using System;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace AttendanceManagerAPI.Models;

//public class StudentEnrolled : TypeFilterAttribute
//{
//    public StudentEnrolled() : base(typeof(StudentEnrolledFilter))
//    {

//    }
//}

//public class StudentEnrolledFilter : IAuthorizationFilter
//{
//    private readonly ICourseRepository _courseRepository;

//    public StudentEnrolledFilter(ICourseRepository courseRepository)
//    {
//        _courseRepository = courseRepository;
//    }

//    public void OnAuthorization(AuthorizationFilterContext context)
//    {
//        string? userIdParam = context.HttpContext.User
//            .FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

//        string? courseIdParam = context.RouteData.Values["courseId"]?.ToString();

//        int userId, courseId;
//        if (!int.TryParse(userIdParam, out userId) || !int.TryParse(courseIdParam, out courseId))
//        {
//            context.Result = new UnauthorizedResult();
//            return;
//        }

//        if (_courseRepository.CheckIfStudentEnrolled(courseId, userId))
//        {
//            return;
//        }

//        if (context.HttpContext.User.IsInRole("Administrator"))
//        {
//            return;
//        }

//        context.Result = new UnauthorizedResult();
//    }
//}

public class StudentEnrolled : IAuthorizationRequirement
{
}

public class StudentEnrolledHandler : AuthorizationHandler<StudentEnrolled>
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly ICourseRepository _courseRepository;

    public StudentEnrolledHandler(IHttpContextAccessor httpContextAccessor, ICourseRepository courseRepository)
    {
        _httpContextAccessor = httpContextAccessor;
        _courseRepository = courseRepository;
    }

    protected override Task HandleRequirementAsync(AuthorizationHandlerContext context, StudentEnrolled requirement)
    {
        string? userIdParam = context.User
            .FindFirst(c => c.Type == ClaimTypes.NameIdentifier)?.Value;

        string? courseIdParam = _httpContextAccessor.HttpContext?.Request.RouteValues["courseId"]?.ToString();

        int userId, courseId;
        if (!int.TryParse(userIdParam, out userId) || !int.TryParse(courseIdParam, out courseId))
        {
            context.Fail();
            return Task.CompletedTask;
        }

        if (_courseRepository.CheckIfStudentEnrolled(courseId, userId))
        {
            context.Succeed(requirement);
            return Task.CompletedTask;
        }

        context.Fail();

        return Task.CompletedTask;
    }
}