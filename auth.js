// Authentication and Role-Based Access Control (RBAC)

// Role definitions
const ROLES = {
    ADMIN: 'Admin',
    OFFICER: 'Officer'
};

// Page access permissions
const PAGE_PERMISSIONS = {
    'dashboard.html': [ROLES.ADMIN, ROLES.OFFICER],
    'livemonitor.html': [ROLES.ADMIN, ROLES.OFFICER],
    'detectionlog.html': [ROLES.ADMIN, ROLES.OFFICER],
    'settings.html': [ROLES.ADMIN] // Only Admin can access
};

// Authentication Manager
const AuthManager = {
    // Set current user with role
    setUser: function(email, role) {
        const user = {
            email: email,
            role: role,
            loginTime: new Date().toISOString()
        };
        sessionStorage.setItem('currentUser', JSON.stringify(user));
        console.log('User logged in:', user);
    },

    // Get current user
    getUser: function() {
        const userStr = sessionStorage.getItem('currentUser');
        return userStr ? JSON.parse(userStr) : null;
    },

    // Check if user is logged in
    isAuthenticated: function() {
        return this.getUser() !== null;
    },

    // Get user role
    getUserRole: function() {
        const user = this.getUser();
        return user ? user.role : null;
    },

    // Check if user is Admin
    isAdmin: function() {
        return this.getUserRole() === ROLES.ADMIN;
    },

    // Check if user is Officer
    isOfficer: function() {
        return this.getUserRole() === ROLES.OFFICER;
    },

    // Logout user
    logout: function() {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'signin.html';
    },

    // Check if user has access to a page
    hasAccess: function(pageName) {
        const userRole = this.getUserRole();
        if (!userRole) return false;

        const allowedRoles = PAGE_PERMISSIONS[pageName];
        return allowedRoles && allowedRoles.includes(userRole);
    }
};

// Page Protection - Call this on every protected page
function protectPage() {
    const currentPage = window.location.pathname.split('/').pop();
    
    console.log('Protecting page:', currentPage);
    console.log('Current user:', AuthManager.getUser());

    // Check if user is authenticated
    if (!AuthManager.isAuthenticated()) {
        console.log('User not authenticated, redirecting to signin');
        window.location.href = 'signin.html';
        return false;
    }

    // Check if user has access to this page
    if (!AuthManager.hasAccess(currentPage)) {
        console.log('Access denied to', currentPage);
        alert('Access Denied!\n\nYou do not have permission to access this page.');
        window.location.href = 'dashboard.html';
        return false;
    }

    console.log('Access granted to', currentPage);
    return true;
}

// Render navigation based on role
function renderNavigationByRole() {
    const navMenu = document.querySelector('.nav-menu');
    if (!navMenu) return;

    const userRole = AuthManager.getUserRole();
    const currentPage = window.location.pathname.split('/').pop();

    // Define navigation items
    const navItems = [
        { page: 'dashboard.html', label: 'Dashboard', roles: [ROLES.ADMIN, ROLES.OFFICER] },
        { page: 'livemonitor.html', label: 'Live monitor', roles: [ROLES.ADMIN, ROLES.OFFICER] },
        { page: 'detectionlog.html', label: 'Detection Logs', roles: [ROLES.ADMIN, ROLES.OFFICER] },
        { page: 'settings.html', label: 'Settings', roles: [ROLES.ADMIN] }
    ];

    // Clear existing navigation
    navMenu.innerHTML = '';

    // Build navigation based on role
    navItems.forEach(item => {
        if (item.roles.includes(userRole)) {
            const link = document.createElement('a');
            link.href = item.page;
            link.className = 'nav-item';
            link.textContent = item.label;
            
            // Highlight active page
            if (item.page === currentPage) {
                link.classList.add('active');
            }

            navMenu.appendChild(link);
        }
    });

    console.log('Navigation rendered for role:', userRole);
}

// Update user info in profile dropdown
function updateUserProfile() {
    const user = AuthManager.getUser();
    if (!user) return;

    // Update profile info
    const profileInfoName = document.querySelector('.profile-info h3');
    const profileInfoEmail = document.querySelector('.profile-info p');

    if (profileInfoName) {
        profileInfoName.textContent = user.role + ' User';
    }
    if (profileInfoEmail) {
        profileInfoEmail.textContent = user.email;
    }

    // Add role badge
    const profileHeader = document.querySelector('.profile-header');
    if (profileHeader && !document.querySelector('.role-badge')) {
        const roleBadge = document.createElement('div');
        roleBadge.className = 'role-badge';
        roleBadge.textContent = user.role;
        roleBadge.style.cssText = 'position: absolute; top: 10px; right: 10px; background: ' + 
            (user.role === ROLES.ADMIN ? '#3d6b2c' : '#2d9cdb') + 
            '; color: white; padding: 4px 12px; border-radius: 12px; font-size: 0.75rem; font-weight: bold;';
        profileHeader.style.position = 'relative';
        profileHeader.appendChild(roleBadge);
    }
}

// Initialize RBAC on page load
function initializeRBAC() {
    console.log('Initializing RBAC...');
    
    // Protect the page
    if (!protectPage()) return;

    // Render navigation based on role
    renderNavigationByRole();

    // Update user profile
    updateUserProfile();

    console.log('RBAC initialized successfully');
}

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { AuthManager, ROLES, protectPage, initializeRBAC };
}