const express = require("express");

const mongoose = require("mongoose");

const cors = require("cors");

const authRouter = require("./routes/authRouter");
const error = require("./middlewares/error");

const app = express();

const port = process.env.PORT || 3020;

require("dotenv").config();

app.use(cors());

app.use(express.json());

app.use("/api/auth", authRouter);

app.use(error);

const start = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Database Connected");
    app.listen(port, () => {
      console.log(`Server is running on PORT ${port}`);
    });
  } catch (err) {
    console.log(err);
    console.log("Unable to Connect");
  }
};

start();
