import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "./Sidebar.css";
import logo from "../assets/logo1.jpg";
import { IoMdAddCircleOutline } from "react-icons/io";
import { IoPersonAddOutline } from "react-icons/io5";
import AxiosInstance from "../api/AxiosInstance";

const Sidebar = () => {
  const [isNavVisible, setIsNavVisible] = useState(true);
  const [isBodyPadded, setIsBodyPadded] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const userName =
    localStorage.getItem("userName")?.split("@")[0].toUpperCase() || "User";

  const handleLogOut = async () => {
    try {
      await AxiosInstance.post("/api/admin-logout", {
        headers: {
          "Content-Type": "application/json",
        },
      });
      localStorage.removeItem("auth");
      alert("Logged out successfully.");
      window.location.reload();
      navigate("/login");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        alert("Session expired. Please log in again.");
        localStorage.removeItem("auth");
        window.location.href = "/login";
      } else {
        console.error("Logout error:", error);
        alert("Error logging out. Please try again.");
      }
    }
  };

  useEffect(() => {
    const handleResize = () => {
      setIsNavVisible(window.innerWidth >= 991);
      setIsBodyPadded(window.innerWidth >= 991);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const sessionTimeout = setTimeout(() => {
      handleLogOut();
      alert("Session expired. Please log in again.");
    }, 60 * 60 * 1000);

    return () => clearTimeout(sessionTimeout);
  }, []);

  const isActive = (path) => (location.pathname === path ? "active" : "");

  const handleLinkClick = () => {
    if (window.innerWidth < 991) {
      setIsNavVisible(false);
      setIsBodyPadded(false);
    }
  };

  return (
    <nav className="sidebar">
      <div id="body-pd" className={isBodyPadded ? "body-pd" : ""}>
        <header className={`header ${isBodyPadded ? "body-pd" : ""}`}>
          <div
            className="header_toggle"
            onClick={() => {
              setIsNavVisible(!isNavVisible);
              setIsBodyPadded(!isBodyPadded);
            }}
          >
            <i className={`bx ${isNavVisible ? "bx-x" : "bx-menu"}`}></i>
          </div>
          <div className="header_img">
            <img src={logo} alt="Logo" />
          </div>
        </header>
        <div className={`l-navbar ${isNavVisible ? "show" : ""}`}>
          <nav className="nav">
            <div>
              <p className="nav_logo">
                <span className="admin-icon-circle">{userName.charAt(0)}</span>
                <span className="nav_logo-name ">{userName}</span>
              </p>
              <hr className="text-danger" />
              <div className="nav_list">
                <Link
                  to="/"
                  className={`nav_link ${isActive("/")}`}
                  onClick={handleLinkClick}
                >
                  <IoMdAddCircleOutline className="nav_icon" />
                  <span className="nav_name">Create Invoice</span>
                </Link>

                <Link
                  to="/get-proforma-invoice"
                  className={`nav_link ${isActive("/get-proforma-invoice")}`}
                  onClick={handleLinkClick}
                >
                  <i className="bx bx-folder nav_icon"></i>
                  <span className="nav_name">Proforma Invoice</span>
                </Link>
                 <Link
                  to="/get-invoice"
                  className={`nav_link ${isActive("/get-invoice")}`}
                  onClick={handleLinkClick}
                >
                  <i className="bx bx-folder nav_icon"></i>
                  <span className="nav_name"> Invoice</span>
                </Link>
                <Link
                  to="/update-info"
                  className={`nav_link ${isActive("/update-info")}`}
                  onClick={handleLinkClick}
                >
                  <IoPersonAddOutline className="nav_icon" />
                  <span className="nav_name">Update Info</span>
                </Link>
                <hr className="text-danger" />
                <p className="nav_link sign-out-btn" onClick={handleLogOut}>
                  <i className="bx bx-log-out"></i>
                  <span className="nav_name">SignOut</span>
                </p>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </nav>
  );
};

export default Sidebar;
