using System;
using Microsoft.AspNetCore.JsonPatch;

namespace AttendanceManagerAPI.Models;

public interface IUserRepository
{
    User? GetUserById(int userId);
    User? GetByUserName(string userName);
    User? GetByEmail(string email);
    User? AuthenticateUser(string email, string password);
    List<Role> GetUserRoles(User user);
    List<User> GetAllUsers();
    bool HasMore(int pageIndex, int pageSize);
    bool HasMore(Course course, int pageIndex, int pageSize);
    IEnumerable<User> GetUsers(int pageIndex, int pageSize);
    IEnumerable<User> GetStudents(Course course, int pageIndex, int pageSize);
    Task AddUser(User user);
    Task DeleteUser(User user);
    Task<Role?> AddRoleToUser(string role, int userId);
    bool IsValidEmail(string email);
    bool IsValidUserName(string userName);
    Task UpdateUser(User user, JsonPatchDocument<User> patchDoc);
}