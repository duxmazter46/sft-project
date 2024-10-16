import { useState, useEffect } from "react";
import Navbar from "../../components/Navbar/Navbar";
import SideBar from "../../components/sidebar/sidebar";
import axios, { AxiosError } from "axios";
import React from 'react';
interface CaseData {
  id: string;
  onset: string;
  finished_on: string;
  status: string;
  patient_id: string;
}

interface InjectionData {
  doctor: string | null;
}

interface CTResultData {
  result: string;
  last_modified_on: string;
}

interface ThrombolyticData {
  is_met: boolean;
  checklist: {
    inclusion: Record<string, boolean>;
    absoluteExclusion: Record<string, boolean>;
    relativeExclusion: Record<string, boolean>;
  };
}

interface NIHSSData {
  score: number;
  last_modified_on: string;
  checklist: Record<string, number>;
}

interface InjectionDetailData {
  bolus: string;
  drip: string;
  bolus_timestamp: string;
  drip_timestamp: string;
  doctor: string;
}

// Define a union type for the different possible response types
type CaseDetailData = CTResultData | ThrombolyticData | NIHSSData | InjectionDetailData;

// Type guards
function isCTResultData(data: CaseDetailData): data is CTResultData {
  return (data as CTResultData).result !== undefined;
}

function isThrombolyticData(data: CaseDetailData): data is ThrombolyticData {
  return (data as ThrombolyticData).is_met !== undefined;
}

function isNIHSSData(data: CaseDetailData): data is NIHSSData {
  return (data as NIHSSData).score !== undefined;
}

function isInjectionDetailData(data: CaseDetailData): data is InjectionDetailData {
  return (data as InjectionDetailData).bolus !== undefined;
}

const Modal = ({
  title,
  content,
  onClose,
}: {
  title: string;
  content: JSX.Element;
  onClose: () => void;
}) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 transition-opacity duration-200 ease-in-out">
      <div className="bg-white p-6 rounded-lg w-full max-w-lg flex flex-col max-h-[80vh] shadow-lg relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-600 transition"
          onClick={onClose}
        >
          ✕
        </button>
        <h2 className="text-lg font-semibold mb-4">{title}</h2>
        <div className="flex-grow overflow-y-auto mb-4">{content}</div>
        <button
          className="px-4 py-2 bg-teal-600 text-white rounded-lg mt-auto hover:bg-teal-700 transition"
          onClick={onClose}
        >
          Close
        </button>
      </div>
    </div>
  );
};

