import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { logout } from "../redux/userSlice";
import menu from "../images/menu.png";
import report from "../images/report.png";
const Navbar = () => {
  const [expand, setExpand] = useState(false);
  const { user } = useSelector((store) => store.user);
  const dispatch = useDispatch();

  return (
    <header className="sticky-top">
      <nav className="navbar navbar-expand-lg">
        <div className="container">
          <div className="mobile-nav">
            <Link to="/newReport" className="navbar-brand">
              <img src={report} alt="report" />
              Reports
            </Link>
            <button
              className="navbar-toggler collapsed"
              aria-controls="navbarNav"
              aria-label="toggle navigation"
              onClick={() => {
                setExpand(!expand);
              }}
            >
              <img src={menu} alt="menu" style={{ width: 35 }} />
            </button>
          </div>
          {user && (
            <div
              className={`navbar-collapse ${!expand ? "collapse" : ""}`}
              id="navbarNav"
            >
              <ul className="navbar-nav ms-auto">
                {(user.role === "Back Office" || user.role === "Admin") && (
                  <li className="nav-item">
                    <Link
                      to="/dashboard"
                      className="nav-link text-center"
                      aria-current="page"
                      onClick={() => {
                        setExpand(false);
                      }}
                    >
                      Dashboard
                    </Link>
                  </li>
                )}
                <li className="nav-item">
                  <Link
                    to="/newReport"
                    className="nav-link text-center"
                    aria-current="page"
                    onClick={() => {
                      setExpand(false);
                    }}
                  >
                    New Report
                  </Link>
                </li>
                <li className="nav-item logout">
                  <button
                    className="btn nav-link text-center"
                    aria-current="page"
                    onClick={() => {
                      dispatch(logout());
                    }}
                  >
                    Log Out
                  </button>
                </li>
              </ul>
            </div>
          )}
        </div>
      </nav>
    </header>
  );
};
export default Navbar;
