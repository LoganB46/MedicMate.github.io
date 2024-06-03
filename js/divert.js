window.addEventListener('message', function(event) {
    if (event.origin !== window.location.origin) {
        return;
    }

    const message = event.data;
    const table = document.getElementById('diverttable');

    if (table) {
        table.rows[message.row].cells[message.column].innerText = message.newValue;
    }
});
