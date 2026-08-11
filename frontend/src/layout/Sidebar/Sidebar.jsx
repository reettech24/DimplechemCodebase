import { useEffect, useState, useContext, useRef } from "react";
import { personsImgs } from "../../utils/images";
import { navigationLinks } from "../../data/data";
import "./Sidebar.css";
import { SidebarContext } from "../../context/sidebarContext";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import dimplechemical from "../../assets/images/Dimple-Logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronUp,
  faChevronDown,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";
import { fetchCurrentUser } from "../../redux/authSlice";

const Sidebar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const sidebarRef = useRef(null); 
  const { user: userDeatail } = useSelector((state) => state.auth);
  const userRoleId = userDeatail?.employeeRole?.role_id;
  //console.log("userRoleId inside Sidebar:", userRoleId);

  const [isMobile, setIsMobile] = useState(window.innerWidth <= 1200);
  const [sidebarClass, setSidebarClass] = useState("");
  const { isSidebarOpen } = useContext(SidebarContext);
  const [openSubmenus, setOpenSubmenus] = useState({});

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 1200);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const { toggleSidebar } = useContext(SidebarContext);


  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    setSidebarClass(isSidebarOpen ? "sidebar-change" : "");
  }, [isSidebarOpen]);

  const toggleSubmenu = (id) => {
    setOpenSubmenus((prev) => ({ ...prev, [id]: !prev[id] }));
  };

   // ⬇️ click outside to close sidebar
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        sidebarRef.current &&
        !sidebarRef.current.contains(event.target) &&
        isSidebarOpen &&
        window.innerWidth <= 1200
      ) {
        toggleSidebar();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isSidebarOpen, toggleSidebar]);


  const renderSubmenu = (submenu, level) => {
    const submenuClass =
      level === 1 ? "submenu-link" : level === 2 ? "nested-submenu-link" : "";

    return (
      <ul className="ml-4 mt-2 ">
        {submenu
          .filter(
            (subItem) =>
              !subItem.allowedRoles || subItem.allowedRoles.includes(userRoleId)
          )
          .map((subItem) => (
            <li key={subItem.id} className="nav-item">
              <NavLink
                to={subItem.path}
                className={({ isActive }) =>
                  `${submenuClass} ${isActive ? "active" : ""}`
                }
                onClick={(e) => {
                  if (subItem.submenu) {
                    e.preventDefault();
                    toggleSubmenu(subItem.id);
                  }
                }}
              >
                <img
                  src={subItem.image}
                  className="nav-link-icon"
                  alt={subItem.title}
                />
                <span className="nav-link-text">{subItem.title}</span>
                {subItem.submenu && (
                  <span
                    className="submenu-toggle"
                    onClick={(e) => {
                      e.preventDefault();
                      toggleSubmenu(subItem.id);
                    }}
                  >
                    {openSubmenus[subItem.id] ? (
                      <FontAwesomeIcon icon={faChevronUp} />
                    ) : (
                      <FontAwesomeIcon icon={faChevronDown} />
                    )}
                  </span>
                )}
              </NavLink>
              {subItem.submenu && openSubmenus[subItem.id] && (
                <div className="ml-4">
                  {renderSubmenu(subItem.submenu, level + 1)}
                </div>
              )}
            </li>
          ))}
      </ul>
    );
  };

  if (!userRoleId) return null;

  return (
    <div ref={sidebarRef} className={`sidebar ${sidebarClass}`}>
      {/* Mobile close button */}
      {isMobile && (
        <div className="mobile-close-btn">
          <FontAwesomeIcon
            icon={faTimes}
            size="lg"
            onClick={() => toggleSidebar()}
            style={{
              position: "absolute",
              top: "25px",
              right: "25px",
              cursor: "pointer",
              zIndex: 1000,
              color: "#fff",
              background: "#ef4444",
              padding: "5px",
              borderRadius: "5px",
            }}
          />
        </div>
      )}

      <div className="user-info p-1 logo-container" style={{ width: "100%" }}>
        <img
          src={dimplechemical}
          alt=""
          style={{ width: "100%" }}
          className="cursor-pointer"
          // onClick={() => navigate("/dashboard")}
          onClick={() => {
            navigate("/dashboard");
            if (window.innerWidth <= 1200) toggleSidebar();
          }}
        />
      </div>

      <nav className="navigation">
        <ul className="nav-list">
          {navigationLinks
            .filter(
              (navigationLink) =>
                !navigationLink.allowedRoles ||
                navigationLink.allowedRoles.includes(userRoleId)
            )
            .map((navigationLink) => (
              <li className="nav-item" key={navigationLink.id}>
                <NavLink
                  to={navigationLink.path}
                  className={({ isActive }) =>
                    `nav-link ${isActive ? "active" : ""}`
                  }
                  onClick={(e) => {
                    if (navigationLink.submenu) {
                      e.preventDefault();
                      toggleSubmenu(navigationLink.id);
                    }
                  }}
                >
                  <img
                    src={navigationLink.image}
                    className="nav-link-icon"
                    alt={navigationLink.title}
                  />
                  <span className="nav-link-text text-textdata">
                    {navigationLink.title}
                  </span>
                  {navigationLink.submenu && (
                    <span
                      className="submenu-toggle text-textdata"
                      onClick={(e) => {
                        e.preventDefault();
                        toggleSubmenu(navigationLink.id);
                      }}
                    >
                      {openSubmenus[navigationLink.id] ? (
                        <FontAwesomeIcon icon={faChevronUp} />
                      ) : (
                        <FontAwesomeIcon icon={faChevronDown} />
                      )}
                    </span>
                  )}
                </NavLink>
                {navigationLink.submenu &&
                  openSubmenus[navigationLink.id] &&
                  renderSubmenu(navigationLink.submenu, 1)}
              </li>
            ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
