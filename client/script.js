document
  .getElementById("signup-form")
  .addEventListener("submit", async function (event) {
    event.preventDefault();

    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const contact = document.getElementById("contact").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirm_password").value;

    if (!email && !username && !contact && !password && confirmPassword) {
      alert("All fields are required!");
      return;
    }

    if (password.length <= 6) {
      alert("Password length must be more than 6 characters!");
      return;
    }

    // Validate password matching
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    try {
      const apiUrl = "http://localhost:3000/auth/register";

      const data = {
        username: username,
        email: email,
        phone: contact,
        password: password,
      };

      const options = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      };

      const response = await fetch(apiUrl, options);

      if (!response.ok) {
        alert("Something went wrong");
        return
      }

      const responseData = await response.json();
      
      if (response.status != 201) {
        alert("Invalid data provided!");
        return
      }
      alert(responseData.message);
      window.location.href = "login.html";

    } catch (error) {
        console.error("There was a problem with the fetch operation:", error);
      }
    }
  )