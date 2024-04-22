import { useContext } from "react";
import { toast } from "react-toastify";
import { User } from "../../../models/User";
import { userContext } from "../../../store/UserContext";

type TableRowProps = {
  user: User;
  onDelete: (userId: number) => void;
  courseId: number;
};

function StudentTableRow({ user, onDelete, courseId }: TableRowProps) {
  const userCtx = useContext(userContext);
  const {
    firstName,
    lastName,
    email,
    roles,
    birthDate,
    phoneNumber,
    bloodType,
    id: studentId,
  } = user;

  const { token } = useContext(userContext);

  const handleDelete = async () => {
    const res = await fetch(
      `${process.env.REACT_APP_API_URL}/courses/${courseId}/students/${studentId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }
    )
      .then(async (res) => {
        if (res.ok) {
          onDelete(studentId);
          toast.success("Student removed successfully", {
            toastId: res.status,
          });
        } else {
          toast.error("Could not remove student", {
            toastId: res.status,
          });
        }
      })
      .catch((err) => console.log(err));
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
      {(userCtx?.user?.roles?.includes("Administrator") ||
        userCtx?.user?.roles?.includes("Teacher")) && (
        <td className="size-px whitespace-nowrap">
          <div className="px-6 py-1.5">
            <div className="inline-flex rounded-lg shadow-sm">
              <button
                type="button"
                onClick={handleDelete}
                className="py-2 px-3 inline-flex justify-center items-center gap-2 -ms-px first:rounded-s-lg first:ms-0 last:rounded-e-lg text-sm font-medium focus:z-10 border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              >
                Remove
              </button>
            </div>
          </div>
        </td>
      )}
    </tr>
  );
}

export default StudentTableRow;
