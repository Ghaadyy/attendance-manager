import { Link } from "react-router-dom";
import BasicInput from "../components/inputs/BasicInput";

function Login() {
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
                to="/signup"
              >
                Sign up here
              </Link>
            </p>
          </div>

          <div className="mt-5">
            <form>
              <div className="grid gap-y-4">
                <BasicInput
                  type="email"
                  name="Email"
                  placeholder="you@email.com"
                />
                <BasicInput
                  type="password"
                  name="Password"
                  placeholder="************"
                />
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
