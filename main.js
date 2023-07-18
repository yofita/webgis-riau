import 'ol/ol.css';
import TileWMS from 'ol/source/TileWMS';
import Map from 'ol/Map';
import OSM from 'ol/source/OSM';
import View from 'ol/View';
import Geolocation from 'ol/Geolocation';
import Feature from 'ol/Feature';
import {Tile as TileLayer, Vector as VectorLayer} from 'ol/layer';
import {Circle as CircleStyle, Fill, Stroke, Style} from 'ol/style';
import {Vector as VectorSource} from 'ol/source';
import Point from 'ol/geom/Point';
import {ScaleLine, defaults as defaultControls} from 'ol/control';

/* Map Persil */
const wmsSource = new TileWMS ({
  url: '',
  params: {
    'FORMAT': 'image/png',
    'VERSION': '1.1.1',
    //"AUTHKEY": '4a7725ba-782q-4595-8f85-3951e14d12v4',
    'LAYERS': 'umum:PersilHak',
    'exceptions': 'application/vnd.ogc.se_inimage',
    'TILED': true
  },
  hidpi: 'true',
  serverType: 'geoserver',
});

const layers = [
  new TileLayer({
    source: new OSM(),
  }),
  new TileLayer({
    extent: [94, -11, 141, 6],
    source: wmsSource,
  }),
];

const view = new View({
  center: [106.7995, -6.2384],
  zoom: 16,
  projection: 'EPSG:4326'
});
const map = new Map({
  layers: layers,
  target: 'map',
  controls: defaultControls().extend([scaleControl()]),
  view: view
});

// Map Event
// map.on('singleclick', function (evt) {
//   const clicked_coordinate = evt.coordinate;
//   const pixel_coordinate = map.getPixelFromCoordinate(clicked_coordinate);
//   const map_width = document.getElementById("map").offsetWidth;
//   const map_height = document.getElementById("map").offsetHeight;
//   const extent = map.getView().calculateExtent(map.getSize());


//   var params = {
//     // authkey: '4a7725ba-782q-4595-8f85-3951e14d12v4',
//     //authkey: '4a7725ba-782q-4595-8f85-3951e14d12l1',
//     service: 'WMS',
//     info_format: 'application/json',
//     request: 'GetFeatureInfo',
//     exceptions: 'application/vnd.ogc.se_xml',
//     version: '1.1.1',
//     layers: 'umum:PersilHak',
//     query_layers: 'umum:PersilHak',
//     typename: 'umum:PersilHak',
//     x: Math.ceil(pixel_coordinate[0]),
//     y: Math.ceil(pixel_coordinate[1]),
//     bbox: extent.toString(),
//     width: map_width,
//     height: map_height,
//   };

//   let paramurl = new URLSearchParams(params).toString();
//   const url = wmsurl+paramurl;

//   fetch(url)
//     .then(res => res.json())
//     .then((data) => {
//       console.log(data['features'][0]['properties']);
//       const recordAttr = data['features'][0]['properties'];
//       alert("Tipe Hak: "+recordAttr['TIPEHAK']+"\nNIB: "+recordAttr['NIB']);
//     })
//     .catch(err => { throw err });

