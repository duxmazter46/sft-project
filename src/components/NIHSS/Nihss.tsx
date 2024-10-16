import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { FaEdit } from 'react-icons/fa';
import { useNavigate } from "react-router-dom";

interface CaseData {
  id: string;
  patient_id: string;
  doctor: string;
  status: string;
  onset: string;
}

interface PatientData {
  id: string;
  name: string;
  gender: string;
  age: number;
  address: string;
  weight: number | null;  // Added | null to handle missing values
  height: number | null;  // Added | null to handle missing values
}

const Nihss: React.FC = () => {
  const [activeCases, setActiveCases] = useState<CaseData[]>([]);
  const [patientData, setPatientData] = useState<{
    [key: string]: PatientData;
  }>({});
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchActiveCases = useCallback(async () => {
    try {
      const caseResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/cases`, {
        withCredentials: true,
      });
      const activeCases = caseResponse.data.filter(
        (caseItem: CaseData) => caseItem.status === "Active"
      );
      setActiveCases(activeCases);

      const patientPromises = activeCases.map(async (caseItem: CaseData) => {
        const patientResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/patient/${caseItem.patient_id}`,
          { withCredentials: true }
        );
        return { id: caseItem.patient_id, ...patientResponse.data };
      });

      const patientDataArray = await Promise.all(patientPromises);
      const newPatientData = patientDataArray.reduce((acc, patient) => {
        acc[patient.id] = patient;
        return acc;
      }, {} as { [key: string]: PatientData });

      setPatientData(newPatientData);
    } catch (error) {
      console.error("Error fetching active cases:", error);
      setError("Failed to fetch data. Please try again later.");
    }
  }, []);

  useEffect(() => {
    fetchActiveCases();
  }, [fetchActiveCases]);

  // Function to handle Continue NIHSS Form (for missing data, always set step to 1)
  const handleContinueNihssFixedStep = (caseId: string) => {
    const step = 1; // Always start at step 1 for missing data

    // Save the current step as 1 in localStorage
    localStorage.setItem(`currentStep-${caseId}`, step.toString());

    // Navigate to the specific CasePage for that case ID
    navigate(`/cases/${caseId}`);
  };

  // Function to calculate how long ago the onset time was
  const timeAgo = (onset: string) => {
    const onsetTime = new Date(onset);
    const now = new Date();
    const diff = now.getTime() - onsetTime.getTime(); // Difference in milliseconds

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

    return `${hours} hour${hours !== 1 ? 's' : ''}, ${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
  };

  // Function to display placeholder text as a button when data is null
  const displayField = (value: string | number | null, fieldName: string, caseId: string) => {
    if (value === null || "") {
      return (
        <button
          onClick={() => handleContinueNihssFixedStep(caseId)}  // Call the function for missing data
          className="text-orange-500 bg-orange-100 hover:bg-orange-200 px-3 py-1 rounded-full transition-colors"
          style={{ fontSize: '12px' }}
        >
          Enter {fieldName}
        </button>
      );
    }
    return value;
  };

  return (
    <>
      <div className="font-popin font-semibold text-black text-[16px] h-5 w-full pb-4 border-t border-gray-200 mb-4 pt-4">
        Patient Information
      </div>
      <div className="w-full overflow-x-auto rounded-md shadow-md bg-white">
        {error && <div className="text-red-500">{error}</div>}

        {/* Table Layout */}
        <table className="min-w-full table-auto bg-white">
          <thead className="bg-gray-200">
            <tr>
              <th className="text-left p-4 text-[14px] font-semibold text-gray-700">Patient Name</th>
              <th className="text-left p-4 text-[14px] font-semibold text-gray-700">Age</th>
              <th className="text-left p-4 text-[14px] font-semibold text-gray-700">Weight</th>
              <th className="text-left p-4 text-[14px] font-semibold text-gray-700">Height</th>
              <th className="text-left p-4 text-[14px] font-semibold text-gray-700">Onset Time</th>
              <th className="text-left p-4 text-[14px] font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="text-gray-700">
            {activeCases.map((caseItem) => {
              const patient = patientData[caseItem.patient_id];
              return (
                <tr key={caseItem.id} className="border-b last:border-b-0">
                  <td className="p-4 text-[14px]">{patient ? patient.name : "Loading..."}</td>
                  <td className="p-4 text-[14px]">{patient ? displayField(patient.age, 'Age', caseItem.id) : "Loading..."}</td>
                  <td className="p-4 text-[14px]">{patient ? displayField(patient.weight, 'Weight', caseItem.id) : "Loading..."}</td>
                  <td className="p-4 text-[14px]">{patient ? displayField(patient.height, 'Height', caseItem.id) : "Loading..."}</td>
                  <td className="p-4 text-[14px]">
                    {new Date(caseItem.onset).toLocaleString()}{" "}
                    <span className="text-gray-500">({timeAgo(caseItem.onset)})</span>
                  </td>
                  <td className="p-4">
                    <button 
                      onClick={() => handleContinueNihssFixedStep(caseItem.id)}  // Call handler on click
                      className="flex items-center gap-2 hover:scale-105 hover:text-teal-600 transition-transform text-[14px]"
                    >
                      <FaEdit className="w-3 h-3" />
                      Continue
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Nihss;
