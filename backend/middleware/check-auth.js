import jwt from "jsonwebtoken";

const checkAuth = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    jwt.verify(token, "this_should_be_longer");
    next();
  } catch (err) {
    res.status(401).json({
      message: "Auth failed!",
    });
  }
};

export default checkAuth;
