import express from "express";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

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

app.post("/api/posts", (req, res, __) => {
  console.log(req.body);
  res.status(201).json({
    message: "Post added succesfully",
  });
});

app.get("/api/posts", (_, res, __) => {
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
    message: "Posts fetched succesfully",
    posts,
  });
});

export { app };
