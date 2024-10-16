import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "react-router-dom";

// Define the structure of NIHSS data
interface NihssData {
  round: number;
  checklist: {
    [key: string]: number;
  };
}

// Define the NIHSS index labels in the desired order
const nihssIndexLabels = [
  "1a", "1b", "1c", "2", "3", "4", "5a", "5b", "6a", "6b", "7", "8", "9", "10", "11"
];

// Define score labels
const scoreLabels: Record<
  keyof NihssData["checklist"],
  Record<number, string>
> = {
  levelOfConsciousness: {
    0: "Alert",
    1: "Drowsy",
    2: "Stuporous",
    3: "Coma",
  },
  twoQuestions: {
    0: "Both correct",
    1: "One correct",
    2: "None correct",
  },
  twoCommands: {
    0: "Both able",
    1: "One able",
    2: "None able",
  },
  bestGaze: {
    0: "Normal",
    1: "Partial gaze palsy",
    2: "Forced deviation",
  },
  bestVisualField: {
    0: "No visual loss",
    1: "Partial hemianopia",
    2: "Complete hemianopia",
    3: "Bilateral hemianopia",
  },
  facialPalsy: {
    0: "Normal",
    1: "Minor",
    2: "Partial",
    3: "Complete",
  },
  motorLeftArm: {
    0: "No drift",
    1: "Drift",
    2: "No effort against gravity",
    3: "No movement",
  },
  motorRightArm: {
    0: "No drift",
    1: "Drift",
    2: "No effort against gravity",
    3: "No movement",
  },
  motorLeftLeg: {
    0: "No drift",
    1: "Drift",
    2: "No effort against gravity",
    3: "No movement",
  },
  motorRightLeg: {
    0: "No drift",
    1: "Drift",
    2: "No effort against gravity",
    3: "No movement",
  },
  ataxia: {
    0: "No ataxia",
    1: "Ataxia one limb",
    2: "Ataxia two limbs",
  },
  sensory: {
    0: "Normal",
    1: "Partial loss",
    2: "Dense loss",
  },
  bestLanguageAphasia: {
    0: "No aphasia",
    1: "Mild to moderate",
    2: "Severe",
    3: "Mute global aphasia",
  },
  dysarthria: {
    0: "Normal articulation",
    1: "Mild to moderate",
    2: "Severe",
  },
  neglect: {
    0: "No neglect",
    1: "Partial sensory or visual loss",
    2: "Dense sensory or visual loss",
  },
};

