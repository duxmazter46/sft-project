import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";
import axios from "axios";


interface FormData {
  identificationNumber: string;
  name: string;
  lastName: string;
  gender: string;
  dateOfBirth: string | Date;
  address: string;
  onsetHour: string;
  onsetMinute: string;
}

const currentHour = new Date().getHours().toString().padStart(2, "0");
const currentMinute = new Date().getMinutes().toString().padStart(2, "0");

const NewCaseForm: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState<FormData>({
    identificationNumber: "",
    name: "",
    lastName: "",
    gender: "",
    dateOfBirth: "",
    address: "",
    onsetHour: currentHour,
    onsetMinute: currentMinute,
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const handleDateChange = (dateInput: Date | string | null) => {
    const today = new Date();
  
    // If the input is a string, convert it to a Date object
    const date = typeof dateInput === "string" ? new Date(dateInput) : dateInput;
  
    // Check if the selected date is valid and not in the future
    if (date && date <= today) {
      setFormData({
        ...formData,
        dateOfBirth: date, // Store raw Date object
      });
    } else if (date && date > today) {
      alert("Date of birth cannot be in the future!");
    } else {
      setFormData({
        ...formData,
        dateOfBirth: ' ', // Reset if date is null or invalid
      });
    }
  };
  
  
  

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name) {
      alert("Name is required to create a case.");
      return;
    }

    if (formData.onsetHour === "" || formData.onsetMinute === "") {
      alert("Onset time is required.");
      return;
    }

    const onsetDate = new Date();
    onsetDate.setHours(Number(formData.onsetHour), Number(formData.onsetMinute));
    
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/cases/create`,
        {
          name: formData.name,
          gender: formData.gender || null,
          dob: formData.dateOfBirth || null,
          address: formData.address || null,
          onset: onsetDate.toISOString(),
          doctor: "Dr. Smith",
        },
        { withCredentials: true }
      );

      const caseId = response.data.case.id;
      await axios.post(
        `${import.meta.env.VITE_APP_API_URL}/cases/add-befast/${caseId}`,
        {
          b: "00",
          e: "00",
          f: "00",
          a: "000",
          s: "00",
          t: "00",
        },
        { withCredentials: true }
      );

      alert("Case created successfully!");
      navigate('/mainpage');
    } catch (error) {
      console.error("Error creating case:", error);
      alert("Failed to create case.");
    }
  };

  return (
    <form
      className="w-full font-poppins text-base p-6 md:p-10 bg-white shadow-md rounded-lg mx-auto"
      onSubmit={handleSubmit}
    >
      <h1 className="text-[20px] font-semibold mb-8 text-gray-800">Create New Case</h1>
  
      <div className="grid grid-cols-2 gap-6 text-[16px]">
        {/* Identification Number */}
        <div className="col-span-2">
          <input
            type="text"
            name="identificationNumber"
            value={formData.identificationNumber}
            onChange={handleInputChange}
            className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-teal-500"
            placeholder="Enter ID number"
          />
        </div>
  
        {/* Name */}
        <div className="col-span-2">
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-teal-500"
            placeholder="Enter full name"
            required
          />
        </div>
  
        {/* Gender */}
        <div className="col-span-2">
          <select
            name="gender"
            value={formData.gender}
            onChange={handleInputChange}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-teal-500"
          >
            <option value="">Select gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
  
        
  
        {/* Address */}
        <div className="col-span-2">
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-teal-500"
            placeholder="Enter address"
          />
        </div>
  
        {/* Onset Time */}
        <div className="col-span-2">
          <label className="block text-sm text-gray-700 font-medium mb-2">Time of Symptom Onset :</label>
          <div className="flex space-x-4">
            <div className="w-1/2">
              <label className="block text-sm text-gray-500 mb-1">Hour</label>
              <select
                name="onsetHour"
                value={formData.onsetHour}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-teal-500"
              >
                {Array.from({ length: 24 }, (_, i) => (
                  <option key={i} value={String(i).padStart(2, "0")}>
                    {String(i).padStart(2, "0")}
                  </option>
                ))}
              </select>
            </div>
  
            <div className="w-1/2">
              <label className="block text-sm text-gray-500 mb-1">Minute</label>
              <select
                name="onsetMinute"
                value={formData.onsetMinute}
                onChange={handleInputChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-teal-500"
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
        {/* Date of Birth */}
        <div className="col-span-1">
          <div className="relative">
          <DatePicker
            selected={formData.dateOfBirth instanceof Date ? formData.dateOfBirth : null} // Use Date object
            onChange={handleDateChange}
            className="w-full px-4 py-1 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:border-teal-500 pr-10"
            dateFormat="dd/MM/yyyy"
            placeholderText="Date of Birth"
            showYearDropdown
            showMonthDropdown
            dropdownMode="select"
          />

            <span className="absolute inset-y-0 left-[235px] bottom-0 flex items-center pointer-events-none">
              <FontAwesomeIcon icon={faCalendarAlt} className="text-gray-400" />
            </span>
          </div>
        </div>


      </div>
                
      <div className="relative">
      
        <button
          type="submit"
          className="absolute bottom-[-20px] right-0 w-[150px] py-1 bg-teal-600 text-[18px] text-white font-semibold rounded-lg shadow-md hover:bg-teal-700 focus:ring focus:ring-teal-300 transition"
        >
          Create Case
        </button>
      
      </div>
    </form>
  );
  
};

export default NewCaseForm;
