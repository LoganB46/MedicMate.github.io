function calculateDripRate() {
    const volume = parseFloat(document.getElementById('volume').value);
    const time = parseFloat(document.getElementById('time').value);
    const dropFactor = parseFloat(document.getElementById('dropFactor').value);

    if (isNaN(volume) || isNaN(time) || isNaN(dropFactor) || time === 0) {
        document.getElementById('result').innerText = "Please enter valid numbers.";
        return;
    }

    // Calculate the drip rate
    const dripRate = (volume * dropFactor) / time;

    // Display the result
    document.getElementById('result').innerText = "Drip Rate: " + dripRate.toFixed(2) + " gtts/min";
}
function calculateDose() {
  const weight = parseFloat(document.getElementById("weight").value);
  const dosePerKg = parseFloat(document.getElementById("dosePerKg").value);

  const resultDiv = document.getElementById("doseResult");

  // Validate input
  if (isNaN(weight) || isNaN(dosePerKg) || weight <= 0 || dosePerKg <= 0) {
    resultDiv.innerHTML = "<span style='color:red;'>Please enter valid positive numbers.</span>";
    return;
  }

  const totalDose = weight * dosePerKg;

  resultDiv.innerHTML = `
    <h3>Total Dose</h3>
    <p>${totalDose.toFixed(2)} mg</p>
  `;
}
