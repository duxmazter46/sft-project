import { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IconContext } from "react-icons/lib";
import { FaBars, FaTimes } from "react-icons/fa";
import Submenu from "./sidebarlabel/sidebarlabel";
import { SideData } from "./sidedata/sidedata";

interface SideBarProps {
  isAdminPage: boolean;
  isOpen: boolean;
  toggleSidebar: () => void;
}

const backgroundGradient =
  "linear-gradient(to bottom, #FFFFFF 0%,  #B2FBF7 25%, #6BDBD4 65%,#ACCEC7 90%, #E3E5B6 100%)";

const SideBar = ({ isAdminPage, isOpen, toggleSidebar }: SideBarProps) => {
  const navigate = useNavigate();
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth < 992);

  // Handle screen resize to detect small screens
  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 992);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const filteredMenuItems = useMemo(
    () =>
      SideData.filter((item) =>
        isAdminPage
          ? item.title === "Approve" || item.title === "Users"
          : item.title === "Menu" || item.title === "Case"
      ),
    [isAdminPage]
  );

  const backgroundStyle = useMemo(
    () => ({ background: backgroundGradient }),
    []
  );

  return (
    <IconContext.Provider value={{ color: "11B6AB" }}>
      {/* Sidebar Content */}
      <div
        className={`fixed top-0 left-0 h-full text-white transition-transform duration-300 ease-in-out w-64 lg:w-[240px] flex flex-col ${
          isOpen
            ? "translate-x-0 lg:translate-x-0"
            : "-translate-x-full lg:translate-x-[-180px]"
        }`}
        style={backgroundStyle}
      >
        {/* Sidebar Toggle Button */}
        <div className="lg:ml-[195px] fixed top-0 left-0 z-50 p-4">
          <button onClick={toggleSidebar}>
            {isSmallScreen
              ? !isOpen
                ? <FaTimes size={18} className="ml-52 " />
                : <FaBars size={18} className=""/>
              : isOpen
              ? <FaTimes size={18} className="lg:ml-[-10px]"/>
              : <FaBars size={20} className="lg:ml-[-15px]"/>}
          </button>
        </div>
        <div className="flex flex-col">
          <img
            src="../../../assets/logo.png"
            alt="Logo"
            className={`h-auto w-auto cursor-pointer mb-[8px] mt-[30px] transition-opacity duration-300 ${
              isOpen ? "lg-opacity-100" : "lg-opacity-0"
            }`}
            onClick={() => navigate(isAdminPage ? "/admin" : "/mainpage")}
          />
          <div className="flex flex-col pr-2 w-full">
            {isSmallScreen
              ? !isOpen
                ? (
                  filteredMenuItems.map((item, index) => (
                    <Submenu item={item} key={index} />
                  ))
                ) : (
                  (
                    filteredMenuItems.map((item, index) => (
                      <Submenu item={item} key={index} />
                    ))
                  )
                )
              : isOpen
              ? (
                filteredMenuItems.map((item, index) => (
                  <Submenu item={item} key={index} />
                ))
              )
              : null
              }
          </div>
        </div>
      </div>

      {/* Overlay when sidebar is open on small screens */}
      <div
        className={`fixed top-0 left-64 h-full w-full bg-black opacity-50 transition-opacity duration-300 ease-in-out ${
          isOpen ? "block lg:hidden" : "hidden"
        }`}
        onClick={toggleSidebar}
      ></div>
    </IconContext.Provider>
  );
};

export default SideBar;
