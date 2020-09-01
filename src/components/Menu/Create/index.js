import React from 'react';

// Import Material UI
import {
  Button,
  Menu,
  MenuItem,
} from '@material-ui/core';

const Create = () => {
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
      <Button aria-controls="simple-menu" aria-haspopup="true" onClick={handleClick}>
        Créer
      </Button>
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
            window.postMessage(['select', 'Polygon']);
          }}
          id="Polygon"
        >
          Polygon
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
