import { useContext } from "react";
import { userContext } from "../store/UserContext";
import { Link } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";

type Inputs = {
  email: string;
  // password: string;
  username: string;
  firstname: string;
  lastname: string;
  bloodtype: string;
  phonenumber: string;
};

function Account() {
  const { user, token } = useContext(userContext);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<Inputs>();

  console.log(watch("bloodtype"));

  const submitHandler: SubmitHandler<Inputs> = async (data) => {
    console.log("submitting");
    console.log(data);
    console.log(
      Object.entries(data)
        .map((kv) => ({
          op: "replace",
          path: kv[0],
          value: kv[1],
        }))
        .filter(({ value }) => value)
    );

    const res = await fetch("http://localhost:8000/api/users/", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + token,
      },
      body: JSON.stringify(
        Object.entries(data)
          .map((kv) => ({
            op: "replace",
            path: kv[0],
            value: kv[1],
          }))
          .filter(({ value }) => value)
      ),
    });

    if(res.ok){
      toast.success("Changes saved", {
        toastId: res.status
      });
    } else {
      toast.error("Could not save changes", {
        toastId: res.status
      });
    }

    // console.log(await res.json());
  };

  return (
    <>
      <div className="max-w-5xl px-4 py-5 sm:px-6 lg:px-8 lg:py-5 mx-auto">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-gray-800">Profile</h2>
          <p className="text-sm text-gray-600">
            Manage your name, password and account settings.
          </p>
        </div>

        <form onSubmit={handleSubmit(submitHandler)}>
          <div className="grid sm:grid-cols-12 gap-2 sm:gap-6">
            <div className="sm:col-span-3">
              <label
                htmlFor="full-name"
                className="inline-block text-sm text-gray-800 mt-2.5"
              >
                Full name
              </label>
              <div className="hs-tooltip inline-block">
                <button type="button" className="hs-tooltip-toggle ms-1">
                  <svg
                    className="inline-block size-3 text-gray-400"
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                    <path d="m8.93 6.588-2.29.287-.082.38.45.083c.294.07.352.176.288.469l-.738 3.468c-.194.897.105 1.319.808 1.319.545 0 1.178-.252 1.465-.598l.088-.416c-.2.176-.492.246-.686.246-.275 0-.375-.193-.304-.533L8.93 6.588zM9 4.5a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                  </svg>
                </button>
                <span
                  className="hs-tooltip-content hs-tooltip-shown:opacity-100 hs-tooltip-shown:visible opacity-0 transition-opacity inline-block absolute invisible w-40 text-center z-10 py-1 px-2 bg-gray-900 text-xs font-medium text-white rounded shadow-sm"
                  role="tooltip"
                >
                  Displayed on public forums, such as John
                </span>
              </div>
            </div>
            {/* <!-- End Col --> */}

            <div className="sm:col-span-9">
              <div className="sm:flex">
                <input
                  {...register("firstname")}
                  id="full-name"
                  type="text"
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="John"
                  defaultValue={user?.firstName}
                />
                <input
                  {...register("lastname")}
                  type="text"
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm -mt-px -ms-px first:rounded-t-lg last:rounded-b-lg sm:first:rounded-s-lg sm:mt-0 sm:first:ms-0 sm:first:rounded-se-none sm:last:rounded-es-none sm:last:rounded-e-lg text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="Doe"
                  defaultValue={user?.lastName}
                />
              </div>
            </div>
            {/* <!-- End Col --> */}

            <div className="sm:col-span-3">
              <label
                htmlFor="email"
                className="inline-block text-sm text-gray-800 mt-2.5"
              >
                Email
              </label>
            </div>
            {/* <!-- End Col --> */}

            <div className="sm:col-span-9">
              <input
                {...register("email")}
                id="email"
                type="email"
                className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm text-sm rounded-lg focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                placeholder="john.doe@email.com"
                defaultValue={user?.email}
              />
            </div>
            {/* <!-- End Col --> */}

            <div className="sm:col-span-3">
              <label
                htmlFor="password"
                className="inline-block text-sm text-gray-800 mt-2.5"
              >
                Password
              </label>
            </div>
            {/* <!-- End Col --> */}

            <div className="sm:col-span-9">
              <div className="space-y-2">
                <input
                  id="password"
                  disabled
                  type="text"
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="Enter current password"
                />
                <input
                  type="text"
                  disabled
                  className="py-2 px-3 pe-11 block w-full border-gray-200 shadow-sm rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="Enter new password"
                />
              </div>
            </div>
            {/* <!-- End Col --> */}

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label
                  htmlFor="phone"
                  className="inline-block text-sm text-gray-800 mt-2.5"
                >
                  Phone
                </label>
                <span className="text-sm text-gray-400"> (Optional)</span>
              </div>
            </div>
            {/* <!-- End Col --> */}

            <div className="sm:col-span-9">
              <div className="sm:flex">
                <input
                  {...register("phonenumber")}
                  id="phone"
                  type="text"
                  className="py-2 px-3 pe-11 block w-full rounded-lg border-gray-200 shadow-sm -mt-px -ms-px sm:mt-0 sm:first:ms-0 text-sm relative focus:z-10 focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none"
                  placeholder="+961 01 000 000"
                  defaultValue={user?.phoneNumber}
                />
              </div>
            </div>
            {/* <!-- End Col --> */}

            <div className="sm:col-span-3">
              <div className="inline-block">
                <label
                  htmlFor="blood-type"
                  className="inline-block text-sm text-gray-800 mt-2.5"
                >
                  Blood Type
                </label>
              </div>
            </div>

            <div className="sm:col-span-9">
              <select
                data-hs-select='{
                  "placeholder": "Select option...",
                  "toggleTag": "<button type=\"button\"></button>",
                  "toggleClasses": "hs-select-disabled:pointer-events-none hs-select-disabled:opacity-50 relative py-3 px-4 pe-9 flex text-nowrap w-full cursor-pointer bg-white border border-gray-200 rounded-lg text-start text-sm focus:border-blue-500 focus:ring-blue-500 before:absolute before:inset-0 before:z-[1]",
                  "dropdownClasses": "mt-2 z-50 w-full max-h-72 p-1 space-y-0.5 bg-white border border-gray-200 rounded-lg overflow-hidden overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-track]:bg-gray-100 [&::-webkit-scrollbar-thumb]:bg-gray-300",
                  "optionClasses": "py-2 px-4 w-full text-sm text-gray-800 cursor-pointer hover:bg-gray-100 rounded-lg focus:outline-none focus:bg-gray-100",
                  "optionTemplate": "<div class=\"flex justify-between items-center w-full\"><span data-title></span><span class=\"hidden hs-selected:block\"><svg class=\"flex-shrink-0 size-3.5 text-blue-600\" xmlns=\"http:.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><polyline points=\"20 6 9 17 4 12\"/></svg></span></div>",
                  "extraMarkup": "<div class=\"absolute top-1/2 end-3 -translate-y-1/2\"><svg class=\"flex-shrink-0 size-3.5 text-gray-500\" xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\" fill=\"none\" stroke=\"currentColor\" stroke-width=\"2\" stroke-linecap=\"round\" stroke-linejoin=\"round\"><path d=\"m7 15 5 5 5-5\"/><path d=\"m7 9 5-5 5 5\"/></svg></div>"
                }'
                className="hidden"
                id="blood-type"
                defaultValue={user?.bloodType}
              >
                <option value="">Choose</option>
                <option>A+</option>
                <option>A</option>
                <option>A-</option>
                <option>B+</option>
                <option>B</option>
                <option>B-</option>
                <option>O+</option>
                <option>O</option>
                <option>O-</option>
                <option>AB+</option>
                <option>AB</option>
                <option>AB-</option>
              </select>
            </div>
            {/* <!-- End Col --> */}
          </div>
          {/* <!-- End Grid --> */}

          <div className="mt-5 flex justify-end gap-x-2">
            <Link
              type="button"
              to="/"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-medium rounded-lg border border-gray-200 bg-white text-gray-800 shadow-sm hover:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none"
            >
              Cancel
            </Link>
            <button
              type="submit"
              className="py-2 px-3 inline-flex items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Account;
