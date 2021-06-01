import express from "express";
import mongoose from "mongoose";
import postRoutes from "./routes/postRoutes.js";

mongoose
  .connect(
    "mongodb+srv://Maen:Lux5YtaLXIVFOwMx@cluster0.mszqm.mongodb.net/PostsPsH?retryWrites=true&w=majority",
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    }
  )
  .then(() => {
    console.log("Connected succesfully to database!");
  })
  .catch((err) => {
    console.log("Connection failed: ");
    console.log(err);
  });

// pass

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((_, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", postRoutes);

export { app };
