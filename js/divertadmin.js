function updateTable() {
    const row = document.getElementById('rowSelect').value;
    const column = document.getElementById('columnSelect').value;
    const newValue = document.getElementById('newValue').value;

    const targetWindow = window.open('divert.html', 'targetWindow');

    targetWindow.onload = function() {
        const table = targetWindow.document.getElementById('diverttable');
        if (table) {
            table.rows[row].cells[column].innerText = newValue;
            alert('Table updated successfully!');
        } else {
            alert('Table not found on target page.');
        }
    };
}