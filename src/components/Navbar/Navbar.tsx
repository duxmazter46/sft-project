import { useState, useEffect } from "react";
import { RiArrowDownSFill, RiArrowUpSFill } from "react-icons/ri";
import axios from "axios";

interface DropdownItemProps {
  href?: string;
  onClick?: () => void;
  children: React.ReactNode;
}

interface User {
  name: string;
}

const DropdownItem = ({ href, onClick, children }: DropdownItemProps) => {
  return href ? (
    <a href={href} className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
      {children}
    </a>
  ) : (
    <button
      onClick={onClick}
      className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left"
    >
      {children}
    </button>
  );
};

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData: User = JSON.parse(storedUser);
        setUserName(userData.name);
      } catch (error) {
        console.error("Failed to parse user data", error);
      }
    }
  }, []);

  const toggleDropdown = () => {
    setIsOpen((prevState) => !prevState);
  };

  const handleLogout = async () => {
    try {
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/users/logout`,
        {},
        { withCredentials: true }
      );

      localStorage.removeItem("user");
      window.location.href = "/login";
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <nav className="border-b-2 border-[#11B6AB] w-screen h-[50px]">
      <div className="flex items-center justify-end text-[16px]">
        <div className="mr-2 mt-2 relative">
          <button
            className="text-profile font-semibold font-popin focus:outline-none flex items-center"
            onClick={toggleDropdown}
            aria-expanded={isOpen}
          >
            <img
              src="../../../assets/User-Icon.png"
              alt="User Image"
              className="w-6 h-6 rounded-full mr-2"
            />
            {userName || "Loading..."}
            <span className="flex justify-end ml-8">
              {isOpen ? <RiArrowUpSFill /> : <RiArrowDownSFill />}
            </span>
          </button>

          {isOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-50">
              <DropdownItem onClick={handleLogout}>Logout</DropdownItem>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
