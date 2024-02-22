import style from "./nav.module.css";
import { Outlet } from "react-router-dom";
import { NavLink, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logOutUser } from "../../Reducers/Auth/auth";

function Navbar({ isAuth, msg, setMsg }) {
  const dispatch = useDispatch();

  // handle logOut Action
  const handleLogOut = () => {
    dispatch(logOutUser());
    setMsg("Sign Out Successfully");
  };

  // return JSX
  return (
    <>
      {msg && <div className={style.message}>{msg}</div>}
      <div className={style.navbar}>
        <div className={style.logo}>
          <h2>{isAuth ? isAuth : "Hellow User"}</h2>
        </div>
        <div className={style.moreOptions}>
          <ul>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive ? style.active : style.unActive
              }
            >
              Home
            </NavLink>
            {isAuth && (
              <NavLink
                to="/cart"
                className={({ isActive }) =>
                  isActive ? style.active : style.unActive
                }
              >
                Cart
              </NavLink>
            )}
            {isAuth && (
              <NavLink
                to="/orders"
                className={({ isActive }) =>
                  isActive ? style.active : style.unActive
                }
              >
                Orders
              </NavLink>
            )}

            {isAuth ? (
              <Link onClick={() => handleLogOut()}>LogOut</Link>
            ) : (
              <NavLink
                to="/signIn"
                className={({ isActive }) =>
                  isActive ? style.active : style.unActive
                }
              >
                Login
              </NavLink>
            )}
          </ul>
        </div>
      </div>
      <Outlet />
    </>
  );
}

export default Navbar;
