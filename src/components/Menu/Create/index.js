import React from 'react';

// Import Material UI
import {
  Menu,
  MenuItem,
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Add as CreateIcon,
} from '@material-ui/icons';

const Create = ({ classes }) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  window.addEventListener('keydown', (event) => {
    if (event.keyCode === 27) {
      window.postMessage(['escape']);
    }
  });

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <ListItem button className={classes}>

        <ListItemIcon onClick={handleClick}>
          <CreateIcon />
        </ListItemIcon>

        <ListItemText primary="Créer" onClick={handleClick} />
      </ListItem>
      <Menu
        id="simple-menu"
        anchorEl={anchorEl}
        keepMounted
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem
          onClick={() => {
            handleClose();
            window.postMessage(['select', 'Point']);
          }}
          id="Point"
        >
          Point
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            window.postMessage(['select', 'LineString']);
          }}
          id="Line"
        >
          Line
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            window.postMessage(['select', 'MultiPolygon']);
          }}
          id="MultiPolygon"
        >
          MultiPolygon
        </MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            window.postMessage(['select', 'Circle']);
          }}
          id="Circle"
        >
          Circle
        </MenuItem>
      </Menu>
    </>
  );
};

export default Create;
