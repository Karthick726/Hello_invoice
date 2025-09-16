const express = require("express");
const router = express.Router();
const infoController = require("../controller/companyInfoController/CompanyInfo");
const { auth } = require("../middleware/auth");
// Define routes
router.post("/create-info", auth, infoController.createInfo);
router.get("/get-all-info", infoController.getAllInfo);
router.get("/get-id-info/:id", auth, infoController.getInfoById);
router.put("/update-info/:id", auth, infoController.updateInfo);
router.delete("/delete-info/:id", auth, infoController.deleteInfo);

module.exports = router;
