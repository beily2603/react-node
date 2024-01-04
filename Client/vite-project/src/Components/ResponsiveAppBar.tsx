import * as React from 'react';
import { useState } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import Menu from '@mui/material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import MenuIcon from '@mui/icons-material/Menu';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import MenuItem from '@mui/material/MenuItem';
import { useNavigate } from 'react-router-dom';
import { getItem } from '../Services/service';
import { endPoint } from '../Services/config';
import { getCookie, isToken, removeCookie } from '../Services/cookies';
import { infoAlert } from '../Services/alerts';
import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail';
import { checkChange, getMessage } from '../Services/sessionStorage';

const pages = ['Signup', 'Login', 'Location'];
const hebrewPages = ['הרשמה', 'כניסה', 'רשימת לוקיישנים'];
checkChange();
const countMessage = getMessage().count;
const names = getMessage().list;

function ResponsiveAppBar() {
    const [userName, setUserName] = useState("");
    const [shouldReload, setShouldReload] = useState(true);
    const [isAdmin, setIsAdmin] = useState(false);

    if (isToken()) {
        getItem(`${endPoint}/user/userName`).then(res => {
            setUserName(res.data);
        });
    }
    const navigate = useNavigate();

    const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);
    const [anchorElUser, setAnchorElUser] = React.useState<null | HTMLElement>(null);
    const [anchorElImages, setAnchorElImages] = React.useState<null | HTMLElement>(null);

    getItem(`${endPoint}/location/isAdmin`).then(res => {
        setIsAdmin(res.data);
        console.log("isAdmin? ", res.data);
    });

    const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElNav(event.currentTarget);
    };
    const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElUser(event.currentTarget);
    };

    const handleCloseNavMenu = (page: string) => {
        const index = hebrewPages.indexOf(page);
        navigate(`/${pages[index]}`);
    };

    const handleCloseUserMenu = () => {
        setAnchorElUser(null);
    };

    const handleCloseImages = () => {
        setAnchorElImages(null);
    };

    const handleOpenImages = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorElImages(event.currentTarget);
    };

    const logout = () => {
        console.log('logout');
        removeCookie("token");
        getCookie("token");
        infoAlert('התנתקת בהצלחה, מתגעגעים אליך כבר מעכשיו...');
        setUserName(" ");
        navigate('/');
        if (shouldReload) {
            window.location.reload();
            setShouldReload(false);
        }
    }

    return (<>
        <AppBar sx={{ backgroundColor: '#11B862' }} dir="rtl" >
            <Container maxWidth="xl">
                <Toolbar disableGutters>
                    <Typography
                        fontFamily={'Calibri'}
                        textAlign={'center'}
                        variant="h6"
                        noWrap
                        component="a"
                        href="/"
                        sx={{
                            mr: 2,
                            display: { xs: 'none', md: 'flex' },
                            fontWeight: 800,
                            letterSpacing: '.4rem',
                            color: 'white',
                            textDecoration: 'none',
                        }}
                    >
                        בית
                    </Typography>

                    <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
                        <IconButton
                            size="large"
                            aria-label="account of current user"
                            aria-controls="menu-appbar"
                            aria-haspopup="true"
                            onClick={handleOpenNavMenu}
                            color="success"
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            id="menu-appbar"
                            anchorEl={anchorElNav}
                            anchorOrigin={{
                                vertical: 'bottom',
                                horizontal: 'left',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'left',
                            }}
                            open={Boolean(anchorElNav)}
                            onClose={() => handleCloseNavMenu("/")}
                            sx={{
                                display: { xs: 'block', md: 'none' },
                            }}
                        >
                            {hebrewPages.map((page) => (
                                <MenuItem key={page} onClick={() => handleCloseNavMenu(page)}>
                                    <Typography textAlign="center">{page}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>
                    <Typography
                        variant="h5"
                        noWrap
                        component="a"
                        href=""
                        sx={{
                            mr: 2,
                            display: { xs: 'flex', md: 'none' },
                            flexGrow: 1,
                            fontFamily: 'Clibri',
                            fontWeight: 700,
                            letterSpacing: '.3rem',
                            color: 'white',
                            textDecoration: 'none',
                        }}
                    >
                        תפריט
                    </Typography>
                    <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
                        {hebrewPages.map((page) => (
                            <Button
                                key={page}
                                onClick={() => { handleCloseNavMenu(page) }}
                                sx={{ my: 2, color: 'white', display: 'block' }}
                            >
                                {page}
                            </Button>
                        ))}
                    </Box>


                   {isAdmin && <Box sx={{ flexGrow: 0 }}>
                        {/* <Tooltip title=""> */}
                            <IconButton onClick={handleOpenImages} sx={{ p: 0 }}>
                                <Badge badgeContent={countMessage} color="primary">
                                    <MailIcon color="action" />
                                </Badge>
                            </IconButton>
                        {/* </Tooltip> */}
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElImages}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            dir='rtl'
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElImages)}
                            onClose={handleCloseImages}
                        >
                            {names.map((name: string) => (
                                <MenuItem key={name} onClick={handleCloseUserMenu}>
                                    <Typography textAlign="center">{name}</Typography>
                                </MenuItem>
                            ))}
                        </Menu>
                    </Box>}



                    <Box sx={{ flexGrow: 0 }}>
                        {isToken() &&
                            <button style={{ margin: 10 }} onClick={logout}>יציאה מהחשבון</button>
                            || <Button variant="outlined" disabled>יציאה מהחשבון</Button>}

                        <Tooltip title={userName}>
                            <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                                <Avatar alt="Remy Sharp" src="" />
                            </IconButton>
                        </Tooltip>
                        <Menu
                            sx={{ mt: '45px' }}
                            id="menu-appbar"
                            anchorEl={anchorElUser}
                            anchorOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            keepMounted
                            transformOrigin={{
                                vertical: 'top',
                                horizontal: 'right',
                            }}
                            open={Boolean(anchorElUser)}
                            onClose={handleCloseUserMenu}
                        >
                            {userName}
                        </Menu>
                    </Box>
                </Toolbar>
            </Container>
        </AppBar>
    </>
    );
}
export default ResponsiveAppBar;