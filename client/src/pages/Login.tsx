import { Link, useNavigate } from "react-router-dom";
import { SubmitHandler, useForm } from "react-hook-form";
import { useContext } from "react";
import { userContext } from "../store/UserContext";
import { toast } from "react-toastify";
import { jwtDecode } from "jwt-decode";
import { User } from "../models/User";

type Inputs = {
  email: string;
  password: string;
};

function Login() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Inputs>();

  const navigate = useNavigate();

  const userCtx = useContext(userContext);

  const submitHandler: SubmitHandler<Inputs> = async (data) => {
    await fetch(`${process.env.REACT_APP_API_URL}/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(async (res) => {
        if (!res.ok) {
          toast.error(await res.text(), {
            toastId: res.status, //to only allow one same error at the same time
          });
        } else {
          const { token } = await res.json();

          if (token) {
            const decodedToken: any = jwtDecode(token);
            fetch(`${process.env.REACT_APP_API_URL}/users/me`, {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + token,
              },
            })
              .then((res) =>
                res.json().then((data) => {
                  const user_data: User = {
                    ...data,
                    roles:
                      decodedToken[
                        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role"
                      ],
                  };
                  userCtx.setUser(user_data);
                  userCtx.setToken(token);
                  localStorage.setItem("token", token);
                  navigate("/courses");
                })
              )
              .catch((err) => console.log(err));
          }
        }
      })
      .catch(() => {
        toast.error("Could not send request", {
          toastId: 500,
        });
      });
  };

  return (
    <div className="bg-gray-100 px-10 w-screen h-screen flex items-center justify-center">
      <div className="bg-white border border-gray-200 rounded-xl shadow-sm max-w-2xl">
        <div className="p-4 sm:p-7">
          <div className="text-center">
            <h1 className="block text-2xl font-bold text-gray-800">Log in</h1>
            <p className="mt-2 text-sm text-gray-600">
              Don't have an account yet?{" "}
              <Link
                className="text-blue-600 decoration-2 hover:underline font-medium"
                to="/auth/signup"
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="grid gap-y-4">
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
                    {...register("password", { required: true, minLength: 6 })}
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
                  {errors.password && errors.password.type === "required" && (
                    <span className="text-xs text-red-400 ml-2">
                      This field is required
                    </span>
                  )}
                  {errors.password && errors.password.type === "minLength" && (
                    <span className="text-xs text-red-400 ml-2">
                      Password must be at least 6 characters long
                    </span>
                  )}
                </div>
                {/* <BasicInput
                  type="email"
                  name="Email"
                  placeholder="you@email.com"
                />
                <BasicInput
                  type="password"
                  name="Password"
                  placeholder="************"
                /> */}
                <button
                  type="submit"
                  className="w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 disabled:pointer-events-none"
                >
                  Sign in
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Login;
