import { useEffect, useRef } from 'react';
import { Loader } from '@googlemaps/js-api-loader';

export function HomePage() {
    const googlemap = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const loader = new Loader({
            apiKey: 'AIzaSyAG9BgIxjYCW4MYzBG75bHy0vz6oUJo1HM',
            version: 'weekly',
            libraries: ['places'],
        });
        let map: google.maps.Map | null = null;

        loader.load().then(() => {
            if (googlemap.current) {
                map = new google.maps.Map(googlemap.current, {
                    center: { lat: -34.397, lng: 150.644 }, // or anywhere you want to show on the map by default
                    zoom: 8, // or any other zoom level
                });
            }
        });

        // Clean up the map when the component is unmounted
        return () => {
            if (map) {
                google.maps.event.clearInstanceListeners(map);
                map = null;
            }
        };
    }, []);

    return <div id="map" ref={googlemap} style={{ height: '400px', width: '100%' }} />;
}
