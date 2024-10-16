import { useState } from "react";
import Navbar from "../../components/Navbar/Navbar";
import ApproveUser from "../../components/Approve/ApproveUser";
import SideBar from "../../components/sidebar/sidebar";
import { Link } from "react-router-dom";

const AdminPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Pass state and function to sidebar */}
      <SideBar isAdminPage={true} isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col">
          <Navbar />
      
      <div className={` transition-all duration-300 ${isOpen ? 'lg:ml-[240px]' : 'lg:ml-[60px]'}`}>
        
        <div className="p-4">
          <Link to="/CreateUser">
            <button className="mb-4 px-4 py-2 bg-black text-[14px] text-white font-semibold rounded-md">
              Create User
            </button>
          </Link>
          <ApproveUser />
        </div>
      </div>
      </div>
    </div>
  );
};

export default AdminPage;
