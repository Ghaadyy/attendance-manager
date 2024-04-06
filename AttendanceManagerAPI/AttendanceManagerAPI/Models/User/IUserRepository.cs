using System;

namespace AttendanceManagerAPI.Models;

public interface IUserRepository
{
    User? GetUserById(int userId);
    User? GetByUserName(string userName);
    User? AuthenticateUser(string email, string password);
    List<Role> GetUserRoles(User user);
    List<User> GetAllUsers();
    Task AddUser(User user);
    Task DeleteUser(User user);
    bool IsValidEmail(string email);
    bool IsValidUserName(string userName);
    Task UpdateUser(User user, PartialUser partialUser);
}