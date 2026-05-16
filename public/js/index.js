async function whologged() {
    const token = localStorage.getItem("token");

    if(!token){
        window.location.href = "/login.html";
    }
    // null

}

function showMod(value) {
    const modeal = document.getElementById('modeal');
    const eyedee = document.getElementById('modalNodeID');

    modeal.style.display = 'flex';
    eyedee.textContent = `NodeID ${value}`;
}

document.addEventListener('DOMContentLoaded', function () {
    const closeButtons = document.querySelectorAll('.close');
    const modeal = document.getElementById('modeal');

    closeButtons.forEach(button => {
        button.onclick = function () {
            modeal.style.display = 'none';
        }
    });

    window.onclick = function (event) {
        if (event.target === modeal) {
            modeal.style.display = 'none';
        }
    }
});


async function loadNodes() {
    try {
        const response = await fetch("/api/node", {
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
            const nodeCount = info.length;
            document.getElementById('online').textContent = nodeCount;
        }
    } catch (error) {
        console.error('Error:', error);
    }


}

async function loadAlerts() {
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
            const alertCount = info.length;
            document.getElementById('alert').textContent = alertCount;
        }
    } catch (error) {
        console.error('Error:', error);
    }


}


async function loadHeart() {
    try {
        const response = await fetch("/api/heartbeat", {
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
            if (info.length > 0) {
                const latest = info[0].timestamp;
                document.getElementById('updated').textContent = latest;
            }
            updateHeartbeat(info);
            updateBatt(info);
        }
    } catch (error) {
        console.error('Error:', error);
    }


}

function updateHeartbeat(data) {
    const beat = document.getElementById("heartbeat");

    beat.innerHTML = "";

    if (data.length === 0) {
        const row = document.createElement("tr");
        const rowData = document.createElement("td");
        rowData.colSpan = 4;
        rowData.style.textAlign = "center";
        rowData.style.padding = "16px";
        row.appendChild(rowData);
        beat.appendChild(row);
        return;
    }

    data.forEach(element => {
        const row = document.createElement("tr");

        const nodeData = document.createElement("td");
        const batData = document.createElement("td");
        const timeData = document.createElement("td");
        const statusData = document.createElement("td");

        nodeData.textContent = element.node_id;
        batData.textContent = element.battery_lvl;
        statusData.textContent = element.status;
        timeData.textContent = element.timestamp;

        if (element.status === "ONLINE") {
            statusData.style.color = "red";
        } else {
            statusData.style.color = "green";
        }

        row.appendChild(nodeData, batData, timeData, statusData);
        beat.appendChild(row);
    });

}

function updateBatt(data) {
    const batt = document.getElementById("battery");

    batt.innerHTML = "";

    if (data.length === 0) {
        const row = document.createElement("tr");
        const rowData = document.createElement("td");
        rowData.colSpan = 4;
        rowData.style.textAlign = "center";
        rowData.style.padding = "16px";
        row.appendChild(rowData);
        batt.appendChild(row);
        return;
    }

    data.forEach(element => {
        const row = document.createElement("tr");

        const batData = document.createElement("td");
        const timeData = document.createElement("td");

        batData.textContent = element.battery_lvl;
        timeData.textContent = element.timestamp;

        row.appendChild(batData, timeData);
        batt.appendChild(row);
    });

}

const initialLat = 18.0060;
const initialLong = -76.7471;
const initialZoom = 50;

const map = L.map('map', {
    scrollWheelZoom: true
}).setView([initialLat, initialLong], initialZoom);

const bounds = [
    [18.0000, -76.7560],
    [18.0110, -76.7420]
];

map.setMaxBounds(bounds);
map.fitBounds(bounds);
map.options.maxBoundsViscosity = 1.0;

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
}).addTo(map);

function resetMap() {
    map.setView([18.0056, -76.7480], initialZoom);
}

window.addEventListener("load", function () {
    whologged();
    loadHeart();
    loadAlerts();
    loadNodes();
})

