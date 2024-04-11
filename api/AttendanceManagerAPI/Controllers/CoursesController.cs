using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using AttendanceManagerAPI.Models;

namespace AttendanceManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class CoursesController : ControllerBase
{
    private readonly ICourseRepository _courseRepository;

    public CoursesController(ICourseRepository courseRepository)
    {
        _courseRepository = courseRepository;
    }

    [HttpGet]
    [Authorize(Roles = "Administrator")]
    public IActionResult Get()
    {
        return Ok(_courseRepository.GetCourses());
    }

    [HttpGet("{courseId}")]
    public IActionResult Get(int courseId)
    {
        var course = _courseRepository.GetCourse(courseId);

        if (course is null) return BadRequest();

        return Ok(course);
    }

    [HttpGet("{courseId}/students")]
    [Authorize(Roles = "Administrator,Teacher,Student")]
    public IActionResult GetStudents(int courseId)
    {
        return Ok(_courseRepository.GetStudents(courseId));
    }

    [HttpGet("{courseId}/sessions")]
	[Authorize(Roles = "Administrator,Teacher,Student")]
	public IActionResult GetSessions(int courseId)
    {
        return Ok(_courseRepository.GetSessions(courseId));
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

    [HttpPatch("{courseId}/student/{studentId}")]
    [Authorize(Roles = "Administrator,Teacher")]
    public async Task<IActionResult> AddStudent(int courseId, int studentId)
    {
        try
        {
            await _courseRepository.AddStudent(courseId, studentId);
        }
        catch
        {
            return BadRequest();
        }

        return Ok();
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

        return Ok();
    }

    [HttpGet("{courseId}/teachers")]
    [Authorize(Roles = "Administrator,Teacher,Student")]
    public ActionResult<IEnumerable<User>> GetTeachers(int courseId)
    {
        return Ok(_courseRepository.GetTeachers(courseId));
    }

    [HttpDelete("{courseId}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> DeleteCourse(int courseId)
    {
        var course = _courseRepository.GetCourse(courseId);

        if (course is null) return BadRequest();

        await _courseRepository.DeleteCourse(course);

        return Ok();
    }
}