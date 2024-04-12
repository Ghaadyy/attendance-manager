import { Link, useNavigate } from "react-router-dom";
import BasicInput from "../components/inputs/BasicInput";
import { SubmitHandler, useForm } from "react-hook-form";
import { useContext } from "react";
import { userContext } from "../store/UserContext";

type Inputs = {
  email: string;
  password: string;
  username: string;
  firstname: string;
  lastname: string;
};

function Signup() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const navigate = useNavigate();

  const userCtx = useContext(userContext);

  const submitHandler: SubmitHandler<Inputs> = async (data) => {
    const res = await fetch("http://localhost:8000/api/users/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const { token } = await res.json();

    if (token) {
      fetch("http://localhost:8000/api/users/me", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
      }).then((res) =>
        res.json().then((data) => {
          userCtx.setUser(data);
          userCtx.setToken(token);
          localStorage.setItem("token", token);
          navigate("/");
        })
      );
    }
  };

  return (
    <div className="bg-gray-100 px-10 w-screen h-screen flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800">Sign up</h1>
            <p className="mt-2 text-sm text-gray-600">
              Already have an account?{" "}
              <Link
                className="text-blue-600 decoration-2 hover:underline font-medium"
                to="/auth/login"
              >
                Sign in here
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="grid gap-y-4">
                <div className="relative">
                  <input
                    {...register("firstname")}
                    type="text"
                    id="firstname"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
                      focus:pt-6
                      focus:pb-2
                      [&:not(:placeholder-shown)]:pt-6
                      [&:not(:placeholder-shown)]:pb-2
                      autofill:pt-6
                      autofill:pb-2"
                    placeholder="John"
                  />
                  <label
                    htmlFor="firstname"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
                      peer-focus:text-xs
                      peer-focus:-translate-y-1.5
                      peer-focus:text-gray-500
                      peer-[:not(:placeholder-shown)]:text-xs
                      peer-[:not(:placeholder-shown)]:-translate-y-1.5
                      peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    First Name
                  </label>
                  {errors.firstname && (
                    <span className="text-xs text-red-400 ml-2">
                      This field is required
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    {...register("lastname", { required: true })}
                    type="text"
                    id="lastname"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
                      focus:pt-6
                      focus:pb-2
                      [&:not(:placeholder-shown)]:pt-6
                      [&:not(:placeholder-shown)]:pb-2
                      autofill:pt-6
                      autofill:pb-2"
                    placeholder="Doe"
                  />
                  <label
                    htmlFor="email"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
                      peer-focus:text-xs
                      peer-focus:-translate-y-1.5
                      peer-focus:text-gray-500
                      peer-[:not(:placeholder-shown)]:text-xs
                      peer-[:not(:placeholder-shown)]:-translate-y-1.5
                      peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Last Name
                  </label>
                  {errors.lastname && (
                    <span className="text-xs text-red-400 ml-2">
                      This field is required
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    {...register("username", { required: true })}
                    type="text"
                    id="username"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
                      focus:pt-6
                      focus:pb-2
                      [&:not(:placeholder-shown)]:pt-6
                      [&:not(:placeholder-shown)]:pb-2
                      autofill:pt-6
                      autofill:pb-2"
                    placeholder="Doe"
                  />
                  <label
                    htmlFor="username"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
                      peer-focus:text-xs
                      peer-focus:-translate-y-1.5
                      peer-focus:text-gray-500
                      peer-[:not(:placeholder-shown)]:text-xs
                      peer-[:not(:placeholder-shown)]:-translate-y-1.5
                      peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Username
                  </label>
                  {errors.username && (
                    <span className="text-xs text-red-400 ml-2">
                      This field is required
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    {...register("email", { required: true })}
                    type="email"
                    id="email"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
                      focus:pt-6
                      focus:pb-2
                      [&:not(:placeholder-shown)]:pt-6
                      [&:not(:placeholder-shown)]:pb-2
                      autofill:pt-6
                      autofill:pb-2"
                    placeholder="john@email.com"
                  />
                  <label
                    htmlFor="email"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
                      peer-focus:text-xs
                      peer-focus:-translate-y-1.5
                      peer-focus:text-gray-500
                      peer-[:not(:placeholder-shown)]:text-xs
                      peer-[:not(:placeholder-shown)]:-translate-y-1.5
                      peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Email
                  </label>
                  {errors.email && (
                    <span className="text-xs text-red-400 ml-2">
                      This field is required
                    </span>
                  )}
                </div>
                <div className="relative">
                  <input
                    {...register("password", { required: true })}
                    type="password"
                    id="password"
                    className="peer p-4 block w-full border-gray-200 rounded-lg text-sm placeholder:text-transparent focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none
                      focus:pt-6
                      focus:pb-2
                      [&:not(:placeholder-shown)]:pt-6
                      [&:not(:placeholder-shown)]:pb-2
                      autofill:pt-6
                      autofill:pb-2"
                    placeholder="************"
                  />
                  <label
                    htmlFor="password"
                    className="absolute top-0 start-0 p-4 h-full text-sm truncate pointer-events-none transition ease-in-out duration-100 border border-transparent peer-disabled:opacity-50 peer-disabled:pointer-events-none
                      peer-focus:text-xs
                      peer-focus:-translate-y-1.5
                      peer-focus:text-gray-500
                      peer-[:not(:placeholder-shown)]:text-xs
                      peer-[:not(:placeholder-shown)]:-translate-y-1.5
                      peer-[:not(:placeholder-shown)]:text-gray-500"
                  >
                    Password
                  </label>
                  {errors.password && (
                    <span className="text-xs text-red-400 ml-2">
                      This field is required
                    </span>
                  )}
                </div>
                {/* <BasicInput type="text" name="First Name" placeholder="John" />
                <BasicInput type="text" name="Last Name" placeholder="Doe" />
                <BasicInput
                  type="email"
                  name="Email"
                  placeholder="you@email.com"
                />
                <BasicInput
                  type="password"
                  name="Password"
                  placeholder="**********"
                /> */}

                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Sign up
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Signup;
