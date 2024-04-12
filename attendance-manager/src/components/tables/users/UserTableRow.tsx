import { User } from "../../../models/User";

type TableRowProps = { user: User };

function UserTableRow({ user }: TableRowProps) {
  const {
    firstName,
    lastName,
    email,
    roles,
    birthDate,
    phoneNumber,
    bloodType,
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
      <td className="h-px w-52 whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="block text-sm font-semibold text-gray-800">
            {roles ?? "N/A"}
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
          <a
            className="inline-flex items-center gap-x-1 text-sm text-blue-600 decoration-2 hover:underline font-medium"
            href="#"
          >
            Edit
          </a>
        </div>
      </td>
    </tr>
  );
}

export default UserTableRow;
