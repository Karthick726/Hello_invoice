const express = require("express");
const router = express.Router();
const AdminController = require("../controller/AdminController/AdminController");
const { auth } = require("../middleware/auth");

router.post("/admin-login", AdminController.LoginController);
router.post("/admin-register", AdminController.registerAdmin);
router.post("/admin-logout", auth, AdminController.LogoutController);
router.delete("/admin-delete/:id", auth, AdminController.deleteAdmin);
router.get("/get-all-admin", auth, AdminController.getAllAdmins);

module.exports = router;
