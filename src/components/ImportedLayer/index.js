import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  Visibility as VisibilityIcon,
  Clear as ClearIcon,
} from '@material-ui/icons';
import { TwitterPicker } from 'react-color';
import { set } from 'ol/transform';

const useStyles = makeStyles((theme) => ({
  liStyle: {
    display: 'flex',
    justifyContent: 'space-between',
    margin: theme.spacing(1),
  },
  title: {
    margin: theme.spacing(1),
    color: 'grey',
    fontStyle: 'italic',
    fontSize: '0.9em',
  },
  eyes: {
    color: '#3f51b5',
  },
  color: {
    width: 15,
    height: 15,
    marginTop: 2,
  },
  titleAndColor: {
    display: 'flex',
    width: '60%',
  },
  pickerColor: {
    top: theme.spacing(3),
    right: theme.spacing(2),
  },
}));

const ImportedLayer = ({
  importedLayers,
  deleteImportedLayer,
  handleNewColor,
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [targetColor, setTargetColor] = React.useState(null);
  const handleClick = (target) => {
    setTargetColor(target);
    setOpen(!open);
  };
  return (
    <>
      <p className={classes.title}>
        Calques importés ({importedLayers.length})
      </p>
      <ul>
        {importedLayers
          ? importedLayers.map((layer) => (
            <li className={classes.liStyle}>
              <div className={classes.titleAndColor}>
                <div
                  className={classes.color}
                  style={{ backgroundColor: layer.color }}
                  id={layer.name}
                  onClick={(event) => (
                    event.target.id === layer.name
                        && handleClick(event.target.id)
                  )}
                >
                  {targetColor === layer.name && open && (
                  <TwitterPicker
                    className={classes.pickerColor}
                    onChange={(evt) => {
                      handleNewColor(evt, layer.name);
                      window.postMessage(['changeColor', layer.name, evt.hex]);
                    }}
                  />
                  )}
                </div>
                <div
                  onClick={() => {
                    window.postMessage(['showLayer', layer.extent]);
                  }}
                  style={{ cursor: 'pointer', marginLeft: 5 }}
                >
                  {layer.name}
                </div>
              </div>
              <div>
                <VisibilityIcon style={{ cursor: 'pointer' }} />
                <ClearIcon
                  onClick={() => {
                    window.postMessage(['deleteLayer', layer.name]);
                    deleteImportedLayer(layer);
                  }}
                  color="secondary"
                  style={{ cursor: 'pointer' }}
                />
              </div>
            </li>
          ))
          : console.log('non')}
      </ul>
    </>
  );
};

export default ImportedLayer;
