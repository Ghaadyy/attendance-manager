using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AttendanceManagerAPI.Models;

public class IsCourseTeacher : IAuthorizationRequirement
{
}

public class IsCourseTeacherHandler : AuthorizationHandler<IsCourseTeacher>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ICourseRepository _courseRepository;

    public IsCourseTeacherHandler(IHttpContextAccessor httpContextAccessor, ICourseRepository courseRepository)
    {
        _httpContextAccessor = httpContextAccessor;
        _courseRepository = courseRepository;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, IsCourseTeacher requirement)
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

        if (_courseRepository.CheckIfTeacherEnrolled(courseId, userId))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        context.Fail();

        return Task.CompletedTask;
    }
}