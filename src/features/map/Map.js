import React from 'react'
import { useEffect, useState, useRef } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import { configureStore } from "@reduxjs/toolkit";
import "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from 'axios'
import wetlandReducer from '../map/WetlandSlice'
import { selectAllRegions } from '../map/MapSlice'
import WetlandSlice, { selectAllWetlands } from '../map/WetlandSlice'
import { changeSelectedRegion, changeSelectedIndicator, changeSelectedSubIndicator } from '../map/WetlandSlice';
import LulcBar from './charts/LulcBar';
import shp from "shpjs/dist/shp.js"

// import "../map/upload_shp/catiline.js"
import "../map/upload_shp/leaflet.shpfile.js"
// import "../map/upload_shp/shp.js"
// import "../map/upload_shp/gh-pages.css"
import "turf/dist/turf.min.js"
import * as turf from '@turf/turf'

import area from "@turf/area"
import bbox from "@turf/bbox"
// import { point }   from '@turf/turf';
// import turf from "turf/dist/turf.js"
// import turf from "https://unpkg.com/@turf/turf@6.5.0/turf.min.js"
// import  points from '@turf/turf';
// import { point } from '@turf/turf';
import {Icon} from 'leaflet'
import * as wkt from 'wkt'
import "leaflet-draw/dist/leaflet.draw-src.css";
import "leaflet-draw";

import "@geoman-io/leaflet-geoman-free"
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css"
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.min.js"


import { IoCloseCircleSharp, IoArrowBackCircleOutline} from "react-icons/io5";
import { FaArrowCircleLeft, FaArrowCircleRight  } from "react-icons/fa"
import { Routes, Route } from 'react-router-dom'
import { Link, NavLink} from "react-router-dom"



delete Icon.Default.prototype._getIconUrl;
// Icon.options.shadowSize = [0,0];
Icon.Default.mergeOptions({
  iconRetinaUrl: require('../map/assets/marker.svg'),
  iconUrl: require('../map/assets/marker.svg'),
  shadowUrl: require('../map/assets/marker.svg'),
  shadowSize: [0,0]
});





