import { useState } from "react";
import Activecase from "../../components/ActiveCase/Activecase";
import AddNewCase from "../../components/AddnewCase/AddNewCase";
import Navbar from "../../components/Navbar/Navbar";
import Nihss from "../../components/NIHSS/Nihss";
import SideBar from "../../components/sidebar/sidebar";

const MainPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Pass state and function to sidebar */}
      <SideBar isAdminPage={false} isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col">
          <Navbar />
      
      <div className={` transition-all duration-300 ${isOpen ? 'lg:ml-[240px]' : 'lg:ml-[60px]'}`}>
        
        <div className="p-4">
          <AddNewCase />
          <Activecase />
          <Nihss />
        </div>
      </div>
      </div>
    </div>
  );
};

export default MainPage;
