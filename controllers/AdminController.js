import Admin from "../models/Admin.js";
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const addValues = async (req, res) => {
  const { finding, suggestion } = req.body;
  try {
    if (finding) {
      await Admin.create({ finding });
      return res.status(201);
    } else if (suggestion) {
      await Admin.create({ suggestion });
      return res.status(201);
    } else if (req.files.file) {
      const docFile = req.files.file;
      const docPath = path.join(__dirname, "../files/" + `${docFile.name}`);
      await docFile.mv(docPath);
      const result = await cloudinary.uploader.upload(`files/${docFile.name}`, {
        resource_type: "raw",
        use_filename: true,
        folder: "reports",
      });
      fs.unlinkSync(`./files/${docFile.name}`);
      const template = {
        templateType: req.body.templateType,
        reportType: req.body.reportType,
        file: result.secure_url,
      };
      await Admin.create({ template });
    }
    res.status(201).json({ msg: "File Added Successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const getValues = async (req, res) => {
  try {
    const values = await Admin.find();
    let findings = [],
      suggestions = [],
      templates = [];
    for (let value of values) {
      if (value.finding && value.finding !== null) findings.push(value.finding);
      if (value.suggestion && value.suggestion !== null)
        suggestions.push(value.suggestion);
      if (value.template && value.template !== null)
        templates.push(value.template);
    }

    res.status(201).json({ findings, suggestions, templates });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};
