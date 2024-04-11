using Microsoft.EntityFrameworkCore.Metadata;
using System;

namespace AttendanceManagerAPI.Models;

public class CourseRepository : ICourseRepository
{
    private readonly AttendanceManagerContext context;

    public CourseRepository(AttendanceManagerContext context)
    {
        this.context = context;
    }

    public async Task<int> AddCourse(Course course)
    {
        context.Courses.Add(course);
        await context.SaveChangesAsync();
        return course.Id;
    }

    public async Task AddStudent(int courseId, int studentId)
    {
        context.CourseStudent.Add(new CourseStudent
        {
            CourseId = courseId,
            StudentId = studentId
        });

        await context.SaveChangesAsync();
    }

    public async Task AddTeacher(int courseId, int teacherId)
    {
        context.CourseTeacher.Add(new CourseTeacher
        {
            CourseId = courseId,
            TeacherId = teacherId
        });

        await context.SaveChangesAsync();
    }

    public async Task DeleteCourse(Course course)
    {
        context.Courses.Remove(course);
        await context.SaveChangesAsync();
    }

    public Course? GetCourse(int courseId)
    {
        return context.Courses.FirstOrDefault(c => c.Id == courseId);
    }

    public IEnumerable<Course> GetCourses()
    {
        return context.Courses;
    }

    public IEnumerable<Session> GetSessions(int courseId)
    {
        var sessions = from course in context.Courses
                       join session in context.Sessions on course.Id equals session.CourseId
                       where course.Id == courseId
                       select session;

        return sessions;
    }

    public IEnumerable<User> GetStudents(int courseId)
    {
        var students = from cs in context.CourseStudent
                       join student in context.Users on cs.StudentId equals student.Id
                       join course in context.Courses on cs.CourseId equals course.Id
                       where course.Id == courseId
                       select student;

        return students;
    }

    public IEnumerable<User> GetTeachers(int courseId)
    {
        var teachers = from ct in context.CourseTeacher
                       join teacher in context.Users on ct.TeacherId equals teacher.Id
                       join course in context.Courses on ct.CourseId equals course.Id
                       where course.Id == courseId
                       select teacher;

        return teachers;
    }

    public bool CheckIfStudentEnrolled(int courseId, int studentId)
    {
        IEnumerable<User> students = GetStudents(courseId);
        foreach(User student in students)
        {
            if (student.Id == studentId) return true;
        }

        return false;
    }

	public bool CheckIfTeacherEnrolled(int courseId, int teacherId)
	{
		IEnumerable<User> teachers = GetTeachers(courseId);
		foreach (User teacher in teachers)
		{
			if (teacher.Id == teacherId) return true;
		}

		return false;
	}
}

