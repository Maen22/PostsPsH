import express from "express";

const app = express();

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

app.use("/api/posts", (_, res, __) => {
  const posts = [
    {
      id: "haghjgdljiekd",
      title: "First server-side post",
      content: "Coming from server !",
    },
    {
      id: "klhjdukghfkhdl",
      title: "Second server-side post",
      content: "Coming from server !",
    },
  ];
  res.status(200).json({
    message: "Posts fetched succesfully!",
    posts,
  });
});

export { app };
