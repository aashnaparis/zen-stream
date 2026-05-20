// const rssi_stat = document.getElementById("rssi");
const lqi_stat = document.getElementById("link");

async function showStats(){
     try {
        const response = await fetch("/api/stats", {
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
            console.log(info);
            createDataPoint(lqiChart, info.timestamp, data.linkquality);
            

        }
    } catch (error) {
        console.log('Error:', error);
    }

}

function createDataPoint(chart, label, value, maxPoints = 30){
    chart.data.labels.push(label);
    chart.data.datasets[0].data.push(value);
    if(chart.data.labels.length > maxPoints){
        chart.data.labels.shift();
        chart.data.datasets[0].data.shift();
    }

    chart.update();

}

const lqiChart = new Chart(lqi_stat, {

    type: 'line',

    data: {
        labels: [],
        datasets: [{
            label: 'Link Quality',
            data: []
        }]
    }
});

// const rssiChart = new Chart(rssi_stat, {

//     type: 'line',

//     data: {
//         labels: [],
//         datasets: [{
//             label: 'RSSI',
//             data: []
//         }]
//     }
// });

async function showTraps(){
     try {
        const response = await fetch("/api/traps", {
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
            updateTraps(info);
        }
    } catch (error) {
        console.log('Error:', error);
    }

}

function updateTraps(data) {
    const snmp = document.getElementById("snmp");

    snmp.innerHTML = "";

    if (data.length === 0) {
        const row = document.createElement("tr");
        const rowData = document.createElement("td");
        rowData.colSpan = 4;
        rowData.style.textAlign = "center";
        rowData.style.padding = "16px";
        row.appendChild(rowData);
        snmp.appendChild(row);
        return;
    }

    data.forEach(element => {
        const row = document.createElement("tr");

        const typeData = document.createElement("td");
        const nodeData = document.createElement("td");
        const batData = document.createElement("td");
        const severity = document.createElement("td");
        const timeData = document.createElement("td");

        typeData.textContent = element.type;
        nodeData.textContent = element.node_id;
        batData.textContent = element.battery_lvl;
        severity.textContent = element.severity;
        timeData.textContent = element.timestamp;

        row.append(typeData, nodeData, batData, severity, timeData);
        snmp.appendChild(row);
    });

}

window.addEventListener("load", function () {
    showStats();
    showTraps();
})

setInterval(showStats, 2000);
setInterval(showTraps, 2000);