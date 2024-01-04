import * as React from 'react';
import Card from '@mui/material/Card';
import { CardHeader, Grid, ImageList, ImageListItem, Box, Typography, Button, IconButton } from '@mui/material';
import Modal from '@mui/material/Modal';
import { useLocation } from 'react-router-dom';
import Map from './Map';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { upload } from '../create-reference/storage';
import { endPoint } from '../Services/config';
import { successAlert } from '../Services/alerts';
import { updateItem } from '../Services/service';
import { location, update } from '../Services/interfaces';
import { checkChange } from '../Services/sessionStorage';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import CircularProgress from '@mui/material/CircularProgress';

const OpenLocation: React.FC = () => {

    const modalStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        maxWidth: '100%',
        maxHeight: '100%',
        bgcolor: 'white',
        boxShadow: 24,
        p: 4,
    };
    const navigationButtonStyle = {
        position: 'absolute' as 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
    };

    console.log('Open Location');
    const location = useLocation();
    const isAdmin = location.state && location.state.isAdmin;
    const newLocation = location.state && location.state.location;
    const description = newLocation.description;
    const address = newLocation.address;
    const area = newLocation.area;
    const name = newLocation.name;
    const pointLat = newLocation.point.lat;
    const pointLng = newLocation.point.lng;
    const imagesList = newLocation.imagesList;
    const userName = newLocation.userName;
    const [tempImagesList, setTempImagesList] = React.useState(newLocation.tempImagesList);
    const [loading, setLoading] = React.useState(false);
    console.log(tempImagesList);

    const [open, setOpen] = React.useState(false);
    const [selectedImageIndex, setSelectedImageIndex] = React.useState<number | null>(null);
    const fileInputRefList = React.createRef<HTMLInputElement>();

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        event.preventDefault();
        const file = event.target.files && event.target.files[0];
        if (file) {
            console.log(file);
            handleLoading();
            console.log(loading);
            upload(file)
                .then((response) => {
                    const tempList = [...tempImagesList, response];
                    setTempImagesList(tempList);
                    saveChanges(response);
                    console.log('tempImagesList 1: ', tempImagesList);
                    successAlert('התמונה נוספה ומחכה לבקרת המנהל. תודה לך!')
                });
            handleLoading();
            console.log(loading);
        }
    }

    const handleLoading = () => {
        setLoading(!loading);
    }
    const saveChanges = (response: string) => {
        const location: location = {
            id: newLocation.id,
            name: newLocation.name,
            address: newLocation.address,
            imageUrl: newLocation.imageUrl,
            description: newLocation.description,
            area: newLocation.area,
            likes: newLocation.likes,
            date: newLocation.date,
            imagesList: newLocation.imagesList,
            tempImagesList: [...tempImagesList, response],
            point: newLocation.point,
            information: ''
        }
        console.log('tempImagesList 2: ', tempImagesList);
        console.log('newLocation: ', location);
        const update: update = {
            item: location,
            isTemp: false
        }
        updateItem(update, `${endPoint}/location`).then(() => {
            checkChange();
            window.location.reload();
            successAlert('התמונה נוספה בהצלחה');
        });
    }

    const handleOpen = (index: number) => {
        setSelectedImageIndex(index);
        console.log('index: ', index, ' selectedImageIndex: ', selectedImageIndex);
        setOpen(true);
    };

    const handleClose = () => {
        setSelectedImageIndex(null);
        setOpen(false);
    };

    const handlePrev = () => {
        console.log(selectedImageIndex);
        if (selectedImageIndex !== null && selectedImageIndex > 0) {
            setSelectedImageIndex(selectedImageIndex - 1);
        }
    };

    const addImage = (index: number) => {
        const image = tempImagesList[index];
        let tempList = tempImagesList;
        tempList.splice(index, 1);
        console.log('tempList: ', tempList);
        setTempImagesList(tempList);
        save(image);
    }

    const save = (image: string) => {
        const location: location = {
            id: newLocation.id,
            name: name,
            address: address,
            description: description,
            imageUrl: newLocation.imageUrl,
            area: area,
            likes: newLocation.likes,
            date: newLocation.date,
            imagesList: imagesList,
            tempImagesList: tempImagesList,
            point: {
                lat: pointLat,
                lng: pointLng
            },
            information: '',
            userName: newLocation.userName
        }
        if (image != "") {
            location.imagesList = [...imagesList, image]
        }
        console.log('location after add image: ', location);
        const update: update = {
            item: location,
            isTemp: false
        }
        updateItem(update, `${endPoint}/location`).then(() => {
            console.log(update.item);
            checkChange();
            // setTimeout(() => { window.location.reload()}, 600);
            successAlert('התמונה נוספה בהצלחה');
        });
    }
    const deleteImage = (index: number) => {
        let tempList = tempImagesList;
        tempList.splice(index, 1);
        console.log('tempList: ', tempList);
        setTempImagesList(tempList);
        save("");
    }


    const handleNext = () => {
        console.log(selectedImageIndex);
        if (selectedImageIndex !== null && selectedImageIndex < imagesList.length - 1) {
            setSelectedImageIndex(selectedImageIndex + 1);
        }
    };

    const handleAddClick = () => {//מקרה שאייכון העריכה נלחץ, נקראת הפונ' הרלוונטית
        if (fileInputRefList.current) {
            fileInputRefList.current.click();
        }
    };
    return (
        <>
            <Card sx={{ width: '100%', height: 610, marginTop: 8, marginBottom: 10, display: 'flex', flexDirection: 'row-reverse' }}>
                <Grid container direction={'row-reverse'}>
                    <Grid>
                        <CardHeader
                            title={name}
                            subheader={'כתובת: ' + address + ', אזור: ' + area}
                        >
                            {description}
                        </CardHeader>
                    </Grid>
                    <Grid>
                        {imagesList.length > 0 && <ImageList sx={{ width: 600, height: 500, marginBottom: 10 }} variant="masonry" cols={3} gap={8} >
                            <button style={{ marginBottom: '10px' }} onClick={handleAddClick}>הוספת תמונה</button>
                            {imagesList.map((item: any, index: number) => (
                                <ImageListItem key={item} sx={{ maxWidth: 400, maxHeight: 500 }}>
                                    <img
                                        style={{ cursor: 'pointer' }}
                                        src={`${item}?w=248&fit=crop&auto=format`}
                                        srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                                        loading="lazy"
                                        onClick={() => handleOpen(index)}
                                    />
                                </ImageListItem>
                            ))}
                        </ImageList>
                            ||
                            <div style={{ marginTop: 100 }}> <br />
                                <Typography variant='h4' color='rgb(182 189 180)'>?יש לך תמונות להתרשמות <br /> !כולנו נשמח</Typography>
                                <button style={{ margin: 30 }} onClick={handleAddClick}>הוספת תמונה</button>
                            </div>}

                        <Modal
                            open={open}
                            onClose={handleClose}
                        >
                            <Box sx={modalStyle}>
                                {selectedImageIndex !== null && (
                                    <React.Fragment>
                                        <img
                                            src={`${imagesList[selectedImageIndex]}?w=600&fit=crop&auto=format`}
                                            alt={`Image ${selectedImageIndex + 1}`}
                                            style={{ width: '100%', maxHeight: '80vh', objectFit: 'contain' }}
                                        />
                                        <Button
                                            style={{ ...navigationButtonStyle, left: -5 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handlePrev();
                                            }}
                                            disabled={selectedImageIndex === 0}
                                        >
                                            <IconButton><ArrowBackIosIcon /></IconButton>
                                        </Button>
                                        <Button
                                            style={{ ...navigationButtonStyle, right: -7 }}
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleNext();
                                            }}
                                            disabled={selectedImageIndex === imagesList.length - 1}
                                        >
                                            <IconButton><ArrowForwardIosIcon /></IconButton>
                                        </Button>
                                    </React.Fragment>
                                )}
                            </Box>
                        </Modal>
                    </Grid>
                    {loading && <CircularProgress />}
                </Grid>

                <input
                    type="file"
                    ref={fileInputRefList}
                    style={{ display: 'none' }}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => handleFileChange(event)}
                />
                <Map address={address} />
            </Card>
            {userName && <Typography variant='h5'>הלוקיישן נוסף על ידי {userName}</Typography>}
            {isAdmin && <ImageList sx={{ width: 600, height: 500, marginBottom: 10 }} variant="masonry" cols={3} gap={8} >
                {tempImagesList.map((item: any, index: number) => (
                    <ImageListItem key={item} sx={{ maxWidth: 400, maxHeight: 500 }}>
                        <img
                            style={{ cursor: 'pointer', border: '1px solid' }}
                            src={`${item}?w=248&fit=crop&auto=format`}
                            srcSet={`${item}?w=248&fit=crop&auto=format&dpr=2 2x`}
                            loading="lazy"
                            onClick={() => handleOpen(index)}
                        />
                        <div onClick={() => addImage(index)}>
                            <IconButton> <AddIcon /></IconButton>
                            <IconButton onClick={() => deleteImage(index)}> <DeleteIcon /></IconButton>
                        </div>
                    </ImageListItem>
                ))}
            </ImageList>}


        </>
    );
}
export default OpenLocation;