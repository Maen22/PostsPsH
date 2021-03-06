import express from "express";
import Post from "../models/post.js";
import multer from "multer";

import checkAuth from "../middleware/check-auth.js";

const router = express.Router();

const MIME_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

// Multer configrations for saving images on the server
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const extension = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + "-" + Date.now() + "." + extension);
  },
});

// Get Posts
router.get("", (req, res) => {
  const { pageSize, page } = req.query;
  const postQuery = Post.find();
  let posts = null;

  if (pageSize && page) {
    postQuery.skip(+pageSize * (+page - 1)).limit(+pageSize);
  }

  postQuery
    .then((documents) => {
      posts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      res.status(200).json({
        message: "Posts fetched succesfully",
        posts,
        maxPosts: count,
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
router.post("", checkAuth, multer({ storage }).single("image"), (req, res) => {
  const url = req.protocol + "://" + req.get("host");
  const { title, content } = req.body;
  const { userId } = req.userData;
  const post = new Post({
    title,
    content,
    imagePath: url + "/images/" + req.file.filename,
    creator: userId,
  });

  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: "Post added succesfully",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((err) => {
      console.log(err);
    });
});

// Update a Post
router.put(
  "/:id",
  checkAuth,
  multer({ storage }).single("image"),
  (req, res) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }

    const { id } = req.params;
    const { title, content } = req.body;

    const post = { title, content, imagePath };

    Post.updateOne({ _id: id }, post).then((result) => {
      console.log(`Post with id: ${id} udpated`);
      res.status(200).json({
        message: "Post updated succesfully",
      });
    });
  }
);

// Delete a Post
router.delete("/:id", checkAuth, (req, res) => {
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
