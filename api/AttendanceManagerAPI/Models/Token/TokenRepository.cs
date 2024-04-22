using System.Security.Claims;

namespace AttendanceManagerAPI.Models.Token;

public class TokenRepository : ITokenRepository
{
    public int? GetIdFromToken(ClaimsPrincipal claim)
    {
        var nameIdentifier = claim.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int userId;

        if (nameIdentifier is null || !int.TryParse(nameIdentifier, out userId))
        {
            return null;
        }

        return userId;
    }

    public string? GetRoleFromToken(ClaimsPrincipal claim)
    {
        return claim.FindFirst(ClaimTypes.Role)?.Value;
    }
}
