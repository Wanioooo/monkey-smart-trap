// Initialize RBAC first
if (typeof initializeRBAC === 'function') {
    initializeRBAC();
}

// Sample detection data
const allDetections = [
    { time: '10:23', cage: 'B', count: 1, status: 'sent', date: '2024-12-29' },
    { time: '10:45', cage: 'A', count: 1, status: 'sent', date: '2024-12-29' },
    { time: '13:50', cage: 'C', count: 4, status: 'sent', date: '2024-12-29' },
    { time: '14:15', cage: 'D', count: 1, status: 'sent', date: '2024-12-29' },
    { time: '15:30', cage: 'E', count: 5, status: 'sent', date: '2024-12-29' },
    { time: '16:45', cage: 'F', count: 2, status: 'sent', date: '2024-12-28' },
    { time: '09:20', cage: 'A', count: 3, status: 'sent', date: '2024-12-28' },
    { time: '11:30', cage: 'C', count: 2, status: 'sent', date: '2024-12-28' },
    { time: '13:15', cage: 'B', count: 1, status: 'sent', date: '2024-12-27' },
    { time: '14:50', cage: 'D', count: 4, status: 'sent', date: '2024-12-27' },
    { time: '08:30', cage: 'E', count: 3, status: 'sent', date: '2024-12-27' },
    { time: '10:15', cage: 'F', count: 1, status: 'sent', date: '2024-12-26' },
    { time: '12:45', cage: 'A', count: 2, status: 'sent', date: '2024-12-26' },
    { time: '15:20', cage: 'B', count: 1, status: 'sent', date: '2024-12-26' },
    { time: '16:30', cage: 'C', count: 5, status: 'sent', date: '2024-12-25' },
];

let currentPage = 1;
const itemsPerPage = 5;
let filteredData = [...allDetections];

// Sidebar toggle
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('shifted');
});

document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && !sidebarToggle.contains(e.target) && sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        mainContent.classList.remove('shifted');
    }
});

// Notification & Profile dropdowns
const notificationBtn = document.getElementById('notificationBtn');
const notificationDropdown = document.getElementById('notificationDropdown');
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle('active');
    profileDropdown.classList.remove('active');
});

profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
    notificationDropdown.classList.remove('active');
});

document.addEventListener('click', (e) => {
    if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationDropdown.classList.remove('active');
    }
    if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
        profileDropdown.classList.remove('active');
    }
});

document.querySelector('.mark-read').addEventListener('click', () => {
    document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    document.querySelector('.notification-badge').textContent = '0';
});

document.querySelectorAll('.profile-menu-item').forEach(item => {
    item.addEventListener('click', (e) => {
        if (item.classList.contains('logout')) {
            e.preventDefault();
            if (confirm('Are you sure you want to log out?')) {
                window.location.href = 'signin.html';
            }
        }
    });
});

// Date Range Modal
const dateRangeBtn = document.getElementById('dateRangeBtn');
const dateModal = document.getElementById('dateModal');
const cancelDateBtn = document.getElementById('cancelDateBtn');
const applyDateBtn = document.getElementById('applyDateBtn');

dateRangeBtn.addEventListener('click', () => {
    dateModal.classList.add('active');
});

cancelDateBtn.addEventListener('click', () => {
    dateModal.classList.remove('active');
});

applyDateBtn.addEventListener('click', () => {
    const fromDate = document.getElementById('dateFrom').value;
    const toDate = document.getElementById('dateTo').value;
    
    if (fromDate && toDate) {
        filteredData = allDetections.filter(item => {
            return item.date >= fromDate && item.date <= toDate;
        });
        currentPage = 1;
        renderTable();
        renderPagination();
    }
    
    dateModal.classList.remove('active');
});

dateModal.addEventListener('click', (e) => {
    if (e.target === dateModal) {
        dateModal.classList.remove('active');
    }
});

// Cage Filter
const cageFilter = document.getElementById('cageFilter');
cageFilter.addEventListener('change', () => {
    const selectedCage = cageFilter.value;
    
    if (selectedCage === 'all') {
        filteredData = [...allDetections];
    } else {
        filteredData = allDetections.filter(item => item.cage === selectedCage);
    }
    
    currentPage = 1;
    renderTable();
    renderPagination();
});

// Export functions
document.querySelector('.pdf-btn').addEventListener('click', () => {
    exportToPDF();
});

document.querySelector('.csv-btn').addEventListener('click', () => {
    exportToCSV();
});

