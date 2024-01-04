import { useEffect, useState } from "react";
import ImageUploader from "./ImageUploader";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import { Button, FormControlLabel, Radio, RadioGroup, TextField } from "@mui/material";
import { isToken } from "../Services/cookies";
import { addLocation } from "../Services/CRUD copy";
import { Area } from "../Services/interfaces";
import SendIcon from '@mui/icons-material/Send';
import { getItem } from "../Services/service";
import { endPoint } from "../Services/config";
import Checkbox from '@mui/material/Checkbox';
import { GoogleMap, useLoadScript, StandaloneSearchBox } from '@react-google-maps/api';


const Add: React.FC = () => {
  const [file, setFile] = useState<File | null>(null);
  const [fileList, setFileList] = useState<FileList | null>(null);
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const [image, setImage] = useState('')
  const [description, setDescription] = useState('');
  const [area, setArea] = useState('');
  const [likes, setLikes] = useState(1);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addName, setAddName] = useState(false);
  const [defaultName, setDefaultName] = useState(true);
  const [userName, setUserName] = useState('');

  console.log(userName);
  console.log(name);

  const keys = Object.keys(Area);
  let values = Object.values(Area);
  values = values.filter(value => value != Area.allEarth);
  getItem(`${endPoint}/location/isAdmin`).then(res => {
    setIsAdmin(res.data);
  });

  const add = (event: any) => {
    event.preventDefault();
   
    if (isToken()) {
      setLoading(true);
      addLocation(isAdmin, 0, name, event.target.address.value, image, description, area, likes, [], userName, file!, fileList!);
      setLoading(false);
      setName('');
      setAddress('');
      setImage('');
      setDescription('');
      setArea('');
      setLikes(1);
    }
  }
  const changeDefaultName = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDefaultName(!defaultName);
  };
  const changeArea = (event: SelectChangeEvent) => { //דואג לשליפת האזור מאפשרויות הבחירה ושמירתו במשתנה
    const index = keys.indexOf(event.target.value as Area);
    setArea(values[index]);
  }

  const handleFile = (newFile: File) => {//פונקציה זו נקראת בקומ' העלאת תמונה  ומכניסה אותה לתוך משתנה 
    setFile(newFile);//הנשלח חזרה לקומ' זו
  }

  const handleMultipleFiles = (newFiles: FileList) => {//פונ' שמטפלת ברשימת תמונות
    setFileList(newFiles);
  }

  const showNamesOptions = () => {
    setAddName(!addName);
    if (!addName) {
      getItem(`${endPoint}/user/userName`).then(res => {
        setUserName(res.data);
      });
    }
  }

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: 'AIzaSyAG9BgIxjYCW4MYzBG75bHy0vz6oUJo1HM',
    libraries: ['places'],
  });


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
    console.log('after click ', address);

  }

  return (<>
    <h1>הוספת לוקיישן</h1>
    <form dir="rtl" onSubmit={add}>
      <FormControl fullWidth>
        <TextField
          required
          dir="rtl"
          id="outlined-basic"
          label="שם לוקיישן" variant="outlined"
          onChange={(e) => setName(e.target.value)} />
        <br /> </FormControl>
      {/* <FormControl fullWidth>
        <TextField id="outlined-basic" label="כתובת" variant="outlined" onChange={(e) => setAddress(e.target.value)} required />
        <br /> </FormControl> */}

      <StandaloneSearchBox
        onLoad={() => setupAutocomplete()}
      >
        <TextField
          dir="rtl"
          required
          id="address"
          label="כתובת"
          name='address'
        // value={address}
        // onChange={e => setAddress(e.target.value)}
        />
      </StandaloneSearchBox>

      <FormControl fullWidth>
        <InputLabel id="demo-simple-select-label">אזור</InputLabel>
        <Select
          required
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          label="area"
          name="select"
          onChange={changeArea}
        >
          {values.map((value, index) => <MenuItem key={index} value={keys[index]}>{value}</MenuItem>)}
        </Select> <br />
      </FormControl>
      <FormControl fullWidth>
        <TextField id="outlined-basic" label="תאור" variant="outlined" onChange={(e) => setDescription(e.target.value)} />
        <br />  </FormControl>

      <FormControl fullWidth>
        <ImageUploader handleFile={handleFile} handleMultipleFiles={handleMultipleFiles} required />
      </FormControl>
      <br />
      <FormControlLabel control={<Checkbox color="success" onChange={showNamesOptions} />} label="האם הינך מעונין ששמך יופיע באתר כמוסיף הלוקיישן הזה?" />
      {/* הצגת שמך כמוסיף הלוקיישן הזה */}
      <div>
        {addName &&
          <FormControl>
            <RadioGroup
              aria-labelledby="demo-controlled-radio-buttons-group"
              name="controlled-radio-buttons-group"
              value={defaultName}
              onChange={changeDefaultName}
            >
              <FormControlLabel value={true} control={<Radio color="success" defaultChecked />} label="שמך" />
              <div>
                <FormControlLabel value={false} control={<Radio color="success" />} label="שם אחר" />

                <FormControl>
                  <TextField
                    id="standard-read-only-input"
                    label="בחר שם"
                    color="success"
                    disabled={defaultName}
                    // value={userName}
                    onChange={(event) => setUserName(event.target.value)}
                    variant="standard"
                  /></FormControl>

              </div>
            </RadioGroup>
          </FormControl>
        }</div>
      <br />
      <Button type="submit" variant="contained" endIcon={<SendIcon />}>שליחה</Button>
    </form>

    <div>
      {loading && <p>Uploading...</p>}
    </div>
  </>);
}

export default Add;