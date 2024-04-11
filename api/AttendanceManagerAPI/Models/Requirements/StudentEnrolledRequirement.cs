namespace AttendanceManagerAPI.Models.Requirements;

public class StudentEnrolledRequirement : UserEnrolledRequirement
{
    public StudentEnrolledRequirement(ICourseRepository courseRepository, int courseId, int userId, string role) : base(courseRepository, courseId, userId, role)
    {

    }

    public override bool Succeed()
    {
        return IsAdmin() | _courseRepository.CheckIfStudentEnrolled(CourseId, UserId);
    }
}
