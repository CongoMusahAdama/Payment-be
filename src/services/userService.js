import User from "../models/user.js";

// Get user profile
export const getUserProfile = async (userId) => {
  const user = await User.findById(userId).select("-password"); // Exclude password
  if (!user) throw new Error("User not found");
  return user;
};

// Update user profile
export const updateUserProfile = async (userId, profileData) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  const { Fullname, email, phone, password } = profileData;
  if (Fullname) user.Fullname = Fullname;
  if (email) user.email = email;
  if (phone) user.phone = phone;
  if (password) user.password = password;

  await user.save();
  return user;
};

// Upload KYC document
export const uploadKYCService = async (userId, filePath) => {
  const user = await User.findById(userId);
  if (!user) throw new Error("User not found");

  user.kycDocument = filePath;
  await user.save();
  return user;
};
