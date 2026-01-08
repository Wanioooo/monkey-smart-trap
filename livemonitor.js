// Initialize RBAC first
if (typeof initializeRBAC === 'function') {
    initializeRBAC();
}

// Cage data with locations
const cageData = {
    'A': { name: 'Cage A', location: 'Kuala Krai', count: 1 },
    'B': { name: 'Cage B', location: 'Gua Musang', count: 0 },
    'C': { name: 'Cage C', location: 'Jeli', count: 4 },
    'D': { name: 'Cage D', location: 'Tanah Merah', count: 1 },
    'E': { name: 'Cage E', location: 'Machang', count: 5 },
    'F': { name: 'Cage F', location: 'Pasir Mas', count: 2 }
};

// Check if a cage was selected from dashboard
let selectedCage = sessionStorage.getItem('selectedCage') || 'A';

// Set the cage selector to the selected cage
document.getElementById('cageSelect').value = selectedCage;

// Update cage information on page load
function updateCageInfo(cageId) {
    const cage = cageData[cageId];
    document.getElementById('currentCageName').textContent = cage.name;
    document.getElementById('currentCageLocation').textContent = `[${cage.location}]`;
    document.getElementById('todayCount').textContent = cage.count;
    
    // Update page title
    document.querySelector('.page-title').textContent = `Live Monitor View - ${cage.name}`;
}

// Initialize with selected cage
updateCageInfo(selectedCage);

// Clear the session storage after loading
sessionStorage.removeItem('selectedCage');

// Cage selector change event
document.getElementById('cageSelect').addEventListener('change', function() {
    const selectedCageId = this.value;
    updateCageInfo(selectedCageId);
    
    // Show notification
    alert(`Switched to ${cageData[selectedCageId].name} - ${cageData[selectedCageId].location}`);
});
const sidebarToggle = document.getElementById('sidebarToggle');
const sidebar = document.getElementById('sidebar');
const mainContent = document.getElementById('mainContent');

sidebarToggle.addEventListener('click', () => {
    sidebar.classList.toggle('active');
    mainContent.classList.toggle('shifted');
});

// Close sidebar when clicking outside
document.addEventListener('click', (e) => {
    if (!sidebar.contains(e.target) && 
        !sidebarToggle.contains(e.target) && 
        sidebar.classList.contains('active')) {
        sidebar.classList.remove('active');
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

// View Detection Image Function
function viewDetectionImage(time, event) {
    const modal = document.getElementById('detectionImageModal');
    const selectedCageId = document.getElementById('cageSelect').value;
    const cage = cageData[selectedCageId];
    
    document.getElementById('detectionModalTime').textContent = time;
    document.getElementById('detectionModalEvent').textContent = event;
    document.getElementById('detectionModalCage').textContent = cage.name + ' [' + cage.location + ']';
    
    modal.classList.add('active');
}

// Close detection image modal
document.getElementById('closeDetectionModal').addEventListener('click', () => {
    document.getElementById('detectionImageModal').classList.remove('active');
});

// Close modal when clicking outside
document.getElementById('detectionImageModal').addEventListener('click', (e) => {
    if (e.target.id === 'detectionImageModal') {
        document.getElementById('detectionImageModal').classList.remove('active');
    }
});

// Detection box animation
const detectionBox = document.getElementById('detectionBox');
let isDetecting = false;

function toggleDetection() {
    isDetecting = !isDetecting;
    if (isDetecting) {
        detectionBox.classList.add('active');
    } else {
        detectionBox.classList.remove('active');
    }
}

// Random detection simulation
setInterval(() => {
    const shouldDetect = Math.random() > 0.6;
    if (shouldDetect) {
        detectionBox.classList.add('active');
        setTimeout(() => {
            detectionBox.classList.remove('active');
        }, 5000);
    }
}, 15000);

// Fullscreen functionality
const fullscreenBtn = document.getElementById('fullscreenBtn');
const videoContainer = document.querySelector('.video-container');

fullscreenBtn.addEventListener('click', () => {
    if (!document.fullscreenElement) {
        videoContainer.requestFullscreen().catch(err => {
            alert(`Error attempting to enable fullscreen: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
});

// Auto-refresh simulation (every 30 seconds)
let detectionCount = 1;
const detectionTimes = ['10:23 AM', '10:30 AM', '10:45 AM'];
const detectionTexts = ['Monkey approaching', 'Monkey inside cage', 'Monkey passing by'];

function updateDetections() {
    // Update count
    detectionCount = Math.floor(Math.random() * 5) + 1;
    document.getElementById('todayCount').textContent = detectionCount;
    
    // Update last alert time
    const now = new Date();
    const timeString = now.toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
    });
    document.getElementById('lastAlert').textContent = timeString;
    
    // Add new detection to list
    const detectionsList = document.getElementById('detectionsList');
    const newDetection = document.createElement('div');
    newDetection.className = 'detection-item';
    
    const randomText = detectionTexts[Math.floor(Math.random() * detectionTexts.length)];
    
    newDetection.innerHTML = `
        <span class="detection-time">${timeString}</span>
        <span class="detection-text">${randomText}</span>
        <a href="#" class="view-link">[View Image]</a>
    `;
    
    detectionsList.insertBefore(newDetection, detectionsList.firstChild);
    
    // Keep only last 5 detections
    if (detectionsList.children.length > 5) {
        detectionsList.removeChild(detectionsList.lastChild);
    }
    
    // Show detection box animation
    detectionBox.classList.add('active');
    setTimeout(() => {
        detectionBox.classList.remove('active');
    }, 3000);
    
    console.log(`[${timeString}] Detection updated - Count: ${detectionCount}`);
}

// Auto-refresh every 30 seconds
setInterval(updateDetections, 30000);

// Initial log
console.log('Live Monitor initialized - Auto-refresh every 30 seconds');