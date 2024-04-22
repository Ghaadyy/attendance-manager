using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AttendanceManagerAPI.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.JsonPatch;
using System.Data;
using System.ComponentModel.DataAnnotations;
using System.Net;
using System.Security.Claims;
using System.Numerics;
using BCrypt.Net;
using AttendanceManagerAPI.Models.Token;

namespace AttendanceManagerAPI.Controllers;

/// <summary>
/// Everything related to user management and accounts.
/// </summary>
[ApiController]
[Route("api/[controller]")]
[ProducesResponseType(200)]
[ProducesResponseType(400)]
[ProducesResponseType(404)]
public class UsersController : ControllerBase
{
    private readonly TokenGenerator generator;
    private readonly IUserRepository _userRepository;
    private readonly ITokenRepository _tokenRepository;

    public UsersController(TokenGenerator generator, IUserRepository userRepository, ITokenRepository tokenRepository)
    {
        this.generator = generator;
        _userRepository = userRepository;
        _tokenRepository = tokenRepository;
    }

    /// <summary>
    /// Retrieves all the users in the app.
    /// </summary>
    [HttpGet]
    [Authorize(Roles = "Administrator")]
    public ActionResult<PaginatedList<User>> Get([FromQuery] int? pageIndex, [FromQuery] int? pageSize)
    {
        if (pageIndex is null || pageSize is null)
            return BadRequest("Please provide query parameters");

        var users = _userRepository.GetUsers(pageIndex.Value, pageSize.Value);

        return Ok(new PaginatedList<User>
        {
            List = users.ToList(),
            HasMore = _userRepository.HasMore(pageIndex.Value, pageSize.Value)
        });
    }

    /// <summary>
    /// Retrieves a specific user.
    /// </summary>
    [HttpGet("{userId}")]
    [Authorize(Roles = "Administrator")]
    public ActionResult<User> Get(int userId)
    {
        var user = _userRepository.GetUserById(userId);

        if (user is null) return NotFound("User not found");

        return Ok(user);
    }

    /// <summary>
    /// Retrieves information about the user who initiated the request.
    /// </summary>
    [HttpGet("me")]
    [Authorize]
    public ActionResult<User> GetUserInfo()
    {
        int? userId = _tokenRepository.GetIdFromToken(User);
        if (userId is null) return BadRequest("User ID missing from token");

        User? user = _userRepository.GetUserById((int)userId);

        if (user is null) return NotFound("User not found");

        return Ok(user);
    }

    /// <summary>
    /// Log into the app.
    /// </summary>
    /// <returns>A JSON Web Token.</returns>
    [HttpPost("login")]
    public ActionResult Login([FromBody] LoginModel model)
    {
        var user = _userRepository.GetByEmail(model.Email);

        if (user is null) return NotFound("Invalid email.");

        if (!BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
            return NotFound("Invalid password.");

        var roles = _userRepository.GetUserRoles(user);

        var token = generator.GenerateJWTToken(user, roles);

        return Ok(new { token });
    }

    /// <summary>
    /// Create a new account.
    /// </summary>
    /// <returns>A JSON Web Token.</returns>
    [HttpPost("signup")]
    [ProducesResponseType(500)]
    public async Task<IActionResult> SignUp([FromBody] SignUpModel model)
    {
        if (!_userRepository.IsValidUserName(model.UserName))
            return BadRequest("User with the same username already exists");

        if (!_userRepository.IsValidEmail(model.Email))
            return BadRequest("User with the same email already exists");

        var hashedPassword = BCrypt.Net.BCrypt.HashPassword(model.Password);

        var user = new User
        {
            FirstName = model.FirstName,
            LastName = model.LastName,
            Email = model.Email,
            UserName = model.UserName,
            Password = hashedPassword,
        };

        await _userRepository.AddUser(user);

        var userRole = _userRepository.AddRoleToUser("User", user.Id).Result;

        //We have to see what to do in this situation, but for now this works
        // TODO: Create a trigger on the database level to automatically add users to a default group called "Users"
        if (userRole is null) return StatusCode(500, "Internal Server Error - User created with no role");

        var token = generator.GenerateJWTToken(user, new List<Role>
        {
            userRole
        });

        return Ok(new { token });
    }

    /// <summary>
    /// Update fields for a specific user.
    /// </summary>
    /// <returns>The updated user.</returns>
    [HttpPatch("{userId}")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<User>> Update(int userId, [FromBody] JsonPatchDocument<User> patchDoc)
    {
        User? user = _userRepository.GetUserById(userId);

        if (user is null) return NotFound("Invalid user id.");

        patchDoc.ApplyTo(user);

        // Validate the user, because when passing JsonPatchDocument,
        // the underlying user object was not properly validated
        TryValidateModel(user);

        if (!ModelState.IsValid)
            return BadRequest("Invalid parameters");

        await _userRepository.UpdateUser(user, patchDoc);

        return Ok(user);
    }

    /// <summary>
    /// Update specific fields for the user who initiated the request.
    /// </summary>
    /// <returns>The updated user.</returns>
    [HttpPatch]
    [Authorize]
    public async Task<ActionResult<User>> Update([FromBody] JsonPatchDocument<User> patchDoc)
    {
        int? userId = _tokenRepository.GetIdFromToken(User);
        if (userId is null) return BadRequest("User ID missing from token");

        User? user = _userRepository.GetUserById((int)userId);

        if (user is null) return NotFound("Invalid user id.");

        patchDoc.ApplyTo(user);

        // Validate the user, because when passing JsonPatchDocument,
        // the underlying user object was not properly validated
        TryValidateModel(user);

        if (!ModelState.IsValid)
            return BadRequest("Invalid parameters");

        await _userRepository.UpdateUser(user, patchDoc);

        return Ok(user);
    }

    /// <summary>
    /// Delete a user from the app.
    /// </summary>
    /// <returns>The deleted user.</returns>
    [HttpDelete("{userId}")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<User>> Delete(int userId)
    {
        var user = _userRepository.GetUserById(userId);

        if (user is null) return NotFound("User does not exist.");

        await _userRepository.DeleteUser(user);

        return Ok(user);
    }

    /// <summary>
    /// Add a role to a specific user.
    /// </summary>
    [HttpPatch("{userEmail}/{roleName}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> AddRole(string userEmail, string roleName)
    {
        var user = _userRepository.GetByEmail(userEmail);
        if (user is null) return NotFound("User not found");

        var role = await _userRepository.AddRoleToUser(roleName, user.Id);

        if (role is null) return BadRequest("Role not found");

        return NoContent();
    }
}