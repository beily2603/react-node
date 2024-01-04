import React, { useState } from "react"
import { useNavigate } from "react-router-dom";
import Filter from "./Filter";
import { getTemp, getItem } from "../Services/service";
import { endPoint } from "../Services/config";
import LocationCard from "./LocationCard";
import { isToken } from "../Services/cookies";
import { Grid } from "@mui/material";

const Locations: React.FC = () => {
    const navigate = useNavigate();
    const [isAdmin, setIsAdmin] = useState(false);
    const [show, setShow] = useState(false);
    const [locations, setLocations] = useState([{ id: 0, name: '', address: '', image: '', imageUrl: '', description: '', area: '', likes: 0, date: null, imagesList: [], tempImagesList: [], userName: '' }]);
    console.log(show);

    getItem(`${endPoint}/location/isAdmin`).then(res => {
        setIsAdmin(res.data);
        console.log("isAdmin? ", res.data);
    });

    const showAllLocations = () => {
        console.log('show in function: ', show);
        if (!show) {
            console.log('true');
            getTemp(`${endPoint}/location/getTempLocations`).then((result) => {
                console.log(result);
                setLocations(result.data);
            });
        }
        else {
            setLocations([{ id: 0, name: '', address: '', image: '', imageUrl: '', description: '', area: '', likes: 0, date: null, imagesList: [], tempImagesList: [], userName: '' }]);
        }
        setShow(!show);
    }
    return (<>
        <h1>רשימת לוקיישנים</h1>
        {isToken() && <button onClick={() => navigate('/Add')}>הוספת לוקיישן</button>
            || <button title="אינך משתמש רשום" disabled>הוספת לוקיישן</button>}
        <br />  <br />
        <Grid sx={{ flexGrow: 1 }} container spacing={2}>
            <Grid item xs={12}>
                <Grid container justifyContent="center" spacing={2}>
                    {
                        locations[0].id != 0 && locations.map((location, index) =>
                            <LocationCard key={index} isTemp={true} location={location} />)
                    }
                </Grid>
            </Grid>
        </Grid>
        {isAdmin && <button onClick={() => { setShow(!show); showAllLocations(); }}>
            {!show && ' רשימה זמנית' || 'סגירת רשימה זמנית'} </button>}
        <br />
        <br />
        <Filter />
    </>);
}

export default Locations;