import mongoose from 'mongoose';

const eventProgramSchema = new mongoose.Schema({
  type: { type: String, enum: ['program', 'event'], required: true },
  image: { type: String, required: true },   
  title: { type: String, required: true },
  date: { type: String, required: true },
  time: { type: String },
  venue: { type: String, required: true },
  about: {type:String},
  attendance: {type:Number}
}, { timestamps: true });

export default mongoose.model('EventProgram', eventProgramSchema);
