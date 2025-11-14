import asyncHandler from "../utils/asyncHandler.js";
import User from "../models/user.model.js";

const generateRefreshAndAccessToken = async (user) => {
  try {
    const refreshToken = await user.generateRefreshToken();
    const accessToken = await user.generateAccessToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });

    return { refreshToken, accessToken };
  } catch (error) {
    console.error("Token generation failed:", error);
    throw error;
  }
};

const registerUser = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const existingUser = await User.findOne({ $or: [{ username }, { email }] });

  if (existingUser) {
    const field = existingUser.username === username ? "Username" : "Email";
    return res
      .status(409)
      .json({ success: false, message: `${field} already in use` });
  }

  const user = await User.create({
    username,
    email,
    password,
  });

  if (!user) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid user data" });
  }

  res.status(201).json({
    success: true,
    message: "User registered successfully",
  });
});

const loginUser = asyncHandler(async (req, res) => {
  const { email, password, username } = req.body;

  if ((!email && !username) || !password) {
    return res
      .status(400)
      .json({ success: false, message: "All fields are required" });
  }

  const user = await User.findOne({ $or: [{ email }, { username }] });

  if (!user) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const isMatch = await user?.comparePassword(password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, message: "Invalid credentials" });
  }

  const { accessToken } = await generateRefreshAndAccessToken(user);
  res.cookie("accessToken", accessToken);
  console.log(accessToken);

  res.status(200).json({
    success: true,
    message: "Login successful",
  });
});

const deleteUser = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  await User.findByIdAndDelete(userId);

  res.clearCookie("accessToken");

  res.status(200).json({
    success: true,
    message: "User deleted successfully",
  });
});

export { registerUser, loginUser, deleteUser };
