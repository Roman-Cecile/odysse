import React from 'react';
import {
  ListItem,
  ListItemIcon,
  ListItemText,
} from '@material-ui/core';
import {
  Create as EditIcon,
} from '@material-ui/icons';

const Edit = ({ classes }) => {
  const [isActive, setIsActive] = React.useState(true);
  window.addEventListener('keydown', (event) => {
    if (event.keyCode === 27) {
      setIsActive(false);
    }
  });
  return (
    <>
      <ListItem
        button
        className={classes}
        disabled={isActive}
        onClick={() => {
          window.postMessage(['edit']);
        }}
      >
        <ListItemIcon>
          <EditIcon />
        </ListItemIcon>
        <ListItemText
          primary="Editer"

        />
      </ListItem>
    </>
  );
};

export default Edit;
