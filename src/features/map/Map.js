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
    const [indicator, setIndicator] = useState('')
    const [sub_indicator, setSubIndicator] = useState('')
    const [year, setYear] = useState('')

    const [aoi, setAoi] = useState({})
   let current_name = useRef(null)
    let current_geojson = useRef(null)
    let current_response = useRef(null)
   let map = useRef(null);
   let wmsLayer = useRef(null)
   let styles = useRef(null)
  

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

         <div className='charts'> 
         {region} 
         {indicator}
         {sub_indicator}
         {year}
         </div>

    </div>
   
  )
}

export default Map