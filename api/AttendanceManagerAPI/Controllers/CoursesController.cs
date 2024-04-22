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

/// <summary>
/// Everything related to courses, sessions, teachers and students.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[ProducesResponseType(200)]
[ProducesResponseType(404)]
[ProducesResponseType(400)]
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

    /// <summary>
    /// Gets all the courses, depending on the user requesting them.
    /// </summary>
    /// <returns>A list of courses.</returns>
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

            if (user is null) return NotFound("User not found.");

            return Ok(_courseRepository.GetCoursesByUser(user));
        }
    }

    /// <summary>
    /// Retrieves information about a specific course.
    /// </summary>
    /// <returns>The requested course.</returns>
    [HttpGet("{courseId}")]
    [Authorize(Policy = "TeacherOrStudent")]
    public ActionResult<Course> Get(int courseId)
    {
        var course = _courseRepository.GetCourse(courseId);

        if (course is null) return NotFound("Course not found.");

        return Ok(course);
    }

    /// <summary>
    /// Get the students enrolled in a specific course.
    /// </summary>
    [HttpGet("{courseId}/students")]
    [Authorize(Policy = "TeacherOrStudent")]
    public ActionResult<PaginatedList<User>> GetStudents(int courseId, [FromQuery] int? pageSize, [FromQuery] int? pageIndex)
    {
        Course? course = _courseRepository.GetCourse(courseId);
        if (pageIndex is null || pageSize is null)
        {
            if (course is null) return NotFound("Course not found");
            else return BadRequest("Invalid query parameters");
        }

        if (course is null) return NotFound("Course not found");

        return Ok(new PaginatedList<User>
        {
            List = _userRepository.GetStudents(course, pageIndex.Value, pageSize.Value).ToList(),
            HasMore = _userRepository.HasMoreStudents(course, pageIndex.Value, pageSize.Value)
        });
    }

    /// <summary>
    /// Create a new course.
    /// </summary>
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

    /// <summary>
    /// Add a student to the specified course.
    /// </summary>
    [HttpPatch("{courseId}/students/{studentUsername}")]
    [Authorize(Policy = "IsCourseTeacher")]
    public async Task<ActionResult<User>> AddStudent(int courseId, string studentUsername)
    {
        try
        {
            var user = _userRepository.GetByUserName(studentUsername);
            if (user is null) return NotFound("Student not found.");
            if (_userRepository.HasRole(user, "Student") is false) return BadRequest("User is not a Student");
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

    /// <summary>
    /// Remove a student from the specified course.
    /// </summary>
    [HttpDelete("{courseId}/students/{studentId}")]
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

    /// <summary>
    /// Add a teacher to the specified course.
    /// </summary>
    [HttpPatch("{courseId}/teachers/{teacherUsername}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> AddTeacher(int courseId, string teacherUsername)
    {
        try
        {
            var user = _userRepository.GetByUserName(teacherUsername);
            if (user is null) return NotFound("Teacher not found.");
            if (_userRepository.HasRole(user, "Teacher") is false) return BadRequest("User is not a Teacher");
            if (_courseRepository.CheckIfTeacherEnrolled(courseId, user.Id))
                return BadRequest("Teacher already teaching this course.");
            await _courseRepository.AddTeacher(courseId, user.Id);
            return Ok(user);
        }
        catch
        {
            return BadRequest();
        }
    }

    /// <summary>
    /// Get the teachers associated with a specific course.
    /// </summary>
    [HttpGet("{courseId}/teachers")]
    [Authorize(Policy = "TeacherOrStudent")]
    public ActionResult<PaginatedList<User>> GetTeachers(int courseId, [FromQuery] int? pageSize, [FromQuery] int? pageIndex)
    {
        Course? course;
        if (pageIndex is null || pageSize is null)
        {
            course = _courseRepository.GetCourse(courseId);
            if (course is null) return NotFound("Course not found");
            else return BadRequest("Invalid query parameters");
        }

        course = _courseRepository.GetCourse(courseId);
        if (course is null) return NotFound("Course not found");

        return Ok(new PaginatedList<User>
        {
            List = _userRepository.GetTeachers(course, pageIndex.Value, pageSize.Value).ToList(),
            HasMore = _userRepository.HasMoreTeachers(course, pageIndex.Value, pageSize.Value)
        });
    }

    /// <summary>
    /// Get all the teachers associated with a specific course.
    /// </summary>
    [HttpGet("{courseId}/teachers/all")]
    [Authorize(Policy = "TeacherOrStudent")]
    public ActionResult<IEnumerable<User>> GetTeachers(int courseId)
    {
        var course = _courseRepository.GetCourse(courseId);
        if (course is null) return NotFound("Course not found");

        return Ok(_courseRepository.GetTeachers(course.Id));
    }

    /// <summary>
    /// Delete a specific course.
    /// </summary>
    /// <returns>The deleted course.</returns>
    [HttpDelete("{courseId}")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<Course>> DeleteCourse(int courseId)
    {
        var course = _courseRepository.GetCourse(courseId);

        if (course is null) return NotFound("Course not found");

        await _courseRepository.DeleteCourse(course);

        return course;
    }
}