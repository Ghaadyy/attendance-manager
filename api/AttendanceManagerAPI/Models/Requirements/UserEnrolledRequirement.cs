namespace AttendanceManagerAPI.Models.Requirements;

public class UserEnrolledRequirement
{
	private readonly ICourseRepository _courseRepository;
	public int UserId { get; set; }
	public int CourseId { get; set; }
	public string Role { get; set; }

	public UserEnrolledRequirement(ICourseRepository courseRepository, int userId, int courseId, string role)
	{
		_courseRepository = courseRepository;
		UserId = userId;
		CourseId = courseId;
		Role = role;
	}

	public bool Succeed()
	{
		if (Role == "Administrator") return true;

		if(Role == "Student")
		{
			return _courseRepository.CheckIfStudentEnrolled(CourseId, UserId);

		}else if(Role == "Teacher")
		{
			return _courseRepository.CheckIfTeacherEnrolled(CourseId, UserId);
		}

		return false;
	}
}
