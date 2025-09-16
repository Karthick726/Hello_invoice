const jwt = require("jsonwebtoken");
const adminModel = require("../models/AdminModel");

const secretKey = "HelloTechInvoiceGenerator2024";

const auth = async (req, res, next) => {
  try {
    const accessToken = req.cookies.accessToken;

    if (!accessToken) {
      console.log("No access token provided");
      return res.status(401).json({ message: "No access token provided" });
    }

    jwt.verify(accessToken, secretKey, async (err, decoded) => {
      if (err) {
        console.error("Token verification error:", err.message);
        return res.status(401).json({ message: "Invalid access token" });
      }

      console.log("Decoded Token:", decoded);

      try {
        let user;
        if (decoded.role === "admin") {
          user = await adminModel
            .findOne({ email: decoded.email })
            .select("-password");

          console.log("User from database:", user);
        }

        if (!user) {
          console.log("Admin not found");
          return res.status(401).json({ message: "Admin not found" });
        }

        req.user = user;
        next();
      } catch (error) {
        console.error("Error fetching user:", error.message);
        return res.status(500).json({ message: "Internal Server Error" });
      }
    });
  } catch (error) {
    console.error("Error in auth middleware:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { auth };
