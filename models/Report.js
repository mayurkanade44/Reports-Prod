import mongoose from "mongoose";

const ReportSchema = new mongoose.Schema(
  {
    reportName: { type: String, required: true },
    templateType: { type: String, required: true },
    reportType: { type: String, required: true },
    meetDetails: { type: Object, required: true },
    shownDetails: { type: Object, required: true },
    inspectionBy: { type: String, required: true },
    inspectionDate: { type: String, required: true },
    contract: { type: Object, required: true },
    details: [],
    link: { type: String },
    quotation: { type: String },
    approved: { type: Boolean, default: false },
    email: { type: Boolean, default: false }, //for checking email sent
    emailList: [String],
  },
  { timestamps: true }
);

export default mongoose.model("Report", ReportSchema);
