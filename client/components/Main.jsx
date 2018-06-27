import React from 'react'
import Map from './Map.jsx';

const Main = (props) => {
  return (
    <div>
      <Map
        locations={props.mentorLocations} // pass in geolocations props
        googleMapURL={process.env.GOOGLE_MAP_URL}
        loadingElement={<div style={{ height: `100%` }} />}
        containerElement={<div style={{ height: `400px` }} />}
        mapElement={<div style={{ height: `100%`, width: `50%` }} />}
      />
    </div>
  )
}

export default Main;
