import { GoogleMap, useLoadScript } from "@react-google-maps/api";
import { useState } from "react";
import "./Map.css";
import {
  setKey,
  setLanguage,
  setRegion,
  fromAddress,
} from "react-geocode";

const Map: React.FC<any> = (props) => {

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAG9BgIxjYCW4MYzBG75bHy0vz6oUJo1HM',
    libraries: ['places']
  });

  const [lat, setLat] = useState(0);
  const [lng, setLng] = useState(0);

  setKey("AIzaSyAG9BgIxjYCW4MYzBG75bHy0vz6oUJo1HM");
  setLanguage("en");
  setRegion("es");

  const address = props.address;

  console.log('address in map: ', address);

  fromAddress(address)
    .then(({ results }) => {
      const { lat, lng } = results[0].geometry.location;
      console.log('position: ', lat, lng);
      setLat(lat);
      setLng(lng);
    })
    .catch(console.error);

  return (
    <div className="App">
      {!isLoaded ? (
        <h1>...טוען</h1>
      ) : (
        <GoogleMap
          mapContainerClassName="map-container"
          center={{ lat: lat, lng: lng }}
          zoom={19}
        >
        </GoogleMap>
      )}
    </div>
  );
}

export default Map;
