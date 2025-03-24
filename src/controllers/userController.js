import User from "../models/user.js";
import { getUserProfile as getUserProfileService } from "../services/userService.js";

// Update user profile
export const updateProfile = async (req, res) => {
  const { Fullname, email, phone, address, password } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.Fullname = Fullname || user.Fullname;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.address = address || user.address;
    user.password = password || user.password;
    await user.save();
    return res.status(200).json({ message: "Profile updated successfully", user });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Get user profile
export const getUserProfile = async (req, res) => {
  console.log("User ID:", req.user); // Log the user ID
  try {
    const userProfile = await getUserProfileService(req.user.id);

    return res.status(200).json({ user: userProfile });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload KYC doc
export const uploadKYC = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Save the file path to the user model
    user.kycDocument = req.file.path;
    await user.save();

    return res.status(200).json({ message: "KYC document uploaded successfully", file: req.file });
  } catch (error) {
    return res.status(500).json({ message: "Server error", error: error.message });
  }
};
