const Admin = require("../../models/AdminModel");
const jwt = require("jsonwebtoken");

const bcrypt = require("bcryptjs");

const secretKey = "HelloTechInvoiceGenerator2024";

const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find({});
    res.status(200).json(admins);
  } catch (error) {
    console.error("Error fetching admins:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Register admin
const registerAdmin = async (req, res) => {
  const { email, password, confirmPassword } = req.body;

  if (password !== confirmPassword) {
    return res.status(400).json({ error: "Passwords do not match" });
  }

  try {
    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res
        .status(302)
        .json({ error: "Admin with this email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = new Admin({ email, password: hashedPassword });
    await newAdmin.save();
    res
      .status(201)
      .json({ success: true, message: "Admin registered successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Login controller function

const LoginController = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.findOne({ email });
    if (!user) {
      console.warn("User not found:", email);
      return res.status(302).json({ error: "User not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      console.warn("Incorrect password for user:", email);
      return res.status(302).json({ error: "Incorrect password" });
    }

    const accessToken = jwt.sign(
      { email: user.email, role: "admin" },
      secretKey,
      { expiresIn: "1h" }
    );

    console.log("Generated Token:", accessToken);
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: false,
      sameSite: "lax",
    });

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("Login error:", error);
    return res
      .status(500)
      .json({ error: "Internal server error", error: error.message });
  }
};

const deleteAdmin = async (req, res) => {
  const { id } = req.params;

  try {
    const adminCount = await Admin.countDocuments();

    if (adminCount <= 1) {
      return res.status(400).json({ error: "Cannot delete the last admin" });
    }

    const admin = await Admin.findByIdAndDelete(id);
    if (!admin) {
      return res.status(404).json({ error: "Admin not found" });
    }

    res
      .status(200)
      .json({ success: true, message: "Admin deleted successfully" });
  } catch (error) {
    console.error("Error deleting admin:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const LogoutController = (req, res) => {
  try {
    res.clearCookie("accessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });

    return res
      .status(200)
      .json({ success: true, message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = {
  LoginController,
  registerAdmin,
  deleteAdmin,
  getAllAdmins,
  LogoutController,
};
