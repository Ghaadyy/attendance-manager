import { useContext, useState } from "react";
import { userContext } from "../../store/UserContext";
import { toast } from "react-toastify";

function AddUserModal() {
  const [email, setEmail] = useState<string>("");
  const [role, setRole] = useState<string>("");

  const { token } = useContext(userContext);

  const resetForms = () => {
    setEmail("");
    setRole("");
  };

  const submitHandler = async () => {
    if(email === "" || role === "") {
        toast.error("Bad Request", {
            toastId: 400,
        });
        return;
    }
    await fetch(`${process.env.REACT_APP_API_URL}/users/${email}/${role}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
    })
      .then(async (res) => {
        if (res.ok) {
          resetForms();
          toast.success("Role added to user", {
            toastId: res.status,
          });
        } else {
          toast.error("Bad Request", {
            toastId: res.status,
          });
        }
      })
      .catch(() => {
        toast.error("Could not send request", {
          toastId: 500,
        });
      });
  };

  return (
    <div
      id="hs-basic-modal"
      className="hs-overlay hs-overlay-open:opacity-100 hs-overlay-open:duration-500 hidden size-full fixed top-0 start-0 z-[80] opacity-0 overflow-x-hidden transition-all overflow-y-auto pointer-events-none"
    >
      <div className="sm:max-w-lg sm:w-full m-3 sm:mx-auto">
        <div className="flex flex-col bg-white border shadow-sm rounded-xl pointer-events-auto">
          <div className="flex justify-between items-center py-3 px-4 border-b">
            <h3 className="font-bold text-gray-800">Add a Role</h3>
            <button
              type="button"
              className="flex justify-center items-center size-7 text-sm font-semibold rounded-full border border-transparent text-gray-800 hover:bg-gray-100 disabled:opacity-50 disabled:pointer-events-none"
              data-hs-overlay="#hs-basic-modal"
            >
              <span className="sr-only">Close</span>
              <svg
                className="flex-shrink-0 size-4"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path d="M18 6 6 18"></path>
                <path d="m6 6 12 12"></path>
              </svg>
            </button>
          </div>
          <div className="p-4 overflow-y-auto">
            <form>
              <div className="sm:col-span-3">
                <label
                  htmlFor="af-account-email"
                  className="inline-block text-sm text-gray-800 mt-2.5"
                >
                  User Email
                </label>
              </div>
              <div className="sm:col-span-9">
                <input
                  id="af-account-email"
                  type="email"
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="najib@net.usj.edu.lb"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="sm:col-span-3">
              <div className="inline-block">
                <label
                  htmlFor="role-type"
                  className="inline-block text-sm text-gray-800 mt-2.5"
                >
                  Role Type
                </label>
              </div>
            </div>
              <div className="sm:col-span-9">
              <select
                id="role-type"
                defaultValue={""}
                className="py-3 px-4 pe-9 block w-full border-gray-200 rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                value = {role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Open this select menu</option>
                <option>Teacher</option>
                <option>Student</option>
                <option>Administrator</option>
              </select>
            </div>
            </form>
          </div>
          <div className="flex justify-end items-center gap-x-2 py-3 px-4 border-t">
            <button
              type="button"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
              data-hs-overlay="#hs-basic-modal"
            >
              Close
            </button>
            <button
              type="button"
              onClick={submitHandler}
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Add
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddUserModal;
