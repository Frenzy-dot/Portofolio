const loginSection = document.getElementById('loginSection');
const dashboardSection = document.getElementById('dashboardSection');
const logoutBtn = document.getElementById('logoutBtn');
const tableBody = document.getElementById('tableBody');

// Cek apakah sudah login (sederhana menggunakan localStorage)
if (localStorage.getItem('adminToken')) {
    showDashboard();
}

// Handle Login
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    const u = document.getElementById('username').value;
    const p = document.getElementById('password').value;

    try {
        const response = await fetch('http://localhost:5000/api/reservasi/admin/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: u, password: p })
        });
        
        const data = await response.json();
        if (data.success) {
            localStorage.setItem('adminToken', data.token);
            showToast("Login Berhasil!");
            showDashboard();
        } else {
            showToast("Username atau Password salah!", true);
        }
    } catch (error) {
        showToast("Gagal terhubung ke server", true);
    }
});

// Handle Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('adminToken');
    loginSection.classList.remove('hidden');
    dashboardSection.classList.add('hidden');
    logoutBtn.classList.add('hidden');
    document.getElementById('loginForm').reset();
});

function showDashboard() {
    loginSection.classList.add('hidden');
    dashboardSection.classList.remove('hidden');
    logoutBtn.classList.remove('hidden');
    fetchReservations();
}

// Ambil data reservasi dari database
async function fetchReservations() {
    try {
        const response = await fetch('http://localhost:5000/api/reservasi');
        const data = await response.json();
        
        tableBody.innerHTML = '';
        data.forEach(res => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${res.date}</td>
                <td>${res.time}</td>
                <td>${res.name}</td>
                <td>${res.phone}</td>
                <td>${res.pax} Orang</td>
                <td>Meja ${res.tableNumber}</td>
                <td><button class="btn-danger" onclick="deleteReservation('${res._id}')">Hapus</button></td>
            `;
            tableBody.appendChild(row);
        });
    } catch (error) {
        showToast("Gagal mengambil data reservasi", true);
    }
}

// Hapus Reservasi
async function deleteReservation(id) {
    if(!confirm("Yakin ingin membatalkan/menghapus reservasi ini?")) return;

    try {
        const response = await fetch(`http://localhost:5000/api/reservasi/${id}`, {
            method: 'DELETE'
        });
        if (response.ok) {
            showToast("Reservasi berhasil dihapus!");
            fetchReservations(); // Refresh tabel
        }
    } catch (error) {
        showToast("Gagal menghapus reservasi", true);
    }
}