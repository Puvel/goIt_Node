const mongoose = require('mongoose');
const { Schema } = mongoose;
const paginate = require('mongoose-paginate-v2');

const contactSchema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  subscription: { type: String, required: true },
  password: { type: String, required: true },
  token: { type: String, required: false },
});

contactSchema.plugin(paginate);
contactSchema.statics.findContactByIdAndUpdate = findContactByIdAndUpdate;

async function findContactByIdAndUpdate(id, updateParams) {
  return this.findByIdAndUpdate(id, { $set: updateParams }, { new: true });
}

const contactModel = mongoose.model('Contact', contactSchema);

module.exports = contactModel;
