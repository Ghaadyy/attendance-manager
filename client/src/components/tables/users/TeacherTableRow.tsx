import { useContext } from "react";
import { toast } from "react-toastify";
import { User } from "../../../models/User";
import { userContext } from "../../../store/UserContext";

type TableRowProps = {
  user: User;
};

function TeacherTableRow({ user }: TableRowProps) {
  const {
    firstName,
    lastName,
    email,
    phoneNumber,
  } = user;

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
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="text-sm text-gray-500">{phoneNumber ?? "N/A"}</span>
        </div>
      </td>
    </tr>
  );
}

export default TeacherTableRow;
