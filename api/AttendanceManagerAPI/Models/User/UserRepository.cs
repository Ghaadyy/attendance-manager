using System;
using Microsoft.AspNetCore.JsonPatch;

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

    public bool HasMore(int pageIndex, int pageSize)
        => (pageIndex * pageSize) < context.Users.Count();

    public IEnumerable<User> GetUsers(int pageIndex, int pageSize)
    {
        var users = context.Users
          .Skip((pageIndex - 1) * pageSize)
          .Take(pageSize);

        return users;
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

    public User? GetByEmail(string email)
    {
        var user = (from u in context.Users
                    where u.Email == email
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

    public async Task<Role?> AddRoleToUser(string role, int userId)
    {
        var userRole = (from r in context.Roles
                        where r.Name == role
                        select r).FirstOrDefault();

        if (userRole == null) return null;

        context.UserRoles.Add(new UserRole
        {
            UserId = userId,
            RoleId = userRole.Id
        });

        await context.SaveChangesAsync();

        return userRole;
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

    public async Task UpdateUser(User user, JsonPatchDocument<User> patchDoc)
    {
        patchDoc.ApplyTo(user);
        await context.SaveChangesAsync();
    }

    public bool HasMoreStudents(Course course, int pageIndex, int pageSize)
        => (pageIndex * pageSize) < (from u in context.Users
                                     join cs in context.CourseStudent on u.Id equals cs.StudentId
                                     where cs.CourseId == course.Id
                                     select u).Count();

    public bool HasMoreTeachers(Course course, int pageIndex, int pageSize)
        => (pageIndex * pageSize) < (from u in context.Users
                                     join cs in context.CourseTeacher on u.Id equals cs.TeacherId
                                     where cs.CourseId == course.Id
                                     select u).Count();

    public bool HasRole(User user, string roleName)
    {
        return (from ur in context.UserRoles
                join r in context.Roles on ur.RoleId equals r.Id
                where ur.UserId == user.Id && r.Name == roleName
                select ur).Count() > 0;
    }

    public IEnumerable<User> GetStudents(Course course, int pageIndex, int pageSize)
    {
        var users = (from u in context.Users
                     join cs in context.CourseStudent on u.Id equals cs.StudentId
                     where cs.CourseId == course.Id
                     select u).Skip((pageIndex - 1) * pageSize).Take(pageSize);

        return users;
    }

    public IEnumerable<User> GetTeachers(Course course, int pageIndex, int pageSize)
    {
        var users = (from u in context.Users
                     join cs in context.CourseTeacher on u.Id equals cs.TeacherId
                     where cs.CourseId == course.Id
                     select u).Skip((pageIndex - 1) * pageSize).Take(pageSize);

        return users;
    }
}