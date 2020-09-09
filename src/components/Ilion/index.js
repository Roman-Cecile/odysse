// == Import yarn
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import clsx from 'clsx';
import { Map, View, Overlay } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import {
  Circle as CircleStyle, Fill, Stroke, Style,
} from 'ol/style';
import {
  Draw,
  Modify,
  Snap,
  DragBox,
  Select,
  DragAndDrop,
  defaults as defaultInteractions,
} from 'ol/interaction';
import { platformModifierKeyOnly } from 'ol/events/condition';
import { GeoJSON } from 'ol/format';
import * as olControl from 'ol/control';
import { getLength } from 'ol/sphere';

// Import Material UI
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  CssBaseline,
  Divider,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Delete,
} from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';

// == Import component
import LineString from 'ol/geom/LineString';
import { instanceOf } from 'prop-types';
import Menu from '../Menu';

// Import data GEOJSON
import data from '../../../public/FT_Chambre_3857.geojson';

// Import container
import TablePop from '../../containers/TablePop';
import Tool from '../../containers/ToolTip';

// Import utile
import isTileLayer from '../../utils/layerFilter';

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  AppBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: 'none',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    zIndex: 50,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create('width', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up('sm')]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  insertDriveIcon: {
    margin: '0.5em auto',
    cursor: 'pointer',
  },
  olPopup: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 15,
    bottom: 12,
    left: -50,
    minWidth: 280,
  },
  dragBox: {
    border: 'solid 2px blue',
  },
  tool: {
    backgroundColor: 'black',
    color: 'white',
    width: 40,
    height: 40,
    zIndex: 1600,
  },
}));

// == Composant

