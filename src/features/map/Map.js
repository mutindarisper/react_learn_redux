import React from 'react'
import { useEffect, useState, useRef } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from 'axios'

import { selectAllRegions } from '../map/MapSlice'
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
   

    const onRegionChanged = e => {
      const changed_region = e.target.value
      console.log(changed_region, 'changed region')
      current_name.current = changed_region

        setRegion(e.target.value)
       fetchRegion()
     
    
    

    }
    const onIndicatorChanged = e => {
      const changed_indicator = e.target.value
     return setIndicator(changed_indicator)
    }
    const onSubIndicatorChanged = e => {
      const changed_sub_indicator = e.target.value
     return setSubIndicator(changed_sub_indicator)
    }
    const onYearChanged = e => {
      const changed_year = e.target.value
     return setYear(changed_year)
    }




    
   

    const regionOptions = mapselections.map( selection => (
        <option key={selection.id} value={selection.name}>
            {selection.name}
    </option>
    ))

    const indicatorOptions = mapselections.map( selection => (
      <option key={selection.id} value={selection.indicator}>
      {selection.indicator}
      </option>
  ))

  const SubindicatorOptions = mapselections.map( selection => (
    <option key={selection.id} value={selection.sub_indicator}>
    {selection.sub_indicator}
    </option>
))
const yearOptions = mapselections.map( selection => (
  <option key={selection.id} value={selection.year}>
  {selection.year}
  </option>
))

    

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
          // minZoom: 6.5,
          // maxZoom: 20,
          zoom: 5,
          measureControl: true,
          // defaultExtentControl: true,
          layers: [mapboxSatellite]
        }); // add the basemaps to the controls
    
        L.control.layers(baseMaps).addTo(map.current);

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
         }).addTo(map.current)
         
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

const fetchWMS = () => {
  if(wmsLayer.current)map.current.removeLayer(wmsLayer.current)
  map.current.createPane("pane400").style.zIndex = 300;
  console.log(year, 'year in fetch')

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

  if(sub_indicator === 'Land Cover') {
    wmsLayer.current =  L.tileLayer.wms("http://66.42.65.87:8080/geoserver/LULC/wms?", {
      pane: 'pane400',
      layers: `LULC:${year}`,
      crs:L.CRS.EPSG4326,
      styles: styles.current,
      format: 'image/png',
      transparent: true,
      opacity:1.0
      
      
     
 });
 
 
 wmsLayer.current.addTo(map.current);

  }


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

 
     

      useEffect(() => {
        setLeafletMap()
        // fetchRegion()
     
       
        
    
      
    }, [])




  return (
    <div className='dashboard'>
        <div className='selections'>
        <label htmlFor='regions' className='region_label'>Select Region</label>
                    <select id='regions' 
                    value={region}
                    onChange={onRegionChanged }
                    >

                        <option value=''></option>
                        {regionOptions}

                    </select>

                    <label htmlFor='indicator' className='indicator_label'>Select Indicator</label>
                    <select id='indicator' 
                    value={indicator}
                    onChange={onIndicatorChanged }
                    >

                        <option value=''></option>
                        {indicatorOptions}

                    </select>

                    <label htmlFor='sub_indicator' className='sub_indicator_label'>Select Sub-Indicator</label>
                    <select id='sub_indicator' 
                    value={sub_indicator}
                    onChange={onSubIndicatorChanged }
                    >

                        <option value=''></option>
                        {SubindicatorOptions}

                    </select>

                    <label htmlFor='year_label' className='year'>Select Year</label>
                    <select id='year' 
                    value={year}
                    onChange={onYearChanged }
                    >

                        <option value=''></option>
                        {yearOptions}

                    </select>

                    <button className='fetch' onClick={fetchWMS}>Fetch</button>

        </div>

         <div id='map'> </div>

         <label className='upload' htmlFor="input">Select a zipped shapefile:</label>
          <input type="file" id="file" /> 
<input type="submit" id="submit" /> <span id="warning"></span>

         <div className='charts' > 
         {/* {region} 
         {indicator}
         {sub_indicator}
         {year} */}
         {console.log(barchartData, 'bar chart data in chart component')} 
       
{
  wmsLayer.current
  ?  <LulcBar  data={barchartData}/>
  : null
}
        
         </div>

    </div>
   
  )
}

export default Map