import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "react-router-dom";

interface FormState {
  inclusion: {
    ischemicStroke: boolean;
    onsetWithinTime: boolean;
    ageOver18: boolean;
    measurableNeurologicalDeficit: boolean;
  };
  absoluteExclusion: {
    activeBleeding: boolean;
    intracranialHemorrhage: boolean;
    recentHeadTrauma: boolean;
    uncontrolledHypertension: boolean;
    lowPlatelets: boolean;
    anticoagulants: boolean;
    bloodGlucoseLow: boolean;
    seizureAtOnset: boolean;
    endocarditisOrDissection: boolean;
    recentMajorSurgery: boolean;
    recentGIOrUTBleed: boolean;
  };
  relativeExclusion: {
    minorSymptoms: boolean;
    pregnancy: boolean;
    majorSurgeryLast3Months: boolean;
    recentGIBleedLast21Days: boolean;
    lumbarOrArterialPuncture: boolean;
  };
  comment: string;
}

const initialFormState: FormState = {
  inclusion: {
    ischemicStroke: false,
    onsetWithinTime: false,
    ageOver18: false,
    measurableNeurologicalDeficit: false,
  },
  absoluteExclusion: {
    activeBleeding: false,
    intracranialHemorrhage: false,
    recentHeadTrauma: false,
    uncontrolledHypertension: false,
    lowPlatelets: false,
    anticoagulants: false,
    bloodGlucoseLow: false,
    seizureAtOnset: false,
    endocarditisOrDissection: false,
    recentMajorSurgery: false,
    recentGIOrUTBleed: false,
  },
  relativeExclusion: {
    minorSymptoms: false,
    pregnancy: false,
    majorSurgeryLast3Months: false,
    recentGIBleedLast21Days: false,
    lumbarOrArterialPuncture: false,
  },
  comment: "",
};

