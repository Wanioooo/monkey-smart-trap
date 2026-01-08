// Initialize RBAC first
if (typeof initializeRBAC === 'function') {
    initializeRBAC();
}

// Cage data
const cagesData = [
    {
        id: 'A',
        location: 'Kuala Krai',
        image: 'images/monkey_trap2.jpg',
        detected: true,
        count: 1
    },
    {
        id: 'B',
        location: 'Gua Musang',
        image: 'images/monkeyB.png',
        detected: false,
        count: 0
    },
    {
        id: 'C',
        location: 'Jeli',
        image: 'images/monkeyC.png',
        detected: true,
        count: 4
    },
    {
        id: 'D',
        location: 'Tanah Merah',
        image: 'images/monkey_trap1.jpg',
        detected: true,
        count: 1
    },
    {
        id: 'E',
        location: 'Machang',
        image: 'images/monkeyE.png',
        detected: true,
        count: 5
    },
    {
        id: 'F',
        location: 'Pasir Mas',
        image: 'images/monkeys.webp',
        detected: true,
        count: 2
    }
];

// Sidebar toggle functionality
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    sidebarToggle.classList.toggle('active');
    mainContent.classList.toggle('shifted');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && 
        !sidebarToggle.contains(e.target) && 
        sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
        sidebarToggle.classList.remove('active');
        mainContent.classList.remove('shifted');
    }
});

// Notification dropdown
const notificationBtn = document.getElementById('notificationBtn');
const notificationDropdown = document.getElementById('notificationDropdown');

notificationBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    notificationDropdown.classList.toggle('active');
    profileDropdown.classList.remove('active');
});

// Profile dropdown
const profileBtn = document.getElementById('profileBtn');
const profileDropdown = document.getElementById('profileDropdown');

profileBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    profileDropdown.classList.toggle('active');
    notificationDropdown.classList.remove('active');
});

// Close dropdowns when clicking outside
document.addEventListener('click', (e) => {
    if (!notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
        notificationDropdown.classList.remove('active');
    }
    if (!profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
        profileDropdown.classList.remove('active');
    }
});

// Mark all as read
document.querySelector('.mark-read').addEventListener('click', () => {
    document.querySelectorAll('.notification-item.unread').forEach(item => {
        item.classList.remove('unread');
    });
    document.querySelector('.notification-badge').textContent = '0';
});

// Profile menu actions
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

// Navigation functionality
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', (e) => {
        // Allow default link behavior for navigation
    });
});

// Function to navigate to live monitor for specific cage
function viewCageLive(cageId) {
    sessionStorage.setItem('selectedCage', cageId);
    window.location.href = 'livemonitor.html';
}

// Render cages function
function renderCages() {
    const cagesGrid = document.getElementById('cagesGrid');
    
    if (!cagesGrid) {
        console.error('Cages grid element not found');
        return;
    }
    
    cagesGrid.innerHTML = cagesData.map(cage => {
        return '<div class="cage-card ' + (cage.detected ? 'detected' : 'no-detection') + '" onclick="viewCageLive(\'' + cage.id + '\')">' +
            '<div class="cage-header">' +
                'Cage ' + cage.id + ' ' +
                '<span class="cage-location">[' + cage.location + ']</span>' +
            '</div>' +
            '<img src="' + cage.image + '" alt="Cage ' + cage.id + '" class="cage-image">' +
            '<div class="cage-status">' +
                '<div>' +
                    '<div class="status-label">Monkey Detection :</div>' +
                    '<div class="status-indicator ' + (cage.detected ? 'yes' : 'no') + '">' +
                        (cage.detected ? 'Yes' : 'No') +
                    '</div>' +
                '</div>' +
                '<div style="text-align: right;">' +
                    '<div class="status-label">Count :</div>' +
                    '<div class="count-value">' + cage.count + '</div>' +
                '</div>' +
            '</div>' +
            '<div class="view-live-badge">' +
                '👁️ Click to view live' +
            '</div>' +
        '</div>';
    }).join('');
}

// Initialize the dashboard
renderCages();

// Auto-refresh simulation
setInterval(() => {
    const randomCage = Math.floor(Math.random() * cagesData.length);
    cagesData[randomCage].count = Math.floor(Math.random() * 6);
    cagesData[randomCage].detected = cagesData[randomCage].count > 0;
    
    const totalMonkeys = cagesData.reduce((sum, cage) => sum + cage.count, 0);
    const monkeysElement = document.querySelector('.status-value.monkeys');
    if (monkeysElement) {
        monkeysElement.textContent = totalMonkeys;
    }
    
    renderCages();
}, 30000);