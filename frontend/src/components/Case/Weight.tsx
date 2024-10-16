import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const Weight: React.FC = () => {
  const { id } = useParams(); // Extract the case ID from the URL
  const [patientId, setPatientId] = useState<string>(""); // State for patient ID
  const [weight, setWeight] = useState<number | null>(null); // State for weight
  const [totalDose, setTotalDose] = useState<number | null>(null); // Total dose
  const [bolus, setBolus] = useState<number | null>(null); // Bolus dose
  const [drip, setDrip] = useState<number | null>(null); // Drip dose
  const [name, setName] = useState<string>("");

  // Fetch the patient's weight on component mount
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const caseResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/cases/${id}`,
          {
            withCredentials: true,
          }
        );

        const patientResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/patient/${caseResponse.data.patient_id}`,
          { withCredentials: true }
        );

        setPatientId(patientResponse.data.id); // Set patient ID
        setWeight(patientResponse.data.weight); // Set weight if available
        setName(patientResponse.data.name);
      } catch (error) {
        console.error("Error fetching patient data:", error);
      }
    };

    fetchPatientData();
  }, [id]);

  // Recalculate bolus and drip whenever weight changes
  useEffect(() => {
    if (weight) {
      const total = Math.min(weight * 0.9, 90); // Calculate total dose (0.9 mg/kg with max of 90 mg)
      const calculatedBolus = total * 0.1; // Bolus: 10% of the total dose
      const calculatedDrip = total * 0.9; // Drip: 90% of the total dose

      setTotalDose(total);
      setBolus(calculatedBolus);
      setDrip(calculatedDrip);
    }
  }, [weight]); // This effect triggers whenever weight is updated

  // Function to handle weight change
  const handleWeightChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setWeight(Number(e.target.value));
  };

  // Function to handle submission of weight and calculation
  const handleCalculate = async () => {
    if (!weight) return;

    try {
      // POST the weight to update the patient's record
      await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/patient/update/${patientId}`,
        { weight },
        { withCredentials: true }
      );

      // Recalculate the dosages after successfully updating weight
    } catch (error) {
      console.error("Error updating patient weight:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-2 mb-6 p-10 bg-white shadow-lg rounded-lg ">
      <h1 className="text-[20px] font-semibold text-gray-800 mb-[-30px]">Patient Weight & Dosage</h1>

      <div className="flex flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-8">
        {/* Patient Details and Image */}
        <div className="flex flex-col items-center space-y-4 mt-[50px]">
          <div className="rounded-lg flex items-center justify-center">
            <img src="../../../assets/newCase.png" alt="patient" className="w-[180px] h-[180px] opacity-80" />
          </div>
          <div className="text-[18px] font-semibold text-gray-800">{name || "Loading..."}</div>
        </div>

        {/* Calculation Section */}
        <div className="flex flex-col space-y-4">
          <h2 className="text-[18px] font-semibold text-teal-600">Dosage Information</h2>
          <div className="flex flex-col space-y-2 text-[16px] text-gray-700">
            <p >Total rt-Pa Dose: <span className="font-bold">{totalDose ? `${totalDose.toFixed(2)} mg` : "--"}</span></p>
            <p>Bolus (10%): <span className="font-bold">{bolus ? `${bolus.toFixed(2)} mg` : "--"}</span></p>
            <p>Drip (90%): <span className="font-bold">{drip ? `${drip.toFixed(2)} mg` : "--"}</span></p>
          </div>
        </div>
      </div>

      {/* Weight Input Section */}
      <div className="mt-6 flex justify-center items-center">
        <label className="block font-medium text-[16px] text-gray-700 mb-2 pr-4">Patient Weight (kg)</label>
        <div className="flex items-center space-x-4 text-[16px]">
          <input
            type="number"
            value={weight || ""}
            onChange={handleWeightChange}
            className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-50 text-gray-800 focus:outline-none focus:ring-2 focus:ring-teal-500"
            placeholder="Enter weight"
          />
          <button
            className="px-10 py-1 bg-teal-600 text-white font-semibold rounded-lg hover:bg-teal-700 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-teal-500"
            onClick={handleCalculate}
          >
            Calculate
          </button>
        </div>
      </div>
    </div>
  );
};

export default Weight;