// });

  // Initialize tooltips
  var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'))
  var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
    return new bootstrap.Tooltip(tooltipTriggerEl)
  })

  // SideBar Controller
  document.querySelector('#hideSideBar').onclick = function () {
    if (this.classList.contains('open') ){
      closeNav();
      this.classList.remove('open');
      this.classList.add('close');
    } else {
      openNav();
      this.classList.remove('close');
      this.classList.add('open');
    }
  }
  function openNav() {
    document.getElementById("sideBar").style.width = "320px";
    document.getElementById("sideBar").style.paddingLeft = "5px";
    document.getElementById("sideBar").style.paddingRight = "5px";
    document.getElementById("hideSideBar").style.left = "-40px";
    document.getElementById("hideSideBar").innerHTML = "<i class='bi bi-arrow-bar-right'></i>";

  }
  function closeNav() {
    document.getElementById("sideBar").style.width = "0";
    document.getElementById("sideBar").style.paddingLeft = "0";
    document.getElementById("sideBar").style.paddingRight = "0";
    document.getElementById("hideSideBar").style.left = "-98px";
    let new_button = "<i class='bi bi-arrow-bar-left'></i><span style='font-size:13px;top: -2px;position: relative;'>Tampilkan</span>";
    document.getElementById("hideSideBar").innerHTML = new_button;
  }

  // Zoom Controller
  document.querySelector('#zoomInBtn').onclick = function () {
    let newZoomLevel = map.getView().getZoom() + 0.2;
    map.getView().animate({
      zoom: newZoomLevel,
      duration: 200
    })
    document.getElementById("zoomInfo").innerHTML = newZoomLevel.toFixed(1);
  }
  document.querySelector('#zoomOutBtn').onclick = function () {
    let newZoomLevel =  map.getView().getZoom() - 0.2;
    map.getView().animate({
      zoom: newZoomLevel,
      duration: 200
    })
    document.getElementById("zoomInfo").innerHTML = newZoomLevel.toPrecision(3);
  }

  // Fullscreen Controller
  function setMapToFullScreen(){
    var elem = document.getElementsByTagName("BODY")[0];
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11  */
      elem.msRequestFullscreen();
    } else if (elem.mozRequestFullScreen) { /* Mozila  */
      elem.mozRequestFullScreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari  */
      elem.webkitRequestFullscreen();
    }
  }
  function setMapToExitFullScreen(){
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.msExitFullscreen) { /* IE11  */
        document.msExitFullscreen();
      } else if (document.mozExitFullScreen) { /* Mozila */
        document.mozExitFullScreen();
      } else if (document.webkitExitFullscreen) { /* Safari */
        document.webkitExitFullscreen();
      }
  }
  document.querySelector('#fullScreenBtn').onclick = function () {
    map.getView().animate({
      zoom: map.getView().getZoom() - 0.2,
      duration: 200
    })
    if((window.fullScreen) || (window.innerWidth == screen.width && window.innerHeight == screen.height)) {
      setMapToExitFullScreen();
      document.getElementById("fullScreenBtn").innerHTML = '<i class="bi bi-fullscreen"></i>';
    } else {
      setMapToFullScreen();
      document.getElementById("fullScreenBtn").innerHTML = '<i class="bi bi-fullscreen-exit"></i>';
    }
    
  }

  // Geo Location
  const geolocation = new Geolocation({
    trackingOptions: {
      enableHighAccuracy: true,
    },
    projection: view.getProjection(),
  });
  document.querySelector('#geoLocationBtn').onclick = function () {
    geolocation.setTracking(true);
  };

  // Get Position Accuracy
  geolocation.on('change', function () {
    let accuracy = " : " + geolocation.getAccuracy().toFixed(3) + 'm';
    // let altitude = geolocation.getAltitude() + ' [m]';
    // let altitudeAccurary = geolocation.getAltitudeAccuracy() + ' [m]';
    document.getElementById("accuracyInfo").innerHTML = accuracy;
  });

  geolocation.on('error', function (error) {
    alert(error.message);
  });

  const accuracyFeature = new Feature();
  geolocation.on('change:accuracyGeometry', function () {
    accuracyFeature.setGeometry(geolocation.getAccuracyGeometry());
  });

  const positionFeature = new Feature();
  positionFeature.setStyle(
    new Style({
      image: new CircleStyle({
        radius: 6,
        fill: new Fill({
          color: '#0f4069',
        }),
        stroke: new Stroke({
          color: '#0f4069',
          width: 2,
        }),
      }),
    })
  );

  geolocation.on('change:position', function () {
    const coordinates = geolocation.getPosition();
    positionFeature.setGeometry(coordinates ? new Point(coordinates) : null);
    console.log(coordinates);
    view.animate({
      center: coordinates,
      duration: 1000,
      zoom: 16
    });
  });

  new VectorLayer({
    map: map,
    source: new VectorSource({
      features: [accuracyFeature, positionFeature],
    }),
  });

  // Mouseover Coordinate
  map.on('pointermove', (evt) => {
    const mouseCoordinate = evt.coordinate;
    let lonCoord = mouseCoordinate[0];
    let latCoord = mouseCoordinate[1];
    document.getElementById("lonInfo").innerHTML = " : " + lonCoord.toFixed(5);
    document.getElementById("latInfo").innerHTML = " : " + latCoord.toFixed(5);
  });

  // Zoom level
  document.getElementById("zoomInfo").innerHTML = " : " + map.getView().getZoom();
  map.getView().on('change:resolution', function (event) {
    document.getElementById("zoomInfo").innerHTML = " : " + map.getView().getZoom().toFixed(1);
  });

  // Scale Line
  function scaleControl() {
    let control = new ScaleLine({
      units: 'metric',
      bar: false,
      steps: '4',
      text: true,
      minWidth: 140,
      className: 'scale-line'
    });
    return control;
  }
  map.addControl(scaleControl());
  

