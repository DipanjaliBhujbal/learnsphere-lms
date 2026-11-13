const userService = require("../services/user.service");

// Shared refresh-token cookie settings
const refreshCookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

// Register controller
const register = async (req, res, next) => {
  try {
    const user = await userService.registerUser(req.body);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

// Login controller
const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const result = await userService.loginUser(email, password);

    res.cookie("refreshToken", result.refreshToken, refreshCookieOptions);

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        user: result.user,
        accessToken: result.accessToken,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Refresh access token controller
const refreshToken = async (req, res, next) => {
  try {
    const token = req.cookies.refreshToken;
    const result = await userService.refreshAccessToken(token);

    res.status(200).json({
      success: true,
      message: "Access token refreshed successfully",
      data: { accessToken: result.accessToken },
    });
  } catch (error) {
    next(error);
  }
};

// Logout controller
const logout = async (req, res, next) => {
  try {
    res.clearCookie("refreshToken", {
      httpOnly: refreshCookieOptions.httpOnly,
      secure: refreshCookieOptions.secure,
      sameSite: refreshCookieOptions.sameSite,
      path: refreshCookieOptions.path,
    });

    res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    next(error);
  }
};

// Get currently authenticated user
const getMe = async (req, res, next) => {
  try {
    res.status(200).json({
      success: true,
      message: "User profile fetched successfully",
      data: { user: req.user },
    });
  } catch (error) {
    next(error);
  }
};

// Update user profile
const updateProfile = async (req, res, next) => {
  try {
    const updatedUser = await userService.updateUserProfile(
        req.user._id,
        req.body
    );

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: { user: updatedUser },
    });
  } catch (error) {
    next(error);
  }
};

// Change user password
const changePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const result = await userService.changeUserPassword(
        req.user._id,
        currentPassword,
        newPassword
    );

    res.status(200).json({
      success: true,
      message: result.message,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getMe,
  updateProfile,
  changePassword,
};
