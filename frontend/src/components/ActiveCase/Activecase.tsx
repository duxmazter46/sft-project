import { useState, useEffect } from "react";
import axios from "axios";
import Case from "../Case/Case";
import styled from "styled-components";

interface CaseData {
  id: string;
  onset: string;
  status: string;
  doctor: string;
  patient_id: string;
}

const ActiveCaseContainer = styled.div`
  .title {
    font-family: "Poppins", sans-serif;
    font-weight: 600;
    color: var(--textSecondary);
    font-size: 18px;
    margin: 20px 0px 0px;
    text-align: left; /* Align title to the left */
  }

  .case-list {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
    gap: 10px;
    justify-content: start; /* Align items to the left */
    padding: 16px;

   
  }

  .loading {
    font-family: "Poppins", sans-serif;
    font-size: 16px;
    color: var(--textPrimary);
    text-align: center;
    margin: 20px 0;
  }
`;




const ActiveCase = () => {
  const [caseData, setCaseData] = useState<CaseData[]>([]);
  const [patientData, setPatientData] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const fetchCasesAndPatients = async () => {
      try {
        const caseResponse = await axios.get(`${import.meta.env.VITE_APP_API_URL}/cases/active/only`, {
          withCredentials: true,
        });
        const cases: CaseData[] = caseResponse.data;

        const activeCases = cases.filter(
          (caseItem: CaseData) => caseItem.status === "Active"
        );
        setCaseData(activeCases);

        const patientIds = [
          ...new Set(
            activeCases.map((caseItem: CaseData) => caseItem.patient_id)
          ),
        ];

        const patientPromises = patientIds.map(async (id) => {
          const patientResponse = await axios.get(
            `${import.meta.env.VITE_APP_API_URL}/patient/${id}`,
            { withCredentials: true }
          );
          return { id, name: patientResponse.data.name };
        });

        const patientDataArray = await Promise.all(patientPromises);
        const newPatientData = patientDataArray.reduce(
          (
            acc: { [key: string]: string },
            patient: { id: string; name: string }
          ) => {
            acc[patient.id] = patient.name;
            return acc;
          },
          {}
        );

        setPatientData(newPatientData);
      } catch (error) {
        console.error("Error fetching cases or patients:", error);
      }
    };

    fetchCasesAndPatients();
  }, []);

  return (
    <ActiveCaseContainer>
      <div className="title">Active Cases</div>
      <div className="case-list">
        {caseData.map((caseItem) => {
          const onsetDate = new Date(caseItem.onset);
          const formattedDate = onsetDate.toLocaleString();

          return (
            <Case
              key={caseItem.id} // Use case ID as key
              id={caseItem.id} // Pass the case ID to the Case component
              time={formattedDate}
              status={caseItem.status}
              name={patientData[caseItem.patient_id]}
            />
          );
        })}
      </div>
    </ActiveCaseContainer>
  );
};

export default ActiveCase;
