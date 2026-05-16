async function showAlerts(){
    const node = document.getElementById("node-filter").value;
    const status = document.getElementById("status").value;

     try {
        const response = await fetch("/api/alarm", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        });

        if (!response.ok) {
            alert("Failed GET Request");

        }
        else {
            const info = await response.json();
            
            let holder = info;

            if(node){
                holder = holder.filter(a => a.node_id === node);
            }

            if(status){
                holder = holder.filter(a => a.severity === status);
            }

            updateAlert(holder);

        }
    } catch (error) {
        console.error('Error:', error);
    }


}

document.getElementById("node-filter").addEventListener('change', () => {
    showAlerts();
});

document.getElementById("status").addEventListener('change', () => {
    showAlerts();
});

document.addEventListener('DOMContentLoaded', showAlerts);

function updateAlert(data) {
    const alert = document.getElementById("alert");

    alert.innerHTML = "";

    if (data.length === 0) {
        const row = document.createElement("tr");
        const rowData = document.createElement("td");
        rowData.colSpan = 4;
        rowData.style.textAlign = "center";
        rowData.style.padding = "16px";
        row.appendChild(rowData);
        alert.appendChild(row);
        return;
    }

    data.forEach(element => {
        const row = document.createElement("tr");

        const nodeData = document.createElement("td");
        const batData = document.createElement("td");
        const severity = document.createElement("td");
        const timeData = document.createElement("td");

        nodeData.textContent = element.node_id;
        batData.textContent = element.battery_lvl;
        severity.textContent = element.severity;
        timeData.textContent = element.timestamp;

        row.appendChild(nodeData, batData, severity, timeData);
        batt.appendChild(row);
    });

}