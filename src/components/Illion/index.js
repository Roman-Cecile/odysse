// == Import npm
import React, {
  useState,
  useEffect,
} from 'react';
import clsx from 'clsx';
import {
  Map,
  View,
  Overlay,
} from 'ol';
import {
  Tile as TileLayer,
  Vector as VectorLayer,
} from 'ol/layer';
import {
  OSM,
  Vector as VectorSource,
} from 'ol/source';
import {
  Circle as CircleStyle,
  Fill,
  Stroke,
  Style,
  Icon,
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
import {
  platformModifierKeyOnly,
} from 'ol/events/condition';

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
} from '@material-ui/core';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  InsertDriveFileOutlined as InsertDriveFileOutlinedIcon,
} from '@material-ui/icons';
import {
  makeStyles,
  useTheme,
} from '@material-ui/core/styles';

// == Import
import Menu from '../Menu';

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
  const [extent, setExtent] = useState(
    [-1249198.2873332978,
      5142345.212601059,
      1849198.2873332978,
      6657654.787398941],
  );

  let draw;
  let snap;
  let modify;

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

  const [map] = useState(
    new Map({
      target: null,
      layers: [raster, vector],
      view,
    }),
  );

  const select = new Select();
  map.addInteraction(select);

  useEffect(() => {
    map.setTarget('map');
  }, []);

  const selectedFeatures = select.getFeatures();
  const dragBox = new DragBox({
    condition: platformModifierKeyOnly,
    className: classes.dragBox,
  });
  map.addInteraction(dragBox);
  dragBox.on('boxend', () => {
    
    const extentLayer = dragBox.getGeometry().getExtent();
    // console.log();
    drawSource.forEachFeatureIntersectingExtent(extentLayer, (feature) => {
    //   // feature.set('name', `feature n°${feature.ol_uid}`);
    //   // feature.set('id', feature.ol_uid);
      console.log(selectedFeatures);
      selectedFeatures.push(feature);
    });
    // handleFeature(selectedFeatures.getArray().map((feature) => feature.get('name')));
    // const featuresArr = [];
    // selectedFeatures.forEach((feature) => {
    //   featuresArr.push(feature.get('name'));
    // });
    // handleFeature(featuresArr);
  });

  dragBox.on('boxstart', () => {
    selectedFeatures.clear();
  });

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
            // overlay.setPosition(undefined);
            return draw.finishDrawing();
          }
        };
        map.removeInteraction(draw);
        map.removeInteraction(snap);
        map.removeInteraction(modify);
        addInteractions();
      }
    };
  }, []);

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
              {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
            </IconButton>
          </div>
          <Divider />
          {open
            ? (
              <List>
                <ListItem>
                  <Menu />
                </ListItem>
              </List>
            )
            : ''}
        </Drawer>
      </div>

      <div
        id="map"
        style={
      {
        width: '100%',
        height: '100vh',
      }
    }
      />
    </>
  );
};

// == Export
export default Illion;
