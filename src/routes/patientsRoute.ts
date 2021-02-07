import express from "express";
import {
  addEntry,
  addPatient,
  getNonSensitivePatient,
  getPatient,
} from "../services/patientService";
import * as utils from "../utils";
const patientsRoute = express.Router();

patientsRoute.get("/", (_req, res) => {
  res.send(getNonSensitivePatient());
});
patientsRoute.get("/:id", (req, res) => {
  const result = getPatient(req.params.id);
  if (result === undefined) {
    res.status(400).send("patient id can't be found");
    return;
  }
  res.send(result);
});

patientsRoute.post("/", (req, res) => {
  try {
    const newPatient = utils.toNewPatient(req.body);
    const addedPatient = addPatient(newPatient);
    res.send(addedPatient);
  } catch (e) {
    if (e instanceof Error) {
      res.status(400).send(e.message);
    }
  }
});
patientsRoute.post("/:id/entries", (req, res) => {
  const patient = getPatient(req.params.id);
  console.log(req.body);
  if (patient === undefined) {
    res.status(400).send("patient id can't be found");
    return;
  }
  try {
    const newEntry = utils.toNewEntry(req.body);
    const updatedPatient = addEntry(patient, newEntry);
    console.log(updatedPatient);
    res.send(updatedPatient);
  } catch (e) {
    if (e instanceof Error) {
      console.log(e.message);
      res.status(400).send(e.message);
    }
  }
});

export { patientsRoute };
