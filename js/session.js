const token = localStorage.getItem('token');
const user = JSON.parse(localStorage.getItem('user') || '{}');

if (!token) {
    window.location.href = 'auth.html';
}
document.addEventListener('DOMContentLoaded', () => {
    const profileAvatar = document.querySelector('.rounded-full.bg-cover');
    if (profileAvatar && user.firstname) {
        profileAvatar.setAttribute('title', `Logged in as ${user.firstname} ${user.lastname}`);
    }
    if (profileAvatar) {
        profileAvatar.addEventListener('click', () => {
            if(confirm("Log out?")) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.location.href = 'index.html';
            }
        });
    }
});