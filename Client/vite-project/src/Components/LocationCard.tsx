import * as React from 'react';
import { useState } from "react";
import { styled } from '@mui/material/styles';
import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Collapse from '@mui/material/Collapse';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import ThumbUpOffAltIcon from '@mui/icons-material/ThumbUpOffAlt';
import { deleteItem, editItem, getItem } from '../Services/service';
import { endPoint } from '../Services/config';
import { isToken } from '../Services/cookies';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { addLocation } from '../Services/CRUD copy';
import { useNavigate } from 'react-router-dom';
import { errorAlert, successAlert } from '../Services/alerts';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
  transition: theme.transitions.create('transform', {
    duration: theme.transitions.duration.shortest,
  }),
}));

const LocationCard: React.FC<any> = (props) => {
  const [expanded, setExpanded] = React.useState(false);
  const [likes, setLikes] = useState(props.location.likes);
  const [isAdmin, setIsAdmin] = useState(false);

  const url = props.location.imageUrl;
  const navigate = useNavigate();
  const handleExpandClick = () => {
    setExpanded(!expanded);
  };
  const propsId = props.location.id;
  getItem(`${endPoint}/location/isAdmin`).then(res => {
    setIsAdmin(res.data);
  });
  const addLike = (id: number) => {
    console.log('addLike', id);
    if (isToken())
      editItem(id, `${endPoint}/location/addLike`)
        .then(response => {
          console.log(response.data);
          setLikes(likes + 1);
        })
        .catch(() => console.log('unAthorize'));
    else
      errorAlert('אינך משתמש רשום');
  }
  const add = () => {
    addLocation(true, propsId, props.location.name, props.location.address, props.location.imageUrl, props.location.description, props.location.area, props.location.likes, props.location.imagesList, props.location.userName);
  }

  const edit = () => {
    navigate('/edit', { state: { isTemp: props.isTemp, location: props.location } });
  }

  const del = () => {
    console.log('isTemp', props.isTemp);
    const del = {
      id: propsId,
      isTemp: props.isTemp
    }
    console.log('del: ', del);
    deleteItem(del, `${endPoint}/location/delete`).then(() => {
      console.log('deleted successfully');
      successAlert('לוקיישן זה הוסר בהצלחה');
      setTimeout(() => {
        window.location.reload();
      }, 3000);
    });
  }

  const open = () => {
    console.log(props.location.point);
    if (props.location.imagesList.length >= 0 || props.location.point) {
      console.log('locationCard', props.location);
      props.location.imagesList.map((image: string) => console.log(image));
      navigate('/openLocation', { state: { location: props.location, isAdmin: isAdmin } });
    }
  }

  return (
    <Card sx={{ width: 330, margin: 4 }}>
      <CardHeader
        action={
          <>
            {isAdmin && <IconButton id={propsId.toString()} onClick={() => edit()}> <EditIcon /></IconButton> || ''}
            {isAdmin && props.isTemp && <IconButton id={propsId.toString()} onClick={() => add()}> <AddIcon /></IconButton> || ''}
            {isAdmin && <IconButton id={propsId.toString()} onClick={() => del()}> <DeleteIcon /></IconButton> || ''}
          </>
        }
        title={props.location.name}
        subheader={props.location.address}
      />
      <div>
        {isToken() && <IconButton onClick={() => { addLike(propsId) }}><ThumbUpOffAltIcon /></IconButton>
          || <IconButton disabled title='אינך משתמש רשום'><ThumbUpOffAltIcon /></IconButton>}
        <h5>{likes}</h5>
      </div>
      <CardMedia
      style={{ cursor: 'pointer' }}
        onClick={() => { open() }}
        component="img"
        height="194"
        image={url}
        alt="התמונה לא עלתה"
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {props.location.description}
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
        </IconButton>
        <IconButton aria-label="share">
        </IconButton>
        <ExpandMore
          expand={expanded}
          onClick={handleExpandClick}
          aria-expanded={expanded}
          aria-label="show more"
        >
        </ExpandMore>
      </CardActions>
      <Collapse in={expanded} timeout="auto" unmountOnExit>
      </Collapse>
    </Card>
  );
}

export default LocationCard