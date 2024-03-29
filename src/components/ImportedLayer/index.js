import React from 'react';

import { makeStyles } from '@material-ui/core/styles';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Clear as ClearIcon,
} from '@material-ui/icons';
import { TwitterPicker } from 'react-color';

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
  icons: {
    width: theme.spacing(7),
    display: 'flex',
    justifyContent: 'space-between'
  }
}));

const ImportedLayer = ({
  importedLayers,
  deleteImportedLayer,
  handleNewColor,
}) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);
  const [isVisible, setIsvisible] = React.useState(true);
  const [targetColor, setTargetColor] = React.useState(null);
  const [targetLayer, setTargetLayer] = React.useState(null);
  const handleClick = (target) => {
    setTargetColor(target);
    setOpen(!open);
  };
  const handleNamebyClick =(layerName) => {
    setTargetLayer(layerName)
    console.log(layerName);
  }

  return (
    <>
      <p className={classes.title}>
        Calques importés ({importedLayers.length})
      </p>
      <ul>
        {importedLayers
          ? importedLayers.map((layer) => (
            <li className={classes.liStyle} key={layer.name}>
              <div className={classes.titleAndColor}>
                <div
                  className={classes.color}
                  style={{ backgroundColor: layer.hex || layer.color }}
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
                      window.postMessage(['changeColor', layer.name, evt.rgb, layer.isMultiPolygon]);
                    }}
                  />
                  )}
                </div>
                <div
                  onClick={() => {
                    window.postMessage(['showLayer', layer.name]);
                  }}
                  style={{ cursor: 'pointer', marginLeft: 5 }}
                >
                  {layer.name}
                </div>
              </div>
              <div className={classes.icons}>
                {targetLayer === layer.name && isVisible
                  ? (
                    <VisibilityIcon
                    style={{ cursor: 'pointer' }}
                    onClick={(event) => {
                      console.log(event);
                      event.name = layer.name
                      handleNamebyClick(event.name)
                      window.postMessage(['toggleVisible', layer]);
                      setIsvisible(false);
                    }}
                  />

                  )
                  : (
                    <VisibilityOffIcon
                      style={{ cursor: 'pointer' }}
                      color="disabled"
                      onClick={() => {
                        window.postMessage(['toggleVisible', layer]);
                        setIsvisible(true);
                      }}
                    />
                  )}
                <ClearIcon
                  onClick={() => {
                    window.postMessage(['deleteLayer', layer.name]);
                    setIsvisible(true)
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
