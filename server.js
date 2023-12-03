import express from "express";
import mongoose from "mongoose"
import userRoute from "./routes/user.js";
import teamRoute from "./routes/team.js"
import {config} from "dotenv"
config();

const app = express();
let PORT = process.env.PORT || 5000;

app.use(express.json());
app.use("/api/users/", userRoute);
app.use("/api/team/", teamRoute);
app.use("*", (req, res) => res.status(200).json({
    message: "Route not found"
  }));

async function connectDb() {
  try {
    await mongoose.connect(process.env.DB_URI);
    console.log("Connected to Database");
  } catch (error) {
    console.log("Failed to connect to Database");
    console.log(error);
  }
}
connectDb();

app.listen(PORT,err => {
  if (err) console.log("Something went wrong");
  else console.log(`Listening on port number ${PORT}`);
});
