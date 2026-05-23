function adjustTime(t){
    const time = new Date(t);
    return time.toLocaleString();
}


async function showAlerts(){
    const node = document.getElementById("node-filter").value;
    const status = document.getElementById("status").value;

    console.log("Node: ",node);

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
            console.log(info[0]);
            
            let holder = info;

            if(node){
                holder = holder.filter(a => a.node_id == node);
            }

            if(status){
                holder = holder.filter(a => a.severity == status);
            }
            console.log("Filtered:", holder);

            updateAlert(holder);

        }
    } catch (error) {
        console.error('Error:', error);
    }


}



document.addEventListener('DOMContentLoaded', function(){
    showAlerts();
    const nodeFilter = document.getElementById("node-filter");
    const statusFilter = document.getElementById("status");
    if(nodeFilter){
        nodeFilter.addEventListener('change', showAlerts);
    }
    if(statusFilter){
        statusFilter.addEventListener('change', showAlerts);
    }
});



function updateAlert(data) {
    const alert = document.getElementById("alert");

    alert.innerHTML = "";

    if (data.length === 0) {
        const row = document.createElement("tr");
        const rowData = document.createElement("td");
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

        if(element.severity == 3){
            severity.textContent = 'CRITICAL';
        }
        if(element.severity == 1){
            severity.textContent = 'MAJOR';
        }
        if(element.severity == 4){
            severity.textContent = 'FAULT';
        }
        if(element.severity == 2){
            severity.textContent = 'WARNING';
        }
        
        timeData.textContent = adjustTime(element.timestamp);

        row.append(nodeData, batData, severity, timeData);
        alert.appendChild(row);
    });

}