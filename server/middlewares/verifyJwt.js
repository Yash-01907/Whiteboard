import User from "../models/user.model.js";
import jwt from "jsonwebtoken";

const verifyJwt = async (req, res, next) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    if (!token) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Unauthorized request",
          code: "NO_TOKEN",
        });
    }
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    const user = await User.findById(decodedToken?.id).select(
      "-password -refreshToken"
    );
    if (!user) {
      return res
        .status(401)
        .json({
          success: false,
          message: "Invalid access token",
          code: "INVALID_TOKEN",
        });
    }
    req.user = user;
    next();
  } catch (err) {
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token expired",
        code: "TOKEN_EXPIRED", // <--- THE IMPORTANT PART
      });
    }
    return res
      .status(401)
      .json({
        success: false,
        message: "Invalid access token",
        code: "INVALID_TOKEN",
      });
  }
};

export { verifyJwt };
