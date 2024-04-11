namespace AttendanceManagerAPI.Models.Requirements;

public interface IUserEnrolledRequirement
{
    bool Succeed();
    bool IsAdmin();
}
