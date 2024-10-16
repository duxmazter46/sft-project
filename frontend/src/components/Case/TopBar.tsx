import { useState, useEffect } from "react";
import axios from "axios";
import { useParams,useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";



// Function to interpolate between two colors based on a percentage
const interpolateColor = (percent: number) => {
  // Define color stops for green (start), yellow (middle), and red (end)
  const green = [13, 148, 136]; // rgb(13, 148, 136) => teal color
  const yellow = [255, 204, 0]; // rgb(255, 204, 0) => yellow color
  const red = [255, 0, 0]; // rgb(255, 0, 0) => red color

  let color;
  if (percent < 50) {
    // Interpolate between green and yellow for the first 50%
    color = green.map((start, index) => Math.round(start + (yellow[index] - start) * (percent / 50)));
  } else {
    // Interpolate between yellow and red for the next 50%
    color = yellow.map((start, index) => Math.round(start + (red[index] - start) * ((percent - 50) / 50)));
  }
  return `rgb(${color[0]}, ${color[1]}, ${color[2]})`;
};

// Countdown Timer component based on the onset time
const Timer = () => {
  const { id } = useParams(); // Extract case ID from the URL
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null); // Remaining time in milliseconds
  const [progress, setProgress] = useState<number>(0); // Circular progress

  useEffect(() => {
    const fetchOnsetTime = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}/cases/${id}`, {
          withCredentials: true,
        });
        const onsetTime = new Date(response.data.onset); // Get the onset time from the case
        const criticalEndTime = new Date(
          onsetTime.getTime() + 4.5 * 60 * 60 * 1000
        ); // Add 4.5 hours

        // Function to calculate time difference
        const calculateTimeRemaining = () => {
          const now = new Date();
          const diff = criticalEndTime.getTime() - now.getTime(); // Difference in milliseconds
          setTimeRemaining(diff > 0 ? diff : 0); // Set remaining time or 0 if critical time is passed

          const elapsedTime = now.getTime() - onsetTime.getTime();
          const totalTime = 4.5 * 60 * 60 * 1000; // 4.5 hours in milliseconds
          setProgress(Math.min((elapsedTime / totalTime) * 100, 100)); // Calculate progress percentage
        };

        calculateTimeRemaining(); // Calculate initially
        const interval = setInterval(calculateTimeRemaining, 1000); // Update every second

        return () => clearInterval(interval); // Cleanup the interval on unmount
      } catch (error) {
        console.error("Error fetching case onset time:", error);
      }
    };

    fetchOnsetTime();
  }, [id]);

  // Helper function to format milliseconds into HH:mm:ss
  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  // Get the dynamic gradient color based on the current progress
  const dynamicColor = interpolateColor(progress);

  return (
    <div className="flex items-center justify-center">
      <div className="w-5 h-5">
        <CircularProgressbar
          value={progress}
          styles={buildStyles({
            pathColor: dynamicColor, // Use dynamic color for the progress path
            trailColor: "#e0e0e0",
          })}
        />
      </div>
      <div className="text-[16px] font-poppins font-semibold ml-2 text-teal-600">
        {timeRemaining !== null ? formatTime(timeRemaining) : "Loading..."}
      </div>
    </div>
  );
};

// StepTracker component
const StepTracker = ({
  currentStep,
  setCurrentStep,
}: {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) => {
  const steps = [
    "Screening",
    "ชั่งน้ำหนักผู้ป่วย",
    "ผล CT Scan",
    "THROMBOLYTIC CHECKLIST",
    "ประเมิน NIHSS",
    "ให้ยา",
  ];

  return (
    <div className="w-full px-2">
      <div className="flex justify-center mb-2">
        <Timer />
      </div>
      <div className="flex flex-wrap justify-between items-center w-full text-[12px]">
        {steps.map((step, index) => (
          <div
            key={index}
            onClick={() => setCurrentStep(index + 1)}
            className="flex flex-col items-center cursor-pointer mb-2 w-1/3 sm:w-auto"
          >
            <div
              className={`w-5 h-5 rounded-full ${
                currentStep >= index + 1 ? "bg-teal-500" : "bg-gray-300"
              } flex items-center justify-center text-white transition-all duration-300 hover:bg-black hover:text-white hover:scale-125`}
            >
              {currentStep >= index + 1 ? (
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 13l4 4L19 7"
                  ></path>
                </svg>
              ) : (
                index + 1
              )}
            </div>
            <div className="text-xs mt-2 text-gray-500 text-center">{step}</div>
          </div>
        ))}
      </div>
      <div className="relative mt-4 flex">
        <div className="absolute w-full h-1 bg-gray-300 top-1/2 left-0 transform -translate-y-1/2 z-0"></div>
        <div
          className="absolute h-1 bg-teal-500 top-1/2 left-0 transform -translate-y-1/2 z-10"
          style={{ width: `${(currentStep / steps.length) * 100}%` }}
        ></div>
      </div>
    </div>
  );
  
};

const TopBar = ({
  currentStep,
  setCurrentStep,
}: {
  currentStep: number;
  setCurrentStep: (step: number) => void;
}) => {

  const navigate = useNavigate();

    // Function to handle "X" button click and navigate to main page
    const handleClose = () => {
      navigate("/mainpage");
    };


    return (
      <div className="relative p-4">
        {/* X button in top left corner */}
        <button
          onClick={handleClose}
          className="absolute top-2 right-1 text-gray-500 hover:text-white bg-gray-100 hover:bg-red-500 w-8 h-8 flex items-center justify-center rounded-full transition-colors duration-200"
          aria-label="Close"
        >
          ✕
        </button>
  
        {/* Step Tracker Component */}
        <StepTracker currentStep={currentStep} setCurrentStep={setCurrentStep} />
      </div>
    );
  };

export default TopBar;