const Map = () => {
    const dispatch = useDispatch()
    const [region, setRegion] = useState('')
    const [indicator, setIndicator] = useState('')
    const [sub_indicator, setSubIndicator] = useState('')
    const [year, setYear] = useState('')
    const [barchartData, setBarchartData] = useState({})

    const [aoi, setAoi] = useState({})
   let current_name = useRef(null)
    let current_geojson = useRef(null)
    let current_response = useRef(null)
   let map = useRef(null);
   let wmsLayer = useRef(null)
   let styles = useRef(null)

   let shp_geojson = useRef(null)
   let marker = useRef(null)
   let bboxx = useRef(null)
   let custom_polygon = useRef()
   let show_chart = useRef(false)
   const [compare, setCompare] = useState(false)
   const [metadata, setMetaData] = useState(false)
   const [stats, setStats] = useState(false)
   const [wetland, setWetland] = useState('')
   const [satellite, setSatellite] = useState('')
   const [season, setSeason] = useState('')
   const [parameter, setParameter] = useState('')
   const [open, setOpen] = useState(false)


  //  window.shp = true
  let lulcChartData = {
    labels: ['bare', 'agri'],
    datasets: [
      {
        data: [10, 20],

        backgroundColor: [
          "#a8a800",
          "#ccc",
          "#bd6860",
          "green",
          "#fff1d2",
          "#55ff00",
          '#4dd7ff',
          '#d2efff'
        ],
        barThickness: 40,
     
     
      },
    ],
  }
 
   
  

    const mapselections = useSelector(selectAllRegions)
    const wetlandselections = useSelector(selectAllWetlands)

    //return the entire wetland slice
    const wetlandSlice = useSelector((state => state.wetlandselections)) //return the entire wetland slice
   

    const onRegionChanged = e => {
      const changed_region = e.target.value
      console.log(changed_region, 'changed region')
      current_name.current = changed_region
    

        setRegion(e.target.value)

        //update the selected_region value using dispatch changeSelelcted region reducer
        dispatch(changeSelectedRegion(e.target.value))
       fetchRegion()
     
    
    

    }
    const onIndicatorChanged = e => {
      const changed_indicator = e.target.value
      dispatch(changeSelectedIndicator(e.target.value))

     return setIndicator(changed_indicator)
    }
    const onSubIndicatorChanged = e => {
      const changed_sub_indicator = e.target.value
      dispatch(changeSelectedSubIndicator(e.target.value))
     return setSubIndicator(changed_sub_indicator)
    }
    const onYearChanged = e => {
      const changed_year = e.target.value
     return setYear(changed_year)
    }

    const onWetlandChanged = e => {
      const changed_wetland = e.target.value
      console.log(changed_wetland, 'selected wetland')
      return setWetland(changed_wetland)
    }

    const onSatelliteChanged = e => {
      const changed_satellite = e.target.value
      console.log(changed_satellite, 'selected satellite')
      return setSatellite(changed_satellite)
    }


    const onSeasonChanged = e => {
      const changed_season = e.target.value
      console.log(changed_season, 'selected season')
      return setSeason(changed_season)
    }

    const onParameterChanged = e => {
      const changed_parameter = e.target.value
      console.log(changed_parameter, 'selected parameter')
      return setParameter(changed_parameter)
    }

    // const shiftControls = () => {
    //   if(open === true) {
    //     // document.getElementsByClassName('leaflet-pm-toolbar')
    //     document.querySelector(".leaflet-top.leaflet-right").style.position = "absolute"
    //     document.querySelector(".leaflet-top.leaflet-right").style.zIndex = "1000"
    //     document.querySelector(".leaflet-top.leaflet-right").style.top = "-300px"
    //     document.querySelector(".leaflet-top.leaflet-right").style.margin = "500px"
    //   }
    //   if(open === false) {
    //     document.querySelector(".leaflet-top.leaflet-right").style.position = "topright"
    //   }
      
    // }





    
   

    const regionOptions = wetlandselections.regions.map( selection => (
        <option key={selection} value={selection}>
            {selection}
    </option>
    ))

    const indicatorOptions = wetlandselections.indicators.map( selection => (
      <option key={selection} value={selection}>
      {selection}
      </option>
  ))

  const SubindicatorOptions = wetlandselections.subindicators.map( selection => (
    <option key={selection} value={selection}>
    {selection}
    </option>
))
const yearOptions = wetlandselections.years.map( selection => (
  <option  key={selection} value={selection}>
  {selection}
  </option>
))
const satelliteOptions = wetlandselections.satellites.map( selection => (
  <option  key={selection} value={selection}>
  {selection}
  </option>
))

const seasonOptions = wetlandselections.seasons.map( selection => (
  <option  key={selection} value={selection}>
  {selection}
  </option>
))

const parameterOptions = wetlandselections.parameters.map( selection => (
  <option  key={selection} value={selection}>
  {selection}
  </option>
))






const wetlandOptions = wetlandselections.wetlands.map( selection => (
  // console.log(i, 'i') //works 'South africa, angola ....
   <option key={selection} value={selection} >
          {selection}
        </option>
))

const year_style = {
  menuList: (base) => ({
    ...base,
    height: "100px",

   "::-webkit-scrollbar": {
     width: "9px"
   },
   "::-webkit-scrollbar-track": {
     background: "red"
   },
   "::-webkit-scrollbar-thumb": {
     background: "#888"
   },
   "::-webkit-scrollbar-thumb:hover": {
     background: "#555"
   }
})
}
    

    const setLeafletMap = () => {
    
        let osm = L.tileLayer(
          "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
          {
            maxZoom: 19,
            attribution:
              '&copy; <a href="https://openstreetmap.org/copyright">OpenStreetMap contributors</a>',
          }
        );
    const mapboxSatellite =  L.tileLayer(
         "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}{r}?access_token={accessToken}",
         {
           attribution:
             'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
    
           id: "mapbox/satellite-v9",
           accessToken:
             "pk.eyJ1IjoiY2hyaXNiYXJ0IiwiYSI6ImNrZTFtb3Z2bDAweTMyem1zcmthMGY0ejQifQ.3PzoCgSiG-1-sV1qJvO9Og",
         }
       );
    
       const mapbox =  L.tileLayer(
         "https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}",
         {
           attribution:
             'Map data (c) <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery (c) <a href="https://www.mapbox.com/">Mapbox</a>',
           // maxZoom: 18,
           id: "mapbox/streets-v11",
           accessToken:
             "pk.eyJ1IjoiY2hyaXNiYXJ0IiwiYSI6ImNrZTFtb3Z2bDAweTMyem1zcmthMGY0ejQifQ.3PzoCgSiG-1-sV1qJvO9Og",
         }
       );
    
        var baseMaps = {
          OpenStreetMap: osm,
          MapBox: mapbox,
          MapBoxSatellite: mapboxSatellite,
        };
         map.current = L.map("map", {
          zoomControl: false,
          layersControl: false,
          center: [-19.004029959874842, 23.989915476106987],
          // drawControl: true,
          // minZoom: 6.5,
          // maxZoom: 20,
          zoom: 5.5,
          // measureControl: true,
          // defaultExtentControl: true,
          layers: [mapboxSatellite]
        }); // add the basemaps to the controls
    
        L.control.layers(baseMaps).addTo(map.current);


       // Initialise the FeatureGroup to store editable layers
// var editableLayers = new L.FeatureGroup();
// map.current.addLayer(editableLayers);



// var drawPluginOptions = {
//   position: 'topright',
//   draw: {
//     polyline: false,
//     polygon: {
//       allowIntersection: false, // Restricts shapes to simple polygons
//       showArea: true,
//       drawError: {
//         color: '#e1e100', // Color the shape will turn when intersects
//         message: '<strong>Polygon draw does not allow intersections!<strong> (allowIntersection: false)' // Message that will show when intersect
//       },
//       shapeOptions: {
//         color: '#bada55'
//       }
//     },
//     circle: false, // Turns off this drawing tool
//             rectangle: false,
//             marker: false,
//             circlemarker: false,
//   },
//   edit: {
//     featureGroup: editableLayers, //REQUIRED!!
//     remove: false
//   }
// };





// // Initialise the draw control and pass it the FeatureGroup of editable layers
// var drawControl = new L.Control.Draw(drawPluginOptions);
// map.current.addControl(drawControl);


// var editableLayers = new L.FeatureGroup();
// map.current.addLayer(editableLayers);




// map.current.on(L.Draw.Event.CREATED, (e) => {
//   var type = e.layerType,
//     layer = e.layer;

//   if (type === 'marker') {
//     layer.bindPopup('A popup!');
//   }

//   editableLayers.addLayer(layer);
// });


// var drawnItems = new L.FeatureGroup();
// map.current.addLayer(drawnItems);

// var drawControl = new L.Control.Draw();
// map.current.addControl(drawControl);

// map.current.on('draw:created', function(e) {
//   var type = e.layerType,
//     layer = e.layer;
//   drawnItems.addLayer(layer);
// });

// map.current.on('draw:editstart', function() {
//   console.log('edit start');
// });

// map.current.on('draw:editstop', function() {
//   console.log('edit stop');
// });

// add Leaflet-Geoman controls with some options to the map  
map.current.pm.addControls({  
  position: 'topright',  
  drawCircle: false, 
  drawMarker: false, 
  drawCircleMarker: false,  
});
// enable polygon Draw Mode
map.current.pm.enableDraw('Polygon', {
  snappable: true,
  snapDistance: 20,
  // getGeomanDrawLayers: true
});

map.current.on('pm:create', function(e) {
  var layer = e.layer;
  var feature = layer.toGeoJSON()
  console.log('geojsonfeature', feature)
  custom_polygon.current = feature

  // setPupup(layer);
  // layer.on('pm:update', function(e) {
  //   setPupup(e.layer);
  // });
});


// console.log(fg.toGeoJSON(), 'geoman polygon ');

// disable Draw Mode
map.current.pm.disableDraw();


        var poinnt = turf.multiPoint([[15.779725953412578, -18.006133866085932],
          [15.879725953412578, -18.106133866085932],
          [15.899725953412578, -18.156133866085932]])

         

          
          var greenIcon = L.icon({
            iconUrl: '../map/assets/marker.svg',
            // shadowUrl: 'leaf-shadow.png',
        
            iconSize:     [38, 95], // size of the icon
            shadowSize:   [50, 64], // size of the shadow
            iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
            shadowAnchor: [4, 62],  // the same for the shadow
            popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
        });

        var turf_help = turf.helpers
        var pointt = turf.point([-75.343, 39.984]);
        console.log(pointt.geometry.coordinates, 'pointt')



          // L.geoJSON(pointt).addTo(map.current)
          // L.marker(pointt.geometry.coordinates, {icon: greenIcon}).addTo(map.current);



          var linestring1 = turf.lineString([[15.83,-19.53], 
            [18.20,-17.68], [18.30,-17.88],
             [18.40,-17.98]],
             [14.90, 14.88], {name: 'line 1'});
          // L.geoJSON(linestring1).addTo(map.current)


          var points = turf.randomPoint(25, {bbox: [15.839969635009767,-19.53411293029785,18.20037460327154,-17.68951606750488]})
          L.geoJSON(points).addTo(map.current)
          
          // var points_coords = points.features.slice(0, 10).map( (item) => item.geometry.coordinates)

          // console.log(points_coords[0], 'random coordinates')

          // L.marker(points_coords[0], {icon: greenIcon}).addTo(map.current); works for just one
          


          Object.entries(points.features).forEach( ([key, value]) => {
            if(key) {


             marker.current =  L.circleMarker([value.geometry.coordinates[1], value.geometry.coordinates[0]], {icon:greenIcon})
            //  marker.current.addTo(map.current)

        return `${key}`

            }

          })

       

   
          var poly1 = turf.polygon([[
            [20.369239807128963, -15.93078994750971],
          
          
            [15.640975952148438, -19.474559783935547],
               
             
                [17.598272323608455, -19.440942764282227],
             
             
                [17.580978393554744, -19.46551322937006],
               
               
                [17.50320816040039, -19.418428421020508],
             
             
                [17.511526107788146, -19.408964157104435],
                [20.369239807128963, -15.93078994750971]
          ]]);
          
          var poly2 = turf.polygon([[
            [20.369239807128963, -15.93078994750971],
            [17.369239807128963, -14.93078994750971],
            [18.370422363281364, -17.930301666259766],
  
            [19.398820877075195, -17.918651580810547],
           
           [20.410255432128963, -17.913959503173828],
           [20.369239807128963, -15.93078994750971]
                    
           
          ]]);
  
          L.geoJSON(poly1,  {
            style: {
              color: "blue",
              opacity: 1,
              fillOpacity:0,
              weight: 4
            }
          })
          // .addTo(map.current)
          L.geoJSON(poly2 ,  {
            style: {
              color: "red",
              opacity: 1,
              fillOpacity:0,
              weight: 4
            }
          })
          // .addTo(map.current)
          
          var intersection = turf.union(poly1, poly2);
          var intersect_geo = L.geoJSON(intersection,  {
            style: {
              color: "yellow",
              opacity: 1,
              fillOpacity:0.5,
              weight: 4
            }
          })
          // intersect_geo.addTo(map.current)

          var difference = turf.difference(poly1, poly2);
          var diff_geo = L.geoJSON(difference,  {
            style: {
              color: "teal",
              opacity: 1,
              fillOpacity:0.5,
              weight: 4
            }
          })
          // diff_geo.addTo(map.current)

       

//           var locationA = turf.point([-75.343, 39.984], {name: 'Location A'});
// var locationB = turf.point([-75.833, 39.284], {name: 'Location B'});
// var locationC = turf.point([-75.534, 39.123], {name: 'Location C'});

// var collection = turf.featureCollection([
//   locationA,
//   locationB,
//   locationC
// ]);

// L.geoJSON(collection).addTo(map.current)




        document.getElementById("submit").onclick = function(e){
          var files = document.getElementById('file').files;
          if (files.length == 0) {
            return; //do nothing if no file given yet
          }
          
          var file = files[0];
          
          if (file.name.slice(-3) != 'zip'){ //Demo only tested for .zip. All others, return.
            document.getElementById('warning').innerHTML = 'Select .zip file';  	
            return;
          } else {
            document.getElementById('warning').innerHTML = ''; //clear warning message.
            handleZipFile(file);
          }
        };
        
        //More info: https://developer.mozilla.org/en-US/docs/Web/API/FileReader
        function handleZipFile(file){
          var reader = new FileReader();
          reader.onload = function(){
            if (reader.readyState != 2 || reader.error){
              return;
            } else {
              convertToLayer(reader.result);
            }
          }
          reader.readAsArrayBuffer(file);
        }
        
        function convertToLayer(buffer){
          shp(buffer).then(function(geojson){	//More info: https://github.com/calvinmetcalf/shapefile-js
            console.log(geojson.features[0].geometry.coordinates[0], 'uploaded geojson')
            shp_geojson.current = geojson
            var layer = L.shapefile(geojson, {
              style: {
                color: "#ff0000",
                opacity: 1,
                fillOpacity:0,
                weight: 4
              },

              onEachFeature: function (feature, layer) {
                console.log(feature, 'uploaded shapefile feature')
                var computed_area =  (area(feature)/1000000).toFixed(2)
                var bounding_box = bbox(feature).toString()
                bboxx.current = bounding_box

             
                layer.bindPopup(`<b> Area: </b> ${computed_area}
                <br>
                <b> Bbox: </b> ${bounding_box}`)
               console.log(bounding_box, 'turf bbox')

              }
            })
            .addTo(map.current);//More info: https://github.com/calvinmetcalf/leaflet.shapefile
            console.log(layer);

          //check the difference

          var polygon = turf.polygon([[[12.839969635009767,-19.53411293029785], [18.20037460327154,-17.68951606750488],
            [17.20037460327154,-18.68951606750488], [12.839969635009767,-19.53411293029785]]]);
         L.geoJSON(polygon, {
           style: {
             color: "magenta",
             opacity: 1,
             fillOpacity:0,
             weight: 4
           }
         })
        //  .addTo(map.current)

            // clip by bbox
            var bboxing = [15.8,-19.5,18.2,-17.6]

            // var bboxx = [0, 0, 10, 10];
            // var poly = turf.polygon([[[2, 2], [8, 4], [12, 8], [3, 7], [2, 2]]]);
            console.log(bboxx.current, 'current bbox')
            // var polyy = current_response.current.features[0].geometry.coordinates

            var new_polly = turf.polygon([ [[13.949995, -17.432521], [18.347457, -17.608717], [18.255073, -21.198009], [15.040122, -21.919735], [13.949995, -17.432521] ] ] )
             var new_polly_geo = L.geoJSON(new_polly)
              // new_polly_geo.addTo(map.current)



            var clipped = turf.bboxClip(new_polly, bboxing)
  
  
  
        var clip_geo =  L.geoJSON(clipped,  {
              style: {
                color: "orange",
                opacity: 1,
                fillOpacity:0.5,
                weight: 4
              }
            })
            // clip_geo.addTo(map.current)
  
         
          var difference = turf.intersect(polygon, layer)
          
         var diffGeojson = L.geoJSON(difference).addTo(map.current)

         map.current.fitBounds(diffGeojson.getBounds(), {
          padding: [50, 50],
        });
     

     
         

          //  var converted_geojson =  L.geoJSON( shp_geojson.current, {
          //     style: {
          //       color: "magenta",
          //       opacity: 1,
          //       fillOpacity:0,
          //       weight: 4
          //     },
          //   //    onEachFeature: function (feature, layer) {
          //   //     // console.log(feature, 'uploaded shapefile feature')
          //   //  var computed_area =  area(feature)
          //   //    console.log(computed_area, 'turf area')

          //   //   }
          //     // pane: 'pane1000'
          //   })
          //   converted_geojson.addTo(map.current)

          });

          

        }
    
        const person = {
          name: 'Risper',
          occupation: 'frontend developer',
          faveFramework: 'React'
        }

        //create a second person with same properties but change the property faveframework using a spread operator
        const person2 = {...person, faveFramework:'Vue'}
        console.log(person2, 'person2 faveframework')
        const names = ['Plain', 'Jane', 'Queen']
        const names2 = [...names, 'Nicki']      
        console.log(names2, 'added nicki to names')
        //important functions, .filter
      //loop through the array and return names that is not queen
      const filtered_array = names2.filter( (name) => {
        return name !== 'Queen'
      })
      console.log(filtered_array, 'filtered array')
      
      
      } 


const fetchRegion = async() => {
  
  try {   
    if(current_geojson.current) map.current.removeLayer(current_geojson.current)
    if(wmsLayer.current)map.current.removeLayer(wmsLayer.current)
    console.log(current_name.current, 'curent name')
    var basin = current_name.current
    console.log(basin, 'basin current')
    const resp = await axios.get(`http://66.42.65.87:8080/geoserver/aoi/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=aoi%3A${basin}&maxFeatures=50&outputFormat=application%2Fjson`
    );
    var aoi_data = resp.data
    console.log(aoi_data, 'aoi response')
    current_response.current = aoi_data
    console.log(current_response.current, 'current aoi')

    console.log(current_response.current.features[0].geometry.coordinates, 'multipolygon')
       // map.createPane("pane1000").style.zIndex = 300;
       current_geojson.current = L.geoJSON(current_response.current, {
        style: {
          color: "black",
          opacity: 1,
          fillOpacity:0,
          weight: 4
        }
        // pane: 'pane1000'
      })
      current_geojson.current.addTo(map.current)
      
      map.current.fitBounds(current_geojson.current.getBounds(), {
              padding: [50, 50],
            });
   
    
    
  } catch (error) {
    console.log( error)
    
  }
}
const lulc_style = () => {
  if(region === 'Cuvelai'  && sub_indicator === 'Land Cover'){
    styles.current = 'cuvelai_lulc'

  }
  if(region === 'Limpopo'  && sub_indicator === 'Land Cover'){
    styles.current = 'limpopo_lulc'

  }
  if(region === 'Okavango'  && sub_indicator === 'Land Cover'){
    styles.current = 'okavango_lulc'

  }
  if(region === 'Zambezi'  && sub_indicator === 'Land Cover'){
    styles.current = 'zambezi_lulc'

  }
}

const fetchLULC = () => {
  if(sub_indicator === 'Land Cover') {
    //   console.log(custom_polygon.current.geometry.coordinates[0], 'custome ')
    //   var feature=  custom_polygon.current
    //   var turf_bbox = turf.bbox(feature)
    //   console.log(turf_bbox, 'turf bbox')
    //   var str =  wkt.stringify(custom_polygon.current.geometry)
    //   console.log(str, 'str')
  
    //  var bounds_ =  map.current.getBounds(custom_polygon.current).toBBoxString()
    //  console.log(bounds_, 'bounds')
      wmsLayer.current =  L.tileLayer.wms("http://66.42.65.87:8080/geoserver/LULC/wms?", {
        pane: 'pane400',
        layers: `LULC:${year}`,
        crs:L.CRS.EPSG4326,
        styles: styles.current,
        // bounds: map.current.getBounds(custom_polygon.current).toBBoxString(),
      
        format: 'image/png',
        transparent: true,
        opacity:1.0
        
        
       
   });
  
   wmsLayer.current.addTo(map.current);
  
    }
}
const fetchSentinelNDVI = () => {
  if(sub_indicator === 'Vegetation Cover' && custom_polygon.current.geometry) {

    const instanceID = "cf1096bb-15f1-4674-bc55-5e5d8fcec549"
  const firstDate = "2022-05-31";
  const lastDate = "2022-12-31";
  // const geometry = "MULTIPOLYGON (((16.3419, -15.1163, 16.6067,-15.2167, 17.9791,-18.1524, 19.3665,-18.9237, 15.237,-19.5444, 15.1447,-19.4983, 16.3419,-15.1163), (14.9678,-19.4888, 14.9585,-19.4888, 14.9587,-19.4796, 13.957,-18.1482, 14.9678,-19.4888), (14.8923, -17.2617, 14.9016 ,-17.2617, 14.9108, -17.2617, 14.92,-17.2617, 16.211, -15.3261 ,16.2202,-15.3261, 14.8923, -17.2617)))"
  // let geom = current_response.current.features[0].geometry.coordinates
//   var stringified = JSON.stringify(geom)
//   // console.log( ` "MULTIPOLYGON ${stringified}"`, 'stringified multipolygon')

//   let str_geom = ` "MULTIPOLYGON ${stringified}"`
//   console.log('str geom', str_geom)
  
//   str_geom = str_geom.replace(/[\[]/g, '(').replace(/[\]]/g, ')')
// console.log('formated geom', str_geom)

//second trial
// let geom = current_response.current.features[0].geometry
// console.log(geom, 'geometry')
// var geom_str = wkt.stringify(geom)
// console.log('wkt stringified', geom_str)



// let smaller_geom =  shp_geojson.current.features[0].geometry
// console.log('smaller geom',smaller_geom)
// var geom_str = wkt.stringify(smaller_geom)
// console.log('str small geom',geom_str)

//third trial, even a smaller polygon
var geometry = {
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "coordinates": [
          [
            [
              15.217331760838846,
              -17.722800942446668
            ],
            [
              15.217331760838846,
              -17.925796489243638
            ],
            [
              15.473208790590633,
              -17.925796489243638
            ],
            [
              15.473208790590633,
              -17.722800942446668
            ],
            [
              15.217331760838846,
              -17.722800942446668
            ]
          ]
        ],
        "type": "Polygon"
      }
    }
  ]
}
// let smaller_geom =  geometry.features[0].geometry
var geom_str = wkt.stringify(custom_polygon.current.geometry)
console.log('str custom geom',geom_str)

  const wmsUrl = `https://services.sentinel-hub.com/ogc/wms/${instanceID}`
  
  var wmsOptions = {
    pane: 'pane400',
    tileSize: 512,
    maxcc: 50,
    layers: "NDVI",
    transparent: "true",
    format: "image/png",
    time: `${firstDate}/${lastDate}`,
    geometry: geom_str, //works with a small area, max characters in a https request is 2048
    crs: L.CRS.EPSG4326,
  }
  //https://gis3.nve.no/map/services/Nettanlegg1/MapServer/WmsServer?request=GetCapabilities&service=WMS
  wmsLayer.current = L.tileLayer.wms(wmsUrl, wmsOptions);


  wmsLayer.current.addTo(map.current)
   }


}
const fetchVegCover = () => {
  if(sub_indicator === 'Vegetation Cover') {
    
    wmsLayer.current =  L.tileLayer.wms(`http://66.42.65.87:8080/geoserver/${satellite}_NDVI_${season}/wms?`, {
     pane: 'pane400',
     layers: `${satellite}_NDVI_${season}:${year}`,
     crs:L.CRS.EPSG4326,
     styles: region === 'Cuvelai' ? 'cuvelai_ndvi' :  region === 'Zambezi' ? 'zambezi_ndvi':  region === 'Limpopo' ? 'limpopo_ndvi': 'okavango_ndvi',
     format: 'image/png',
     transparent: true,
     opacity:1.0
     // CQL_FILTER: "Band1='1.0'"
     
    
});


wmsLayer.current.addTo(map.current);
  }

}
const fetchWetlandExtent = () => {
  if(sub_indicator === 'Wetland Inventory' && parameter === 'Wetland Extent') {
  
 
  
  wmsLayer.current =  L.tileLayer.wms("http://66.42.65.87:8080/geoserver/NDWI/wms?", {
     pane: 'pane400',
     layers: `NDWI:${year}`,
     crs:L.CRS.EPSG4326,
     styles: region === 'Cuvelai' ? 'cuvelai_water' :  region === 'Zambezi' ? 'zambezi_water':  region=== 'Limpopo' ? 'limpopo_water': 'okavango_water',
     format: 'image/png',
     transparent: true,
     opacity:1.0
     // CQL_FILTER: "Band1='1.0'"
     
    
  });
  
  
  wmsLayer.current.addTo(map.current);
 
  }

 }
 const addSuspendedSediments = () => {
  if(sub_indicator === 'Water Quality' && parameter === 'Sus Sediments') {
  
  // console.log('just to see if request is accessed') //accessed

  
  wmsLayer.current=  L.tileLayer.wms("http://66.42.65.87:8080/geoserver/NDWI/wms?", {
     pane: 'pane400',
     layers: `NDWI:${year}`,
     crs:L.CRS.EPSG4326,
     styles: region === 'Cuvelai' ? 'cuvelai_water' :  region === 'Zambezi' ? 'zambezi_water':  region === 'Limpopo' ? 'limpopo_water': 'okavango_water',
     format: 'image/png',
     transparent: true,
     opacity:1.0
     // CQL_FILTER: "Band1='1.0'"
     
    
  });
  
  
  wmsLayer.current.addTo(map.current);
  
   
  }

 }

 const addFirmsLayer = () => {
  if(sub_indicator === 'Burnt Area FIRMS') {
  
wmsLayer.current =  L.tileLayer.wms(`http://66.42.65.87:8080/geoserver/FIRMS_DRY/wms?`, {
     pane: 'pane400',
     layers: `FIRMS_DRY:${year}`,
     crs:L.CRS.EPSG4326,
     styles: `${region}_firms`,
     format: 'image/png',
     transparent: true,
     opacity:1.0
     // CQL_FILTER: "Band1='1.0'"
     
    
});


wmsLayer.current.addTo(map.current);

}

 }

 const addPrecIndexWet = () => {

  if(sub_indicator === 'Precipitation Index' && season === 'WET' ) {
  
    wmsLayer.current =  L.tileLayer.wms("http://66.42.65.87:8080/geoserver/SPI_WET/wms?", {
       pane: 'pane400',
       layers: `SPI_WET:${year}`,
       crs:L.CRS.EPSG4326,
       styles: region === 'Cuvelai' ? 'cuvelai_spi' :  region === 'Zambezi' ? 'zambezi_spi':   region=== 'Limpopo' ? 'limpopo_spi': 'okavango_spi',
       format: 'image/png',
       transparent: true,
       opacity:1.0
       // CQL_FILTER: "Band1='1.0'"
       
      
    });
  
  
  
  
    wmsLayer.current.addTo(map.current);
  }
 }

 const addPrecIndexDry = () => {
  if(sub_indicator === 'Precipitation Index' && season === 'DRY' ) {
  
    
    wmsLayer.current =  L.tileLayer.wms("http://66.42.65.87:8080/geoserver/SPI_DRY/wms?", {
       pane: 'pane400',
       layers: `SPI_DRY:${year}`,
       crs:L.CRS.EPSG4326,
       styles: region === 'Cuvelai' ? 'cuvelai_spi' :  region === 'Zambezi' ? 'zambezi_spi':  region === 'Limpopo' ? 'limpopo_spi': 'okavango_spi',
       format: 'image/png',
       transparent: true,
       opacity:1.0
       // CQL_FILTER: "Band1='1.0'"
       
      
    });
    
    
    wmsLayer.current.addTo(map.current);
  }
 }
 const addFloodLayer = () => {
  if(sub_indicator === 'Undulation') {
  
wmsLayer.current =  L.tileLayer.wms(`http://66.42.65.87:8080/geoserver/FLOOD/wms`, {
     pane: 'pane400',
     layers: `FLOOD:FLOOD`,
     crs:L.CRS.EPSG4326,
     styles: `${region}_flood`,
     format: 'image/png',
     transparent: true,
     opacity:1.0
     // CQL_FILTER: "Band1='1.0'"
     
    
});


wmsLayer.current.addTo(map.current);

}
 }
 const addWetlandStatus = () => {
  if(sub_indicator === 'Wetland Inventory' && parameter === 'Wetland Status' ) { //&& season.value === 'DRY'
 
  
  wmsLayer.current =  L.tileLayer.wms(`http://66.42.65.87:8080/geoserver/${satellite}_NDVI_${season}/wms?`, {
       pane: 'pane400',
       layers: `${satellite}_NDVI_${season}:${year}`,
       crs:L.CRS.EPSG4326,
       styles: region === 'Cuvelai' ? 'cuvelai_status' :  region === 'Zambezi' ? 'zambezi_status':  region === 'Limpopo' ? 'limpopo_status': 'okavango_status',
       format: 'image/png',
       transparent: true,
       opacity:1.0
       // CQL_FILTER: "Band1='1.0'"
       
      
  });
  
  
  wmsLayer.current.addTo(map.current);

}
 }

 const addSMILayer = () => {
  if(sub_indicator === 'Soil Moisure Index') {
  

  wmsLayer.current =  L.tileLayer.wms(`http://66.42.65.87:8080/geoserver/SMI_${season}/wms?`, {
       pane: 'pane400',
       layers: `SMI_${season}:${year}`,
       crs:L.CRS.EPSG4326,
       styles: `${region}_smi`,
       format: 'image/png',
       transparent: true,
       opacity:1.0
       // CQL_FILTER: "Band1='1.0'"
       
      
  });
  
  
  wmsLayer.current.addTo(map.current);
}
 }

