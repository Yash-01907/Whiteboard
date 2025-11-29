import asyncHandler from "../utils/asyncHandler.js";
import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import axios from "axios";
import { generateRefreshAndAccessToken } from "../utils/generateRefreshAndAccessToken.js";
import { cookieOptions } from "../utils/cookieOption.js";
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuthHandler = asyncHandler(async (req, res) => {
  const { token } = req.body;
  if (!token) {
    throw new Error("No token provided");
  }
  const googleUser = await axios
    .get("https://www.googleapis.com/oauth2/v3/userinfo", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => res.data);
  const { sub, email, name, picture } = googleUser;
  let user = await User.findOne({ email });
  if (!user) {
    user = await User.create({
      password: Math.random().toString(36).slice(2),
      email,
      username: email.split("@")[0],
    });
  }
  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user);

  const loggedInUser = {
    id: user._id,
    username: user.username,
    email: user.email,
  };
  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);
  res
    .status(200)
    .json({
      success: true,
      message: "User logged in successfully",
      user: loggedInUser,
    });
});
