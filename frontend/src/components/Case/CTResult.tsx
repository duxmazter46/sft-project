import React, { useState, useEffect } from "react";
import axios, { AxiosError } from "axios";
import { useParams } from "react-router-dom";

const CTResult: React.FC = () => {
  const { id } = useParams(); // Extract case ID from the URL
  const [currentCtResult, setCurrentCtResult] = useState<string>("pending"); // Current CT result
  const [newCtResult, setNewCtResult] = useState<string>("pending"); // New CT result for dropdown
  const [lastModifiedOn, setLastModifiedOn] = useState<string>("");
  const [isNewCTResult, setIsNewCTResult] = useState<boolean>(false); // To track if this is a new CT result

  // Fetch the CT result on component mount
  useEffect(() => {
    const fetchCTResult = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/cases/ct_result/${id}`,
          {
            withCredentials: true,
          }
        );

        if (response.data) {
          setCurrentCtResult(response.data.result); // Set the current CT result
          setNewCtResult(response.data.result); // Set the default new CT result in dropdown
          setLastModifiedOn(response.data.last_modified_on); // Set the last modified time
        } else {
          setIsNewCTResult(true);
        }
      } catch (error) {
        // Handle 404 Not Found error, indicating we need to create a new CT result
        if (error instanceof AxiosError && error.response?.status === 404) {
          setIsNewCTResult(true);
        } else {
          console.error("Error fetching CT result:", error);
        }
      }
    };

    fetchCTResult();
  }, [id]);

  // Handle result update
  const handleResultChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setNewCtResult(e.target.value); // Set new CT result from dropdown
  };

  const handleSubmit = async () => {
    try {
      const payload = {
        result: newCtResult,
      };

      if (isNewCTResult) {
        // Perform POST if it's a new entry
        try {
          await axios.post(
            `${import.meta.env.VITE_APP_API_URL}/cases/ct_result/${id}`,
            payload,
            {
              withCredentials: true,
            }
          );
          alert("CT result created successfully!");
        } catch (error: unknown) {
          if (error instanceof AxiosError) {
            if (error.response && error.response.status === 409) {
              console.warn(
                "Conflict: CT result entry already exists. Switching to update..."
              );
              await axios.patch(
                `${import.meta.env.VITE_APP_API_URL}/cases/ct_result/${id}`,
                payload,
                {
                  withCredentials: true,
                }
              );
              alert("CT result updated successfully!");
            } else {
              throw error;
            }
          } else {
            console.error("An unknown error occurred:", error);
            alert("An unknown error occurred.");
          }
        }
      } else {
        // Perform PATCH if entry already exists
        await axios.patch(
          `${import.meta.env.VITE_APP_API_URL}/cases/ct_result/${id}`,
          payload,
          {
            withCredentials: true,
          }
        );
        alert("CT result updated successfully!");
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        console.error("Error updating CT result:", error);
        alert("Failed to update CT result.");
      } else {
        console.error("An unknown error occurred:", error);
        alert("An unknown error occurred.");
      }
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-6 mb-6 bg-white border border-gray-200 rounded-lg shadow-lg mt-6">
      <h1 className="text-[20px] font-bold text-gray-800 mb-6 text-center">
        CT Scan Result
      </h1>

      {/* Displaying Current CT Result */}
      <div className="mb-4">
        <h2 className="text-[16px] font-semibold text-gray-700">Current CT Result:</h2>
        <div className="w-full px-4 py-2 text-[14px] border border-gray-300 rounded-lg bg-gray-100 text-gray-700">
          {currentCtResult}
        </div>
      </div>

      {/* Dropdown for Selecting New CT Result */}
      <div className="mb-4">
        <h2 className="text-[16px] font-semibold text-gray-700">Select New CT Result:</h2>
        <select
          value={newCtResult}
          onChange={handleResultChange}
          className="w-full px-4 py-2 text-[14px] border border-gray-300 rounded-lg bg-gray-50 focus:ring-2 focus:ring-teal-500 transition duration-200"
        >
          <option value="pending">pending</option>
          <option value="Ischemic">Ischemic Stroke</option>
          <option value="Hemorrhagic">Hemorrhagic Stroke</option>
          <option value="NoAbnormalityDetected">No Abnormality Detected</option>
        </select>
      </div>

      {/* Displaying Last Modified */}
      {lastModifiedOn && (
        <div className="mt-4">
          <p className="text-[14px] text-gray-600">
            Last Modified: {new Date(lastModifiedOn).toLocaleString()}
          </p>
        </div>
      )}

      {/* Submit Button */}
      <button
        className="w-full mt-6 text-center bg-teal-600 text-[14px] font-bold text-white py-2 px-6 rounded-full hover:bg-teal-700 transition duration-300"
        onClick={handleSubmit}
      >
        {isNewCTResult ? "Create CT Result" : "Update CT Result"}
      </button>
    </div>
  );
};

export default CTResult;
