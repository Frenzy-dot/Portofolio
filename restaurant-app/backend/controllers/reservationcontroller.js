const Reservation = require('../models/Reservation');

// @desc    Membuat reservasi baru
// @route   POST /api/reservasi
exports.createReservation = async (req, res) => {
    try {
        const { name, phone, pax, date, time, tableNumber } = req.body;
        
        // Validasi sederhana
        if (!name || !phone || !date || !time || !tableNumber) {
            return res.status(400).json({ message: "Semua field wajib diisi!" });
        }

        // Cek apakah meja sudah dipesan di tanggal & waktu yang sama
        const isBooked = await Reservation.findOne({ date, time, tableNumber });
        if (isBooked) {
            return res.status(400).json({ message: "Meja ini sudah dipesan pada waktu tersebut." });
        }

        const reservation = await Reservation.create(req.body);
        res.status(201).json({ message: "Reservasi berhasil!", data: reservation });
    } catch (error) {
        res.status(500).json({ message: "Terjadi kesalahan pada server", error: error.message });
    }
};

// @desc    Mengambil semua data reservasi
// @route   GET /api/reservasi
exports.getReservations = async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({ createdAt: -1 });
        res.status(200).json(reservations);
    } catch (error) {
        res.status(500).json({ message: "Gagal mengambil data" });
    }
};

// @desc    Menghapus reservasi
// @route   DELETE /api/reservasi/:id
exports.deleteReservation = async (req, res) => {
    try {
        await Reservation.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Reservasi berhasil dihapus" });
    } catch (error) {
        res.status(500).json({ message: "Gagal menghapus data" });
    }
};