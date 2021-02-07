import {
  Gender,
  NewEntry,
  NewPatient,
  HealthCheckRating,
  Discharge,
  SickLeave,
} from "../types";
export { toNewPatient, toNewEntry };

const toNewPatient = (object: {
  dateOfBirth: string;
  gender: string;
  name: string;
  occupation: string;
  ssn: string;
}): NewPatient => {
  return {
    dateOfBirth: parseDate(object.dateOfBirth),
    gender: parseGender(object.gender),
    name: parseString(object.name, "name"),
    occupation: parseString(object.occupation, "occupation"),
    ssn: parseString(object.ssn, "ssn"),
    entries: [],
  };
};

const toNewEntry = (object: NewEntry): NewEntry => {
  const baseEntry = {
    description: parseString(object.description, "description"),
    date: parseDate(object.date),
    specialist: parseString(object.specialist, "specialist"),
    diagnosisCodes: parseDiagnosisCodes(object.diagnosisCodes),
  };
  switch (object.type) {
    case "HealthCheck":
      return {
        ...baseEntry,
        type: object.type,
        healthCheckRating: parseHealthCheckRating(object.healthCheckRating),
      };
    case "Hospital":
      return {
        ...baseEntry,
        type: "Hospital",
        discharge: parseDischarge(object.discharge),
      };
    case "OccupationalHealthcare":
      return {
        ...baseEntry,
        type: "OccupationalHealthcare",
        employerName: parseString(object.description, "employerName"),
        sickLeave: parseSickleave(object.sickLeave),
        // create a property only if not null or undefined
        // https://stackoverflow.com/questions/11704267/in-javascript-how-to-conditionally-add-a-member-to-an-object/38483660
        // ...(object.sickLeave != undefined &&
        //   object.sickLeave != null && {
        //     sickLeave: parseSickleave(object.sickLeave),
        //   }),
      };
  }
};

const isString = (text: unknown): text is string => {
  return typeof text === "string" || text instanceof String;
};
const isArrayOfStrings = (array: unknown): array is string[] => {
  return Array.isArray(array) && array.every((item) => isString(item));
};
const isNumber = (nb: unknown): nb is number => {
  return typeof nb === "number" || nb instanceof Number;
};
const isObject = (obj: unknown): obj is Record<string, unknown> => {
  return typeof obj === "object" || obj !== null;
};
const parseString = (comment: unknown, field?: string): string => {
  if (!comment || !isString(comment)) {
    throw new Error(`Incorrect or missing ${field ?? "string"}`);
  }
  return comment;
};
const isDate = (date: string): boolean => {
  return !isNaN(Date.parse(date));
};
const parseDate = (date: unknown): string => {
  if (!date || !isString(date) || !isDate(date)) {
    throw new Error("Incorrect or missing date");
  }
  return date;
};
// https://stackoverflow.com/questions/2587345/why-does-date-parse-give-incorrect-results
// Until the 5th edition spec came out, the Date.parse method was completely implementation dependent (new Date(string) is equivalent to Date.parse(string) except the latter returns a number rather than a Date).
// warining: implmentation dependent

// http://www.trucsweb.com/tutoriels/javascript/tw276/
// var MaDateFrancaise = new Intl.DateTimeFormat("fr-FR")
// MaDateFrancaise.format(new Date("2016-08-30")) === "30/08/2016"

const isGender = (param: string): param is Gender => {
  return Object.values(Gender).includes(param as Gender);
};
const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender)) {
    throw new Error("Incorrect or missing gender");
  }
  return gender;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return Object.values(HealthCheckRating).includes(param as HealthCheckRating);
};
const parseHealthCheckRating = (
  healthCheckRating: unknown
): HealthCheckRating => {
  if (
    !healthCheckRating ||
    !isNumber(healthCheckRating) ||
    !isHealthCheckRating(healthCheckRating)
  ) {
    throw new Error("Incorrect or missing health check rating");
  }
  return healthCheckRating;
};

const isDischarge = (param: unknown): param is Discharge => {
  return (
    parseString((param as Discharge).criteria, "discharge criteria") !==
      undefined && parseDate((param as Discharge).date) != undefined
  );
};
const parseDischarge = (discharge: unknown): Discharge => {
  if (!discharge || !isObject(discharge) || !isDischarge(discharge)) {
    throw new Error("Incorrect or missing discharge");
  }
  return discharge;
};

const isSickLeave = (param: unknown): param is SickLeave => {
  return (
    parseDate((param as SickLeave).startDate) != undefined &&
    parseDate((param as SickLeave).endDate) != undefined
  );
};
const parseSickleave = (sickLeave: unknown): SickLeave | undefined => {
  if (
    !sickLeave ||
    ((sickLeave as SickLeave).startDate === "" &&
      (sickLeave as SickLeave).endDate === "")
  ) {
    return undefined;
  }
  if (!isObject(sickLeave) || !isSickLeave(sickLeave)) {
    throw new Error("Incorrect sick leave format");
  }
  return sickLeave;
};

const parseDiagnosisCodes = (diagnosisCodes: unknown): string[] | undefined => {
  if (!diagnosisCodes) {
    return undefined;
  }
  if (!isArrayOfStrings(diagnosisCodes)) {
    throw new Error("Incorrect diagnosis Codes format");
  }
  return diagnosisCodes;
};
