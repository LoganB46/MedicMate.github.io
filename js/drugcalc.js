function calculateDripRate() {
    const volume = parsefloat(document.getElementById('volume').value);
    const time = parseFloat(document.getElementById('time').value);
    const dropFactor = parseFloat(document.getElementById('dropFactor').value);

    if (isNaN(volume) || isNaN(time) || isNaN(dropFactor) || time === 0){
        document.getElementById('result').innerText = "Please enter valid numers."
        return;
    }

    //Calculate the drip rate
    const dripRate = (volume * dropFactor) / time;

    //Display the result
    document.getElementById('result').innerText = "Drip Rate: " = dripRate.toFixed(2) + "gtts/min";
}