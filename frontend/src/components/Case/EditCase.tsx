import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const EditCase = () => {
  const { id } = useParams(); // Extract the case ID from the URL
  const [patientId, setPatientId] = useState<string>("");


  const [formData, setFormData] = useState({
    identificationNumber: "",
    name: "",
    gender: "",
    dateOfBirth: "", // Handle as string
    address: "",
    onsetHour: "00",
    onsetMinute: "00",
    weight: "",
    height: "",
  });

  // Fetch case and patient data here as previously done
  useEffect(() => {
    const fetchCaseData = async () => {
      try {
        const caseResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/cases/${id}`,
          { withCredentials: true }
        );
        const patientResponse = await axios.get(
          `${import.meta.env.VITE_APP_API_URL}/patient/${caseResponse.data.patient_id}`,
          { withCredentials: true }
        );

        // Pre-fill the form with the case and patient data
        setFormData({
          identificationNumber: patientResponse.data.reg_id,
          name: patientResponse.data.name,
          gender: patientResponse.data.gender || "",
          // Format the dateOfBirth to 'YYYY-MM-DD' before setting it in formData
          dateOfBirth: patientResponse.data.dob
            ? new Date(patientResponse.data.dob).toISOString().split("T")[0]
            : "",
          address: patientResponse.data.address || "",
          onsetHour: new Date(caseResponse.data.onset)
            .getHours()
            .toString()
            .padStart(2, "0"),
          onsetMinute: new Date(caseResponse.data.onset)
            .getMinutes()
            .toString()
            .padStart(2, "0"),
          weight: patientResponse.data.weight || "",
          height: patientResponse.data.height || "",
        });

        setPatientId(patientResponse.data.id);
      } catch (error) {
        console.error("Error fetching case data", error);
      }
    };

    fetchCaseData();
  }, [id, patientId]);

  // Handle input change
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
  
    // Special handling for date of birth
    if (name === "dateOfBirth") {
      const selectedDate = new Date(value);
      const today = new Date();
  
      // Check if the selected date is in the future
      if (selectedDate <= today) {
        setFormData({
          ...formData,
          [name]: value, // Store the value as yyyy-MM-dd
        });
      } else {
        alert("Date of birth cannot be in the future!");
      }
    }
    // Special handling for number fields (like weight, height) to prevent negative input
    else if (name === "weight" || name === "height") {
      // Only allow non-negative numbers
      if (!isNaN(Number(value)) && Number(value) >= 0) {
        setFormData({
          ...formData,
          [name]: value,
        });
      }
    } 
    // Handle other fields normally
    else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };
  
  

  // Handle form submission (update case)
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const onsetDate = new Date();
    onsetDate.setHours(
      Number(formData.onsetHour),
      Number(formData.onsetMinute)
    );

    try {
      await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/patient/update/${patientId}`,
        {
          name: formData.name,
          gender: formData.gender,
          dob: formData.dateOfBirth
            ? new Date(
                new Date(formData.dateOfBirth).setDate(
                  new Date(formData.dateOfBirth).getDate() + 1
                )
              ).toISOString()
            : null,
          address: formData.address,
          onset: onsetDate.toISOString(),
          reg_id: formData.identificationNumber,
          weight: formData.weight ? parseFloat(formData.weight) : null, // Handle empty weight
          height: formData.height ? parseFloat(formData.height) : null, // Handle empty height
        },
        { withCredentials: true }
      );

      await axios.patch(
        `${import.meta.env.VITE_APP_API_URL}/cases/update/${id}`,
        {
          onset: onsetDate.toISOString(),
        },
        { withCredentials: true }
      );

      alert("Case updated successfully!");
      // Navigate back to the updated case page
    } catch (error) {
      console.error("Error updating case:", error);
      alert("Failed to update case.");
    }
  };

  return (
    <div className="w-full mt-4">
      <form className="font-poppins text-base bg-white shadow-lg rounded-lg p-6 " onSubmit={handleSubmit}>
        <h1 className="text-[20px] font-semibold mb-6 text-gray-800">Edit Case</h1>
        
        {/* Case Image */}
        <div className="flex justify-center mb-6">
          <img
            src="/assets/newCase.png"
            alt="caseProfile"
            className="w-[180px] h-[180px] opacity-80 rounded-md shadow-md"
          />
        </div>
  
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 text-[14px]">
          {/* Name */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter name"
            />
          </div>
  
          {/* Gender */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Gender</label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>
          </div>
  
          {/* Date of Birth */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleInputChange}
              className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="YYYY-MM-DD"
            />
          </div>
  
          {/* Weight */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Weight</label>
            <input
              type="text"
              name="weight"
              value={formData.weight}
              onChange={handleInputChange}
              className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter weight"
            />
          </div>
  
          {/* Height */}
          <div>
            <label className="block font-medium text-gray-700 mb-1">Height</label>
            <input
              type="text"
              name="height"
              value={formData.height}
              onChange={handleInputChange}
              className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter height"
            />
          </div>
  
          {/* Address */}
          <div className="col-span-1 lg:col-span-2">
            <label className="block font-medium text-gray-700 mb-1">Address</label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleInputChange}
              className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter address"
            />
          </div>
  
          {/* Identification Number */}
          <div className="col-span-1 lg:col-span-2">
            <label className="block font-medium text-gray-700 mb-1">Identification Number</label>
            <input
              type="text"
              name="identificationNumber"
              value={formData.identificationNumber}
              onChange={handleInputChange}
              className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
              placeholder="Enter identification number"
            />
          </div>
  
          {/* Onset Time */}
          <div className="col-span-1 lg:col-span-2">
            <label className="block font-semibold text-gray-700 mb-1">Time of Symptom Onset :</label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[14px] text-gray-500 mb-1">Hour</label>
                <select
                  name="onsetHour"
                  value={formData.onsetHour}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={String(i).padStart(2, "0")}>
                      {String(i).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-[14px] text-gray-500 mb-1">Minute</label>
                <select
                  name="onsetMinute"
                  value={formData.onsetMinute}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-teal-500"
                >
                  {Array.from({ length: 60 }, (_, i) => (
                    <option key={i} value={String(i).padStart(2, "0")}>
                      {String(i).padStart(2, "0")}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </div>
  
        {/* Submit Button */}
        <div className="flex justify-end mt-6">
          <button
            type="submit"
            className="px-4 py-1 text-[] bg-teal-600 text-white rounded-lg font-semibold shadow-md hover:bg-teal-700 transition-colors duration-300"
          >
            Update Case
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default EditCase;
