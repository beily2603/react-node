import { useState } from "react";
import { getBySearch } from "../Services/service";
import { endPoint } from "../Services/config";
import LocationCard from "./LocationCard";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { Grid, Box, TextField } from '@mui/material';
import { Area } from "../Services/interfaces";
import { errorAlert } from "../Services/alerts";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
const Filter: React.FC = () => {

  const [freeSearch, setFreeSearch] = useState(' ');
  const [select, setSelect] = useState('allEarth');
  const [locations, setLocations] = useState([{ id: 0, name: '', address: '', image: '', imageUrl: '', description: '', area: '', likes: 0, date: null }]);
  const keys = Object.keys(Area);
  const values = Object.values(Area);

  const search = async () => {
    const objSearch = {
      freeSearch: freeSearch,
      select: select
    }

    let data: any;
      getBySearch(objSearch, `${endPoint}/location/search`).then((result) => { return result })
        .then((result) => {
          data = result.data;
          if (data.length === 0) {
            errorAlert('לא נמצאו לוקיישנים מתאימים');
            data = [{ id: 0 }];
          }
          setLocations(data);
        }
        ).catch(() => errorAlert('לא נמצאו לוקיישנים מתאימים'));
  }

  return (<>
    <Box>
      <FormControl fullWidth>
        <FormControl fullWidth>
          <TextField
            dir="rtl"
            type="search"
            label="חיפוש חופשי"
            id="outlined-required"
            value={freeSearch}
            onChange={e => setFreeSearch(e.target.value)} />
        </FormControl>
        <br />
        <FormControl fullWidth>
          <InputLabel id="demo-simple-select-label">אזור</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={select}
            label="אזור"
            onChange={e => setSelect(e.target.value)}
          >
            {values.map((value, index) => <MenuItem dir="rtl" key={index} value={keys[index]}>{value}</MenuItem>)}
          </Select>
        </FormControl>
        <br />
        <button onClick={search}>חפש</button>
      </FormControl>
    </Box>
    <Grid sx={{ flexGrow: 1 }} container spacing={2}>
      <Grid item xs={12}>
        <Grid container justifyContent="center" flexDirection='row-reverse' spacing={2}>
          {locations[0].id != 0 && locations.map((location, index) => <LocationCard key={index} isTemp={false} location={location} />) || ''}
          <ToastContainer />
        </Grid>
      </Grid>
    </Grid>
  </>)
}

export default Filter;