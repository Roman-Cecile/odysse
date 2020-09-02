// == Import yarn
import React, { useState, useEffect } from 'react';
import clsx from 'clsx';
import { Map, View, Overlay } from 'ol';
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer';
import { OSM, Vector as VectorSource } from 'ol/source';
import {
  Circle as CircleStyle, Fill, Stroke, Style, Icon,
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
import WebGLPointsLayer from 'ol/layer/WebGLPoints';

// Import Material UI
import {
  Drawer,
  AppBar,
  Toolbar,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  IconButton,
  Typography,
  CssBaseline,
  Divider,
  Fab,
  Badge,
  Container,
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  InsertDriveFileOutlined as InsertDriveFileOutlinedIcon,
} from '@material-ui/icons';
import { makeStyles, useTheme } from '@material-ui/core/styles';

// == Import component
import Menu from '../Menu';

// Import data GEOJSON
import data from '../../../public/FT_Chambre_3857.geojson';

// Import container
import TablePop from '../../containers/TablePop';

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
}));

// == Composant

const Illion = ({
  handleFeature,
  handleLayers,
  handleProperties,
  layersActive,
  handleImportedLayers,
  newColor,
}) => {
  const classes = useStyles();
  const [top, setTop] = React.useState(0);
  const [left, setLeft] = React.useState(0);
  const [edit, setEdit] = React.useState(false);
  const [create, setCreate] = React.useState(false);
  const theme = useTheme();
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

  const predefinedStyles = {
    icons: {
      symbol: {
        symbolType: 'image',
        src: 'data/icon.png',
        size: [18, 28],
        color: 'lightyellow',
        rotateWithView: false,
        offset: [0, 9],
      },
    },
  };

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

  const overlay = new Overlay({
    element: null,
    autoPan: true,
    autoPanAnimation: {
      duration: 250,
    },
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
      controls: olControl.defaults({ rotate: false }),
      layers: [raster, vector],
      overlays: [overlay],
      view,
    }),
  );

  const dragBox = new DragBox({
    condition: platformModifierKeyOnly,
    className: classes.dragBox,
  });

  const select = new Select();
  const selectedFeatures = select.getFeatures();

  // Cible la div map apres rendu
  useEffect(() => {
    map.setTarget('map');
  }, []);

  // Instancie GeoJSON apres rendu
  useEffect(() => {
    const firstSource = new VectorSource({
      features: new GeoJSON().readFeatures(data),
    });
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
    handleLayers(vector.get('name'));
  }, []);

  const [vectorSource] = useState(
    new VectorSource(),
  );
  // Instancie DragAndDrop
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
  // Instancie overlay
  useEffect(() => {
    overlay.setElement(document.getElementById('popup'));
    map.on('click', (evt) => {
      // console.log(map.getFeaturesAtPixel(evt.pixel).length);
      if (draw === undefined && map.getFeaturesAtPixel(evt.pixel).length) {
        const coordinate = map.getCoordinateFromPixel(evt.pixel);
        const position = overlay;
        console.log(position);
        overlay.setPosition(coordinate);
        console.log(overlay.getPosition());
        const pixelFeatures = map.getFeaturesAtPixel(evt.pixel);
        handleProperties(pixelFeatures[0].getProperties());
      }
      else {
        overlay.setPosition(undefined);
      }
    });
  }, []);

  // Instancie dragBox
  useEffect(() => {
    map.addInteraction(select);
    map.addInteraction(dragBox);
    dragBox.on('boxend', () => {
      const extentDragBox = dragBox.getGeometry().getExtent();
      map.getLayers().forEach((layer) => {
        if (layer instanceof TileLayer) {
          // eslint-disable-next-line no-useless-return
          return;
        }
        // eslint-disable-next-line no-else-return
        else {
          layer
            .getSource()
            .forEachFeatureIntersectingExtent(extentDragBox, (feature) => {
              feature.set('name', `feature n°${feature.ol_uid}`);
              feature.set('id', feature.ol_uid);
              // console.log(feature.getGeometry().getLinearRing().getCoordinates());
              selectedFeatures.push(feature);
            });
          // handleFeature(selectedFeatures.getArray().map((feature) => feature.get('name')));
          const featuresArr = [];
          selectedFeatures.forEach((feature) => {
            featuresArr.push(feature.get('name'));
          });
          handleFeature(featuresArr);
        }
        // console.log(layer.getSource())
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
          draw = new Draw({
            source: drawSource,
            type: typeSelect,
          });
          draw.on('drawend', () => {
            setEdit(true);
          });
          if (event.data[0] === 'select') {
            map.addInteraction(draw);
            snap = new Snap();
            map.addInteraction(snap);
          }
          else if (event.data[0] === 'escape') {
            setCreate(false);
            overlay.setPosition(undefined);
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
        drawSource
          .getFeatures()
          .forEach(
            (feature) => feature.get('name') === event.data[1]
              && drawSource.removeFeature(feature),
          );
      }

      if (event.data[0] === 'deleteAllFeatures') {
        // selectedFeatures.forEach((feature) => drawSource.removeFeature(feature));
        // selectedFeatures.forEach((feature) => console.log(feature));
        console.log(selectedFeatures);
        map
          .getLayers()
          .forEach((layer) => {
            const source = layer.getSource();
            if (layer instanceof TileLayer) {
              // eslint-disable-next-line no-useless-return
              return;
            }

            source.getFeatures().forEach((feature) => {
              if (selectedFeatures.getArray().includes(feature)) {
                source.removeFeature(feature);
              }
            });
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
        console.log(event.data[1]);
        map.getView().fit(map.getExtent(event.data[1]));
      }
      if (event.data[0] === 'changeColor' && newColor[0].color !== undefined) {
        map
          .getLayers()
          .forEach(
            (layer) => {
              if (layer.get('name') === event.data[1]) {
              // console.log(layer.getStyle().getFill().setColor());
              // console.log(layer.getStyle().getStroke().setColor());
              // console.log(layer.getStyle().getFill().setColor(event.data[2]));
                layer.getStyle().getFill().setColor(event.data[2]);
                layer.getStyle().getStroke().setColor(event.data[2]);
                layer.changed();
              }
            },
          );
      }
    };
  }, []);

  // useEffect(() => {
  //   window.onmessage = (event) => {
  //     if (event.data[0] === 'showLayer') {
  //       console.log('oui');
  //       map.getView().fit(map.getExtent(event.data[1]));
  //     }
  //     if (event.data[0] === 'changeColor' && newColor[0].color !== undefined) {
  //       map
  //         .getLayers()
  //         .forEach(
  //           (layer) => {
  //             if (layer.get('name') === event.data[1]) {
  //             // console.log(layer.getStyle().getFill().setColor());
  //             // console.log(layer.getStyle().getStroke().setColor());
  //             // console.log(layer.getStyle().getFill().setColor(event.data[2]));
  //               layer.getStyle().getFill().setColor(event.data[2]);
  //               layer.getStyle().getStroke().setColor(event.data[2]);
  //               layer.changed();
  //             }
  //           },
  //         );
  //     }
  //   };
  // }, []);

  // console.log(map.getInteractions().getArray());
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
          {open ? (
            // <List>
            //   <ListItem>
            <Menu />
          ) : (
            //   </ListItem>
            // </List>
            ''
          )}
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
        id="popup"
        style={{
          zIndex: 1500,
          position: 'absolute',
        }}
      >
        <TablePop />
      </div>
    </>
  );
};

// == Export
export default Illion;
