using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AttendanceManagerAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AttendanceManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class SessionsController : Controller
{
    private readonly ISessionRepository _sessionRepository;

    public SessionsController(ISessionRepository sessionRepository)
    {
        _sessionRepository = sessionRepository;
    }

    [HttpGet("time")]
    public ActionResult GetTime()
    {
        return Ok(new
        {
            DateTime = DateTime.Now
        });
    }

    [HttpGet]
    public ActionResult<IEnumerable<Session>> Get()
    {
        return Ok(_sessionRepository.GetSessions());
    }

    [HttpGet("{sessionId}/students")]
    public ActionResult<IEnumerable<User>> GetStudents(int sessionId)
    {
        return Ok(_sessionRepository.GetStudents(sessionId));
    }

    [HttpGet("{sessionId}")]
    public ActionResult<Course> Get(int sessionId)
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
}

