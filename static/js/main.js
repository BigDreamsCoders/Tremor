const date = new Date()
const fullDate = date.toISOString().split("T")[0]
const hour = date.toLocaleTimeString().slice(0, -3)
document.querySelector("#date").value = `${fullDate}T${hour.length === 4 ? `0${hour}` : hour}`

const loader = document.querySelector("#loader-container")

const markers = []

const mymap = L.map('mapid', {
    scrollWheelZoom: false, zoomControl: false
}).setView([13.8333000, -88.9167000], 9);

L.tileLayer(
    'https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
        maxZoom: 18,
        attribution: 'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
        id: 'mapbox/streets-v11',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(mymap);

document.querySelector("#submit").addEventListener('click', async () => {
    loader.style.visibility = "visible"
    setTimeout(async () => {
        const date = new Date(document.querySelector("#date").value).getTime()
        const magnitudeElement = document.querySelector("#magnitude")
        const depthElement = document.querySelector("#depth")
        const magnitude = magnitudeElement.options[magnitudeElement.selectedIndex].value
        const depth = depthElement.options[depthElement.selectedIndex].value
        const [lat, lng] = await fetchData(date, magnitude, depth)
        const marker = L.marker([Number(lat), Number(lng)]).addTo(mymap)
        markers.push(marker)
        loader.style.visibility = "hidden"
    }, 5000)
})

document.querySelector("#clear").addEventListener('click', () => {
    markers.forEach((mark) => {
        mark.remove()
    })
})

const fetchData = async (timestamp, magnitude, depth) => {
    const query = `timestamp=${timestamp}&magnitude=${magnitude}&depth=${depth}`
    const response = await fetch(`/latitud?${query}`)
    const {data} = await response.json()
    return data.trim().split(" ");
}