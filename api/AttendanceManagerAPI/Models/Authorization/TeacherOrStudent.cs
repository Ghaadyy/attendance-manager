using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AttendanceManagerAPI.Models;

public class TeacherOrStudent : IAuthorizationRequirement
{
}

public class TeacherOrStudentHandler : AuthorizationHandler<TeacherOrStudent>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ICourseRepository _courseRepository;

    public TeacherOrStudentHandler(IHttpContextAccessor httpContextAccessor, ICourseRepository courseRepository)
    {
        _httpContextAccessor = httpContextAccessor;
        _courseRepository = courseRepository;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, TeacherOrStudent requirement)
    {
        if (context.User.IsInRole("Administrator"))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        string? userIdParam = context.User
            .FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        string? courseIdParam = _httpContextAccessor.HttpContext?.Request.RouteValues["courseId"]?.ToString();

        int userId, courseId;
        if (!int.TryParse(userIdParam, out userId) || !int.TryParse(courseIdParam, out courseId))
        {
            context.Fail();
            return Task.CompletedTask;
        }

        if (context.User.IsInRole("Student") && _courseRepository.CheckIfStudentEnrolled(courseId, userId))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        if (context.User.IsInRole("Teacher") && _courseRepository.CheckIfTeacherEnrolled(courseId, userId))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        context.Fail();

        return Task.CompletedTask;
    }
}