using System;
using Microsoft.AspNetCore.Authorization;

namespace AttendanceManagerAPI.Models;

/// <summary>
/// Allow our API to have OR behavior with multiple authorization handlers,
/// in which the final authorization result is if ANY handlers return true.
/// This class was implemented because default behavior is to apply an AND behavior
/// with the result of each authorization handler.
/// </summary>
public class CustomAuthorizationEvaluator : IAuthorizationEvaluator
{
    public AuthorizationResult Evaluate(AuthorizationHandlerContext context)
    {
        int totalRequirementsCount = context.Requirements.Count();

        // HasFailed will be true, if at least one requirement already called Fail()
        if (totalRequirementsCount <= 1)
        {
            return DefaultEvaluate(context);
        }

        var failedRequirements = context.PendingRequirements;

        bool isAllRequirementsFailed = totalRequirementsCount == failedRequirements.Count();

        if (isAllRequirementsFailed)
        {
            return DefaultEvaluate(context);
        }

        return AuthorizationResult.Success();
    }

    // Logic from DefaultAuthorizationEvaluator
    private static AuthorizationResult DefaultEvaluate(AuthorizationHandlerContext context)
    {
        return context.HasSucceeded
            ? AuthorizationResult.Success()
            : AuthorizationResult.Failed(context.HasFailed
                ? AuthorizationFailure.Failed(context.FailureReasons)
                : AuthorizationFailure.Failed(context.PendingRequirements));
    }
}