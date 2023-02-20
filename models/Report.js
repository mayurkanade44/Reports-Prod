import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    reportName: { type: String, required: true },
    templateType: { type: String, required: true },
    reportType: { type: String, required: true },
    meetTo: { type: String, required: true },
    shownTo: { type: String, required: true },
    inspectionBy: { type: String, required: true },
    inspectionDate: { type: String, required: true },
    details: [],
    link: { type: String },
    approved: { type: Boolean, default: false },
    email: { type: Boolean, default: false },
    emailList: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Report", ReportSchema);
