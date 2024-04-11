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

[ApiController]
[Route("api/[controller]")]
public class SessionsController : Controller
{
    private readonly ISessionRepository _sessionRepository;
    private readonly ITokenRepository _tokenRepository;

    private readonly ICourseRepository _courseRepository;

    public SessionsController(ISessionRepository sessionRepository, ITokenRepository tokenRepository, ICourseRepository courseRepository)
    {
        _sessionRepository = sessionRepository;
        _tokenRepository = tokenRepository;
        _courseRepository = courseRepository;
    }

    [HttpGet]
    [Authorize(Roles = "Administrator")]
    public IActionResult Get()
    {
        return Ok(_sessionRepository.GetSessions());
    }

    [HttpGet("{sessionId}/students")]
	[Authorize(Roles = "Administrator,Teacher,Student")]
	public IActionResult GetStudents(int sessionId)
    {
        int? userId = _tokenRepository.GetIdFromToken(User);
        if (userId is null) return BadRequest("User ID missing from token");

		string? role = _tokenRepository.GetRoleFromToken(User);
		if (role is null) return BadRequest("User Role missing from token");

        var session = _sessionRepository.GetSession(sessionId);
        if (session is null) return BadRequest("Session not valid");

        UserEnrolledRequirement requirement = new UserEnrolledRequirement(_courseRepository, (int)userId, session.CourseId, role);
        if (requirement.Succeed() is false) return Unauthorized();

		return Ok(_sessionRepository.GetStudents(sessionId));
    }

    [HttpGet("{sessionId}")]
	[Authorize(Roles = "Administrator,Teacher,Student")]
	public IActionResult Get(int sessionId)
    {
        var session = _sessionRepository.GetSession(sessionId);

        if (session is null) return BadRequest();

        return Ok(session);
    }

    [HttpPost]
    [Authorize(Roles = "Administrator,Teacher")]
    public async Task<IActionResult> CreateSession([FromBody] CreateSessionModel model)
    {
        var session = new Session
        {
            StartDate = model.StartDate.ToUniversalTime(),
            EndDate = model.EndDate.ToUniversalTime(),
            CourseId = model.CourseId,
            TeacherId = model.TeacherId,
        };

        await _sessionRepository.AddSession(session);

        return Ok();
    }

    [HttpDelete("{sessionId}")]
    [Authorize(Roles = "Administrator,Teacher")]
    public async Task<IActionResult> DeleteSession(int sessionId)
    {
        var session = _sessionRepository.GetSession(sessionId);

        if (session is null) return BadRequest();

        await _sessionRepository.DeleteSession(session);

        return Ok();
    }

    [HttpPost("attendance/{sessionId}")]
    [Authorize(Roles = "Student")]
    public IActionResult MarkAttendance(int sessionId)
    {
        //var nameIdentifier = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        //int userId;

        //if (nameIdentifier is null || !int.TryParse(nameIdentifier, out userId))
        //{
        //    return BadRequest("User ID missing from token");
        //}

        int? userId = _tokenRepository.GetIdFromToken(User);
        if (userId is null) return BadRequest("User ID missing from token");

        Session? session = _sessionRepository.GetSession(sessionId);

        if (session is null || _sessionRepository.CheckIfSessionValid(session) is false)
            return BadRequest("Session is not valid");

        if (_sessionRepository.IsStudentPresent(sessionId, (int)userId))
            return BadRequest("Student already marked their attendance");

        if (_sessionRepository.AddStudent(session, (int)userId).Result is false)
            return BadRequest("Student not enrolled in the course");

        return Ok();
    }
}

