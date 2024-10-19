import mongoose, { Schema, Document } from 'mongoose';

interface ICompany extends Document {
  companyName: string;
  email: string;
  mobile: string;
  password: string;
  verified: boolean;
}

const companySchema: Schema = new mongoose.Schema({
  companyName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  verified: { type: Boolean, default: false },
});

export default mongoose.model<ICompany>('Company', companySchema);
