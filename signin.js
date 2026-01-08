// Demo users with roles
const DEMO_USERS = {
    'admin@example.com': { password: '12345', role: 'Admin' },
    'officer@example.com': { password: '12345', role: 'Officer' },
    'admin': { password: 'admin', role: 'Admin' },
    'officer': { password: 'officer', role: 'Officer' }
};

// Sign in form handling
document.getElementById('signinForm').addEventListener('submit', function(event) {
    event.preventDefault();
    
    const email = document.getElementById('email').value.toLowerCase().trim();
    const password = document.getElementById('password').value;
    
    console.log('Login attempt:', email);
    
    // Check against demo users
    if (DEMO_USERS[email] && DEMO_USERS[email].password === password) {
        const user = DEMO_USERS[email];
        
        // Set user session with role
        const userSession = {
            email: email,
            role: user.role,
            loginTime: new Date().toISOString()
        };
        sessionStorage.setItem('currentUser', JSON.stringify(userSession));
        
        console.log('Login successful:', userSession);
        
        alert('Login successful!\n\nWelcome ' + user.role + '!\n\nRedirecting to dashboard...');
        window.location.href = 'dashboard.html';
    } else {
        alert('Invalid email or password!\n\nDemo Accounts:\n\nAdmin:\n- Email: admin@example.com\n- Password: 12345\n\nOfficer:\n- Email: officer@example.com\n- Password: 12345');
    }
});

// Forgot Password Modal
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const forgotPasswordModal = document.getElementById('forgotPasswordModal');
const closeForgotPassword = document.getElementById('closeForgotPassword');

forgotPasswordLink.addEventListener('click', function(e) {
    e.preventDefault();
    forgotPasswordModal.classList.add('active');
});

closeForgotPassword.addEventListener('click', function() {
    forgotPasswordModal.classList.remove('active');
});

// Forgot Password Form
document.getElementById('forgotPasswordForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('resetEmail').value;
    alert(`Password reset link has been sent to ${email}!\n\nPlease check your email inbox.`);
    forgotPasswordModal.classList.remove('active');
    document.getElementById('forgotPasswordForm').reset();
});

// Sign Up Modal
const signupLink = document.getElementById('signupLink');
const signupModal = document.getElementById('signupModal');
const closeSignup = document.getElementById('closeSignup');
const backToSignin = document.getElementById('backToSignin');

signupLink.addEventListener('click', function(e) {
    e.preventDefault();
    signupModal.classList.add('active');
});

closeSignup.addEventListener('click', function() {
    signupModal.classList.remove('active');
});

backToSignin.addEventListener('click', function(e) {
    e.preventDefault();
    signupModal.classList.remove('active');
});

// Sign Up Form
document.getElementById('signupForm').addEventListener('submit', function(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirmPassword = document.getElementById('signupConfirmPassword').value;
    
    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }
    
    if (password.length < 6) {
        alert('Password must be at least 6 characters long!');
        return;
    }
    
    alert(`Account created successfully for ${name}!\n\nEmail: ${email}\n\nYou can now sign in with your credentials.`);
    signupModal.classList.remove('active');
    document.getElementById('signupForm').reset();
});

// Close modals when clicking outside
forgotPasswordModal.addEventListener('click', function(e) {
    if (e.target === forgotPasswordModal) {
        forgotPasswordModal.classList.remove('active');
    }
});

signupModal.addEventListener('click', function(e) {
    if (e.target === signupModal) {
        signupModal.classList.remove('active');
    }
});