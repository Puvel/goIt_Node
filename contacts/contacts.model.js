const mongoose = require('mongoose');
const { Schema } = mongoose;
const paginate = require('mongoose-paginate-v2');

const contactSchema = new Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  subscription: {
    type: String,
    enum: ['free', 'pro', 'premium'],
    default: 'free',
    required: true,
  },
  password: { type: String, required: true },
  token: { type: String },
});

contactSchema.plugin(paginate);
contactSchema.statics.findContactByEmail = findContactByEmail;
contactSchema.statics.updateToken = updateToken;
contactSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;

async function findContactByIdAndUpdate(id, updateParams) {
  return this.findByIdAndUpdate(id, { $set: updateParams }, { new: true });
}

async function findContactByEmail(email) {
  return this.findOne({ email });
}

async function updateToken(id, newToken) {
  return this.findByIdAndUpdate(id, {
    token: newToken,
  });
}

const contactModel = mongoose.model('Contact', contactSchema);

module.exports = contactModel;
