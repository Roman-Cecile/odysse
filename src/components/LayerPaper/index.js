import React from 'react';

// Import Material UI
// import {
//     InsertDriveFileOutlined as InsertDriveFileOutlinedIcon
// } from '@material-ui/icons';
import { makeStyles } from '@material-ui/core/styles';
import { Paper, Divider } from '@material-ui/core';
import {
  Clear as ClearIcon,
} from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    '& > *': {
      width: theme.spacing(16),
      height: theme.spacing(16),
    },
  },
  noLayer: {
    color: 'grey',
    fontStyle: 'italic',
  },
  paperLi: {
    display: 'flex',
    justifyContent: 'space-between',
  },

  layerActive: {
    cursor: 'pointer',
  },
}));

const LayerPaper = ({ layersActive, deleteLayer }) => {
  const classes = useStyles();

  return (

    <Paper elevation={0}>
      {layersActive.length > 0
        ? layersActive.map((layer) => (
          <li className={classes.paperLi}>
            <span className={classes.layerActive} onClick={() => window.postMessage(['showLayer', layer.extent])}>
              {layer.name}
            </span>
            <ClearIcon
              className={classes.layerActive}
              color="secondary"
              onClick={() => {
                deleteLayer(layer);
                window.postMessage(['deleteLayer', layer.name]);
              }}
            />
          </li>
        ))
        : <span className={classes.noLayer}>No open layer</span>}
    </Paper>

  );
};

export default LayerPaper;
