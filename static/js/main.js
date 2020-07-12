const date = new Date()
const fullDate = date.toISOString().split("T")[0]
const hour = date.toLocaleTimeString().slice(0, -3)
document.querySelector("#date").value = `${fullDate}T${hour}`

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


/*
mymap.on('click', async (e)=>{
	const {lat, lng} = e.latlng;
	document.querySelector("#lat").value=lat
	document.querySelector("#lng").value=lng
	const marker = L.marker([lat, lng ]/!*, {icon}*!/).addTo(mymap)
	const [Mag, Depth] = await fetchData()
	marker.bindPopup(`
		<ul>
		<li>Magnitud: ${Mag}</li>
		<li>Profundidad: ${Depth} Km</li>
		<ul>
	`).openPopup()
})



/*document.querySelector("#fetch").addEventListener('click', async ()=>{
	const valu1 = document.querySelector("#input0").textContent
	const valu2 = document.querySelector("#input1").textContent
	const valu3 = document.querySelector("#input2").textContent
	console.log(valu1, valu2, valu3)
	await fetchData()
})*/

/*
const fetchData = async ()=>{
	const date = document.querySelector("#date").value
	const lat = document.querySelector("#lat").value
	const lng = document.querySelector("#lng").value
	const timeStamp = new Date(`${date}`.replace(/-/gi, '/')).getTime()
	const query = `date=${timeStamp}&lat=${lat}&lng=${lng}`
	const response = await fetch(`/data?${query}`)
    const {data} = (await response.json())
	const arr = data.trimStart().trimEnd().split(" ")
	return [arr[0], arr[arr.length-1]]
}
*/