// Export to PDF function
function exportToPDF() {
    let pdfContent = 'MONKEY SMARTTRAP - DETECTION HISTORY LOG\n';
    pdfContent += '=' .repeat(60) + '\n\n';
    pdfContent += `Generated on: ${new Date().toLocaleString()}\n\n`;
    pdfContent += '-'.repeat(60) + '\n';
    pdfContent += 'Time\t\tCage\t\tCount\t\tStatus\n';
    pdfContent += '-'.repeat(60) + '\n';
    
    filteredData.forEach(item => {
        pdfContent += `${item.time}\t\tCage ${item.cage}\t\t${item.count}\t\t${item.status}\n`;
    });
    
    pdfContent += '-'.repeat(60) + '\n';
    pdfContent += `\nTotal Records: ${filteredData.length}\n`;
    pdfContent += `Total Monkeys Detected: ${filteredData.reduce((sum, item) => sum + item.count, 0)}\n`;
    
    // Create a blob and download
    const blob = new Blob([pdfContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MonkeyDetection_Log_${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('Detection log exported successfully!\n\nNote: This is a text file. For production, use a proper PDF library like jsPDF.');
}

// Export to CSV function
function exportToCSV() {
    let csvContent = 'Date,Time,Cage,Count,Alert Status\n';
    
    filteredData.forEach(item => {
        csvContent += `${item.date},${item.time},Cage ${item.cage},${item.count},${item.status}\n`;
    });
    
    // Create a blob and download
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `MonkeyDetection_Log_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
    
    alert('CSV file exported successfully!\n\nYou can open it in Excel or Google Sheets.');
}

// Render table
function renderTable() {
    const tableBody = document.getElementById('tableBody');
    const start = (currentPage - 1) * itemsPerPage;
    const end = start + itemsPerPage;
    const pageData = filteredData.slice(start, end);
    
    // Sample images for cages
    const cageImages = {
        'A': 'images/monkey_trap2.jpg',
        'B': 'images/monkeyF.png',
        'C': 'images/monkeyC.png',
        'D': 'images/monkey_trap1.jpg',
        'E': 'images/monkeyE.png',
        'F': 'images/monkeys.webp'
    };
    
    tableBody.innerHTML = pageData.map((item, index) => `
        <tr>
            <td>${item.time}</td>
            <td>Cage ${item.cage}</td>
            <td>${item.count}</td>
            <td>${item.status}</td>
            <td><a href="#" class="view-link" onclick="viewImage('${item.cage}', '${item.time}', ${item.count}, '${item.status}', '${cageImages[item.cage]}'); return false;">{ view }</a></td>
        </tr>
    `).join('');
}

// View Image Function
function viewImage(cage, time, count, status, imageUrl) {
    const modal = document.getElementById('imageModal');
    document.getElementById('modalImage').src = imageUrl;
    document.getElementById('modalCage').textContent = `Cage ${cage}`;
    document.getElementById('modalTime').textContent = time;
    document.getElementById('modalCount').textContent = count;
    document.getElementById('modalStatus').textContent = status;
    modal.classList.add('active');
}

// Close image modal
document.getElementById('closeImageModal').addEventListener('click', () => {
    document.getElementById('imageModal').classList.remove('active');
});

// Close modal when clicking outside
document.getElementById('imageModal').addEventListener('click', (e) => {
    if (e.target.id === 'imageModal') {
        document.getElementById('imageModal').classList.remove('active');
    }
});

// Render pagination
function renderPagination() {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const pageNumbers = document.getElementById('pageNumbers');
    
    pageNumbers.innerHTML = '';
    
    for (let i = 1; i <= totalPages; i++) {
        const btn = document.createElement('button');
        btn.className = 'page-number';
        btn.textContent = i;
        if (i === currentPage) {
            btn.classList.add('active');
        }
        btn.addEventListener('click', () => {
            currentPage = i;
            renderTable();
            renderPagination();
        });
        pageNumbers.appendChild(btn);
    }
    
    // Update prev/next buttons
    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = currentPage === totalPages;
}

// Pagination buttons
document.getElementById('prevBtn').addEventListener('click', () => {
    if (currentPage > 1) {
        currentPage--;
        renderTable();
        renderPagination();
    }
});

document.getElementById('nextBtn').addEventListener('click', () => {
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        renderTable();
        renderPagination();
    }
});

// Initialize
renderTable();
renderPagination();