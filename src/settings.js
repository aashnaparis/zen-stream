
const initialLat = 18.0060;
const initialLong = -76.7471;
const initialZoom = 50;

// const minLat = 18.005, maxLat = 18.015;
// const minLong = -76.745, maxLong = -76.735;


// function validateItems() {
//   document
//     .getElementById("location")
//     .addEventListener("submit", function (event) {
//       event.preventDefault();
//     });

//     if (node.value === null || node.value === "" || node.value === "default") {
//         alert("Select a car name!");
//         return false;
//     } else if (lat.value >= minLat || lat.value <= maxLat || lat.value === null || isNaN(lat.value)) {
//         alert("Put an appropriate Latitude!");
//         return false;
//     } else if(long.value >= minLong || long.value <= maxLong || long.value === null || isNaN(long.value)){
//         alert("Put an appropriate Longitude!");
//         return false;
//     }

// }

async function assignDot() {
    const node = document.getElementById("nodes").value;
    const lat = document.getElementById("lat").value;
    const long = document.getElementById("long").value;

    var requestBody = {
        "node_id": node,
        "lat": lat,
        "lng": long
    }

    var settings = {
        "method": "PUT",
        "headers": {
            "Content-Type": "application/json"
        },
        "body": JSON.stringify(requestBody)
    };

    try {
        const response = await fetch(`/api/node/${node}/location`, settings)
       
        if (response.status != 201) {
            alert("Failed GET Request");

        }
        else {
            const info = await response.json();
            alert("Location Saved");
            console.log(info);
            
        }
    } catch (error) {
        console.error('Error:', error);
    }

}




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

var marker = null;

map.on('click', (e) => {
    const lat = e.latlng.lat.toFixed(6);
    const long = e.latlng.lng.toFixed(6);

    document.getElementById("lat").value = lat;
    document.getElementById("long").value = long;

    if (marker) {
        map.removeLayer(marker);
    }

    marker = L.marker([lat, long], { draggable: true }).addTo(map);

    marker.on('dragend', (event) => {
        const p = event.target.getLatLng();
        document.getElementById('lat').value = p.lat.toFixed(6);
        document.getElementById('long').value = p.lng.toFixed(6);
    });

    marker.bindPopup(`
        Latitude: ${marker.getLatLng().lat.toFixed(6)}<br>
        Longitude: ${marker.getLatLng().lng.toFixed(6)}
        `).openPopup();

    document.getElementById("save").disabled = false;

});

L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    attribution: 'Tiles © Esri'
}).addTo(map);



function resetMap() {
    map.setView([18.0056, -76.7480], initialZoom);
}
