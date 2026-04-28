let selectedTable = null;
const tableGrid = document.getElementById('tableGrid');

// Render Visual Tables
for (let i = 1; i <= 6; i++) {
    const tableDiv = document.createElement('div');
    tableDiv.className = 'table-box';
    tableDiv.innerHTML = `Meja ${i}<br><small>Kapasitas: 4</small>`;
    tableDiv.onclick = () => selectTable(i, tableDiv);
    tableGrid.appendChild(tableDiv);
}

function selectTable(tableNum, element) {
    selectedTable = tableNum;
    document.querySelectorAll('.table-box').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

// Handle Form Submit
document.getElementById('reservationForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    if (!selectedTable) {
        showToast("Silakan pilih meja terlebih dahulu!", true);
        return;
    }

    const btn = document.getElementById('submitBtn');
    btn.textContent = "Memproses...";
    btn.disabled = true;

    const formData = {
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        pax: document.getElementById('pax').value,
        date: document.getElementById('date').value,
        time: document.getElementById('time').value,
        tableNumber: selectedTable
    };

    try {
        const response = await fetch('http://localhost:5000/api/reservasi', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formData)
        });
        const result = await response.json();

        if (response.ok) {
            showToast("Reservasi Berhasil! Sampai jumpa di Elegance.");
            document.getElementById('reservationForm').reset();
            document.querySelectorAll('.table-box').forEach(el => el.classList.remove('selected'));
            selectedTable = null;
        } else {
            showToast(result.message, true);
        }
    } catch (error) {
        showToast("Gagal terhubung ke server.", true);
    } finally {
        btn.textContent = "Konfirmasi Reservasi";
        btn.disabled = false;
    }
});