using System.Security.Claims;

namespace AttendanceManagerAPI.Models.Token;

public interface ITokenRepository
{
    int? GetIdFromToken(ClaimsPrincipal claim);
    string? GetRoleFromToken(ClaimsPrincipal claim);
}
