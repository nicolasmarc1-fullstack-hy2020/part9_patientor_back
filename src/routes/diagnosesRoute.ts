import express from "express";
import { getDiagnoses } from "../services/diagnoseService";
const diagnosesRoute = express.Router();

diagnosesRoute.get("/", (_req, res) => {


  res.send(getDiagnoses());
});

export { diagnosesRoute };
