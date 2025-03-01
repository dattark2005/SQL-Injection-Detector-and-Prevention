document.addEventListener("toggle", function (event) {
    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      if (isSQLInjection(input.value)) {
        alert("⚠️ SQL Injection detected in form submission!");
        event.preventDefault(); // Stop form submission
      }
    });
  });


