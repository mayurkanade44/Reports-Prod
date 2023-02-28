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
      return res.status(201).json({ msg: "Report successfully uploaded." });
    }

    let emailList = contract.billToEmails.concat(contract.shipToEmails);
    if (meetEmail.length > 0) emailList.push(meetEmail);
    if (shownEmail.length > 0) emailList.push(shownEmail);

    contract.number = capitalLetter(contract.number);
    contract.billToName = capitalLetter(contract.billToName);
    contract.shipToName = capitalLetter(contract.shipToName);

    const meetDetails = {
      name: capitalLetter(meetTo),
      contact: meetContact,
      email: meetEmail,
    };

    const shownDetails = {
      name: capitalLetter(shownTo),
      contact: shownContact,
      email: shownEmail,
    };

    await Report.create({
      reportName,
      reportType,
      templateType,
      meetDetails,
      shownDetails,
      inspectionBy: req.user.name,
      inspectionDate,
      contract,
      details,
      emailList,
    });

    // let file = "",
    //   width = 16;
    // adminValues.forEach((x) => {
    //   if (
    //     x.template &&
    //     x.template.templateType === templateType &&
    //     x.template.reportType === reportType
    //   ) {
    //     file = x.template.file;
    //   }
    // });

    // const resp = await axios.get(file, {
    //   responseType: "arraybuffer",
    // });
    // const template = Buffer.from(resp.data);

    // if (templateType !== "Single Picture") width = 8;

    // const buffer = await newdoc.createReport({
    //   cmdDelimiter: ["{", "}"],
    //   template,

    //   additionalJsContext: {
    //     meetTo: meetTo,
    //     meetContact: meetContact,
    //     meetEmail: meetEmail,
    //     shownTo: shownTo,
    //     shownContact: shownContact,
    //     shownEmail: shownEmail,
    //     inspectionBy: req.user.name,
    //     inspectionDate: inspectionDate,
    //     contract: contract,
    //     data: details,
    //     image: async (url) => {
    //       const resp = await axios.get(url, {
    //         responseType: "arraybuffer",
    //       });
    //       const buffer = Buffer.from(resp.data, "binary").toString("base64");
    //       return {
    //         width: width,
    //         height: 9,
    //         data: buffer,
    //         extension: ".jpg",
    //       };
    //     },
    //   },
    // });

    // fs.writeFileSync(
    //   path.resolve(__dirname, "../files/", `${reportName}.docx`),
    //   buffer
    // );

    // const result = await cloudinary.uploader.upload(
    //   `files/${reportName}.docx`,
    //   {
    //     resource_type: "raw",
    //     use_filename: true,
    //     folder: "reports",
    //   }
    // );

    // fs.unlinkSync(`./files/${reportName}.docx`);

    // newReport.link = result.secure_url;
    // await newReport.save();

    res.status(201).json({ msg: "Report successfully saved." });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ msg: "Server error, try again later" });
  }
};

const capitalLetter = (phrase) => {
  return phrase
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
};

export const generateReport = async (req, res) => {
  const { id } = req.params;
  try {
    const report = await Report.findOne({ _id: id });
    if (!report) return res.stats(404).json({ msg: "Report Not Found" });

    const adminValues = await Admin.find();

    let file = "",
      width = 16;
    adminValues.forEach((x) => {
      if (
        x.template &&
        x.template.templateType === report.templateType &&
        x.template.reportType === report.reportType
      ) {
        file = x.template.file;
      }
    });

    const resp = await axios.get(file, {
      responseType: "arraybuffer",
    });
    const template = Buffer.from(resp.data);

    if (report.templateType !== "Single Picture") width = 8;

    const buffer = await newdoc.createReport({
      cmdDelimiter: ["{", "}"],
      template,

      additionalJsContext: {
        meetTo: report.meetDetails.name,
        meetContact: report.meetDetails.contact,
        meetEmail: report.meetDetails.email,
        shownTo: report.shownDetails.name,
        shownContact: report.shownDetails.contact,
        shownEmail: report.shownDetails.email,
        inspectionBy: report.inspectionBy,
        inspectionDate: report.inspectionDate,
        contract: report.contract,
        data: report.details,
        image: async (
          url = "https://res.cloudinary.com/epcorn/image/upload/v1674627399/signature/No_Image_Available_ronw0k.jpg"
        ) => {
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
      path.resolve(__dirname, "../files/", `${report.reportName}.docx`),
      buffer
    );

    const size = fs.statSync(
      path.resolve(__dirname, "../files/", `${report.reportName}.docx`)
    );

    if (size.size < 10000000) {
      const result = await cloudinary.uploader.upload(
        `files/${report.reportName}.docx`,
        {
          resource_type: "raw",
          use_filename: true,
          folder: "reports",
        }
      );
      report.link = result.secure_url;
      await report.save();

      fs.unlinkSync(`./files/${report.reportName}.docx`);
    } else {
      fs.unlinkSync(`./files/${report.reportName}.docx`);
      return res
        .status(200)
        .json({ msg: "File size is too large contact Admin" });
    }

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
        width: 800,
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
      report.link = await uploadFile(req.files.file);
      report.approved = true;
      await report.save();
    }

    if (req.files.quotation) {
      report.quotation = await uploadFile(req.files.quotation);
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
    let reportQuot = `${report.reportType} Report`;

    const files = [{ name: `${report.reportName} Report`, link: report.link }];
    if (report.quotation) {
      reportQuot += " And Quotation";
      files.push({
        name: `${report.reportName} Quotation`,
        link: report.quotation,
      });
    }

    const attach = [];

    for (let i = 0; i < files.length; i++) {
      const fileType = files[i].link.split(".").pop();
      const result = await axios.get(files[i].link, {
        responseType: "arraybuffer",
      });
      const base64File = Buffer.from(result.data, "binary").toString("base64");

      const attachObj = {
        content: base64File,
        filename: `${files[i].name}.${fileType}`,
        type: `application/${fileType}`,
        disposition: "attachment",
      };
      attach.push(attachObj);
    }

    // const fileType = report.link.split(".").pop();
    // const result = await axios.get(report.link, {
    //   responseType: "arraybuffer",
    // });
    // const base64File = Buffer.from(result.data, "binary").toString("base64");

    // const attachObj = {
    //   content: base64File,
    //   filename: `${report.reportName}.${fileType}`,
    //   type: `application/${fileType}`,
    //   disposition: "attachment",
    // };
    // attach.push(attachObj);

    let emailTo = [];
    for (let email of emailList) {
      if (email !== "clientproxymail@gmail.com" && !emailTo.includes(email))
        emailTo.push(email);
    }

    if (emails.length > 0) {
      emailTo = emailTo.concat(emails.split(","));
    }

    sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    const msg = {
      to: emailTo,
      cc: ["sales@epcorn.com", "natco.epcorn@gmail.com"],
      from: { email: "noreply.epcorn@gmail.com", name: "Epcorn" },
      dynamic_template_data: {
        fileName: report.reportName,
        name: req.user.name,
        report: reportQuot,
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
      sendDate: new Date(),
      reportName: report.reportName,
      emails: emailTo.toString(),
      sendBy: req.user.name,
      report: report.link,
      quotation: report.quotation,
    };

    await Admin.create({ emailData });

    res.status(200).json({ msg: "Email has been sent" });
  } catch (error) {
    console.log(error);
    console.log(error.response.body);
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
