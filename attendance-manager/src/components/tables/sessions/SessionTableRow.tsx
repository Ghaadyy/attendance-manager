import React from "react";

function SessionTableRow() {
  return (
    <tr>
      {/* <td className="size-px whitespace-nowrap"> */}
      {/* <div className="ps-6 py-3">
          <label htmlFor="hs-at-with-checkboxes-1" className="flex">
            <input
              type="checkbox"
              className="shrink-0 border-gray-300 rounded text-blue-600 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
              id="hs-at-with-checkboxes-1"
            />
            <span className="sr-only">Checkbox</span>
          </label>
        </div> */}
      {/* </td> */}
      <td className="size-px whitespace-nowrap">
        <div className="ps-6 py-3">
          <div className="flex items-center gap-x-3">
            {/* <img
              className="inline-block size-[38px] rounded-full"
              src="https://images.unsplash.com/photo-1531927557220-a9e23c1e4794?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=facearea&facepad=2&w=300&h=300&q=80"
              alt="Image Description"
            /> */}
            <div className="grow">
              <span className="block text-sm font-semibold text-gray-800">
                Jeudi à 8h
              </span>
            </div>
          </div>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="text-sm text-gray-500">28 Dec, 12:12</span>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="text-sm text-gray-500">28 Dec, 12:12</span>
        </div>
      </td>
      <td className="h-px w-72 whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="block text-sm font-semibold text-gray-800">
            Séance de regulière de cours
          </span>
        </div>
      </td>
      <td className="size-px whitespace-nowrap">
        <div className="px-6 py-3">
          <span className="py-1 px-1.5 inline-flex items-center gap-x-1 text-xs font-medium bg-teal-100 text-teal-800 rounded-full">
            <svg
              className="size-2.5"
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              viewBox="0 0 16 16"
            >
              <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
            </svg>
            Active
          </span>
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

export default SessionTableRow;
