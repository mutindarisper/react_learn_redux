import React from 'react'
import { useEffect, useState, useRef } from 'react';
import {  useDispatch, useSelector } from 'react-redux';
import "leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import axios from 'axios'

import { selectAllRegions } from '../map/MapSlice'



const Map = () => {
    const dispatch = useDispatch()
    const [region, setRegion] = useState('')
    const [aoi, setAoi] = useState({})
   let current_name = useRef(null)
    let current_geojson = useRef(null)
    let current_response = useRef(null)
   let map = useRef(null);
  

    const mapselections = useSelector(selectAllRegions)
   

    const onRegionChanged = e => {
      const changed_region = e.target.value
      console.log(changed_region, 'changed region')
      current_name.current = changed_region

        setRegion(e.target.value)
       fetchRegion()
     
    
    

    }

    
   

    const regionOptions = mapselections.map( selection => (
        <option key={selection.id} value={selection.name}>
            {selection.name}
    </option>
    ))

    const aoiOptions = mapselections.map( selection => (
      <p key={selection.id}>{selection.aoi}</p>
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
    
      
      } 


const fetchRegion = async() => {
  
  try {   
    // if(current_geojson.current) map.removeLayer(current_geojson.current)
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
   
    
    
  } catch (error) {
    console.log( error)
    
  }
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

        </div>

         <div id='map'> </div>

         <div className='charts'> {region} </div>

    </div>
   
  )
}

export default Map