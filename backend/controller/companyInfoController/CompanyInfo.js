const Info = require("../../models/Info");

// Create a new Info
const createInfo = async (req, res) => {
  try {
    const newInfo = new Info(req.body);
    const savedInfo = await newInfo.save();
    res.status(201).json(savedInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all Info entries
const getAllInfo = async (req, res) => {
  try {
    const infoList = await Info.find();
    res.status(200).json(infoList);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Info by ID
const getInfoById = async (req, res) => {
  try {
    const info = await Info.findById(req.params.id);
    if (!info) return res.status(404).json({ message: "Info not found" });
    res.status(200).json(info);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update Info by ID
const updateInfo = async (req, res) => {
  try {
    const updatedInfo = await Info.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedInfo)
      return res.status(404).json({ message: "Info not found" });
    res.status(200).json(updatedInfo);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Info by ID
const deleteInfo = async (req, res) => {
  try {
    const deletedInfo = await Info.findByIdAndDelete(req.params.id);
    if (!deletedInfo)
      return res.status(404).json({ message: "Info not found" });
    res.status(200).json({ message: "Info deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createInfo,
  getAllInfo,
  getInfoById,
  updateInfo,
  deleteInfo,
};
