﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using AttendanceManagerAPI.Models;
using AttendanceManagerAPI.Models.Token;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace AttendanceManagerAPI.Controllers;

public partial class CoursesController : ControllerBase
{
    /// <summary>
    /// Get the sessions associated with a specific course.
    /// </summary>
    [HttpGet("{courseId}/sessions")]
    [Authorize(Policy = "TeacherOrStudent")]
    public ActionResult<PaginatedList<Session>> GetSessions(int courseId, [FromQuery] int? pageIndex, [FromQuery] int? pageSize)
    {
        if (pageIndex is null || pageSize is null)
        {
            var course = _courseRepository.GetCourse(courseId);
            if (course is null) return NotFound("Course not found");
            else return BadRequest("Invalid query parameters");
        }

        return Ok(new PaginatedList<Session>
        {
            List = _sessionRepository.GetSessions(courseId, pageIndex.Value, pageSize.Value).ToList(),
            HasMore = _sessionRepository.HasMore(courseId, pageIndex.Value, pageSize.Value)
        });
    }

    /// <summary>
    /// Get the students that attended a specific session.
    /// </summary>
    [HttpGet("{courseId}/sessions/{sessionId}/students")]
    [Authorize(Policy = "TeacherOrStudent")]
    public ActionResult<PaginatedList<AttendanceUser>> GetSessionStudents(int sessionId, [FromQuery] int? pageIndex, [FromQuery] int? pageSize)
    {
        var session = _sessionRepository.GetSession(sessionId);
        if (session is null) return BadRequest("Session not valid");

        if (pageIndex is null || pageSize is null)
            return BadRequest("Please provide query parameters");

        var students = _sessionRepository.GetStudents(sessionId).ToList();
        var courseStudents = _courseRepository.GetStudents(session.CourseId).ToList();
        var sessionStudents = _sessionRepository.GetStudents(session, pageIndex.Value, pageSize.Value);

        return Ok(sessionStudents);
    }

    /// <summary>
    /// Get all the students that attended a specific session.
    /// </summary>
    [HttpGet("{courseId}/sessions/{sessionId}/students/all")]
    [Authorize(Policy = "TeacherOrStudent")]
    public ActionResult<PaginatedList<AttendanceUser>> GetSessionStudents(int sessionId)
    {
        return Ok(_sessionRepository.GetStudents(sessionId));
    }

    /// <summary>
    /// Retrieve information about a specific session.
    /// </summary>
    [HttpGet("{courseId}/sessions/{sessionId}")]
    [Authorize(Policy = "TeacherOrStudent")]
    public ActionResult<Session> GetSession(int sessionId)
    {
        var session = _sessionRepository.GetSession(sessionId);
        if (session is null) return BadRequest("Session not valid");

        return Ok(session);
    }

    /// <summary>
    /// Create a new session associated with a course.
    /// </summary>
    [HttpPost("{courseId}/sessions")]
    [Authorize(Policy = "IsCourseTeacher")]
    public async Task<ActionResult<Session>> CreateSession(int courseId, [FromBody] CreateSessionModel model)
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

        return Ok(session);
    }

    /// <summary>
    /// Delete a session associated with a course.
    /// </summary>
    [HttpDelete("{courseId}/sessions/{sessionId}")]
    [Authorize(Policy = "IsCourseTeacher")]
    public async Task<ActionResult<Session>> DeleteSession(int sessionId)
    {
        var session = _sessionRepository.GetSession(sessionId);

        if (session is null) return NotFound("Session not found.");

        await _sessionRepository.DeleteSession(session);

        return Ok(session);
    }

    /// <summary>
    /// Mark your attendance to a session.
    /// </summary>
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

        if (_courseRepository.CheckIfStudentEnrolled(session.CourseId, userId.Value) is false)
            return BadRequest("Student not enrolled in the course");

        _sessionRepository.AddStudent(session, userId.Value);

        return Ok();
    }

    /// <summary>
    /// Mark a specific student's attendance to a specific session.
    /// </summary>
    [HttpPost("{courseId}/sessions/{sessionId}/attendance/{userId}")]
    [Authorize(Policy = "TeacherOrStudent")]
    public IActionResult MarkAttendance(int sessionId, int userId)
    {
        Session? session = _sessionRepository.GetSession(sessionId);

        if (session is null || _sessionRepository.CheckIfSessionValid(session) is false)
            return BadRequest("Session is not valid");

        if (_sessionRepository.IsStudentPresent(sessionId, userId))
            return BadRequest("Student already marked their attendance");

        if (_courseRepository.CheckIfStudentEnrolled(session.CourseId, userId) is false)
            return BadRequest("Student not enrolled in the course");

        _sessionRepository.AddStudent(session, userId);

        return Ok();
    }
}

