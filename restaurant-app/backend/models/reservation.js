const mongoose = require('mongoose');

const reservationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    pax: { type: Number, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    tableNumber: { type: Number, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Reservation', reservationSchema);