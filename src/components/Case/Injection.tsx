import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useParams,useNavigate } from "react-router-dom";

const Injection: React.FC = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState<string>("");
  const [bolus, setBolus] = useState<number | null>(null);
  const [drip, setDrip] = useState<number | null>(null);
  const [bolusTimestamp, setBolusTimestamp] = useState<string>("");
  const [dripTimestamp, setDripTimestamp] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const [isNewInjection, setIsNewInjection] = useState<boolean>(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Prefill the doctor's name from localStorage if available
    const doctorNameFromStorage = localStorage.getItem("user");
    if (doctorNameFromStorage) {
      const doctorName = JSON.parse(doctorNameFromStorage).name;
      setDoctor(doctorName);
    }

    const fetchInjectionData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/cases/injection/${id}`,
          { withCredentials: true }
        );

        if (response.data) {
          setBolus(response.data.bolus);
          setDrip(response.data.drip);
          setBolusTimestamp(response.data.bolus_timestamp);
          setDripTimestamp(response.data.drip_timestamp);
          setDoctor(response.data.doctor || doctorNameFromStorage || ""); // Fallback to local storage
        } else {
          setIsNewInjection(true);
        }

        // Fetch the user details if no doctor name is found
        if (!doctorNameFromStorage) {
          const userResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/users/me`, {
            withCredentials: true,
          });
          setDoctor(userResponse.data.name);
          localStorage.setItem("doctorName", userResponse.data.name); // Save to local storage
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching injection data:", error);
        setIsNewInjection(true);
        setLoading(false);
      }
    };

    fetchInjectionData();
  }, [id]);

  const handleNumberInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<number | null>>
  ) => {
    const value = Number(e.target.value);
    setState(isNaN(value) ? null : value);
  };

  const handleStringInputChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const value = e.target.value;
    setState(value);
  };

  const setCurrentTimestamp = (
    setState: React.Dispatch<React.SetStateAction<string>>
  ) => {
    const now = new Date();
    
    // Get the timezone offset in minutes and convert it to hours and minutes
    const timezoneOffset = -now.getTimezoneOffset(); // returns offset in minutes, negative for UTC+ times
    const offsetHours = String(Math.floor(timezoneOffset / 60)).padStart(2, '0');
    const offsetMinutes = String(Math.abs(timezoneOffset % 60)).padStart(2, '0');
    const timezoneSign = timezoneOffset >= 0 ? '+' : '-';
  
    // Format the date in ISO 8601 and append the timezone offset
    const formattedTimestamp = now.toISOString().slice(0, -1) + `${timezoneSign}${offsetHours}:${offsetMinutes}`;
  
    setState(formattedTimestamp);
  };
  
  const handleReject =  async () => {
    alert('Patient Refuses Treatment');
    navigate("/mainpage")}
  const handleSubmit = async () => {
    try {
      const payload = {
        bolus,
        drip,
        bolus_timestamp: bolusTimestamp,
        drip_timestamp: dripTimestamp,
        doctor,
      };

      if (isNewInjection) {
        try {
          await axios.post(
            `${import.meta.env.VITE_APP_API_URL}/cases/injection/${id}`,
            payload,
            {
              withCredentials: true,
            }
          );
          alert("Injection data created successfully!");
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            if (error.response && error.response.status === 409) {
              console.warn(
                "Conflict: Injection entry already exists. Switching to update..."
              );
              await axios.patch(
                `${import.meta.env.VITE_APP_API_URL}/cases/injection/${id}`,
                payload,
                {
                  withCredentials: true,
                }
              );
              alert("Injection data updated successfully!");
            } else {
              throw error;
            }
          } else {
            console.error("An unknown error occurred:", error);
            alert("An unknown error occurred.");
          }
        }
      } else {
        await axios.patch(
          `${import.meta.env.VITE_APP_API_URL}/cases/injection/${id}`,
          payload,
          {
            withCredentials: true,
          }
        );
        alert("Injection data updated successfully!");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Error saving injection data:", error);
        alert("Failed to save injection data.");
      } else {
        console.error("An unknown error occurred:", error);
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="w-full border border-gray-300 rounded-lg p-6 mt-4 mb-6">
      <h1 className="text-[20px] font-semibold mb-4">ให้ยาสลายลิ่มเลือด</h1>

      {loading ? (
        <p>Loading injection data...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[18px] font-medium text-gray-700 mb-1">
              ปริมาณยา Bolus 10%
            </label>
            <input
              type="number"
              value={bolus !== null ? bolus : ""}
              onChange={(e) => handleNumberInputChange(e, setBolus)}
              className="w-full px-4 py-1 block text-[14px]  border rounded-lg bg-gray-100"
              placeholder="กรอกผลตามหน้าชั่งน้ำหนักผู้ป่วย"
            />
            <label className="block text-[18px] font-medium text-gray-700 mt-4">
              เวลาที่ให้ยา
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={bolusTimestamp}
                onChange={(e) => handleStringInputChange(e, setBolusTimestamp)}
                className="w-full px-4 py-1 text-[14px]  border rounded-lg bg-gray-100"
                placeholder="YYYY-MM-DD HH:MM"
              />
              <button
                className="px-4 py-1 text-[16px]  bg-gray-200 rounded-lg"
                onClick={() => setCurrentTimestamp(setBolusTimestamp)}
              >
                TimeStamp
              </button>
            </div>
          </div>

          <div>
            <label className="block text-[18px]  font-medium text-gray-700 mb-1">
              ปริมาณยา Drip 90%
            </label>
            <input
              type="number"
              value={drip !== null ? drip : ""}
              onChange={(e) => handleNumberInputChange(e, setDrip)}
              className="w-full px-4 py-1 text-[14px]  border rounded-lg bg-gray-100"
              placeholder="กรอกผลตามหน้าชั่งน้ำหนักผู้ป่วย"
            />
            <label className="block text-[18px]  font-medium text-gray-700 mt-4">
              เวลาที่ให้ยา
            </label>
            <div className="flex space-x-2">
              <input
                type="text"
                value={dripTimestamp}
                onChange={(e) => handleStringInputChange(e, setDripTimestamp)}
                className="w-full px-4 py-1 text-[14px]  border rounded-lg bg-gray-100"
                placeholder="YYYY-MM-DD HH:MM"
              />
              <button
                className="px-4 py-1 text-[16px]  bg-gray-200 rounded-lg"
                onClick={() => setCurrentTimestamp(setDripTimestamp)}
              >
                TimeStamp
              </button>
            </div>
          </div>

          <div className="col-span-1 md:col-span-2">
            <label className="block text-[18px]  font-medium text-gray-700 mb-1">
              ลงชื่อแพทย์ผู้รักษา
            </label>
            <input
              type="text"
              value={doctor}
              onChange={(e) => handleStringInputChange(e, setDoctor)}
              className="w-full px-4 py-1 text-[14px]  border rounded-lg bg-gray-100"
              placeholder="Doctor's Name"
            />
          </div>

          <div className="flex space-x-4 text-[16px] col-span-1 md:col-span-2 mt-6">
            <button
              className="px-4 py-1 bg-green-600 text-white rounded-lg"
              onClick={handleSubmit}
            >
              ยืนยันการให้ยา
            </button>
            <button className="px-4 py-1 bg-red-600 text-white rounded-lg"
              onClick={handleReject}>
              ไม่ให้ยา
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Injection;