const fetchWMS = () => {
  if(wmsLayer.current)map.current.removeLayer(wmsLayer.current)
  map.current.createPane("pane400").style.zIndex = 200;
  console.log(year, 'year in fetch')
  console.log('vegcover params', region, satellite, year, season)

 
  lulc_style()
  fetchLULC()
  fetchVegCover()
  fetchWetlandExtent()
  addSuspendedSediments()
  addFirmsLayer()
  addPrecIndexWet()
  addPrecIndexDry()
  addFloodLayer()
  addWetlandStatus()
  addSMILayer()


 

  const getStats = async () => {
    try {
     
      console.log(region, 'region in stats')
   console.log(year, 'year in stats')


      const response = await axios.get(`http://66.42.65.87:8080/geoserver/wfs?request=GetFeature&service=WFS&version=1.0.0&typeName=LULC_STATS:${year}&outputFormat=application/json&CQL_FILTER=Name=%27${region}%27`
      );
      console.log(response.data.features[0].properties,'stats response')
      var obj = response.data.features[0].properties
      
      const newObj = Object.fromEntries(Object.entries(obj).filter(([key]) => !key.includes('MAJ_BAS') && !key.includes('Basin_Name') && !key.includes('Name') && !key.includes('0')))
      console.log(newObj, 'NEW OBJECT')

      var labels = Object.keys(newObj)
      console.log(labels, 'stats labels')
      lulcChartData.labels = labels
     
    
      var figures = Object.values(newObj)
      console.log(figures, 'stats figures')
      // var converted = figures.map( (item) => item/100)
      // console.log(converted, 'converted figres')
      lulcChartData.datasets[0].data = figures
      
      console.log(lulcChartData, 'land cover chart data')
      if(barchartData)show_chart.current = true
      return setBarchartData(lulcChartData)

      // //for new array
      // this.stats_array.labels = labels
      // this.stats_array.data_figures = figures


      // //capture bbox
      // var bbox = response.data.features[0].bbox
      // console.log(bbox, 'BOUNDING BOX')
      //  this.western_lon = bbox[0]
      //  this.northern_lat = bbox[1]
      //  this.eastern_lon = bbox[2]
      //  this.southern_lat = bbox[3]

      //  this.resolution = '300'
     
   
      
    } catch (error) {
      console.error('an error occured'+error);
      
    }
  }
  getStats()


  



}

 const show_compare = () => {
    setCompare(true)

 }
 const close_compare = () => {
  setCompare(false)

}
  
