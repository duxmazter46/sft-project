import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SideBar from "../../components/sidebar/sidebar";
import BefastAssessment from "../../components/AddnewCase/BeFast";
import EditCase from "../../components/Case/EditCase";
import TopBar from "../../components/Case/TopBar";
import Weight from "../../components/Case/Weight";
import CTResult from "../../components/Case/CTResult";
import Thrombolytic from "../../components/Case/Thrombolytic";
import Nihss from "../../components/Case/Nihss";
import Injection from "../../components/Case/Injection";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

const steps = [
  {
    key: "step-1",
    component: (
      <>
        <EditCase />
        <BefastAssessment />
      </>
    ),
  },
  {
    key: "step-2",
    component: <Weight />,
  },
  {
    key: "step-3",
    component: <CTResult />,
  },
  {
    key: "step-4",
    component: <Thrombolytic />,
  },
  {
    key: "step-5",
    component: <Nihss round={0} />,
  },
  {
    key: "step-6",
    component: <Injection />,
  },
];

const CasePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);

  // 1. Initialize currentStep from localStorage, falling back to 1 if not found
  const initialStep = () => {
    const savedStep = localStorage.getItem(`currentStep-${id}`);
    return savedStep ? parseInt(savedStep, 10) : 1;  // Fallback to 1 if nothing is saved
  };

  const [currentStep, setCurrentStep] = useState<number>(initialStep); // Use function to initialize

  // 2. Save current step to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem(`currentStep-${id}`, currentStep.toString());
  }, [currentStep, id]);

  // Handle Sidebar toggle
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  // Handle finishing the case with a confirmation dialog
  const handleFinishCase = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to finish this case?"
    );
    if (!confirmed) return;

    try {
      const response = await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/cases/finish/${id}`,
        {},
        { withCredentials: true }
      );
      console.log("Case finished successfully:", response.data);
      alert("Case finished successfully!");
      localStorage.removeItem(`currentStep-${id}`); // Clear the step when the case is finished
      navigate("/mainpage");
    } catch (error) {
      console.error("Error finishing case:", error);
      alert("Failed to finish case.");
    }
  };

  return (
    <div className="flex flex-col lg:flex-row">
      {/* Sidebar */}
      <SideBar isAdminPage={false} isOpen={isOpen} toggleSidebar={toggleSidebar} />
  
      {/* Main Content Area */}
      <div className="flex flex-col">
        <Navbar />
        <div className={`transition-all duration-300 ${isOpen ? 'lg:ml-[240px]' : 'lg:ml-[60px]'}`}>
          <div className="px-8 space-y-8">
            {/* Step Navigation */}
            <TopBar currentStep={currentStep} setCurrentStep={setCurrentStep} />
  
            <div className="w-full h-fit border border-[#11B6AB] rounded-md px-8 pt-2 justify-center items-center">
              <div className="w-full ">
                {/* Render the current step component */}
                {steps[currentStep - 1].component}
              </div>
            </div>  
  
            {/* Finish Case Button Here */}
            <div className="flex justify-end pb-2">
              <button
                type="button"
                onClick={handleFinishCase}
                className="px-3 py-1 text-[18px] bg-red-600 text-white rounded-full hover:bg-red-700 transition duration-300"
              >
                Finish this case
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
  
};

export default CasePage;
