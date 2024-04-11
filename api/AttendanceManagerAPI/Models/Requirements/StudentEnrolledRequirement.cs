namespace AttendanceManagerAPI.Models.Requirements;

public class StudentEnrolledRequirement : UserEnrolledRequirement
{
    public StudentEnrolledRequirement(ICourseRepository courseRepository, int userId, int courseId, string role) : base(courseRepository, userId, courseId, role)
    {

    }

    public override bool Succeed()
    {
        return IsAdmin() | _courseRepository.CheckIfStudentEnrolled(CourseId, UserId);
    }
}
