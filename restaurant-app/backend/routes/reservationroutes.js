const express = require('express');
const router = express.Router();
const { createReservation, getReservations, deleteReservation } = require('../controllers/reservationController');

router.post('/', createReservation);
router.get('/', getReservations);
router.delete('/:id', deleteReservation);

// Endpoint Auth Admin sederhana
router.post('/admin/login', (req, res) => {
    const { username, password } = req.body;
    if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        res.status(200).json({ success: true, token: "premium_admin_token_123" });
    } else {
        res.status(401).json({ success: false, message: "Kredensial salah" });
    }
});

module.exports = router;