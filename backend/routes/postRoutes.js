import express from "express";
import Post from "../models/post.js";

const router = express.Router();

// Get Posts
router.get("", (_, res) => {
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

router.get("/:id", (req, res) => {
  const { id } = req.params;
  console.log(req.params);
  Post.findById(id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      console.log("Error");
      res.status(404).json({
        message: "Post not found",
      });
    }
  });
});

// Create a Post
router.post("", (req, res) => {
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

// Update a Post
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  const post = { title, content };

  Post.updateOne({ _id: id }, post).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Post updated succesfully",
    });
  });
});

// Delete a Post
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  Post.deleteOne({ _id: id }).then((result) => {
    console.log(`Post with id: ${id} deleted`);
  });
  res.status(200).json({
    message: "Post Deleted succesfully",
  });
});

const postRoutes = router;

export default postRoutes;
