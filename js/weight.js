function calculateIBW() {
    const height = parseFloat(document.getElementById('height').value);
    const gender = document.getElementById('gender').value;
    let ibw;

    if (gender === 'male') {
        ibw = 50 + 0.9 * (height - 152.4);
    } else {
        ibw = 45.5 + 0.9 * (height - 152.4);
    }

    document.getElementById('result').innerText = `Ideal Body Weight: ${ibw.toFixed(2)} kg`;
}
