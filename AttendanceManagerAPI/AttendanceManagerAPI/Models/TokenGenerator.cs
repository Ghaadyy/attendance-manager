using System;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace AttendanceManagerAPI.Models;

public class TokenGenerator
{
    private readonly IConfiguration configuration;

    public TokenGenerator(IConfiguration configuration)
    {
        this.configuration = configuration;
    }

    public string GenerateJWTToken(User user, List<Role> roles)
    {
        var claims = new List<Claim>();

        foreach (Role role in roles)
            claims.Add(new Claim(ClaimTypes.Role, role.Name));

        var jwtToken = new JwtSecurityToken(
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddHours(1),
            signingCredentials: new SigningCredentials(
                new SymmetricSecurityKey(
                   Encoding.UTF8.GetBytes(configuration["JWT:Secret"]!)
                ),
                SecurityAlgorithms.HmacSha256Signature)
            );

        return new JwtSecurityTokenHandler().WriteToken(jwtToken);
    }
}
