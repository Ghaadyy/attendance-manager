using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using AttendanceManagerAPI.Models;
using Microsoft.AspNetCore.Authorization;
using System.Data;
using System.ComponentModel.DataAnnotations;
using System.Net;

namespace AttendanceManagerAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    //private readonly AttendanceManagerContext context;
    private readonly TokenGenerator generator;
    private readonly IUserRepository _userRepository;

    public UsersController(TokenGenerator generator, IUserRepository userRepository)
    {
        //this.context = context;
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

    [HttpPost("login")]
    public ActionResult Login([FromBody] LoginModel model)
    {
        var user = _userRepository.AuthenticateUser(model.Email, model.Password);

        if (user is null) return BadRequest("Invalid credentials.");

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

        var user = new User
        {
            FirstName = model.FirstName,
            LastName = model.LastName,
            Email = model.Email,
            UserName = model.UserName,
            Password = model.Password
        };

        await _userRepository.AddUser(user);

        //var userRole = (from r in context.Roles
        //                where r.Name == "User"
        //                select r).First();

        //context.UserRoles.Add(new UserRole
        //{
        //    UserId = user.Id,
        //    RoleId = userRole.Id
        //});

        //await context.SaveChangesAsync();

        var userRole = _userRepository.AddRoleToUser("User", user.Id).Result;

        //We have to see what to do in this situation, but for now this works
        if (userRole is null) return StatusCode(500, "Internal Server Error - User created with no role");

        var token = generator.GenerateJWTToken(user, new List<Role>
        {
            userRole
        });

        return Ok(new
        {
            token,
            user
        });
    }

    [HttpPatch("{userId}")]
    [Authorize(Roles = "Administrator")]
    public async Task<ActionResult<User>> Update(int userId, [FromBody] PartialUser partialUser)
    {
        var user = _userRepository.GetUserById(userId);

        if (user is null) return BadRequest("User does not exist.");

        await _userRepository.UpdateUser(user, partialUser);

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
    public async Task<IActionResult> AddRole(int userId, string roleName)
    {
        //var role = context.Roles.Where(r => r.Name == roleName).FirstOrDefault();

        //if (role is null) return BadRequest();

        //context.UserRoles.Add(new UserRole
        //{
        //    UserId = userId,
        //    RoleId = role.Id
        //});

        //await context.SaveChangesAsync();

        var role = await _userRepository.AddRoleToUser(roleName, userId);

        if (role is null) return BadRequest();

        return Ok();
    }
}