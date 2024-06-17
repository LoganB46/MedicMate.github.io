function convert() {
    // Retrieve input values
    let feet = parseFloat(document.getElementById('feet').value);
    let inches = parseFloat(document.getElementById('inches').value);
  
    // Convert feet and inches to centimeters
    let totalInches = feet * 12 + inches;
    let centimeters = totalInches * 2.54;
  
    // Display the result
    let resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<p>Result: <strong>${centimeters.toFixed(2)} cm</strong></p>`;
  }
  