const ilion = ({
  handleFeature,
  handleLayers,
  handleProperties,
  layersActive,
  handleImportedLayers,
  handleSomeProperties,
  properties,
  // someProps,
  newColor,
}) => {
  const classes = useStyles();
  const [edit, setEdit] = React.useState(false);
  const [create, setCreate] = React.useState(false);
  const theme = useTheme();
  const [someProperties, setSomeProperties] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [center, setCenter] = useState([300000, 5900000]);
  const [zoom, setZoom] = useState(6.6);
  const [extent, setExtent] = useState([
    -1249198.2873332978,
    5142345.212601059,
    1849198.2873332978,
    6657654.787398941,
  ]);

  let draw;
  let snap;
  let modify;
  const getRandomColor = () => {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  };
  const color = getRandomColor();
  const randColor = (col) => col === color && getRandomColor();

  const dragAndDropInteraction = new DragAndDrop({
    formatConstructors: [GeoJSON],
  });

  const view = new View({
    center,
    zoom,
    extent,
  });
  const raster = new TileLayer({
    source: new OSM(),
  });

  const drawSource = new VectorSource();
  const vector = new VectorLayer({
    source: drawSource,
    style: new Style({
      fill: new Fill({
        color: 'rgba(255, 255, 255, 0.2)',
      }),
      stroke: new Stroke({
        color: '#ffcc33',
        width: 2,
      }),
      image: new CircleStyle({
        radius: 7,
        fill: new Fill({
          color: '#ffcc33',
        }),
      }),
    }),
  });

  // const overlay = new Overlay({
  //   element: null,
  //   autoPan: true,
  //   autoPanAnimation: {
  //     duration: 250,
  //   },
  // });

  const tooltip = new Overlay({
    element: null,
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
    offset: [15, 15],
  });

  const [map] = useState(
    new Map({
      interactions: defaultInteractions({
        pinchRotate: false,
        pinchZoom: false,
        shiftDragZoom: false,
        keyboard: false,
        doubleClickZoom: false,
        altShiftDragRotate: false,
      }).extend([dragAndDropInteraction]),
      target: null,
      controls: olControl.defaults({
        rotate: false,
        zoom: false,
        attribution: false,
        attributionOptions: false,
      }),
      layers: [raster, vector],
      overlays: [tooltip],
      view,
    }),
  );

  const dragBox = new DragBox({
    condition: platformModifierKeyOnly,
    className: classes.dragBox,
  });

  const select = new Select();
  const selectedFeatures = select.getFeatures();

  // Target div map after loading
  useEffect(() => {
    map.setTarget('map');
  }, []);

  // instantiate GeoJSON
  const firstSource = new VectorSource();
  useEffect(() => {
    firstSource.addFeatures(new GeoJSON().readFeatures(data));
    const firstVector = new VectorLayer({
      source: firstSource,
      name: 'FT_Chambre',
      style: new Style({
        fill: new Fill({
          color: getRandomColor(),
        }),
        stroke: new Stroke({
          color: getRandomColor(),
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: getRandomColor(),
          }),
        }),
      }),
    });
    map.addLayer(firstVector);
    handleLayers(firstVector.get('name'), firstSource.getExtent());
  }, []);

  const [vectorSource] = useState(new VectorSource());
  // instantiate DragAndDrop
  useEffect(() => {
    dragAndDropInteraction.on('addfeatures', (event) => {
      vectorSource.addFeatures(event.features);
      const indexOfExtention = event.file.name.length - 8;
      const splitFileName = event.file.name.split('');
      const removeExtention = splitFileName.slice(0, indexOfExtention);
      const fileName = removeExtention.join('');
      const colorLayer = randColor(color);
      event.file.color = colorLayer;
      const fileColor = event.file.color;
      map.addLayer(
        new VectorLayer({
          source: vectorSource,
          name: fileName,
          extent: event.projection.getExtent(),
          style: new Style({
            fill: new Fill({
              color: fileColor,
            }),
            stroke: new Stroke({
              color: fileColor,
              width: 2,
            }),
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: fileColor,
              }),
            }),
          }),
        }),
      );
      const layerExtent = event.projection.getExtent();
      handleLayers(fileName, layerExtent, fileColor);
      handleImportedLayers(fileName, layerExtent, fileColor);
      map.getView().fit(vectorSource.getExtent());
    });
  }, []);

  // instantiate overlay
  useEffect(() => {
    tooltip.setElement(document.getElementById('tool'));
    map.on('pointermove', (evt) => {
      if (draw === undefined && map.getFeaturesAtPixel(evt.pixel).length) {
        const featureAtPixel = map.getFeaturesAtPixel(evt.pixel);
        const geom = featureAtPixel[0].getGeometry();
        let length;
        if (geom instanceof LineString) {
          // length = getLength(featureAtPixel[0].getGeometry());

          length = geom.getLength();
          length = `${Math.round((length / 10) * 100)} m`;
        }
        // geom.set('name', '!!!!test!!!')
        // console.log(geom.getType());
        const coordinate = map.getCoordinateFromPixel(evt.pixel);
        tooltip.setPosition(coordinate);
        const pixelFeatures = map.getFeaturesAtPixel(evt.pixel);
        handleSomeProperties(pixelFeatures[0].getProperties(), length);
      }
      else {
        tooltip.setPosition(undefined);
      }
    });
  }, []);

  // Instanciate tootip
  // useEffect(() => {
  //   tooltip.setElement(document.getElementById('tool'));
  //   map.on('pointermove', (evt) => {
  //     if (map.hasFeatureAtPixel(evt.pixel)) {
  //       const pixelFeatures = map.getFeaturesAtPixel(evt.pixel);
  //       const propsInState = pixelFeatures[0].getProperties().ROTATION;
  //       if (propsInState !== someProperties.ROTATION) {
  //         const coordinate = map.getCoordinateFromPixel(evt.pixel);
  //         tooltip.setPosition(coordinate);
  //         setSomeProperties(pixelFeatures[0].getProperties().ROTATION);
  //       }
  //     }
  //     else {
  //       tooltip.setPosition(undefined);
  //     }
  //   });
  //   // console.log(someProperties);
  // });

  useEffect(() => {
    map.on('click', (evt) => {
      if (map.getInteractions().getArray().length <= 5
      && map.getFeaturesAtPixel(evt.pixel).length) {
        const pixelFeatures = map.getFeaturesAtPixel(evt.pixel);
        handleProperties(pixelFeatures[0].getProperties());
      }
    });
    if (map.getInteractions().getArray().length <= 5 && properties[0]) {
      const json = JSON.stringify(properties[0]);
      localStorage.setItem('properties', json);
      window.open('new', 'newWindow', 'width= 700, height= 450');
    }
  }, [properties]);

  // Instanciate dragBox
  useEffect(() => {
    map.addInteraction(select);
    map.addInteraction(dragBox);
    dragBox.on('boxend', () => {
      const extentDragBox = dragBox.getGeometry().getExtent();

      map.getLayers().forEach((layer) => {
        if (!isTileLayer(layer, TileLayer)) {
          layer
            .getSource()
            .forEachFeatureIntersectingExtent(extentDragBox, (feature) => {
              feature.set('name', `feature n°${feature.ol_uid}`);
              feature.set('id', feature.ol_uid);
              selectedFeatures.push(feature);
            });
          const featuresArr = [];
          selectedFeatures.forEach((feature) => {
            featuresArr.push(feature.get('name'));
          });
          handleFeature(featuresArr);
        }
      });
    });

    dragBox.on('boxstart', () => {
      selectedFeatures.clear();
    });
  }, []);

  // Une fois que la page est chargée il peut écouter les window.onmessage
  useEffect(() => {
    window.onmessage = (event) => {
      if (event.data[0] === 'select' || event.data[0] === 'escape') {
        const typeSelect = event.data[1];
        const addInteractions = () => {
          if (event.data[0] === 'select') {
            draw = new Draw({
              source: drawSource,
              type: typeSelect,
            });
            draw.on('drawend', () => {
              setEdit(true);
            });
            map.addInteraction(draw);
            snap = new Snap();
            map.addInteraction(snap);
          }
          else if (event.data[0] === 'escape') {
            setCreate(false);
            tooltip.setPosition(undefined);
            draw.finishDrawing();
            draw = undefined;
          }
        };
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        map.removeInteraction(modify);
        addInteractions();
      }

      if (event.data[0] === 'deleteOneFeature') {
        map.getLayers().forEach((layer) => {
          const source = layer.getSource();
          if (!isTileLayer(layer, TileLayer)) {
            source
              .getFeatures()
              .forEach(
                (feature) => feature.get('name') === event.data[1]
                  && source.removeFeature(feature),
              );
          }
        });
      }

      if (event.data[0] === 'deleteAllFeatures') {
        map.getLayers().forEach((layer) => {
          const source = layer.getSource();
          if (!isTileLayer(layer, TileLayer)) {
            source.getFeatures().forEach((feature) => {
              if (selectedFeatures.getArray().includes(feature)) {
                source.removeFeature(feature);
              }
            });
          }
        });
      }

      if (event.data[0] === 'edit') {
        setCreate(true);
        modify = new Modify({
          source: drawSource,
        });
        map.addInteraction(modify);
      }

      if (event.data[0] === 'deleteLayer') {
        map
          .getLayers()
          .forEach(
            (layer) => layer.get('name') === event.data[1] && map.removeLayer(layer),
          );
      }
      if (event.data[0] === 'showLayer') {
        map.getView().fit(firstSource.getExtent(event.data[1]));
      }
      if (event.data[0] === 'changeColor' && newColor[0].color !== undefined) {
        map.getLayers().forEach((layer) => {
          if (layer.get('name') === event.data[1]) {
            // console.log(layer.getStyle().getFill().setColor());
            // console.log(layer.getStyle().getStroke().setColor());
            // console.log(layer.getStyle().getFill().setColor(event.data[2]));
            layer.getStyle().getFill().setColor(event.data[2]);
            layer.getStyle().getStroke().setColor(event.data[2]);
            layer.changed();
          }
        });
      }
      if (event.data[0] === 'toggleVisible') {
        map.getLayers().forEach((layer) => {
          if (layer.getVisible()) {
            return (
              layer.get('name') === event.data[1].name
              && layer.setVisible(false)
            );
          }
          return (
            layer.get('name') === event.data[1].name && layer.setVisible(true)
          );
        });
      }
    };
  }, []);

  return (
    <>
      <div className={classes.root}>
        <CssBaseline />
        <AppBar
          position="fixed"
          className={clsx(classes.appBar, {
            [classes.appBarShift]: open,
          })}
        >
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={() => setOpen(true)}
              edge="start"
              className={clsx(classes.menuButton, {
                [classes.hide]: open,
              })}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" noWrap>
              Odyssée
            </Typography>
          </Toolbar>
        </AppBar>
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            <IconButton onClick={() => setOpen(false)}>
              {theme.direction === 'rtl' ? (
                <ChevronRightIcon />
              ) : (
                <ChevronLeftIcon />
              )}
            </IconButton>
          </div>
          <Divider />
          <Menu layers={layersActive} drawerState={open} />
        </Drawer>
      </div>

      <div
        id="map"
        style={{
          width: '100%',
          height: '100vh',
        }}
      />
      <div
        id="tool"
        style={{
          zIndex: 1500,
          position: 'absolute',
        }}
      >
        <Tool someProps={someProperties} />
      </div>
      {/* <div
        id="popup"
        style={{
          zIndex: 1500,
          position: 'absolute',
        }}
      >
        <TablePop />
      </div> */}
    </>
  );
};

// == Export
export default ilion;