const Nihss: React.FC<{ round: number }> = ({ round }) => {
  const { id } = useParams(); // Extract case ID from the URL
  const [loading, setLoading] = useState<boolean>(true); // Loading state
  const [checklist, setChecklist] = useState<NihssData["checklist"]>(
    Object.keys(scoreLabels).reduce((acc, key) => {
      acc[key] = 0;
      return acc;
    }, {} as NihssData["checklist"])
  ); // Initialize checklist state
  const [score, setScore] = useState<number>(0); // Total score state
  const [isNewNihss, setIsNewNihss] = useState<boolean>(false); // Track if it's a new NIHSS

  // Function to calculate the total score from the checklist
  const calculateScore = (checklist: NihssData["checklist"]) => {
    const totalScore = Object.values(checklist).reduce(
      (acc, value) => acc + value,
      0
    );
    return totalScore;
  };

  // Get the stroke severity category based on the score
  const getStrokeSeverity = (score: number) => {
    if (score < 5) return "Minor Stroke";
    if (score <= 25) return "Moderate Stroke";
    return "Severe Stroke";
  };

  useEffect(() => {
    const fetchNihssData = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/cases/nihss/${id}`,
          { withCredentials: true }
        );
        const nihssData = response.data;

        if (Array.isArray(nihssData)) {
          const roundData = nihssData.find(
            (item: NihssData) => item.round === round
          );
          if (roundData) {
            setChecklist(roundData.checklist || {});
            setScore(calculateScore(roundData.checklist || {})); // Calculate score
          }
        } else if (nihssData && nihssData.round === round) {
          setChecklist(nihssData.checklist || {});
          setScore(calculateScore(nihssData.checklist || {})); // Calculate score
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response?.status === 404) {
          // If a 404 error is encountered, this is a new NIHSS entry
          setIsNewNihss(true);
        } else {
          console.error("Error fetching NIHSS data:", error);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNihssData();
  }, [id, round]);

  // Handle checklist change
  const handleChecklistChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: keyof NihssData["checklist"]
  ) => {
    const updatedChecklist = {
      ...checklist,
      [field]: parseInt(e.target.value, 10),
    };
    setChecklist(updatedChecklist);
    setScore(calculateScore(updatedChecklist)); // Update score when checklist changes
  };

  // Handle form submission to update or create NIHSS data
  const handleSubmit = async () => {
    const payload = { checklist, round };

    try {
      if (isNewNihss) {
        // If it's a new NIHSS entry, POST the data
        await axios.post(
          `${import.meta.env.VITE_APP_API_URL}/cases/nihss/${id}`,
          payload,
          { withCredentials: true }
        );
        alert("NIHSS data created successfully!");
      } else {
        // Otherwise, PATCH the existing record
        await axios.patch(
          `${import.meta.env.VITE_APP_API_URL}/cases/nihss/${id}`,
          payload,
          { withCredentials: true }
        );
        alert("NIHSS data updated successfully!");
      }
    } catch (error) {
      console.error("Error saving NIHSS data:", error);
    }
  };

  return (
    <div className="w-full p-6 md:p-8 lg:p-10 max-w-4xl mx-auto h-screen overflow-auto">
      <h1 className="text-2xl font-semibold mb-6 text-gray-800">NIHSS Assessment</h1>
  
      {loading ? (
        <div className="flex items-center justify-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
          </svg>
          <p className="ml-2 text-gray-600">Loading NIHSS data...</p>
        </div>
      ) : (
        <div>
          {/* NIHSS Criteria Table */}
          <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-sm mb-6">
            <thead>
              <tr className="bg-gray-50 text-left">
                <th className="px-6 py-2 text-[16px] font-semibold text-gray-700">Criteria</th>
                <th className="px-6 py-2 text-[16px] font-semibold text-gray-700 text-left">Select</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(scoreLabels).map((field, index) => (
                <tr key={field} className="border-t text-[14px]">
                  {/* Display the index label and field name */}
                  <td className="px-6 py-3 align-top">
                    <span className="font-semibold">{nihssIndexLabels[index]}</span>:&nbsp;
                    {field.replace(/([A-Z])/g, " $1").replace(/^./, (str) => str.toUpperCase())}
                  </td>
                  <td className="px-6 py-3 align-top text-left">
                    <div className="flex flex-col space-y-2 items-start">
                      {Object.entries(scoreLabels[field as keyof typeof scoreLabels]).map(([value, label]) => (
                        <label key={value} className="flex items-center space-x-2">
                          <input
                            type="radio"
                            name={field}
                            value={value}
                            checked={checklist[field] === parseInt(value)}
                            onChange={(e) => handleChecklistChange(e, field as keyof NihssData["checklist"])}
                            className="text-blue-600 focus:ring-blue-500"
                            aria-label={label}
                          />
                          <span>{label} ({value})</span>
                        </label>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
  
          {/* NIHSS Total Score and Stroke Severity */}
          <div className="mb-6">
            <h2 className="text-[16px] font-semibold mb-2">
              NIHSS Total Score: <span className="text-lg">{score}</span>
            </h2>
            <p className="text-gray-600">
              Stroke Severity:{" "}
              <span className="font-semibold text-blue-700 cursor-pointer">{getStrokeSeverity(score)}</span>
              <span className="ml-1 text-gray-400 cursor-pointer" title="Minor: <5, Moderate: 5-25, Severe: >25">(Info)</span>
            </p>
          </div>
  
          {/* Submit Button */}
          <button
            className="mt-6 px-4 py-2 text-[16px] bg-teal-600 text-white rounded-lg shadow-lg hover:bg-teal-700 w-full sm:w-auto focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={handleSubmit}
          >
            {isNewNihss ? "Create NIHSS Data" : "Update NIHSS Data"}
          </button>
        </div>
      )}
    </div>
  );
  
  
  
  
  
};

export default Nihss;
