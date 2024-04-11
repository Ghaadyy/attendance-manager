import UsersTable from "../components/tables/users/UsersTable";
import { User } from "../models/User";

function Users() {
  const users: User[] = [
    {
      firstName: "Ghady",
      lastName: "Youssef",
      email: "ghady.youssef@net.usj.edu.lb",
      birthdate: new Date("2004-12-21"),
      roles: "Teacher, Student",
      bloodType: "A+",
      phoneNumber: "+961 01 234 567",
    },
    {
      firstName: "Antoine",
      lastName: "Karam",
      email: "antoine.karam3@net.usj.edu.lb",
      birthdate: new Date("2004-09-20"),
      roles: "Administrator, Teacher",
      bloodType: "A+",
      phoneNumber: "+961 03 456 789",
    },
  ];

  return (
    <>
      <h1 className="text-xl font-bold text-gray-800">Users</h1>
      <UsersTable users={users} />
    </>
  );
}

export default Users;
