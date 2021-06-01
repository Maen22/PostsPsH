import express from "express";
import Post from "./models/post.js";
import mongoose from "mongoose";

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
    "GET, POST, PATCH, DELETE, OPTIONS"
  );
  next();
});

// Get Posts
app.get("/api/posts", (_, res) => {
  Post.find()
    .then((documents) => {
      const posts = documents;
      res.status(200).json({
        message: "Posts fetched succesfully",
        posts,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Create a Post
app.post("/api/posts", (req, res) => {
  const { title, content } = req.body;
  const post = new Post({
    title,
    content,
  });

  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post added succesfully",
        postId: createdPost._id,
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Delete a Post
app.delete("/api/posts/:id", (req, res) => {
  const { id } = req.params;

  Post.deleteOne({ _id: id }).then((result) => {
    console.log(`Post with id: ${id} deleted`);
  });
  res.status(200).json({
    message: "Post Deleted succesfully",
  });
});

export { app };
