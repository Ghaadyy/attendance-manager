import { RouterProvider, createBrowserRouter } from "react-router-dom";

import "preline/preline";
import { IStaticMethods } from "preline/preline";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";
import RootLayout from "./layouts/RootLayout";
import Account from "./pages/Account";
import Courses from "./pages/Courses";
import Dashboard from "./pages/Dashboard";
import Course from "./pages/Course";
import Users from "./pages/Users";
import CreateCourse from "./pages/CreateCourse";
import CreateUser from "./pages/CreateUser";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <RootLayout />,
      children: [
        {
          path: "",
          element: <Dashboard />,
        },
        {
          path: "account",
          element: <Account />,
        },
        {
          path: "users",
          element: <Users />,
        },
        {
          path: "courses",
          element: <Courses />,
        },
        {
          path: "course/:courseId",
          element: <Course />,
        },
        {
          path: "course/create",
          element: <CreateCourse />,
        },
        {
          path: "users/create",
          element: <CreateUser />,
        },
      ],
    },
    {
      path: "/auth",
      children: [
        {
          path: "login",
          element: <Login />,
        },
        {
          path: "signup",
          element: <Signup />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
