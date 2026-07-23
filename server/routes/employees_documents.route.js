const express = require("express");
const router = express.Router();
const EmployeeDocument = require("../models/employeesDocumentsModel");
const supabase = require("../services/supabase.service");

router.get("/:documentId", async (req, res) => {
  console.log("DOCUMENT API END POINT HIT");
  try {
    const { documentId } = req.params;

    const document = await EmployeeDocument.findById(documentId);

    if (!document) {
      return res.status(404).json({
        message: "Document not found",
      });
    }

    const { data, error } = await supabase.storage
      .from("afritan_employees_documents")
      .download(document.storagePath);

    if (error || !data) {
      return res.status(404).json({
        message: "Document file not found",
      });
    }

    const buffer = Buffer.from(await data.arrayBuffer());

    res.setHeader(
      "Content-Type",
      document.mimeType || "application/octet-stream"
    );

    res.setHeader(
      "Content-Disposition",
      `inline; filename="${document.originalName}"`
    );

    res.setHeader("Cache-Control", "public, max-age=3600");

    return res.status(200).send(buffer);
  } catch (error) {
    console.error(error);

    return res.status(500).json({
      message: "FAILED TO DOWNLOAD DOCUMENT",
    });
  }
});

module.exports = router;
