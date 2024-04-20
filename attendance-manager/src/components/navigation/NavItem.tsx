import { HSOverlay } from "preline/preline";
import { NavLink } from "react-router-dom";

type NavItemProps = {
  name: string;
  path: string;
};

function NavItem({ name, path }: NavItemProps) {
  return (
    <li>
      <NavLink
        className={({ isActive }) =>
          `flex items-center gap-x-3.5 py-3 px-2.5 text-sm text-slate-700 rounded-lg hover:bg-gray-100 ${
            isActive ? "bg-gray-100" : ""
          }`
        }
        to={path}
        onClick={() =>
          HSOverlay.close(document.getElementById("application-sidebar")!)
        }
      >
        {name}
      </NavLink>
    </li>
  );
}

export default NavItem;
