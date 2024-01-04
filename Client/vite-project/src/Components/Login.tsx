import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addItem } from "../Services/service";
import { endPoint } from "../Services/config";
import { setCookie } from "../Services/cookies";
import { Box, Card, CardContent, CardHeader, Grid, Paper, TextField } from "@mui/material";
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { infoAlert, successAlert } from "../Services/alerts";
import img from '../assets/camera.jpg';

const Login: React.FC = () => {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();
    const [shouldReload, setShouldReload] = useState(true);

    const login = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        const user = {
            name: name,
            password: password
        }
        addItem(user, `${endPoint}/auth`).then(res => {
            if (shouldReload) {
                successAlert(`שלום ${name} שמחים שנכנסת ללוקיישן`);
                setTimeout(() => {
                    navigate('/');
                    window.location.reload();
                }, 3000);
            }
            setCookie("token", res.data.access_token, 14);
        })
            .catch(() => {
                infoAlert('גם אנחנו היינו רוצים שתכנס, אך נראה !שעוד לא נרשמת. מוזמן לעשות זאת');
            });
    }
    console.log(name);
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
            <Card sx={{ width: 300, height: 546, marginTop: 4.5, direction: 'rtl', padding: 10, backgroundColor: 'rgba(255, 255, 255, 0.9)' }}>
                <CardHeader title='כניסה' />
                <CardContent>
                    <Box dir='rtl' component="form" onSubmit={login}>
                        <Grid container justifyContent="center" spacing={2}>
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
                                <button>אישור</button>
                                <ToastContainer />
                            </div>
                        </Grid>
                    </Box>
                </CardContent>
                <br />
                <button onClick={() => navigate('/signup')}>חדש?<br />
                    הרשם כאן!
                </button>
            </Card>
        </>
    );
}

export default Login;