const Thrombolytic: React.FC = () => {
  const { id } = useParams(); // Get the case ID from the URL
  const [formState, setFormState] = useState<FormState>(initialFormState); // Form state
  const [isMet, setIsMet] = useState<boolean | null>(null); // Whether the criteria is met or not
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [isNewThrombolytic, setIsNewThrombolytic] = useState<boolean>(false); // Check if it's a new entry

  // Fetch existing thrombolytic data for prefill
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/cases/thrombolytic/${id}`,
          { withCredentials: true }
        );
        const { checklist, is_met } = response.data;
        
        // Set formState with existing checklist data
        setFormState(checklist);
        setIsMet(is_met);
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          // If the response is a 404, it's a new entry
          setIsNewThrombolytic(true);
        } else {
          console.error("Error fetching thrombolytic data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // Handle input change for checkboxes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    const [category, field] = name.split(".");

    setFormState((prevState) => ({
      ...prevState,
      [category]: {
        ...(prevState[category as keyof FormState] as Record<string, boolean>), // Type casting to avoid TS errors
        [field]: checked,
      },
    }));
  };

  // Logic to calculate if the criteria is met based on the form state
  const calculateIsMet = () => {
    const inclusionCriteriaMet = Object.values(formState.inclusion).every(Boolean);
    const noAbsoluteExclusions = !Object.values(formState.absoluteExclusion).some(Boolean);

    const criteriaMet = inclusionCriteriaMet && noAbsoluteExclusions;
    setIsMet(criteriaMet);
  };

  // Handle form submission
  const handleSubmit = async () => {
    calculateIsMet(); // Calculate if criteria is met before submitting
    const payload = { is_met: isMet, checklist: formState };

    try {
      if (isNewThrombolytic) {
        // If it's a new thrombolytic record, POST the data
        await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/cases/thrombolytic/${id}`,
          payload,
          { withCredentials: true }
        );
        alert("Thrombolytic criteria created successfully!");
      } else {
        // Otherwise, PATCH the existing record
        await axios.patch(
          `${import.meta.env.VITE_APP_API_URL}/cases/thrombolytic/${id}`,
          payload,
          { withCredentials: true }
        );
        alert("Thrombolytic criteria updated successfully!");
      }
    } catch (error) {
      console.error("Error updating thrombolytic criteria:", error);
      alert("Failed to save thrombolytic criteria.");
    }
  };

  if (loading) {
    return <p>Loading thrombolytic data...</p>;
  }

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto h-screen overflow-auto">
      <h1 className="text-[20px] font-bold mb-4">Thrombolytic Therapy Checklist</h1>

      {/* Inclusion Criteria */}
      <h2 className="font-semibold text-[18px] mb-2">Inclusion Criteria</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <thead>
          <tr className="bg-gray-50 text-left">
            <th className="px-6 py-2 text-[16px] font-semibold text-gray-700">Criteria</th>
            <th className="px-6 py-2 text-[16px] font-semibold text-gray-700 text-right">Select</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(initialFormState.inclusion).map((key) => (
            <tr key={key} className="border-t text-[14px]">
              <td className="px-6 py-3">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </td>
              <td className="px-6 py-3 text-right">
                <input
                  type="checkbox"
                  name={`inclusion.${key}`}
                  checked={
                    formState.inclusion[key as keyof typeof formState.inclusion]
                  }
                  onChange={handleInputChange}
                  className="mr-2"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Absolute Exclusion Criteria */}
      <h2 className="font-semibold text-[18px] mb-2">Absolute Exclusion Criteria</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <thead>
          <tr className="bg-gray-50 text-left text-[16px]">
            <th className="px-6 py-2 font-semibold text-gray-700">Criteria</th>
            <th className="px-6 py-2 font-semibold text-gray-700 text-right">Select</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(initialFormState.absoluteExclusion).map((key) => (
            <tr key={key} className="border-t text-[14px]">
              <td className="px-6 py-3">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </td>
              <td className="px-6 py-3 text-right">
                <input
                  type="checkbox"
                  name={`absoluteExclusion.${key}`}
                  checked={
                    formState.absoluteExclusion[
                      key as keyof typeof formState.absoluteExclusion
                    ]
                  }
                  onChange={handleInputChange}
                  className="mr-2"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Relative Exclusion Criteria */}
      <h2 className="font-semibold text-[18px] mb-2">Relative Exclusion Criteria</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
        <thead>
          <tr className="bg-gray-50 text-left text-[16px]">
            <th className="px-6 py-2 font-semibold text-gray-700">Criteria</th>
            <th className="px-6 py-2 font-semibold text-gray-700 text-right">Select</th>
          </tr>
        </thead>
        <tbody>
          {Object.keys(initialFormState.relativeExclusion).map((key) => (
            <tr key={key} className="border-t text-[14px]">
              <td className="px-6 py-3">
                {key
                  .replace(/([A-Z])/g, " $1")
                  .replace(/^./, (str) => str.toUpperCase())}
              </td>
              <td className="px-6 py-3 text-right">
                <input
                  type="checkbox"
                  name={`relativeExclusion.${key}`}
                  checked={
                    formState.relativeExclusion[
                      key as keyof typeof formState.relativeExclusion
                    ]
                  }
                  onChange={handleInputChange}
                  className="mr-2"
                />
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Submit Button */}
      <button
        className="mt-6 px-4 py-2 bg-teal-600 text-[16px] font-bold text-white rounded-lg w-full sm:w-auto hover:bg-teal-700"
        onClick={handleSubmit}
      >
        {isNewThrombolytic ? "Create Thrombolytic Criteria" : "Update Thrombolytic Criteria"}
      </button>

{/* Display if criteria is met */}
<div className="mt-4 text-[16px]">
  {/* Criteria Met */}
  <div className="font-bold">
    Criteria Met:{" "}
    {isMet !== null ? (
      <span className={isMet ? "text-green-600" : "text-red-600"}>
        {isMet ? "Yes" : "No"}
      </span>
    ) : (
      "--"
    )}
  </div>
  
  {/* Proceed or not based on criteria */}
  <div className="font-bold">
    {isMet !== null && isMet
      ? "Proceed with thrombolytic therapy."
      : "Do not proceed with thrombolytic therapy."}
  </div>
</div>
    </div>
  );
};

export default Thrombolytic;
