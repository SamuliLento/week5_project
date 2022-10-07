if (document.readyState !== "loading") {
  console.log("Document is ready!");
  initializeCode();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Document is ready after waiting!");
    initializeCode();
  });
}

function initializeCode() {
  async function getData() {
    const url =
      "https://geo.stat.fi/geoserver/wfs?service=WFS&version=2.0.0&request=GetFeature&typeName=tilastointialueet:kunta4500k&outputFormat=json&srsName=EPSG:4326";
    const dataPromise = await fetch(url);
    const dataJSON = await dataPromise.json();

    initMap(dataJSON);
  }

  const initMap = (data) => {
    let map = L.map("map", {
      minZoom: -3,
    });

    let geoJson = L.geoJSON(data, {
      onEachFeature: getFeature,
      weight: 2,
    }).addTo(map);

    let osm = L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution: "© OpenStreetMap",
      }
    ).addTo(map);

    map.fitBounds(geoJson.getBounds());
  };

  const getFeature = (feature, layer) => {
    if (!feature) return;

    layer.bindTooltip(feature.properties.name);
  };

  getData();
}
