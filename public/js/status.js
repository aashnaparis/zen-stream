// const rssi_stat = document.getElementById("rssi");
const lqi_stat = document.getElementById("link");

async function showStats() {
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

            
            const temp = [...info].reverse();

           
            lqiChart.data.labels = [];
            lqiChart.data.datasets[0].data = [];
            lqiChart.data.datasets[1].data = [];

           
            temp.forEach(d => {
                lqiChart.data.labels.push(d.timestamp);
            });

            
            temp.forEach((d, i) => {
                if (d.node_id == '24' || d.node_id == 24) {
                    lqiChart.data.datasets[0].data[i] = d.linkquality;
                } else if (d.node_id == '25' || d.node_id == 25) {
                    lqiChart.data.datasets[1].data[i] = d.linkquality;
                }
            });

            lqiChart.update();



        }
    } catch (error) {
        console.log('Error:', error);
    }

}

const lqiChart = new Chart(lqi_stat, {

    type: 'line',

    data: {
        labels: ["LQI over time"],
        datasets: [{
            label: ["Zenx01"],
            data: [],
            borderColor: '#00ff88',
            backgroundColor: 'rgba(0, 255, 136, 0.15)',
            tension: 0.4,
            fill: true,
            pointRadius: 4
        },
        {
            label: ["Zen01"],
            data: [],
            borderColor: '#829f1a',
            backgroundColor: 'rgba(206, 97, 23, 0.15)',
            tension: 0.4,
            fill: true,
            pointRadius: 4
        }]
    },
    options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                labels: { color: '#ffffff' }
            }
        },
        scales: {
            x: {
                ticks: { color: '#cccccc' },
                grid: { color: 'rgba(255,255,255,0.1)' }
            },
            y: {
                ticks: { color: '#cccccc' },
                grid: { color: 'rgba(255,255,255,0.1)' },
                title: {
                    display: true,
                    text: 'LQI',
                    color: '#cccccc'
                }
            }
        }
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

async function showTraps() {
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
            // const temp = [...info].reverse();
            console.log(info);
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
        nodeData.textContent = element.node;
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

setInterval(showStats, 20000);
setInterval(showTraps, 20000);