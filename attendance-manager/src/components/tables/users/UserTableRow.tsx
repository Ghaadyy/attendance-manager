import { Link } from "react-router-dom";
import { User } from "../../../models/User";
import { useContext } from "react";
import { userContext } from "../../../store/UserContext";
import { toast } from "react-toastify";

type TableRowProps = { user: User; onDelete: (userId: number) => void };

function UserTableRow({ user, onDelete }: TableRowProps) {
  const { token } = useContext(userContext);

  const {
    firstName,
    lastName,
    email,
    roles,
    birthDate,
    phoneNumber,
    bloodType,
  } = user;

  const handleDelete = async () => {
    await fetch(`http://localhost:8000/api/users/${user.id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    }).then(async (res) => {
      if (res.ok) {
        onDelete(user.id);
        toast.success("User deleted successfully", {
          toastId: res.status,
        });
      } else {
        toast.error("Could not delete user", {
          toastId: res.status,
        });
      }
    }).catch(() => {
      toast.error("Could not send request", {
        toastId: 500,
      })
    })
  };

  return (
    <tr>
      <td className="size-px whitespace-nowrap">
        <div className="ps-6 py-3">
          <div className="flex items-center gap-x-3">
            <div className="grow">
              <span className="block text-sm font-semibold text-gray-800">
                {firstName + " " + lastName}
              </span>
              <span className="block text-sm text-gray-500">{email}</span>
            </div>
          </div>
        </div>
      </td>
      <td className="h-px w-52 whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="block text-sm font-semibold text-gray-800">
            {roles ? roles.join(", ") : "N/A"}
          </span>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="text-sm text-gray-500">
            {birthDate ? new Date(birthDate).toDateString() : "N/A"}
          </span>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="text-sm text-gray-500">{phoneNumber ?? "N/A"}</span>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="text-sm text-gray-500">{bloodType ?? "N/A"}</span>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-1.5">
          <div className="inline-flex rounded-lg shadow-sm">
            <Link
              type="button"
              to={`/users/edit`}
              state={{ user }}
              className="py-2 px-3 inline-flex justify-center items-center gap-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              Edit
            </Link>
            <button
              type="button"
              onClick={handleDelete}
              className="py-2 px-3 inline-flex justify-center items-center gap-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              Delete
            </button>
          </div>
        </div>
      </td>
    </tr>
  );
}

export default UserTableRow;
