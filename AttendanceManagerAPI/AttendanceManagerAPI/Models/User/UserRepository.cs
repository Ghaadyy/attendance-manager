using System;

namespace AttendanceManagerAPI.Models;

public class UserRepository : IUserRepository
{
    private readonly AttendanceManagerContext context;

    public UserRepository(AttendanceManagerContext context)
    {
        this.context = context;
    }

    public List<User> GetAllUsers()
    {
        return context.Users.ToList();
    }

    public User? GetUserById(int userId)
    {
        var user = (from u in context.Users
                    where u.Id == userId
                    select u).FirstOrDefault();

        return user;
    }

    public User? GetByUserName(string userName)
    {
        var user = (from u in context.Users
                    where u.UserName == userName
                    select u).FirstOrDefault();

        return user;
    }

    public async Task AddUser(User user)
    {
        context.Users.Add(user);
        await context.SaveChangesAsync();
    }

    public async Task DeleteUser(User user)
    {
        context.Users.Remove(user);
        await context.SaveChangesAsync();
    }

    public User? AuthenticateUser(string email, string password)
    {
        var user = (from u in context.Users
                    where u.Email == email && u.Password == password
                    select u).FirstOrDefault();

        return user;
    }

    public List<Role> GetUserRoles(User user)
    {
        var roles = (from u in context.Users
                     join ur in context.UserRoles on u.Id equals ur.UserId
                     join r in context.Roles on ur.RoleId equals r.Id
                     where u.Id == user.Id
                     select r).ToList();

        return roles;
    }

    public bool IsValidEmail(string email)
    {
        return (from u in context.Users
                where u.Email == email
                select u).FirstOrDefault() is null;
    }

    public bool IsValidUserName(string userName)
    {
        return (from u in context.Users
                where u.UserName == userName
                select u).FirstOrDefault() is null;
    }

    public async Task UpdateUser(User user, PartialUser partialUser)
    {
        user.FirstName = partialUser.FirstName ?? user.FirstName;
        user.LastName = partialUser.LastName ?? user.LastName;
        user.Email = partialUser.Email ?? user.Email;
        user.BirthDate = partialUser.BirthDate ?? user.BirthDate;
        user.BloodType = partialUser.BloodType ?? user.BloodType;
        user.Password = partialUser.Password ?? user.Password;
        user.PhoneNumber = partialUser.PhoneNumber ?? user.PhoneNumber;
        user.UserName = partialUser.UserName ?? user.UserName;

        await context.SaveChangesAsync();
    }
}