import { NewPatient, NonSensitivePatient, Patient, NewEntry } from "../types";
import { patients as initialPatientsData } from "./../../data/patients";
import { v4 as uuid } from "uuid";

let patientsData: Patient[] = [...initialPatientsData];

const getNonSensitivePatient = (): NonSensitivePatient[] => {
  return patientsData.map(
    ({ ssn: _removed_ssn, ...nonSensitivePatient }) => nonSensitivePatient
  );
};

const getPatient = (id: string): Patient | undefined => {
  return patientsData.find(patient => patient.id === id );
};

const addPatient = (patient: NewPatient): NonSensitivePatient => {
  if (patientsData.find((p) => p.ssn === patient.ssn)) {
    throw new Error(`Patient SSN already existing`);
  }
  const newPatient = {
    id: uuid(),
    ...patient,
  };
  patientsData = [...patientsData, newPatient];
  return newPatient;
};

const addEntry = (patient: Patient, newEntry: NewEntry): Patient => {
  const patientNewEntry = {
    id: uuid(),
    ...newEntry,
  };
  const updatedPatient = {...patient, entries:[...patient.entries, patientNewEntry]};
  patientsData = patientsData.map(p => p.id === updatedPatient.id ? updatedPatient : p );
  return updatedPatient;
};

export { getNonSensitivePatient, addPatient, getPatient, addEntry };
