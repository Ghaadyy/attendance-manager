using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AttendanceManagerAPI.Models;
using AttendanceManagerAPI.Models.Token;
using System.Security.Claims;
using System.Reflection.Metadata.Ecma335;

namespace AttendanceManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public partial class CoursesController : ControllerBase
{
    private readonly ICourseRepository _courseRepository;
    private readonly IUserRepository _userRepository;
    private readonly ITokenRepository _tokenRepository;
    private readonly ISessionRepository _sessionRepository;

    public CoursesController(ICourseRepository courseRepository, ITokenRepository tokenRepository, IUserRepository userRepository, ISessionRepository sessionRepository)
    {
        _courseRepository = courseRepository;
        _tokenRepository = tokenRepository;
        _userRepository = userRepository;
        _sessionRepository = sessionRepository;
    }

    [HttpGet]
    [Authorize]
    public ActionResult<IEnumerable<Course>> Get()
    {
        if (User.IsInRole("Administrator"))
            return Ok(_courseRepository.GetCourses());
        else
        {
            int? userId = _tokenRepository.GetIdFromToken(User);
            if (userId is null) return BadRequest("User ID missing from token");

            User? user = _userRepository.GetUserById(userId.Value);

            if (user is null) return BadRequest();

            return Ok(_courseRepository.GetCoursesByUser(user));
        }
    }

    [HttpGet("{courseId}")]
    [Authorize(Policy = "TeacherOrStudent")]
    public ActionResult<Course> Get(int courseId)
    {
        var course = _courseRepository.GetCourse(courseId);

        if (course is null) return BadRequest();

        return Ok(course);
    }

    [HttpGet("{courseId}/students")]
    [Authorize(Policy = "TeacherOrStudent")]
    public ActionResult<PaginatedUserList> GetStudents(int courseId, [FromQuery] int? pageSize, [FromQuery] int? pageIndex)
    {
        Course? course;
        if (pageIndex is null || pageSize is null)
        {
            course = _courseRepository.GetCourse(courseId);
            if (course is null) return BadRequest("Course not found");
            else return BadRequest("Invalid query parameters");
        }

        course = _courseRepository.GetCourse(courseId);
        if (course is null) return BadRequest("Course not found");

        return Ok(new PaginatedUserList
        {
            users = _userRepository.GetStudents(course, pageIndex.Value, pageSize.Value),
            hasMore = _userRepository.HasMore(course, pageIndex.Value, pageSize.Value)
        });
    }

    [HttpGet("{courseId}/sessions")]
    [Authorize(Policy = "TeacherOrStudent")]
    public ActionResult<PaginatedSessionList> GetSessions(int courseId, [FromQuery] int? pageIndex, [FromQuery] int? pageSize)
    {
        if (pageIndex is null || pageSize is null)
        {
            var course = _courseRepository.GetCourse(courseId);
            if (course is null) return BadRequest("Course not found");
            else return BadRequest("Invalid query parameters");
        }

        return Ok(new PaginatedSessionList
        {
            sessions = _sessionRepository.GetSessions(courseId, pageIndex.Value, pageSize.Value),
            hasMore = _sessionRepository.HasMore(courseId, pageIndex.Value, pageSize.Value)
        });
    }

    // ADD TEACHER HERE ALSO
    [HttpPost]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> CreateCourse([FromBody] CreateCourseModel model)
    {
        var course = new Course
        {
            Name = model.Name,
            Description = model.Description
        };

        var courseId = await _courseRepository.AddCourse(course);

        if (model.TeacherIds is not null)
            foreach (int teacherId in model.TeacherIds)
                await _courseRepository.AddTeacher(courseId, teacherId);

        return Ok();
    }

    [HttpPatch("{courseId}/student/{studentUsername}")]
    [Authorize(Policy = "IsCourseTeacher")]
    public async Task<ActionResult<User>> AddStudent(int courseId, string studentUsername)
    {
        try
        {

            var user = _userRepository.GetByUserName(studentUsername);
            if (user is null) return NotFound("Student not found.");
            if (_courseRepository.CheckIfStudentEnrolled(courseId, user.Id))
                return BadRequest("Student already enrolled in course.");
            await _courseRepository.AddStudent(courseId, user);
            return Ok(user);
        }
        catch
        {
            return BadRequest("User is not a student");
        }
    }

    [HttpDelete("{courseId}/student/{studentId}")]
    [Authorize(Policy = "IsCourseTeacher")]
    public async Task<ActionResult<User>> RemoveStudent(int courseId, int studentId)
    {
        try
        {
            var user = _userRepository.GetUserById(studentId);
            if (user is null) return NotFound("User with this ID was not found.");
            bool isRemoved = await _courseRepository.RemoveStudent(courseId, user);
            if (isRemoved is false) return NotFound("User not enrolled in this course");
            return user;
        }
        catch
        {
            return BadRequest();
        }
    }

    [HttpPatch("{courseId}/teacher/{teacherId}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> AddTeacher(int courseId, int teacherId)
    {
        try
        {
            await _courseRepository.AddTeacher(courseId, teacherId);
        }
        catch
        {
            return BadRequest();
        }

        return NoContent();
    }

    [HttpGet("{courseId}/teachers")]
    [Authorize(Policy = "TeacherOrStudent")]
    public ActionResult<IEnumerable<User>> GetTeachers(int courseId)
    {
        return Ok(_courseRepository.GetTeachers(courseId));
    }

    [HttpDelete("{courseId}")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<Course>> DeleteCourse(int courseId)
    {
        var course = _courseRepository.GetCourse(courseId);

        if (course is null) return NotFound();

        await _courseRepository.DeleteCourse(course);

        return course;
    }
}