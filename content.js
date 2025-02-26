document.addEventListener("toggle", function (event) {
    const inputs = document.querySelectorAll("input, textarea");
    inputs.forEach((input) => {
      if (isSQLInjection(input.value)) {
        alert("⚠️ SQL Injection detected in form submission!");
        event.preventDefault(); // Stop form submission
      }
    });
  });
  
  function isSQLInjection(input) {
    const sqlPatterns = [
      "' OR '1'='1",
      "' OR 1=1 --",
      "SELECT * FROM",
      "DROP TABLE",
      "UNION SELECT",
      "INSERT INTO",
      "'; --"
    ];
    return sqlPatterns.some((pattern) => input.includes(pattern));
  }


