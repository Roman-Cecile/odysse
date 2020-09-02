// == Import npm
import React from 'react';

// == Import material UI
import { makeStyles } from '@material-ui/core/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import CancelOutlinedIcon from '@material-ui/icons/CancelOutlined';
import { Slide, Paper } from '@material-ui/core';


// == Import
import PaperImportedLayer from '../../containers/ImportedLayers';
import Illion from '../../containers/Illion';

import './styles.scss';

const useStyles = makeStyles((theme) => ({
  paperStyleLi: {
    display: 'flex',
    justifyContent: 'space-between',
  },
  paperStyle: {
    position: 'fixed',
    bottom: '10px',
    right: '10px',
    width: '15%',
    zIndex: '20',
    padding: '0.8em',
  },
  trash: {
    position: 'sticky',
    left: '2000em',
  },
  paper: {
    width: '15%',
    position: 'fixed',
    right: 15,
    top: 100,
    zIndex: '20',

  },
}));
// == Composant
const App = ({
  featuresSelected,
  deleteFeature,
  deleteAllFeatures,
  importedLayer,
}) => {
  const classes = useStyles();
  
  return (
    <>
      <Slide in={featuresSelected.length > 0} direction="left">
        <Paper
          className={
            featuresSelected.length
              ? `${classes.paperStyle} paperStyle-active`
              : ' paperStyle '
          }
        >
          <DeleteForeverIcon
            className={classes.trash}
            onClick={() => {
              window.postMessage(['deleteAllFeatures', featuresSelected]);
              deleteAllFeatures();
            }}
          />
          <ul>
            {featuresSelected
              ? featuresSelected.map((featureName) => (
                <li className={classes.paperStyleLi}>
                  {featureName}
                  <CancelOutlinedIcon
                    fontSize="small"
                    color="secondary"
                    onClick={(event) => {
                      deleteFeature(event, featureName);
                      window.postMessage(['deleteOneFeature', featureName]);
                    }}
                  />
                </li>
              ))
              : null}
          </ul>
        </Paper>
      </Slide>
      <Slide in={importedLayer.length > 0} direction="left">
        <Paper className={classes.paper}>
          <PaperImportedLayer />
        </Paper>
      </Slide>

      <Illion />
    </>
  );
};

// == Export
export default App;
