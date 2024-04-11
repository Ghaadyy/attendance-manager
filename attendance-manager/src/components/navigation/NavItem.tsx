import { NavLink } from "react-router-dom";

type NavItemProps = {
  name: string;
  path: string;
};

function NavItem({ name, path }: NavItemProps) {
  return (
    <NavLink
      className={({ isActive }) =>
        `font-medium ${
          isActive ? "text-blue-500" : "text-gray-600 hover:text-gray-400"
        }`
      }
      to={path}
    >
      {name}
    </NavLink>
  );
}

export default NavItem;
