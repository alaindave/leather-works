const express = require("express");
const router = express.Router();
const supabase = require("../services/supabase.service");
const Employee = require("../models/employeeModel");

router.get("/:employeeId", async (req, res) => {
  try {
    const { employeeId } = req.params;

    const employee = await Employee.findById(employeeId);

    if (!employee) {
      return res.status(404).json({
        message: "Employee not found",
      });
    }

    const { data, error } = await supabase.storage
      .from("afritan_employees_photos")
      .download(employee.photo_path);

    if (error || !data) {
      return res.status(404).json({
        message: "Photo not found",
      });
    }

    const buffer = Buffer.from(await data.arrayBuffer());
    res.setHeader("Content-Type", data.type || "application/octet-stream");
    res.setHeader("Cache-Control", "public, max-age=3600");

    return res.status(200).send(buffer);
  } catch (err) {
    console.error(err);

    return res.status(500).json({
      message: "FAILED TO DOWNLOAD PHOTO",
    });
  }
});

module.exports = router;
