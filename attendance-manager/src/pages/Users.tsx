import { useContext, useEffect, useState } from "react";
import UsersTable from "../components/tables/users/UsersTable";
import { User } from "../models/User";
import { userContext } from "../store/UserContext";

function Users() {
  const [users, setUsers] = useState<User[]>([]);

  const { user, token } = useContext(userContext);

  useEffect(() => {
    fetch("http://localhost:8000/api/users", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then((res) =>
        res.json().then((data: User[]) => {
          setUsers(data);
        })
      )
      .catch((err) => console.log(err));
  }, [token]);

  return (
    <>
      <h1 className="text-xl font-bold text-gray-800">Users</h1>
      <UsersTable users={users} />
    </>
  );
}

export default Users;
