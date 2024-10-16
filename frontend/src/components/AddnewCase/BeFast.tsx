import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { AiOutlineLoading3Quarters } from "react-icons/ai";


const BefastAssessment: React.FC = () => {
  const { id } = useParams(); // Extract the case ID from the URL

  const [checked, setChecked] = useState({
    balance1: false,
    balance2: false,
    eyes1: false,
    eyes2: false,
    face1: false,
    face2: false,
    arms1: false,
    arms2: false,
    arms3: false,
    speech1: false,
    speech2: false,
    time1: false,
    time2: false,
  });

  const [loading, setLoading] = useState(true); // State for loading
  const [error, setError] = useState<string | null>(null); // State for error handling

  // Fetch the BEFAST data on component mount
  useEffect(() => {
    const fetchBefastData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/cases/befast/${id}`,
          {
            withCredentials: true,
          }
        );
        const befastData = response.data;

        // Pre-fill the form with the BEFAST data
        setChecked({
          balance1: befastData.b[0] === "1",
          balance2: befastData.b[1] === "1",
          eyes1: befastData.e[0] === "1",
          eyes2: befastData.e[1] === "1",
          face1: befastData.f[0] === "1",
          face2: befastData.f[1] === "1",
          arms1: befastData.a[0] === "1",
          arms2: befastData.a[1] === "1",
          arms3: befastData.a[2] === "1",
          speech1: befastData.s[0] === "1",
          speech2: befastData.s[1] === "1",
          time1: befastData.t[0] === "1",
          time2: befastData.t[1] === "1",
        });
        setLoading(false);
      } catch (error) {
        console.error("Error fetching BEFAST data:", error);
        setError("Failed to fetch BEFAST data.");
        setLoading(false);
      }
    };

    fetchBefastData();
  }, [id]);

  const getBefastData = () => {
    return {
      b: `${checked.balance1 ? "1" : "0"}${checked.balance2 ? "1" : "0"}`,
      e: `${checked.eyes1 ? "1" : "0"}${checked.eyes2 ? "1" : "0"}`,
      f: `${checked.face1 ? "1" : "0"}${checked.face2 ? "1" : "0"}`,
      a: `${checked.arms1 ? "1" : "0"}${checked.arms2 ? "1" : "0"}${checked.arms3 ? "1" : "0"}`,
      s: `${checked.speech1 ? "1" : "0"}${checked.speech2 ? "1" : "0"}`,
      t: `${checked.time1 ? "1" : "0"}${checked.time2 ? "1" : "0"}`,
    };
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setChecked((prev) => ({ ...prev, [name]: checked }));
  };

  const handleUpdateBefast = async () => {
    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/cases/update-befast/${id}`,
        { ...getBefastData(), last_modified_on: new Date().toISOString() },
        { withCredentials: true }
      );
      alert("BEFAST data updated successfully!");
    } catch (error: unknown) {
      console.error("Error updating BEFAST data:", error);
      alert("Failed to update BEFAST data.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <AiOutlineLoading3Quarters className="animate-spin text-3xl text-blue-600" />
        <span className="ml-2 text-lg text-blue-600">Loading BEFAST data...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 text-red-500 text-center">
        {error}
      </div>
    );
  }

  return (
    <div className="p-6 font-poppins text-[16px] h-screen overflow-auto">
      <h1 className="text-[18px] font-bold mb-6 text-gray-800 mt-5">BEFAST Assessment</h1>

      <div className="grid gap-6">
        {/* Balance */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col flex-1 space-y-4">
            <p className="font-semibold text-gray-700">Balance</p>

          {/* First Switch + Label */}
          <div className="flex items-center space-x-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              name="balance1"
              checked={checked.balance1}
              onChange={handleCheckboxChange}
              className="sr-only"
            />
            <div className={`w-7 h-5 rounded-full ${checked.balance1 ? "bg-teal-500" : "bg-gray-300"}`}>
              <div
                className={`h-4 w-4 mt-[2px] ml-[1px] bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${checked.balance1 ? "translate-x-[12px]" : ""}`}
              >
                {checked.balance1}
              </div>
            </div>
          </label>
          <label>Perform bilateral index finger-to-nose test and bilateral heel-to-shin test</label>
        </div>

    {/* Second Switch + Label */}
    <div className="flex items-center space-x-2">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="balance2"
          checked={checked.balance2}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div className={`w-7 h-5 rounded-full ${checked.balance2 ? "bg-teal-500" : "bg-gray-300"}`}>
          <div className={`h-4 w-4 mt-[2px] ml-[1px] bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${checked.balance2 ? "translate-x-[12px]" : ""}`}
          >        
            {checked.balance2}
          </div>
        </div>
      </label>
      <label>Sudden loss of balance, trouble walking, or dizziness?</label>
    </div>
  </div>

  {/* Image on the right */}
  <img src='../assets/b.png' alt="Balance" className="w-48 h-28 object-contain self-center md:self-start md:ml-4" />
        </div>
        <div className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-center">
            <div className="flex flex-col flex-1 space-y-4">
              <p className="font-semibold text-gray-700">Eyes</p>

              {/* First Switch + Label */}
              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="eyes1"
                    checked={checked.eyes1}
                    onChange={handleCheckboxChange}
                    className="sr-only"
                  />
                  <div className={`w-7 h-5 rounded-full ${checked.eyes1 ? "bg-teal-500" : "bg-gray-300"}`}>
                    <div className={`h-4 w-4 mt-[2px] ml-[1px] bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${checked.eyes1 ? "translate-x-[12px]" : ""}`}
                    >
                      {checked.eyes1}
                    </div>
                  </div>
                </label>
                <label>Assess 4 quadrants of visual field</label>
              </div>

              {/* Second Switch + Label */}
              <div className="flex items-center space-x-2">
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    name="eyes2"
                    checked={checked.eyes2}
                    onChange={handleCheckboxChange}
                    className="sr-only"
                  />
                  <div className={`w-7 h-5 rounded-full ${checked.eyes2 ? "bg-teal-500" : "bg-gray-300"}`}>
                    <div className={`h-4 w-4 mt-[2px] ml-[1px] bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${checked.eyes2 ? "translate-x-[12px]" : ""}`}
                    >
                      {checked.eyes2}
                    </div>
                  </div>
                </label>
                <label>Trouble seeing or sudden double vision?</label>
              </div>
            </div>

            {/* Image on the right */}
            <img src='../assets/e.png' alt="Eyes" className="w-48 h-28 object-contain self-center md:self-start md:ml-4" />
        </div>
        <div className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col flex-1 space-y-4">
        <p className="font-semibold text-gray-700">Face</p>

      {/* First Switch + Label */}
      <div className="flex items-center space-x-2">
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            name="face1"
            checked={checked.face1}
            onChange={handleCheckboxChange}
            className="sr-only"
          />
          <div className={`w-7 h-5 rounded-full ${checked.face1 ? "bg-teal-500" : "bg-gray-300"}`}>
            <div className={`h-4 w-4 mt-[2px] ml-[1px] bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${checked.face1 ? "translate-x-[12px]" : ""}`}
            >
              {checked.face1}
            </div>
          </div>
        </label>
        <label>Ask the patient to smile or show their teeth</label>
      </div>

    {/* Second Switch + Label */}
    <div className="flex items-center space-x-2">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="face2"
          checked={checked.face2}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
         <div className={`w-7 h-5 rounded-full ${checked.face2 ? "bg-teal-500" : "bg-gray-300"}`}>
            <div className={`h-4 w-4 mt-[2px] ml-[1px] bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${checked.face2 ? "translate-x-[12px]" : ""}`}
            >
            {checked.face2}
          </div>
        </div>
      </label>
      <label>Face drooping or numbness on one side?</label>
    </div>
  </div>

  {/* Image on the right */}
  <img src='../assets/f.png' alt="Face" className="w-48 h-28 object-contain self-center md:self-start md:ml-4" />
        </div>


        {/* Arms */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-center">
  <div className="flex flex-col flex-1 space-y-4">
    <p className="font-semibold text-gray-700">Arms</p>

    {/* First Switch + Label */}
    <div className="flex items-center space-x-2">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="arms1"
          checked={checked.arms1}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
         <div className={`w-7 h-5 rounded-full ${checked.arms1 ? "bg-teal-500" : "bg-gray-300"}`}>
            <div className={`h-4 w-4 mt-[2px] ml-[1px] bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${checked.arms1 ? "translate-x-[12px]" : ""}`}
            >
            {checked.arms1}
          </div>
        </div>
      </label>
      <label>Ask the patient to raise and extend both arms with palms up</label>
    </div>

    {/* Second Switch + Label */}
    <div className="flex items-center space-x-2">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="arms2"
          checked={checked.arms2}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div className={`w-7 h-5 rounded-full ${checked.arms2 ? "bg-teal-500" : "bg-gray-300"}`}>
            <div className={`h-4 w-4 mt-[2px] ml-[1px] bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${checked.arms2 ? "translate-x-[12px]" : ""}`}
            >
            {checked.arms2}
          </div>
        </div>
      </label>
      <label>Does one arm drift downward?</label>
    </div>

    {/* Third Switch + Label */}
    <div className="flex items-center space-x-2">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="arms3"
          checked={checked.arms3}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div className={`w-7 h-5 rounded-full ${checked.arms3 ? "bg-teal-500" : "bg-gray-300"}`}>
            <div className={`h-4 w-4 mt-[2px] ml-[1px] bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${checked.arms3 ? "translate-x-[12px]" : ""}`}
            >
            {checked.arms3}
          </div>
        </div>
      </label>
      <label>Sudden numbness or weakness of one arm?</label>
    </div>
  </div>

  {/* Image on the right */}
  <img src='../assets/a.png' alt="Arms" className="w-48 h-28 object-contain self-center md:self-start md:ml-4" />
        </div>


        {/* Speech */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-center">
        <div className="flex flex-col flex-1 space-y-4">
    <p className="font-semibold text-gray-700">Speech</p>

    {/* First Switch + Label */}
    <div className="flex items-center space-x-2">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="speech1"
          checked={checked.speech1}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div className={`w-7 h-5 rounded-full ${checked.speech1 ? "bg-teal-500" : "bg-gray-300"}`}>
            <div className={`h-4 w-4 mt-[2px] ml-[1px] bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${checked.speech1 ? "translate-x-[12px]" : ""}`}
            >
            {checked.speech1}
          </div>
        </div>
      </label>
      <label>Ask the patient to say, "You can't teach an old dog new tricks"</label>
    </div>

    {/* Second Switch + Label */}
    <div className="flex items-center space-x-2">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="speech2"
          checked={checked.speech2}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div className={`w-7 h-5 rounded-full ${checked.speech2 ? "bg-teal-500" : "bg-gray-300"}`}>
            <div className={`h-4 w-4 mt-[2px] ml-[1px] bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${checked.speech2 ? "translate-x-[12px]" : ""}`}
            >
            {checked.speech2}
          </div>
        </div>
      </label>
      <label>Slurred speech or difficulty understanding?</label>
    </div>
        </div>

        {/* Image on the right */}
        <img src='../assets/s.png' alt="Speech" className="w-48 h-28 object-contain self-center md:self-start md:ml-4" />
          </div>


        {/* Time */}
        <div className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-center">
  <div className="flex flex-col flex-1 space-y-4">
    <p className="font-semibold text-gray-700">Time</p>

    {/* First Switch + Label */}
    <div className="flex items-center space-x-2">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="time1"
          checked={checked.time1}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div className={`w-7 h-5 rounded-full ${checked.time1 ? "bg-teal-500" : "bg-gray-300"}`}>
            <div className={`h-4 w-4 mt-[2px] ml-[1px] bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${checked.time1 ? "translate-x-[12px]" : ""}`}
            >
            {checked.time1}
          </div>
        </div>
      </label>
      <label>What time did the symptoms start?</label>
    </div>

    {/* Second Switch + Label */}
    <div className="flex items-center space-x-2">
      <label className="relative inline-flex items-center cursor-pointer">
        <input
          type="checkbox"
          name="time2"
          checked={checked.time2}
          onChange={handleCheckboxChange}
          className="sr-only"
        />
        <div className={`w-7 h-5 rounded-full ${checked.time2 ? "bg-teal-500" : "bg-gray-300"}`}>
            <div className={`h-4 w-4 mt-[2px] ml-[1px] bg-white rounded-full shadow-md transform transition-all duration-300 ease-in-out ${checked.time2 ? "translate-x-[12px]" : ""}`}
            >
            {checked.time2}
          </div>
        </div>
      </label>
      <label>Last known well time?</label>
    </div>
  </div>

  {/* Image on the right */}
  <img src='../assets/t.png' alt="Time" className="w-48 h-28 object-contain self-center md:self-start md:ml-4" />
</div>


      </div>

      <button
        className=" mt-6 px-3 py-2 bg-[#11B6AB] text-[14px] text-white font-bold rounded-md hover:bg-[#0a877a] transition-all duration-200"
        onClick={handleUpdateBefast}
      >
        Update BEFAST
      </button>
    </div>
  );
};

export default BefastAssessment;
