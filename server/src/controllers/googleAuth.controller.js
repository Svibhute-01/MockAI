import generateJWTtoken from "../config/token.config.js";
import User from "../models/user.model.js";

export const googleAuth = async (req, res) => {
  try {
    const { name, email } = req.body;

    if (!email) {
      return res.status(400).json({
        message: "Email is required",
      });
    }

    let user = await User.findOne({ email });

    if (!user) {
      user = await User.create({ name, email });
    }

    const token = await generateJWTtoken(user);

    // ✅ Set cookie properly
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,        // ❗ set true in production (HTTPS)
      sameSite: "lax",      // ✅ important for localhost
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "User authenticated",
      user,
    });

  } catch (error) {
    return res.status(500).json({
      message: `Google auth error: ${error.message}`,
    });
  }
};

export const logout = async (req, res) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({
      message: "Logout successfully",
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};