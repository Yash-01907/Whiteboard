import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";
import { generateRefreshAndAccessToken } from "../utils/generateRefreshAndAccessToken.js";
import jwt from "jsonwebtoken";
import { cookieOptions } from "../utils/cookieOption.js";

const refreshAccessToken = asyncHandler(async (req, res) => {
  // 1. Get the "Key" from the cookie
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    return res
      .status(401)
      .json({ success: false, message: "Unauthorized request" });
  }
  console.log(incomingRefreshToken);

  try {
    // 2. Verify the signature (Is this a valid key?)
    const decoded = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET
    );

    // 3. Find the user inside the "Bank"
    const user = await User.findById(decoded?.id);
    console.log(user)

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: "Invalid refresh token" });
    }

    // 4. THE DB CHECK: Does the key match what we have in the DB?
    // This allows you to "Log out all devices" by clearing the DB field.
    if (incomingRefreshToken !== user.refreshToken) {
      return res
        .status(401)
        .json({ success: false, message: "Refresh token is expired or used" });
    }

    // 5. Generate NEW Access Token (Give them a new wristband)
    // const options = {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === "production",
    //   sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    // };

    const { accessToken, refreshToken:newRefreshToken } =
      await generateRefreshAndAccessToken(user);

    res
      .status(200)
      .cookie("accessToken", accessToken, cookieOptions)
      .cookie("refreshToken", newRefreshToken, cookieOptions) // Optional: Rotate refresh token too
      .json({
        success: true,
        accessToken,
        message: "Access token refreshed",
      });
  } catch (error) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid refresh token" });
  }
});

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({
        success: false,
        message: "All fields are required",
        code: "INVALID_DATA",
      });
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    const field = existingUser.username === username ? "Username" : "Email";
    return res
      .status(409)
      .json({
        success: false,
        message: `${field} already in use`,
        code: "DUPLICATE_DATA",
      });
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (!user) {
    return res
      .status(400)
      .json({
        success: false,
        message: "Invalid user data",
        code: "INVALID_DATA",
      });
  }

  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user);
  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.status(201).json({
    success: true,
    message: "User registered successfully",
    user
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { usernameOrEmail, password } = req.body;

  if (!usernameOrEmail || !password) {
    return res
      .status(400)
      .json({
        success: false,
        message: "All fields are required",
        code: "INVALID_DATA",
      });
  }

  const user = await User.findOne({
    $or: [{ email: usernameOrEmail }, { username: usernameOrEmail }],
  });

  if (!user) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
  }

  const isMatch = await user?.comparePassword(password);

  if (!isMatch) {
    return res
      .status(401)
      .json({
        success: false,
        message: "Invalid credentials",
        code: "INVALID_CREDENTIALS",
      });
  }

  const { accessToken, refreshToken } = await generateRefreshAndAccessToken(
    user
  );

  const loggedInUser = {
    _id: user._id,
    username: user.username,
    email: user.email,
  };
  res.cookie("accessToken", accessToken, cookieOptions);
  res.cookie("refreshToken", refreshToken, cookieOptions);

  res.status(200).json({
    success: true,
    message: "Login successful",
    user: loggedInUser,
  });
});

const logoutUser=asyncHandler(async(req,res)=>{
    res.clearCookie("accessToken",cookieOptions);
    res.clearCookie("refreshToken",cookieOptions);
    res.status(200).json({
        success:true,
        message:"User logged out successfully"
    })
})

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await User.findByIdAndDelete(userId);

  res.clearCookie("accessToken",cookieOptions);

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

const getCurrentUser = asyncHandler(async (req, res) => {
  const user = req.user;
  res.status(200).json({
    success: true,
    message: "User fetched successfully",
    user,
  });
});

export {
  registerUser,
  loginUser,
  deleteUser,
  getCurrentUser,
  refreshAccessToken,
  logoutUser
};
