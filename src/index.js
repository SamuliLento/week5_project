if (document.readyState !== "loading") {
  console.log("Document is ready!");
  initializeCode();
} else {
  document.addEventListener("DOMContentLoaded", function () {
    console.log("Document is ready after waiting!");
    initializeCode();
  });
}

async function initializeCode() {
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
    getNegative();

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

  async function getPositive() {
    const url =
      "https://statfin.stat.fi/PxWeb/sq/4bb2c735-1dc3-4c5e-bde7-2165df85e65f";

    const positivePromise = await fetch(url);
    const positiveJSON = await positivePromise.json();
    const positiveArray = Object.values(positiveJSON.dataset.value);

    return positiveArray;
  }

  const positiveArray = await getPositive();

  async function getNegative() {
    const url =
      "https://statfin.stat.fi/PxWeb/sq/944493ca-ea4d-4fd9-a75c-4975192f7b6e";
    const negativePromise = await fetch(url);
    const negativeJSON = await negativePromise.json();
    const negativeArray = Object.values(negativeJSON.dataset.value);

    return negativeArray;
  }

  const negativeArray = await getNegative();

  const getFeature = (feature, layer) => {
    if (!feature) return;

    const id = feature.id.split("."); //stackoverflow convert string to array
    layer.bindTooltip(feature.properties.name);
    layer.bindPopup(
      `<ul>
          <li>Name: ${feature.properties.name}</li>
          <li>Positive migration: ${positiveArray[id[1]]}</li>
          <li>Negative migration: ${negativeArray[id[1]]}</li>
      </ul>`
    );
  };

  getData();
}
