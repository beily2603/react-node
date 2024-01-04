import React, { useState } from 'react';
import { getToHome } from '../Services/service';
import { endPoint } from '../Services/config';
import Grid from '@mui/material/Grid';
import CardMedia from '@mui/material/CardMedia';
import LocationCard from './LocationCard';
import img from '../assets/location.png';

const Home: React.FC = () => {
  const [popularLocations, setPopularLocations] = useState([{ id: 0, name: '', address: '', image: '', imageUrl: '', description: '', area: '', likes: 0, date: null, imagesList: [''], tempImagesList: [] }]);
  const [lastLocations, setLastLocations] = useState([{ id: 0, name: '', address: '', image: '', imageUrl: '', description: '', area: '', likes: 0, date: null, imagesList: [''], tempImagesList: [] }]);
  const last = "last";
  const likes = "likes";
  const setLocations = () => {
    getToHome(last, `${endPoint}/location/getToHome`)
      .then(response => {
        setLastLocations(response.data);
      })
      .catch(err => console.log(err));
    getToHome(likes, `${endPoint}/location/getToHome`)
      .then(response => {
        setPopularLocations(response.data);
      });
  }

  setLocations();

  return (
    <div>
      <br /><br />
      <CardMedia
        component="img"
        height="300"
        width="180"
        image={img}
        alt="התמונה לא עלתה"
      />
      <div>
        <h2>הלוקיישנים האחרונים</h2>
        <Grid sx={{ flexGrow: 1 }} container spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
              {lastLocations[0].id != 0 && lastLocations.map((location, index) => (
                <LocationCard key={index} location={location} />
              )) || ''}
            </Grid>
          </Grid>
        </Grid>
      </div>
      <div>
        <h2>הלוקיישנים הפופולרים</h2>
        <Grid sx={{ flexGrow: 1 }} container spacing={2}>
          <Grid item xs={12}>
            <Grid container justifyContent="center" spacing={2}>
              {popularLocations[0].id != 0 && popularLocations.map((location, index) => (
                <LocationCard key={index} isTemp={false} location={location} />
              )) || ''}
            </Grid>
          </Grid>
        </Grid>
      </div>
    </div>
  );
}

export default Home