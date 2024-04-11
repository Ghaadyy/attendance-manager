import { useEffect } from "react";
import {
  Outlet,
  RouterProvider,
  createBrowserRouter,
  useLocation,
} from "react-router-dom";

import "preline/preline";
import { IStaticMethods } from "preline/preline";

import NavBar from "./components/navigation/NavBar";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import "./App.css";

declare global {
  interface Window {
    HSStaticMethods: IStaticMethods;
  }
}

function Root() {
  const location = useLocation();

  useEffect(() => {
    window.HSStaticMethods.autoInit();
  }, [location.pathname]);

  return (
    <div>
      <NavBar />
      <Outlet />
    </div>
  );
}

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Root />,
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
