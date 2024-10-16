import { Link } from "react-router-dom";

const AddNewCase = () => {
  return (
    <Link to="/MainPage/Newcase">
      <button className="bg-black text-white font-bold py-1 px-6 text-[14px] font-poppins rounded-lg flex items-center gap-3 shadow-lg hover:bg-gray-800 transition duration-300 ease-in-out transform hover:scale-105">
        <img
          src="../../../assets/User-plus.png"
          alt="Add New Case"
          className="w-3 h-3 "
        />
        <span className="hidden sm:inline">Add New Case</span>
      </button>
    </Link>
  );
};

export default AddNewCase;
