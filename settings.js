// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('Settings page loaded');

    // Initialize RBAC first - CRITICAL for Settings page
    if (typeof initializeRBAC === 'function') {
        const rbacResult = initializeRBAC();
        console.log('RBAC initialization result:', rbacResult);
        if (rbacResult === false) {
            // If RBAC fails, stop execution
            console.log('RBAC failed, stopping settings initialization');
            return;
        }
    }

    // Small delay to ensure DOM is fully ready
    setTimeout(function() {
        initializeSettings();
    }, 100);
});

function initializeSettings() {
    console.log('Initializing settings functionality...');

    // Sidebar toggle
    const sidebarToggle = document.getElementById('sidebarToggle');
    const sidebar = document.getElementById('sidebar');
    const mainContent = document.getElementById('mainContent');

    if (sidebarToggle && sidebar && mainContent) {
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
    }

    // Notification & Profile dropdowns
    const notificationBtn = document.getElementById('notificationBtn');
    const notificationDropdown = document.getElementById('notificationDropdown');
    const profileBtn = document.getElementById('profileBtn');
    const profileDropdown = document.getElementById('profileDropdown');

    if (notificationBtn && notificationDropdown) {
        notificationBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            notificationDropdown.classList.toggle('active');
            if (profileDropdown) profileDropdown.classList.remove('active');
        });
    }

    if (profileBtn && profileDropdown) {
        profileBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            profileDropdown.classList.toggle('active');
            if (notificationDropdown) notificationDropdown.classList.remove('active');
        });
    }

    document.addEventListener('click', (e) => {
        if (notificationDropdown && notificationBtn && !notificationDropdown.contains(e.target) && !notificationBtn.contains(e.target)) {
            notificationDropdown.classList.remove('active');
        }
        if (profileDropdown && profileBtn && !profileDropdown.contains(e.target) && !profileBtn.contains(e.target)) {
            profileDropdown.classList.remove('active');
        }
    });

    const markReadBtn = document.querySelector('.mark-read');
    if (markReadBtn) {
        markReadBtn.addEventListener('click', () => {
            document.querySelectorAll('.notification-item.unread').forEach(item => {
                item.classList.remove('unread');
            });
            const badge = document.querySelector('.notification-badge');
            if (badge) badge.textContent = '0';
        });
    }

    document.querySelectorAll('.profile-menu-item').forEach(item => {
        item.addEventListener('click', (e) => {
            if (item.classList.contains('logout')) {
                e.preventDefault();
                if (confirm('Are you sure you want to log out?')) {
                    if (typeof AuthManager !== 'undefined' && AuthManager.logout) {
                        AuthManager.logout();
                    } else {
                        window.location.href = 'signin.html';
                    }
                }
            }
        });
    });

    // Tab switching
    const tabButtons = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');

    console.log('Tab buttons found:', tabButtons.length);

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            const targetTab = button.dataset.tab;
            console.log('Tab clicked:', targetTab);
            
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            button.classList.add('active');
            const targetContent = document.getElementById(targetTab + 'Tab');
            if (targetContent) {
                targetContent.classList.add('active');
                console.log('Tab activated:', targetTab);
            }
        });
    });

    // Sensitivity Slider
    const sensitivitySlider = document.getElementById('sensitivitySlider');
    const sensitivityValue = document.getElementById('sensitivityValue');

    if (sensitivitySlider && sensitivityValue) {
        sensitivitySlider.addEventListener('input', (e) => {
            const value = e.target.value / 100;
            sensitivityValue.textContent = value.toFixed(1);
        });
    }

    // Save Settings
    const saveSettingsBtn = document.getElementById('saveSettingsBtn');
    if (saveSettingsBtn) {
        saveSettingsBtn.addEventListener('click', () => {
            const sensitivity = sensitivitySlider ? sensitivitySlider.value / 100 : 0.8;
            const refreshRate = document.getElementById('refreshRate');
            const rate = refreshRate ? refreshRate.value : 'continuous';
            
            alert('Settings Saved!\n\nDetection Sensitivity: ' + sensitivity + '\nCamera Refresh Rate: ' + rate);
        });
    }

    // Add User Modal
    const addUserBtn = document.getElementById('addUserBtn');
    const addUserModal = document.getElementById('addUserModal');
    const cancelAddUser = document.getElementById('cancelAddUser');
    const addUserForm = document.getElementById('addUserForm');

    console.log('Add user button:', addUserBtn);
    console.log('Add user modal:', addUserModal);

    if (addUserBtn && addUserModal) {
        addUserBtn.addEventListener('click', (e) => {
            e.preventDefault();
            console.log('Add user button clicked');
            addUserModal.classList.add('active');
        });
    }

    if (cancelAddUser && addUserModal) {
        cancelAddUser.addEventListener('click', () => {
            addUserModal.classList.remove('active');
            if (addUserForm) addUserForm.reset();
        });
    }

    if (addUserModal) {
        addUserModal.addEventListener('click', (e) => {
            if (e.target === addUserModal) {
                addUserModal.classList.remove('active');
                if (addUserForm) addUserForm.reset();
            }
        });
    }

    if (addUserForm) {
        addUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Add user form submitted');
            
            const username = document.getElementById('newUsername').value;
            const role = document.getElementById('newRole').value;
            
            const tableBody = document.getElementById('usersTableBody');
            if (tableBody) {
                const newRow = document.createElement('tr');
                newRow.innerHTML = '<td>' + username + '</td><td>' + role + '</td><td>Just now</td><td class="actions-cell"><button class="action-btn edit-btn">✏️</button><button class="action-btn delete-btn">🗑️</button></td>';
                
                tableBody.appendChild(newRow);
                addActionListeners(newRow);
                
                addUserModal.classList.remove('active');
                addUserForm.reset();
                
                alert('User "' + username + '" has been added successfully!');
            }
        });
    }

    // Edit User Modal
    const editUserModal = document.getElementById('editUserModal');
    const cancelEditUser = document.getElementById('cancelEditUser');
    const editUserForm = document.getElementById('editUserForm');
    let currentEditRow = null;

    console.log('Edit modal element:', editUserModal);
    console.log('Cancel edit button:', cancelEditUser);

    if (cancelEditUser && editUserModal) {
        cancelEditUser.addEventListener('click', () => {
            console.log('Cancel edit clicked');
            editUserModal.classList.remove('active');
            if (editUserForm) editUserForm.reset();
        });
    }

    if (editUserModal) {
        editUserModal.addEventListener('click', (e) => {
            if (e.target === editUserModal) {
                console.log('Clicked outside edit modal');
                editUserModal.classList.remove('active');
                if (editUserForm) editUserForm.reset();
            }
        });
    }

    if (editUserForm) {
        editUserForm.addEventListener('submit', (e) => {
            e.preventDefault();
            console.log('Edit form submitted');
            
            const username = document.getElementById('editUsername').value;
            const role = document.getElementById('editRole').value;
            const password = document.getElementById('editPassword').value;
            
            if (currentEditRow) {
                currentEditRow.cells[0].textContent = username;
                currentEditRow.cells[1].textContent = role;
                currentEditRow.cells[2].textContent = 'Just now';
            }
            
            let message = 'User "' + username + '" has been updated successfully!\n\nRole: ' + role;
            if (password) {
                message += '\nPassword: Updated';
            }
            
            alert(message);
            editUserModal.classList.remove('active');
            editUserForm.reset();
            currentEditRow = null;
        });
    }

    // Add action listeners function
    function addActionListeners(row) {
        const editBtn = row.querySelector('.edit-btn');
        const deleteBtn = row.querySelector('.delete-btn');
        
        console.log('Adding listeners to row:', row);
        
        if (editBtn) {
            editBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Edit button clicked!');
                
                currentEditRow = row;
                const username = row.cells[0].textContent;
                const role = row.cells[1].textContent;
                
                console.log('Editing user:', username, 'Role:', role);
                
                const usernameInput = document.getElementById('editUsername');
                const roleSelect = document.getElementById('editRole');
                const passwordInput = document.getElementById('editPassword');
                
                if (usernameInput) usernameInput.value = username;
                if (roleSelect) roleSelect.value = role;
                if (passwordInput) passwordInput.value = '';
                
                const modal = document.getElementById('editUserModal');
                if (modal) {
                    modal.classList.add('active');
                    console.log('Edit modal opened');
                } else {
                    console.error('Edit modal not found!');
                }
            };
        }
        
        if (deleteBtn) {
            deleteBtn.onclick = function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                console.log('Delete button clicked!');
                
                const username = row.cells[0].textContent;
                if (confirm('Are you sure you want to delete user "' + username + '"?')) {
                    row.remove();
                    alert('User "' + username + '" has been deleted.');
                }
            };
        }
    }

    // Initialize existing rows
    console.log('Initializing existing user rows...');
    const existingRows = document.querySelectorAll('#usersTableBody tr');
    console.log('Found ' + existingRows.length + ' existing rows');
    
    existingRows.forEach((row, index) => {
        console.log('Adding listeners to row ' + (index + 1));
        addActionListeners(row);
    });

    console.log('Settings page initialization complete');
}