import Report from "../models/Report.js";
import Admin from "../models/Admin.js";
import newdoc from "docx-templates";
import fs from "fs";
import { dirname } from "path";
import { fileURLToPath } from "url";
import path from "path";
import { v2 as cloudinary } from "cloudinary";
import axios from "axios";
import sgMail from "@sendgrid/mail";

const __dirname = dirname(fileURLToPath(import.meta.url));

export const createReport = async (req, res) => {
  const {
    reportName,
    templateType,
    reportType,
    details,
    meetTo,
    meetContact,
    shownTo,
    shownContact,
    inspectionDate,
    meetEmail,
    shownEmail,
    contract,
  } = req.body;
  try {
    if (!reportName || !templateType || !reportType)
      return res.status(400).json({ msg: "Please provide all values" });

    if (templateType === "Direct" && req.files.file) {
      const link = await uploadFile(req.files.file);
      req.body.emailList = contract.split(",");
      req.body.link = link;
      req.body.inspectionBy = req.user.name;
      req.body.approved = true;
      await Report.create(req.body);
      return res.status(201).json({ msg: "Report successfully generated." });
    }

    let emailList = contract.billToEmails.concat(contract.shipToEmails);
    if (meetEmail.length > 0) emailList.push(meetEmail);
    if (shownEmail.length > 0) emailList.push(shownEmail);

    const newReport = await Report.create({
      reportName,
      reportType,
      templateType,
      meetTo,
      shownTo,
      inspectionBy: req.user.name,
      inspectionDate,
      details,
      emailList,
    });

    const adminValues = await Admin.find();

    let file = "",
      width = 16;
    adminValues.forEach((x) => {
      if (
        x.template &&
        x.template.templateType === templateType &&
        x.template.reportType === reportType
      ) {
        file = x.template.file;
      }
    });

    const resp = await axios.get(file, {
      responseType: "arraybuffer",
    });
    const template = Buffer.from(resp.data);

    if (templateType !== "Single Picture") width = 8;

    const buffer = await newdoc.createReport({
      cmdDelimiter: ["{", "}"],
      template,

      additionalJsContext: {
        meetTo: meetTo,
        meetContact: meetContact,
        meetEmail: meetEmail,
        shownTo: shownTo,
        shownContact: shownContact,
        shownEmail: shownEmail,
        inspectionBy: req.user.name,
        inspectionDate: inspectionDate,
        contract: contract,
        data: details,
        image: async (url) => {
          const resp = await axios.get(url, {
            responseType: "arraybuffer",
          });
          const buffer = Buffer.from(resp.data, "binary").toString("base64");
          return {
            width: width,
            height: 9,
            data: buffer,
            extension: ".jpg",
          };
        },
      },
    });

    fs.writeFileSync(
      path.resolve(__dirname, "../files/", `${reportName}.docx`),
      buffer
    );

    const result = await cloudinary.uploader.upload(
      `files/${reportName}.docx`,
      {
        resource_type: "raw",
        use_filename: true,
        folder: "reports",
      }
    );

    fs.unlinkSync(`./files/${reportName}.docx`);

    newReport.link = result.secure_url;
    await newReport.save();

    res.status(201).json({ msg: "Report successfully generated." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const uploadImages = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(
      req.files.image.tempFilePath,
      {
        use_filename: true,
        folder: "reports",
        quality: 30,
      }
    );
    fs.unlinkSync(req.files.image.tempFilePath);

    return res.status(201).json({
      msg: "ok",
      link: result.secure_url,
      imageCount: req.body.imageCount,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const editReport = async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Report.findById(id);
    if (!report) return res.status(404).json({ msg: "Report not found" });

    if (req.files.file) {
      const link = await uploadFile(req.files.file);
      report.link = link;
      report.approved = true;
      await report.save();
    }

    return res.status(200).json({ msg: "Report has been updated" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const allReports = async (req, res) => {
  const { search } = req.query;
  const searchObject = {};
  try {
    if (search) searchObject.reportName = { $regex: search, $options: "i" };

    const allReports = await Report.find();
    const approved = allReports.filter((item) => item.approved === true).length;
    const email = allReports.filter((item) => item.email === true).length;

    const stats = [
      {
        bg: "secondary",
        count: allReports.length,
        text: "Number Of Reports",
      },
      {
        bg: "danger",
        count: allReports.length - approved,
        text: "Pending For Approval",
      },
      {
        bg: "success",
        count: approved,
        text: "Reports Approved",
      },

      {
        bg: "danger",
        count: allReports.length - email,
        text: "Email Not Sent",
      },
    ];

    let repo = Report.find(searchObject)
      .sort("-createdAt")
      .select(
        "reportName reportType inspectionBy inspectionDate link approved email emailList"
      );
    // if (req.user.role === "Field") {
    //   reports = reports.filter((item) => item.inspectionBy === req.user.name);
    // }

    const page = Number(req.query.page) || 1;
    const pageLimit = 20;

    repo = repo.skip(page * pageLimit - pageLimit).limit(pageLimit);

    const reports = await repo;

    const totalPages = Math.ceil(
      (await Report.countDocuments(searchObject)) / pageLimit
    );

    return res.status(200).json({ reports, totalPages, stats });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const sendEmail = async (req, res) => {
  const { emailList, emails, mailId } = req.body;
  try {
    const report = await Report.findById(mailId);

    const attach = [];
    const fileType = report.link.split(".").pop();
    const result = await axios.get(report.link, {
      responseType: "arraybuffer",
    });
    const base64File = Buffer.from(result.data, "binary").toString("base64");
    const attachObj = {
      content: base64File,
      filename: `${report.reportName}.${fileType}`,
      type: `application/${fileType}`,
      disposition: "attachment",
    };
    attach.push(attachObj);

    const emailTo = [];
    for (let email of emailList) {
      if (email !== "clientproxymail@gmail.com" && !emailTo.includes(email))
        emailTo.push(email);
    }

    if (emails.length > 0) emailTo.push(emails);

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: emailTo,
      from: { email: "noreply.epcorn@gmail.com", name: "donotreply_epcorn" },
      dynamic_template_data: {
        fileName: report.reportName,
        name: req.user.name,
        subject: report.reportType,
        inspectionBy: report.inspectionBy,
      },
      template_id: "d-0e9f59c886f84dd7ba895e0a3390697e",
      attachments: attach,
    };
    await sgMail.send(msg);

    report.email = true;
    await report.save();

    const emailData = {
      inspectionDate: new Date(),
      reportName: report.reportName,
      email: emailTo.toString(),
      inspectionBy: report.inspectionBy,
    };

    await Admin.create({ emailData });

    res.status(200).json({ msg: "Email has been sent" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

export const uploadFile = async (file) => {
  try {
    const docFile = file;
    const docPath = path.join(__dirname, "../files/" + `${docFile.name}`);
    await docFile.mv(docPath);
    const result = await cloudinary.uploader.upload(`files/${docFile.name}`, {
      resource_type: "raw",
      use_filename: true,
      folder: "reports",
    });
    fs.unlinkSync(`./files/${docFile.name}`);
    return result.secure_url;
  } catch (error) {
    console.log(error);
    return error;
  }
};
