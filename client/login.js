document.getElementById('login-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const credential = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (!credential ||!password) {
        alert("All fields are required!");
        return;
    }
    try {
        const apiUrl = "http://localhost:3000/auth/login";
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                credential: credential,
                password: password
            })
        });

        if (!response.ok) {
            alert("Invalid username or password")
            return
        }

        const data = await response.json();

        // Assuming you want to store the token in localStorage for authentication
        localStorage.setItem('token', data.token);

        // Redirect to the home page or perform any other actions upon successful login
        window.location.href = "home.html";
    } catch (error) {
        alert('Error: ' + error.message);
    }

    // Reset the form after submission
    document.getElementById('login-form').reset();

});
