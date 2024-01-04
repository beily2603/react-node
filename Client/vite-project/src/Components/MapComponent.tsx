import React, { useState, useEffect, useRef } from 'react';
import { GoogleMap, useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';
import Map from './Map';
import { TextField } from '@mui/material';

const libraries = ['places'];
const mapContainerStyle: React.CSSProperties = {
    width: '100%',
    height: '400px',
};

const center = {
    lat: 24.799448,
    lng: 120.979021,
};

const MapComponent: React.FC = () => {
    const [address, setAddress] = useState<string>('לונדון');

    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: 'AIzaSyAG9BgIxjYCW4MYzBG75bHy0vz6oUJo1HM',
        libraries: ['places'],
    });

    const myInput = React.useRef(null);
    const [isClicked, setIsClicked] = useState(false);

    if (myInput.current !== null) {
        console.log(myInput.current);
    }
    console.log('address: ', address);


    useEffect(() => {
        if (isLoaded) {
            console.log('loading');
            setupAutocomplete();
        }
    }, [isLoaded]);


    const onPlacesChanged = () => {
        const inputElement = document.getElementById('address-input') as HTMLInputElement;
        const autocomplete = new window.google.maps.places.Autocomplete(inputElement, { types: ['address'] });

        console.log('I', autocomplete);
        autocomplete.addListener('place_changed', () => {
            console.log('2345678');

            const place = autocomplete.getPlace();
            setAddress(place?.formatted_address || '');
            console.log('place: ', place);
        });
    };

    const setupAutocomplete = () => {
        console.log('setupAutocomplete');
        const inputElement = document.getElementById('address-input') as HTMLInputElement;
        const autocomplete = new window.google.maps.places.Autocomplete(inputElement, { types: ['address'] });
        autocomplete.addListener('place_changed', onPlacesChanged);
    };

    if (loadError) return <div>Error loading Google Maps</div>;
    if (!isLoaded) return <div>Loading Google Maps</div>;

    const submitAddress = (event: any) => {
        event.preventDefault();
        setAddress(event.target.address.value);
        setIsClicked(true);
        console.log('after click ', address);

    }

    return (
        <div>
            <br />
            <br />
            <form onSubmit={submitAddress}>
                <StandaloneSearchBox
                    onLoad={() => setupAutocomplete()}
                >
                    <TextField
                        dir="rtl"
                        required
                        id="address-input"
                        label="כתובת"
                        name='address'
                        // value={address}
                        // onChange={e => setAddress(e.target.value)}
                    />
                </StandaloneSearchBox>

                <button type='submit'>Click me</button>
            </form>
            {/* <GoogleMap
                id="map"
                mapContainerStyle={mapContainerStyle}
                zoom={8}
                center={center}
            /> */}
            {isClicked && <Map pointLat={0} pointLng={0} address={address} />
            }
        </div>

    );
};

export default MapComponent;
