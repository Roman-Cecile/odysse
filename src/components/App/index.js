// == Import npm
import React from 'react';
import { Route, Switch } from 'react-router-dom';

// == Import material UI
import { makeStyles } from '@material-ui/core/styles';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import { Clear as ClearIcon } from '@material-ui/icons';
import { Slide, Paper } from '@material-ui/core';

// == Import
import PaperImportedLayer from '../../containers/ImportedLayers';
import Ilion from '../../containers/Ilion';
import Window from '../../containers/Window';

import './styles.scss';

const useStyles = makeStyles((theme) => ({
  paperStyleLi: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: '0.3em auto',
  },
  paperStyle: {
    position: 'fixed',
    bottom: 10,
    right: 10,
    width: theme.spacing(30),
    zIndex: 20,
    padding: '0.8em',
    height: 210,
    overflow: 'auto',
  },
  trash: {
    position: 'sticky',
    left: '2000em',
  },
  paper: {
    width: theme.spacing(30),
    position: 'fixed',
    right: 15,
    top: 100,
    zIndex: '20',

  },
  title: {
    color: 'grey',
    fontStyle: 'italic',
    fontSize: '0.9em',
  },
  titleContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(2)
  }
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
      <Switch>
        <Route exact path="/">
          <Slide in={featuresSelected.length > 0} direction="left">
            <Paper
              className={
            featuresSelected.length
              ? `${classes.paperStyle} paperStyle-active`
              : ' paperStyle '
          }
            >
              <div className={classes.titleContainer}>

                <p className={classes.title}>
                  Features sélectionnés ({featuresSelected.length})
                </p>
                <DeleteForeverIcon
                  className={classes.trash}
                  onClick={() => {
                    window.postMessage(['deleteAllFeatures', featuresSelected]);
                    deleteAllFeatures();
                  }}
                />
              </div>
              <ul>
                {featuresSelected
                  ? featuresSelected.map((featureName) => (
                    <li className={classes.paperStyleLi}>
                      {featureName}
                      <ClearIcon
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

          <Ilion />
        </Route>
        <Route exact path="/new">
          <Window />
        </Route>
        <Route>
          <p>not found</p>
        </Route>
      </Switch>

    </>
  );
};

// == Export
export default App;
