import { useState } from "react";
import NewCaseForm from "../../components/AddnewCase/NewCaseForm";
import Navbar from "../../components/Navbar/Navbar";
import SideBar from "../../components/sidebar/sidebar";

const NewcasePage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Pass state and function to sidebar */}
      <SideBar isAdminPage={false} isOpen={isOpen} toggleSidebar={toggleSidebar} />
      
      <div className="flex flex-col w-full">
        <Navbar />

        <div className={`transition-all duration-300 ${isOpen ? 'lg:ml-[240px]' : 'lg:ml-[60px]'} mt-4`}>
          <div className="p-4">
            <NewCaseForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default NewcasePage;
