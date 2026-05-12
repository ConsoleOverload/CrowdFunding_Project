import dns from 'node:dns';
dns.setServers(['8.8.8.8', '8.8.4.4']); // Forces use of Google DNS
import exp from 'express'
import { config } from "dotenv";
import { connect } from "mongoose";
import cookieParser from "cookie-parser";
import {userApp} from  "./APIs/userApi.js";
import cors from 'cors'
import { commonApp } from "./APIs/commonApi.js";
import campaignApp from './APIs/campaignApi.js';
import { adminApp } from './APIs/adminApi.js';
import donationApp from './APIs/donationApi.js';
import { razorpayApp } from "./APIs/razorpayApi.js";
config();
//body parser
const app = exp();

app.use(cors({
  origin:['http://localhost:5173'],
  credentials:true
}));

app.use(exp.json());
app.use(cookieParser());

app.use("/user-api", userApp);
app.use("/auth-api", commonApp);
app.use("/campaign-api",campaignApp)
app.use("/admin-api",adminApp)
app.use("/donation-api",donationApp)
app.use("/razorpay-api", razorpayApp);
//connect to db
const connectDB = async () => {
  try {
    await connect(process.env.DB_URL);
    console.log("DB server connected");
    //assign port
    const port = process.env.PORT || 5005;
    app.listen(port, () => console.log(`server listening on ${port}..`));
  } catch (err) {
    console.log("err in db connect", err);
  }
};

connectDB();

//to handle invalid path
app.use((req, res, next) => {
  console.log(req.url);
  res.status(404).json({ message: `path ${req.url} is invalid` });
});

//Error handling middleware
app.use((err, req, res, next) => {
  console.log("error is ",err)
  console.log("Full error:", JSON.stringify(err, null, 2));
  //ValidationError
  if (err.name === "ValidationError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  //CastError
  if (err.name === "CastError") {
    return res.status(400).json({ message: "error occurred", error: err.message });
  }
  const errCode = err.code ?? err.cause?.code ?? err.errorResponse?.code;
  const keyValue = err.keyValue ?? err.cause?.keyValue ?? err.errorResponse?.keyValue;

  if (errCode === 11000) {
    const field = Object.keys(keyValue)[0];
    const value = keyValue[field];
    return res.status(409).json({
      message: "error occurred",
      error: `${field} "${value}" already exists`,
    });
  }

  //send server side error
  res.status(500).json({ message: "error occurred", error: "Server side error" });
});
export default app;