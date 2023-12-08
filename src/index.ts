import express from "express";
import router from "./routes";
const homePath = "/api/genres";

const app = express();
app.use(express.json());
app.use(homePath, router);
app.listen("3000", () => console.log("Listening to 3000"));
