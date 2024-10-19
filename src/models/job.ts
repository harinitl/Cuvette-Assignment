import mongoose, { Schema, Document } from 'mongoose';

interface IJob extends Document {
  title: string;
  description: string;
  experienceLevel: string;
  endDate: Date;
  company: mongoose.Schema.Types.ObjectId;
}

const jobSchema: Schema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  experienceLevel: { type: String, required: true },
  endDate: { type: String, required: true },
  company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
});

export default mongoose.model<IJob>('Job', jobSchema);
