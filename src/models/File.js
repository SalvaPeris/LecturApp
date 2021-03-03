const mongoose = require('mongoose');
const { Schema } = mongoose;

const FileSchema = new Schema({
    name: { type: String, required: true },
    route: { type: String, required: true },
    date: { type: Date, default: Date.now },
    user: { type: String }
});

module.exports = mongoose.model('File', FileSchema);