import { useNavigate } from "react-router-dom";

interface CaseProps {
  id: string;
  time: string;
  status: string;
  name: string;
}

const Case: React.FC<CaseProps> = ({ id, time, status, name }) => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/cases/${id}`);
  };

  return (
    <div
      className="flex items-center bg-white shadow-md rounded-lg p-3 w-[300px] h-auto cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg"
      onClick={handleClick}
    >
      <ImageSection />
      <div className="ml-3 flex flex-col">
        <NameSection name={name} />
        <TimeSection time={time} />
        <StatusSection status={status} />
      </div>
    </div>
  );
};

const ImageSection = () => {
  return (
    <div className="w-[60px] h-[60px] bg-gray-200 rounded-md flex items-center justify-center">
      <img
        src="/assets/newCase.png"
        alt="caseProfile"
        className="w-4 h-4 opacity-50"
      />
    </div>
  );
};

const TimeSection = ({ time }: { time: string }) => {
  return (
    <span className="text-[12px] font-light text-gray-600 mt-1">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="inline w-4 h-4 mr-1 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
        />
      </svg>
      {time}
    </span>
  );
};

const StatusSection = ({ status }: { status: string }) => {
  return (
    <p className="text-[12px] text-green-600 font-light mt-1">
      Status: {status ? status : "N/A"}
    </p>
  );
};

const NameSection = ({ name }: { name: string }) => {
  return (
    <h3 className="text-[14px] font-semibold text-gray-800">
      {name}
    </h3>
  );
};

export default Case;
