import { useState } from "react";
import { addItem, getSearch } from "../Services/service";
import { endPoint } from "../Services/config";
import { Box, Card, CardContent, CardHeader, Grid, Paper, TextField, Typography } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import { errorAlert, successAlert } from "../Services/alerts";
import 'react-toastify/dist/ReactToastify.css';
import img from '../assets/camera.jpg';
import { useNavigate } from "react-router-dom";

const SignUp: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const signup = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const user = {
            name: name,
            password: password
        }
        addItem(user, `${endPoint}/user`)
            .then(() => {
                successAlert(user.name + ' נוספת בהצלחה לרשימת המשתמשים ');
                setTimeout(() => {
                    navigate('/Login');
                }, 3000);
            })
            .catch(() => errorAlert('המשתמש כבר קיים.'));
    }
    getSearch(`${endPoint}/search`).then((response) => {
        console.log(response.data);
    });

    return (
        <>
            <Paper
                sx={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    width: '100%',
                    height: '100%',
                    position: 'absolute',
                    top: 30,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    zIndex: -1,
                }}
            >
            </Paper>
            <Card sx={{ width: 300, height: 546, direction: 'rtl', padding: 10, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <CardHeader title="הרשמה" />
                <CardContent>
                    <Box component="form" onSubmit={signup}>
                        <Grid container justifyContent="center" spacing={2}>
                          <br />
                            <Typography variant="h6" color={'GrayText'}>משתמש רשום יכול להוסיף לוקיישן ולסמן לייק על לוקיישנים קיימים</Typography>
                           <br />
                            <Grid item xs={20}>
                                <TextField
                                    dir="rtl"
                                    required
                                    id="outlined-required"
                                    label="שם"
                                    onChange={e => setName(e.target.value)}
                                />
                                <br /><br />
                                <TextField
                                    dir="rtl"
                                    type="password"
                                    required
                                    id="outlined-required"
                                    label="סיסמה"
                                    onChange={e => setPassword(e.target.value)}
                                />
                            </Grid>
                            <br />
                            <br />
                            <div>
                                <br />
                                <br />
                                <button>הרשמה ללוקיישן</button>
                                <ToastContainer />
                            </div>
                        </Grid>
                    </Box>
                </CardContent>
            </Card>
        </>
    );
}

export default SignUp;