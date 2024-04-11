﻿using System;
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

namespace AttendanceManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly TokenGenerator generator;
    private readonly IUserRepository _userRepository;

    public UsersController(TokenGenerator generator, IUserRepository userRepository)
    {
        this.generator = generator;
        _userRepository = userRepository;
    }

    [HttpGet]
    [Authorize(Roles = "Administrator")]
    public ActionResult<List<User>> Get()
    {
        var users = _userRepository.GetAllUsers();

        return Ok(users);
    }

    [HttpGet("{userId}")]
    [Authorize(Roles = "Administrator")]
    public ActionResult<User> Get(int userId)
    {
        var user = _userRepository.GetUserById(userId);

        if (user is null) return NotFound();

        return Ok(user);
    }

    [HttpGet("me")]
    [Authorize]
    public IActionResult GetUserInfo()
    {
        var nameIdentifier = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        int userId;

        if (nameIdentifier is null || !int.TryParse(nameIdentifier, out userId))
        {
            return BadRequest("User ID missing from token");
        }

        User? user = _userRepository.GetUserById(userId);

        if (user is null) return BadRequest("User not found");

        return Ok(user);
    }

    [HttpPost("login")]
    public ActionResult Login([FromBody] LoginModel model)
    {
        var user = _userRepository.GetByEmail(model.Email);

        if (user is null) return BadRequest("Invalid email.");

        if (!BCrypt.Net.BCrypt.Verify(model.Password, user.Password))
            return BadRequest("Invalid password.");

        var roles = _userRepository.GetUserRoles(user);

        var token = generator.GenerateJWTToken(user, roles);

        return Ok(new { token });
    }

    [HttpPost("signup")]
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

    [HttpPatch("{userId}")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<User>> Update(int userId, [FromBody] JsonPatchDocument<User> patchDoc)
    {
        User? user = _userRepository.GetUserById(userId);

        if (user is null) return BadRequest("Invalid user id.");

        patchDoc.ApplyTo(user);

        // Validate the user, because when passing JsonPatchDocument,
        // the underlying user object was not properly validated
        TryValidateModel(user);

        if (!ModelState.IsValid)
            return BadRequest("Invalid parameters");

        await _userRepository.UpdateUser(user, patchDoc);

        return Ok(user);
    }

    [HttpDelete("{userId}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> Delete(int userId)
    {
        var user = _userRepository.GetUserById(userId);

        if (user is null) return BadRequest("User does not exist.");

        await _userRepository.DeleteUser(user);

        return Ok();
    }

    [HttpPatch("{userId}/{roleName}")]
    [Authorize(Roles = "Administrator")]
    public async Task<IActionResult> AddRole(int userId, string roleName)
    {
        var role = await _userRepository.AddRoleToUser(roleName, userId);

        if (role is null) return BadRequest();

        return Ok();
    }
}