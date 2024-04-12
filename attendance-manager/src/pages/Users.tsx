import { useEffect, useState } from "react";
import UsersTable from "../components/tables/users/UsersTable";
import { User } from "../models/User";

function Users() {
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    fetch("http://localhost:8000/api/users", {
      method: "GET",
    })
      .then((res) =>
        res.json().then((data: User[]) => {
          setUsers(data);
        })
      )
      .catch((err) => console.log(err));
  }, []);

  return (
    <>
      <h1 className="text-xl font-bold text-gray-800">Users</h1>
      <UsersTable users={users} />
    </>
  );
}

export default Users;
