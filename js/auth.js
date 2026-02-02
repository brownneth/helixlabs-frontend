document.addEventListener('DOMContentLoaded', () => {
    const signinForm = document.getElementById('form-signin');
    const signupForm = document.getElementById('form-signup');
    if (signinForm) {
        signinForm.querySelector('button').addEventListener('click', async (e) => {
            e.preventDefault();
            const btn = e.target.closest('button');
            const originalText = btn.innerHTML;
            const email = document.getElementById('signin-email').value;
            const password = document.getElementById('signin-password').value;

            if (!email || !password) {
                alert("Please fill in all fields.");
                return;
            }
            btn.disabled = true;
            btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Signing in...`;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password })
                });

                const data = await response.json();

                if (response.ok) {
                    localStorage.setItem('token', data.access_token);
                    localStorage.setItem('user', JSON.stringify(data.user));
                    window.location.href = 'analyze.html';
                } else {
                    alert(data.message || "Login failed");
                }
            } catch (error) {
                console.error("Login Error:", error);
                alert("Cannot connect to server. Check your internet or backend URL.");
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        });
    }

    if (signupForm) {
        signupForm.querySelector('button').addEventListener('click', async (e) => {
            e.preventDefault();
            const btn = e.target.closest('button');
            const originalText = btn.innerHTML;

            const firstname = document.getElementById('firstname').value;
            const lastname = document.getElementById('lastname').value;
            const email = document.getElementById('signup-email').value;
            const password = document.getElementById('signup-password').value;

            if (!email || !password || !firstname || !lastname) {
                alert("Please fill in all fields.");
                return;
            }

            btn.disabled = true;
            btn.innerHTML = `<span class="material-symbols-outlined animate-spin text-[20px]">progress_activity</span> Creating...`;

            try {
                const response = await fetch(`${API_BASE_URL}/auth/register`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, password, firstname, lastname })
                });

                const data = await response.json();

                if (response.ok) {
                    alert("Account created! Please sign in.");
                    location.reload(); 
                } else {
                    alert(data.message || "Registration failed");
                }
            } catch (error) {
                console.error("Signup Error:", error);
                alert("Cannot connect to server.");
            } finally {
                btn.disabled = false;
                btn.innerHTML = originalText;
            }
        });
    }
});