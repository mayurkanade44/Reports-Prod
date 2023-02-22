import mongoose from "mongoose";

const AdminSchema = new mongoose.Schema({
  finding: { type: String },
  suggestion: { type: String },
  template: { type: Object },
  emailData: { type: Object },
});

export default mongoose.model("Admin", AdminSchema);
