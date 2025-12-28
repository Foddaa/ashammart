import { UserContext } from "@/Context/AuthContext";
import { useContext } from "react";
import { NavLink } from "react-router-dom";

export default function NavBar() {
  const { Token, setToken, userRole, setUserRole } = useContext(UserContext);

  const linkBase = "transition-colors duration-200 font-medium";
  const activeClass = "text-blue-700 font-semibold";
  const inactiveClass = "text-gray-700 hover:text-blue-600";

  return (
    <div className="flex flex-wrap justify-center gap-4 text-[15px]">
      {userRole === "ADMIN" ? (
        <NavLink
          to="/admin"
          className={({ isActive }) =>
              `centering mr-2 gap-2 ${isActive ? "isActiveStyle" : ""}`
          }
        >
          Admin
        </NavLink>
      ) : (
        <>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `centering mr-2 gap-2 ${isActive ? "isActiveStyle" : ""}`
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/Shop"
            className={({ isActive }) =>
              `centering mr-2 gap-2 ${isActive ? "isActiveStyle" : ""}`
            }
          >
            Shop
          </NavLink>

          <NavLink
            to="/blog"
            className={({ isActive }) =>
              `centering mr-2 gap-2 ${isActive ? "isActiveStyle" : ""}`
            }
          >
            Blog
          </NavLink>

          <NavLink
            to="/contact"
            className={({ isActive }) =>
              `centering mr-2 gap-2 ${isActive ? "isActiveStyle" : ""}`
            }
          >
            Contact
          </NavLink>
          {/* <NavLink
            to="/contact"
            className={({ isActive }) =>
              `centering mr-2 gap-2 ${isActive ? "isActiveStyle" : ""}`
            }
          >
            {({ isActive }) => (
              <span className={isActive ? "text-blue-900" : ""}>Contact</span>
            )}
          </NavLink> */}
        </>
      )}
    </div>
  );
}
