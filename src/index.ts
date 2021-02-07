import express from "express";
// import cors from "cors";
// pb w any type?
import cors = require("cors");
import { diagnosesRoute } from "./routes/diagnosesRoute";
import { patientsRoute } from "./routes/patientsRoute";

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  console.log("someone pinged here");
  res.send("pong");
});

app.use("/api/diagnoses", diagnosesRoute);
app.use("/api/patients", patientsRoute);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
