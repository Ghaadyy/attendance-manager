using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AttendanceManagerAPI.Models;
using AttendanceManagerAPI.Models.Requirements;
using AttendanceManagerAPI.Models.Token;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AttendanceManagerAPI.Controllers;

public partial class CoursesController : ControllerBase
{
    [HttpGet("{courseId}/sessions/{sessionId}/students")]
    [Authorize(Policy = "TeacherOrStudent")]
    public ActionResult<IEnumerable<User>> GetSessionStudents(int sessionId)
    {
        var session = _sessionRepository.GetSession(sessionId);
        if (session is null) return BadRequest("Session not valid");

        return Ok(_sessionRepository.GetStudents(sessionId));
    }

    [HttpGet("{courseId}/sessions/{sessionId}")]
    [Authorize(Policy = "TeacherOrStudent")]
    public ActionResult<Session> GetSession(int sessionId)
    {
        var session = _sessionRepository.GetSession(sessionId);
        if (session is null) return BadRequest("Session not valid");

        return Ok(session);
    }

    [HttpPost("{courseId}/sessions")]
    [Authorize(Policy = "IsCourseTeacher")]
    public async Task<IActionResult> CreateSession(int courseId, [FromBody] CreateSessionModel model)
    {
        if (model.StartDate >= model.EndDate) return BadRequest("End Date should be bigger than Start Date");

        int? userId = _tokenRepository.GetIdFromToken(User);
        if (userId is null) return BadRequest("User ID missing from token");

        var session = new Session
        {
            Name = model.Name,
            Description = model.Description,
            StartDate = model.StartDate.ToUniversalTime(),
            EndDate = model.EndDate.ToUniversalTime(),
            CourseId = courseId,
            TeacherId = userId.Value,
        };

        await _sessionRepository.AddSession(session);

        return Ok();
    }

    [HttpDelete("{courseId}/sessions/{sessionId}")]
    [Authorize(Policy = "IsCourseTeacher")]
    public async Task<ActionResult<Session>> DeleteSession(int sessionId)
    {
        var session = _sessionRepository.GetSession(sessionId);

        if (session is null) return NotFound();

        await _sessionRepository.DeleteSession(session);

        return session;
    }

    [HttpPost("{courseId}/sessions/{sessionId}/attendance")]
    [Authorize(Policy = "StudentEnrolled")]
    public IActionResult MarkAttendance(int sessionId)
    {
        int? userId = _tokenRepository.GetIdFromToken(User);
        if (userId is null) return BadRequest("User ID missing from token");

        Session? session = _sessionRepository.GetSession(sessionId);

        if (session is null || _sessionRepository.CheckIfSessionValid(session) is false)
            return BadRequest("Session is not valid");

        if (_sessionRepository.IsStudentPresent(sessionId, userId.Value))
            return BadRequest("Student already marked their attendance");

        if (_sessionRepository.AddStudent(session, userId.Value).Result is false)
            return BadRequest("Student not enrolled in the course");

        return Ok();
    }
}