const AdmitPage = () => {
  const [admitCases, setAdmitCases] = useState<CaseData[]>([]);
  const [patientData, setPatientData] = useState<{ [key: string]: string }>({});
  const [doctorData, setDoctorData] = useState<{ [key: string]: string }>({});
  const [modalContent, setModalContent] = useState<JSX.Element | null>(null);
  const [modalTitle, setModalTitle] = useState<string>("");
  const [showModal, setShowModal] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  useEffect(() => {
    const fetchAdmitCasesAndPatients = async () => {
      try {
        const caseResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/cases`, {
          withCredentials: true,
        });

        const cases: CaseData[] = caseResponse.data;
        const admitCases = cases.filter((caseItem) => caseItem.status === "Admit");
        setAdmitCases(admitCases);

        const patientIds = admitCases.map((caseItem) => caseItem.patient_id);
        const patientPromises = patientIds.map(async (id) => {
          const patientResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/patient/${id}`, {
            withCredentials: true,
          });
          return { id, name: patientResponse.data.name };
        });

        const patientDataArray = await Promise.all(patientPromises);
        const newPatientData = patientDataArray.reduce(
          (acc: { [key: string]: string }, patient: { id: string; name: string }) => {
            acc[patient.id] = patient.name;
            return acc;
          },
          {}
        );
        setPatientData(newPatientData);

        const injectionPromises = admitCases.map(async (caseItem) => {
          try {
            const injectionResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/cases/injection/${caseItem.id}`, {
              withCredentials: true,
            });
            const injectionData: InjectionData = injectionResponse.data;
            return { caseId: caseItem.id, doctor: injectionData.doctor };
          } catch (error) {
            if (error instanceof AxiosError && error.response?.status === 404) {
              return { caseId: caseItem.id, doctor: "Treatment Refused" };
            } else {
              console.error("Error fetching injection data:", error);
              return { caseId: caseItem.id, doctor: "Treatment Refused" };
            }
          }
        });

        const injectionDataArray = await Promise.all(injectionPromises);
        const newDoctorData = injectionDataArray.reduce(
          (acc: { [key: string]: string }, injection: { caseId: string; doctor: string | null }) => {
            acc[injection.caseId] = injection.doctor ? injection.doctor : "Treatment Refused";
            return acc;
          },
          {}
        );
        setDoctorData(newDoctorData);
      } catch (error) {
        console.error("Error fetching admit cases or patients:", error);
      }
    };

    fetchAdmitCasesAndPatients();
  }, []);

  const formatKey = (key: string) => {
    return key
      .replace(/([A-Z])/g, " $1") // Add space before capital letters
      .replace(/_/g, " ") // Replace underscores with spaces
      .replace(/^./, (str) => str.toUpperCase()); // Capitalize the first letter
  };

  const contentProcessor = (data: CaseDetailData) => {
    if (isCTResultData(data)) {
      return (
        <div className="space-y-2">
          <p><strong>CT Result:</strong> {data.result}</p>
          <p><strong>Last Modified:</strong> {new Date(data.last_modified_on).toLocaleString()}</p>
        </div>
      );
    }

    if (isThrombolyticData(data)) {
      return (
        <div className="space-y-2">
          <p>
            <strong>Criteria met for treatment:</strong>{" "}
            <span className={data.is_met ? "text-green-500" : "text-red-500"}>
              {data.is_met ? "Yes" : "No"}
            </span>
          </p>
          <div>
            <table className="table-auto w-full text-[16px] mb-4">
              <thead>
                <tr>
                  <th className="px-4 py-2 text-left">Section</th>
                  <th className="px-4 py-2 text-left">Checklist Item</th>
                  <th className="px-4 py-2 text-left">Status</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(data.checklist).map(([section, sectionData]) => (
                  <React.Fragment key={section}>
                    {Object.entries(sectionData).map(([key, value]) => (
                      <tr key={key} className="border-t">
                        {/* Section name in the first column */}
                        <td className="px-4 py-2">{formatKey(section)}</td>
                        
                        {/* Checklist item name */}
                        <td className="px-4 py-2">{formatKey(key)}</td>
                        
                        {/* Status (✔ or ✖) */}
                        <td className="px-4 py-2">{value ? "✔" : "✖"}</td>
                      </tr>
                    ))}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    if (isNIHSSData(data)) {
      return (
        <div className="space-y-4">
        <p>
          <strong>Score:</strong>{" "}
          <span
            className={`px-2 py-1 rounded ${
              data.score > 25
                ? "text-red-500 bg-red-100"
                : data.score > 5
                ? "text-orange-500 bg-orange-100"
                : "text-green-500 bg-green-100"
            }`}
          >
            {data.score}
          </span>
        </p>
        <div>
          <table className="table-auto w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="border-b px-4 py-2">Item</th>
                <th className="border-b px-4 py-2">Value</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(data.checklist).map(([key, value]) => (
                <tr key={key}>
                  <td className="border-b px-4 py-2">{formatKey(key)}</td>
                  {/* Display the raw value instead of checking for true/false */}
                  <td className="border-b px-4 py-2">{String(value)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      );
    }

    if (isInjectionDetailData(data)) {
      return (
        <div className="space-y-4">
          <p><strong>Bolus:</strong> {data.bolus} mg</p>
          <p><strong>Bolus Timestamp:</strong> {data.bolus_timestamp}</p>
          <p><strong>Drip:</strong> {data.drip} mg</p>
          <p><strong>Drip Timestamp:</strong> {data.drip_timestamp}</p>
          <p><strong>Doctor:</strong> {data.doctor}</p>
        </div>
      );
    }

    return <p className="text-red-500">Unknown Data Type</p>;
  };

  const fetchCaseDetails = async (caseId: string, type: "ct" | "thrombolytic" | "nihss" | "injection") => {
    try {
      const urlMap = {
        ct: `/cases/ct_result/${caseId}`,
        thrombolytic: `/cases/thrombolytic/${caseId}`,
        nihss: `/cases/nihss/${caseId}`,
        injection: `/cases/injection/${caseId}`,
      };
      const response = await axios.get(`${import.meta.env.VITE_APP_API_URL}${urlMap[type]}`, {
        withCredentials: true,
      });
      setModalContent(contentProcessor(response.data));
      setModalTitle(type.toUpperCase());
      setShowModal(true);
    } catch (error) {
      if (error instanceof AxiosError) {
        if (error.response?.status === 404) {
          alert("Data not found.");
        } else {
          alert("An error occurred while fetching the data.");
        }
      } else {
        console.error("An unknown error occurred:", error);
      }
    }
  };

  return (
    <div className="flex flex-col lg:flex-row text-[14px] px-6">
      <SideBar isAdminPage={false} isOpen={isOpen} toggleSidebar={toggleSidebar} />
      <div className="flex flex-col w-full">
        <Navbar />
        <div className={`transition-all duration-300 ${isOpen ? 'lg:ml-[240px]' : 'lg:ml-[60px]'}`}>
          <div className="mt-8 p-4 lg:p-0">
            <div>
              {admitCases.length === 0 ? (
                <p className="text-gray-600 px-4">No admitted cases found.</p>
              ) : (
                <div className="relative grid grid-cols-1 gap-4">
                {admitCases.map((caseItem) => (
                  <div key={caseItem.id} className="flex flex-rol bg-white p-6 rounded-lg shadow-lg space-y-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-[100px] h-[100px] bg-gray-200 rounded-md flex items-center justify-center">
                        <img
                          src="/assets/newCase.png"
                          alt="caseProfile"
                          className="w-6 h-6 opacity-50"
                        />
                      </div>
                      <div className="flex-1">
                        <p><strong>Onset:</strong> {new Date(caseItem.onset).toLocaleString()}</p>
                        <p><strong>Finished On:</strong> {new Date(caseItem.finished_on).toLocaleString()}</p>
                        <p><strong>Patient Name:</strong> {patientData[caseItem.patient_id] || "Loading..."}</p>
                        <p><strong>Doctor:</strong> {doctorData[caseItem.id] || "Loading..."}</p>
                      </div>
                    </div>

                    {/* Buttons */}
                    <div className="flex justify-end space-x-[10px] basis-2/3 pt-[50px]">
                      <button
                        className="w-24 h-6 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition shadow-sm"
                        onClick={() => fetchCaseDetails(caseItem.id, "ct")}
                      >
                        Show CT Scan
                      </button>
                      <button
                        className="w-32 h-6 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition shadow-sm"
                        onClick={() => fetchCaseDetails(caseItem.id, "thrombolytic")}
                      >
                        Show Thrombolytic
                      </button>
                      <button
                        className="w-24 h-6 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition shadow-sm"
                        onClick={() => fetchCaseDetails(caseItem.id, "nihss")}
                      >
                        Show NIHSS
                      </button>
                      <button
                        className="w-24 h-6 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition shadow-sm"
                        onClick={() => fetchCaseDetails(caseItem.id, "injection")}
                      >
                        Show Injection
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              )}
            </div>
          </div>
        </div>
      </div>

      {showModal && modalContent && (
        <Modal
          title={modalTitle}
          content={modalContent}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
};

export default AdmitPage;
