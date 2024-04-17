document.getElementById('signup-form').addEventListener('submit', function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const email = document.getElementById('email').value;
    const contact = document.getElementById('contact').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm_password').value;

    // Validate password matching
    if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
    }

    // Still to add more validation logic here for all input data....

    window.location.href = "home.html";

    document.getElementById('signup-form').reset();
});
