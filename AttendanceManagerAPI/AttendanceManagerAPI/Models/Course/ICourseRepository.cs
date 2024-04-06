using System;
namespace AttendanceManagerAPI.Models;

public interface ICourseRepository
{
    Course? GetCourse(int courseId);
    IEnumerable<Course> GetCourses();
    Task<int> AddCourse(Course course);
    Task DeleteCourse(Course course);
    IEnumerable<User> GetStudents(int courseId);
    IEnumerable<Session> GetSessions(int sessionId);
    IEnumerable<User> GetTeachers(int courseId);
    Task AddStudent(int courseId, int studentId);
    Task AddTeacher(int courseId, int teacherId);
}