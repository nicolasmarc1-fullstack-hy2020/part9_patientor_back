export interface Diagnose {
  code: string;
  name: string;
  latin?: string;
}

export enum Gender {
  Male = "male",
  Female = "female",
  Other = "other",
}

export enum HealthCheckRating {
  "Healthy" = 0,
  "LowRisk" = 1,
  "HighRisk" = 2,
  "CriticalRisk" = 3,
}


// export enum EntryTypes {
//   HealthCheck = "HealthCheck",
//   Hospital = "Hospital",
//   OccupationalHealthcare = "OccupationalHealthcare",
// }

// export type EntryTypesUnion = `${EntryTypes}`;

interface BaseEntry {
  id: string;
  type: string;
  description: string;
  date: string;
  specialist: string;
  diagnosisCodes?: Array<Diagnose["code"]>;
}

export interface SickLeave {
  startDate: string;
  endDate: string;
}
export interface Discharge {
  date: string;
  criteria: string;
}

export interface HospitalEntry extends BaseEntry {
  // type : EntryTypes.Hospital;
  type : "Hospital";
  discharge: Discharge;
}

interface OccupationalHealthcareEntry extends BaseEntry {
  type: "OccupationalHealthcare";
  employerName: string;
  sickLeave?: SickLeave;
}
interface HealthCheckEntry extends BaseEntry {
  type: "HealthCheck"
  healthCheckRating: HealthCheckRating;
}

export type Entry =
  | HospitalEntry
  | OccupationalHealthcareEntry
  | HealthCheckEntry;


  export type AllKeys<T> = T extends T ? keyof T : never;
  export type DistributiveOmit<T, K extends AllKeys<T>> = T extends T ? Pick<T, Exclude<keyof T, K>> : never;

export interface Patient {
  id: string;
  name: string;
  dateOfBirth: string;
  ssn: string;
  gender: Gender;
  occupation: string;
  entries: Entry[];
}

export type NonSensitivePatient = Omit<Patient, "ssn">;
export type NewPatient = Omit<Patient, "id">;

export type NewEntry = DistributiveOmit<Entry, "id">;

export type PublicPatient = Omit<Patient, "ssn" | "entries">;


// const theMap: {
//   [K in Entry["type"]]: (u: Extract<Entry, { type: K }>) => string
// } = {
//   Hospital: ({ type }) => type,
//   HealthCheck: ({ type }) => type,
//   OccupationalHealthcare  : ({ type }) => type,
// };