const show_metadata = () => {
  setMetaData(true)
  setStats(false)
  
}
    
const show_stats = () => {
  setStats(true)
  setMetaData(false)
}


      useEffect(() => {
        setLeafletMap()
        // fetchRegion()
        // store.dispatch(setRegion())
       
        
    
      
    }, [])




  return (
    <div className='dashboard'>
        <div className='selections'>
        <label htmlFor='regions' className='region_label'>Select Region</label>
                    <select id='regions' className='text-black text-base pl-5 outline-none'
                    value={region}
                    onChange={onRegionChanged }
                    >

                        <option value=''></option>
                        {regionOptions}

                    </select>

                    <label htmlFor='indicator' className='indicator_label'>Select Indicator</label>
                    <select id='indicator' className='text-black text-base pl-2 pr-2 outline-none'
                    value={indicator}
                    onChange={onIndicatorChanged }
                    >

                        <option value=''></option>
                        {indicatorOptions}

                    </select>

                    <label htmlFor='sub_indicator' className='sub_indicator_label'>Select Sub-Indicator</label>
                    <select id='sub_indicator' className='text-black text-base pl-1 pr-1 outline-none'
                    value={sub_indicator}
                    onChange={onSubIndicatorChanged }
                    >

                        <option value=''></option>
                        {SubindicatorOptions}

                    </select>

                    <label htmlFor='year_label' className='year' style={{left:sub_indicator === 'Vegetation Cover' ? '40vw':
                    sub_indicator === 'Wetland Inventory' || sub_indicator ===  'Water Quality' ? '40vw' : '32vw' }}>Select Year</label>
                    <select id='year'  className='text-black text-base pl-5 outline-none' style={{left:sub_indicator === 'Vegetation Cover' ? '40vw':
                     sub_indicator === 'Wetland Inventory'  || sub_indicator ===  'Water Quality' ? '40vw' : '32vw' }}
                    value={year}
                    onChange={onYearChanged }
                 
                    >

                        <option  id='year_list' value=''></option>
                         {yearOptions}
                        

                    </select>

                    <button className='fetch bg-white text-black' onClick={fetchWMS} style={{left:sub_indicator === 'Vegetation Cover' ? '60vw' :
                     parameter === 'Wetland Extent' || sub_indicator ===  'Water Quality'  ? '49vw' :
                     sub_indicator === 'Precipitation Index' ? '50vw' : 
                     sub_indicator === 'Soil Moisure Index' ? '50vw':
                     sub_indicator === 'Wetland Inventory' && parameter === 'Wetland Status' ? '65vw' : '42vw' }}>Fetch</button>

                    <label htmlFor='satellite_label'  className='satellite' style={{left:sub_indicator === 'Vegetation Cover' ? '32vw' :
                    parameter === 'Wetland Status' ? '57vw': '-10vw' }}>Select Satellite</label>
                    <select id='satellite'  className='satellite text-black text-base pl-5 outline-none' style={{left:sub_indicator === 'Vegetation Cover' ? '32vw' :
                     parameter === 'Wetland Status' ? '57vw' : '-10vw' }}
                    value={satellite}
                    onChange={onSatelliteChanged }
                    >

                        <option value=''></option>
                        {satelliteOptions}

                    </select>

                    <label htmlFor='season_label'  className='season_label' style={{left:sub_indicator === 'Vegetation Cover' ? '49vw' :
                    sub_indicator === 'Precipitation Index' ? '41vw' :
                    sub_indicator === 'Soil Moisure Index' ? '41vw':
                    parameter === 'Wetland Status' ? '48vw': '-10vw' }}>Select Season</label>
                    <select id='season'  className='season text-black text-base pl-5 outline-none'  style={{left:sub_indicator === 'Vegetation Cover' ? '49vw' :
                    sub_indicator === 'Precipitation Index' ? '41vw' :
                    sub_indicator === 'Soil Moisure Index' ? '41vw':
                    parameter === 'Wetland Status' ? '48vw': '-10vw' }}
                    value={season}
                    onChange={onSeasonChanged }
                    >

                        <option value=''></option>
                        {seasonOptions}

                    </select>

{
  sub_indicator === 'Wetland Inventory' || sub_indicator === 'Water Quality' ? 
  <>
  
   <label htmlFor='parameter_label'  className='parameter_label' style={{left:sub_indicator === 'Wetland Inventory' || sub_indicator ===  'Water Quality' ? '32vw' : '-100vw' }}>Select Parameter</label>
  <select id='parameter'  className='parameter text-black pl-5 text-base outline-none' style={{left:sub_indicator === 'Wetland Inventory' || sub_indicator ===  'Water Quality'  ? '32vw' : '-10vw' }}
  value={parameter}
  onChange={onParameterChanged }
  >

      <option value=''></option>
      {parameterOptions}

  </select>
  
   </>
  : null

}
                    


        </div>

        
         {/* {
          wmsLayer.current ? <div  className='container'> yes</div>  className={open ? ' flex-auto float-left' : 'map'}
          : '' 
         }
          */}

          <div className='compare' onClick={show_compare}>Compare</div>
          {
            compare ? <div className='compare_panel' >Compare Panel
            <IoCloseCircleSharp className='close_compare' onClick={close_compare} />
            
            </div>
            : null
          }

          
          



         <label className='upload' htmlFor="input">Select a zipped shapefile:</label>
          <input type="file" id="file" /> 
<input type="submit" id="submit" /> <span id="warning"></span>

<div className={open ? 'absolute -left-60' : ' toggle_div  w-7 h-7 z-700' }>
  <FaArrowCircleLeft className='toggle cursor-pointer z-1000 '  onClick={ () => { setOpen(!open)}} />
 

</div>




<div>
<div id='map' > </div>

<div className={ open ? 'charts duration-500 z-700 transition-transform -translate-x-10' : null} > 
{/* {region} 
{indicator}
{sub_indicator}
{year} */}
{console.log(barchartData, 'bar chart data in chart component')} 



 {
   
   open ?  <div className='tabs'>
    
    
      <div onClick={show_stats} style={{ color: stats === true ? 'steelblue' : '#5c5a5a', borderBottom:  stats === true ? ' 5px solid' : '' }}> Statistics</div> 
       
     <div onClick={show_metadata} style={{ color: metadata === true ? 'steelblue' : '#5c5a5a', borderBottom:  metadata === true ? ' 5px solid' : '' }}>MetaData</div>
    
     
     </div>
     : null

 }
 
 
  

 

{
wmsLayer.current && stats && open
? <> <p style= {{ color: '#5c5a5a'}}>{region} {sub_indicator} {year}</p>
<LulcBar  data={barchartData}/>
<div className='close_chart'>
<FaArrowCircleRight className='toggle cursor-pointer z-1000 bg-slate-600 '  onClick={ () => { setOpen(!open)}} />

</div>

 </> 


: null
}

{
metadata ? <p className='metadata_text'> <b>  { wetland } </b> Velit cillum excepteur in exercitation eiusmod laborum laboris incididunt deserunt veniam proident dolor fugiat.
In ad culpa elit reprehenderit enim culpa enim laboris nulla qui adipisicing ex. Labore consectetur anim aliquip officia excepteur 
reprehenderit non ad laborum nulla ullamco consequat officia. Exercitation duis officia sint commodo et culpa duis id adipisicing.</p>
: null
}

</div>

</div>

          {/* access the current state of selected region */}
         {/* <div style={{position: 'absolute', top: '80vh', color: 'black', left: '80vw', zIndex: 600, fontWeight: 800}}>{wetlandSlice.selected_subindicator}</div> */}

    </div>
   
  )
}

export default Map