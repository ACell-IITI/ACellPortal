import mongoose from 'mongoose';

const upcomingEventSchema = new mongoose.Schema({
  image: { type: String, required: true },
  title: { type: String, required: true },
  date: { type: String, required: true },
  venue: { type: String, required: true }
}, { timestamps: true });

export default mongoose.model('UpcomingEvent', upcomingEventSchema);