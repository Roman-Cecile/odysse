// == Import yarn
import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import clsx from "clsx";
import { Map, View, Overlay } from "ol";
import { Tile as TileLayer, Vector as VectorLayer } from "ol/layer";
import { OSM, Vector as VectorSource } from "ol/source";
import { Circle as CircleStyle, Fill, Stroke, Style } from "ol/style";
import {
  Draw,
  Modify,
  Snap,
  DragBox,
  Select,
  DragAndDrop,
  defaults as defaultInteractions,
} from "ol/interaction";
import { platformModifierKeyOnly } from "ol/events/condition";
import { GeoJSON } from "ol/format";
import * as olControl from "ol/control";
import { getLength } from "ol/sphere";

// Import Material UI
import {
  Drawer,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  CssBaseline,
  Divider,
  withStyles,
} from "@material-ui/core";
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  ChevronRight as ChevronRightIcon,
  Delete,
  ThreeSixty,
} from "@material-ui/icons";
import { makeStyles, useTheme } from "@material-ui/core/styles";

// == Import component
import LineString from "ol/geom/LineString";
import { instanceOf } from "prop-types";
import MultiPolygon from "ol/geom/MultiPolygon";
import Menu from "../Menu";

// Import data GEOJSON
import data from "../../../public/FT_Chambre_3857.geojson";

// Import container
import TablePop from "../../containers/TablePop";
import Tool from "../../containers/ToolTip";

// Import utile
import isTileLayer from "../../utils/layerFilter";

const drawerWidth = 240;

const styles = (theme) => ({
  root: {
    display: "flex",
  },
  AppBar: {
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
  },
  appBarShift: {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  menuButton: {
    marginRight: 36,
  },
  hide: {
    display: "none",
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
    zIndex: 50,
  },
  drawerOpen: {
    width: drawerWidth,
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
  },
  insertDriveIcon: {
    margin: "0.5em auto",
    cursor: "pointer",
  },
  olPopup: {
    position: "absolute",
    backgroundColor: "white",
    padding: 15,
    bottom: 12,
    left: -50,
    minWidth: 280,
  },
  dragBox: {
    border: "solid 2px blue",
  },
  tool: {
    backgroundColor: "black",
    color: "white",
    width: 40,
    height: 40,
    zIndex: 1600,
  },
});

// == Composant

// const ilion = ({
//   handleFeature,
//   handleLayers,
//   handleProperties,
//   layersActive,
//   handleImportedLayers,
//   handleSomeProperties,
//   properties,
//   // someProps,
//   newColor,
// }) => {
//   const classes = useStyles();
//   const [edit, setEdit] = React.useState(false);
//   const [create, setCreate] = React.useState(false);
//   const theme = useTheme();
//   const [someProperties, setSomeProperties] = React.useState('');
//   const [open, setOpen] = React.useState(false);
//   const [center, setCenter] = useState([300000, 5900000]);
//   const [zoom, setZoom] = useState(6.6);
//   const [extent, setExtent] = useState([
//     -1249198.2873332978,
//     5142345.212601059,
//     1849198.2873332978,
//     6657654.787398941,
//   ]);

//   let draw;
//   let snap;
//   let modify;
//   const getRandomColor = () => {
//     const letters = '0123456789ABCDEF';
//     let color = '#';
//     for (let i = 0; i < 6; i++) {
//       color += letters[Math.floor(Math.random() * 16)];
//     }
//     return color;
//   };
//   const color = getRandomColor();
//   const randColor = (col) => col === color && getRandomColor();

//   const getTransparencyRandomColor = () => {
//     const trans = '0.5'; // 50% transparency
//     let colorRGBA = 'rgba(';
//     for (let i = 0; i < 3; i++) {
//       colorRGBA += `${Math.floor(Math.random() * 255)},`;
//     }
//     colorRGBA += `${trans})`; // add the transparency
//     return colorRGBA;
//   };

//   const transparency = getTransparencyRandomColor();
//   const transparencyRandColor = (col) => col === transparency && getTransparencyRandomColor();

//   const insert = (mainString, insString, pos) => (
//     mainString.slice(0, pos) + insString + mainString.slice(pos)
//   );
//   const dragAndDropInteraction = new DragAndDrop({
//     formatConstructors: [GeoJSON],
//   });

//   const view = new View({
//     center,
//     zoom,
//     extent,
//   });
//   const raster = new TileLayer({
//     source: new OSM(),
//   });

//   const drawSource = new VectorSource();
//   const vector = new VectorLayer({
//     source: drawSource,
//     style: new Style({
//       fill: new Fill({
//         color: 'rgba(255, 255, 255, 0.2)',
//       }),
//       stroke: new Stroke({
//         color: '#ffcc33',
//         width: 2,
//       }),
//       image: new CircleStyle({
//         radius: 7,
//         fill: new Fill({
//           color: '#ffcc33',
//         }),
//       }),
//     }),
//   });

//   const tooltip = new Overlay({
//     element: null,
//     autoPan: true,
//     autoPanAnimation: {
//       duration: 250,
//     },
//     offset: [15, 15],
//   });

//   const [map] = useState(
//     new Map({
//       interactions: defaultInteractions({
//         pinchRotate: false,
//         pinchZoom: false,
//         shiftDragZoom: false,
//         keyboard: false,
//         doubleClickZoom: false,
//         altShiftDragRotate: false,
//       }).extend([dragAndDropInteraction]),
//       target: null,
//       controls: olControl.defaults({
//         rotate: false,
//         zoom: false,
//         attribution: false,
//         attributionOptions: false,
//       }),
//       layers: [raster, vector],
//       overlays: [tooltip],
//       view,
//     }),
//   );

//   const dragBox = new DragBox({
//     condition: platformModifierKeyOnly,
//     className: classes.dragBox,
//   });

//   const select = new Select();
//   const selectedFeatures = select.getFeatures();

//   // Target div map after loading
//   useEffect(() => {
//     map.setTarget('map');
//   }, []);

//   // instantiate GeoJSON
//   const firstSource = new VectorSource();
//   useEffect(() => {
//     firstSource.addFeatures(new GeoJSON().readFeatures(data));
//     const firstVector = new VectorLayer({
//       source: firstSource,
//       name: 'FT_Chambre',
//       style: new Style({
//         fill: new Fill({
//           color: getRandomColor(),
//         }),
//         stroke: new Stroke({
//           color: getRandomColor(),
//           width: 2,
//         }),
//         image: new CircleStyle({
//           radius: 7,
//           fill: new Fill({
//             color: getRandomColor(),
//           }),
//         }),
//       }),
//     });
//     map.addLayer(firstVector);
//     handleLayers(firstVector.get('name'), firstSource.getExtent());
//   }, []);

//   // const [vectorSource] = useState(new VectorSource());
//   // instantiate DragAndDrop
//   useEffect(() => {
//     dragAndDropInteraction.on('addfeatures', (event) => {
//       const vectorSource = new VectorSource({
//         features: event.features,
//       });
//       // vectorSource.addFeatures(event.features);
//       const indexOfExtention = event.file.name.length - 8;
//       const splitFileName = event.file.name.split('');
//       const removeExtention = splitFileName.slice(0, indexOfExtention);
//       const fileName = removeExtention.join('');
//       const colorLayer = randColor(color);
//       const transparencyColorLayer = transparencyRandColor(transparency);
//       let fileColor;
//       let test;
//       event.features.forEach((feature) => {
//         if (feature.getGeometry() instanceof MultiPolygon) {
//           test = true;
//           fileColor = new Style({
//             fill: new Fill({
//               color: transparencyColorLayer,
//             }),
//             stroke: new Stroke({
//               color: '#fff',
//               lineDash: [15],
//               // lineDashOffset: 2,
//               width: 2,
//             }),
//             image: new CircleStyle({
//               radius: 7,
//               fill: new Fill({
//                 color: transparencyColorLayer,
//               }),
//             }),
//           });
//         }
//         else if (feature.getGeometry() instanceof LineString) {
//           test = false;
//           fileColor = new Style({
//             fill: new Fill({
//               color: colorLayer,
//             }),
//             stroke: new Stroke({
//               color: colorLayer,
//               width: 2,
//             }),
//             image: new CircleStyle({
//               radius: 7,
//               fill: new Fill({
//                 color: colorLayer,
//               }),
//             }),
//           });
//         }
//       });
//       map.addLayer(
//         new VectorLayer({
//           source: vectorSource,
//           name: fileName,
//           extent: event.projection.getExtent(),
//           style: fileColor,
//         }),
//       );
//       const goodColor = test ? transparencyColorLayer : colorLayer;
//       let isMultiPolygon;
//       event.features.forEach((feature) => {
//         const geom = feature.getGeometry();
//         isMultiPolygon = geom instanceof MultiPolygon;
//       });
//       handleLayers(fileName, vectorSource.getExtent(), goodColor);
//       handleImportedLayers(fileName, vectorSource.getExtent(), goodColor, isMultiPolygon);
//       map.getView().fit(vectorSource.getExtent());
//     });
//   }, []);

//   // instantiate overlay
//   useEffect(() => {
//     tooltip.setElement(document.getElementById('tool'));
//     map.on('pointermove', (evt) => {
//       if (draw === undefined && map.getFeaturesAtPixel(evt.pixel).length) {
//         const featureAtPixel = map.getFeaturesAtPixel(evt.pixel);
//         const geom = featureAtPixel[0].getGeometry();
//         let length;
//         if (geom instanceof LineString) {
//           // length = getLength(featureAtPixel[0].getGeometry());

//           length = geom.getLength();
//           length = `${Math.round((length / 10) * 100)} m`;
//         }
//         // geom.set('name', '!!!!test!!!')
//         // console.log(geom.getType());
//         const coordinate = map.getCoordinateFromPixel(evt.pixel);
//         tooltip.setPosition(coordinate);
//         const pixelFeatures = map.getFeaturesAtPixel(evt.pixel);
//         handleSomeProperties(pixelFeatures[0].getProperties(), length);
//       }
//       else {
//         tooltip.setPosition(undefined);
//       }
//     });
//   }, []);

//   useEffect(() => {
//     map.on('click', (evt) => {
//       if (map.getInteractions().getArray().length <= 5
//       && map.getFeaturesAtPixel(evt.pixel).length) {
//         const pixelFeatures = map.getFeaturesAtPixel(evt.pixel);
//         handleProperties(pixelFeatures[0].getProperties());
//       }
//     });
//     if (map.getInteractions().getArray().length <= 5 && properties[0]) {
//       const json = JSON.stringify(properties[0]);
//       localStorage.setItem('properties', json);
//       window.open('new', 'newWindow', 'width= 700, height= 450');
//     }
//   }, [properties]);

//   // Instanciate dragBox
//   useEffect(() => {
//     map.addInteraction(select);
//     map.addInteraction(dragBox);
//     dragBox.on('boxend', () => {
//       const extentDragBox = dragBox.getGeometry().getExtent();

//       map.getLayers().forEach((layer) => {
//         if (!isTileLayer(layer, TileLayer)) {
//           layer
//             .getSource()
//             .forEachFeatureIntersectingExtent(extentDragBox, (feature) => {
//               feature.set('name', `feature n°${feature.ol_uid}`);
//               feature.set('id', feature.ol_uid);
//               selectedFeatures.push(feature);
//             });
//           const featuresArr = [];
//           selectedFeatures.forEach((feature) => {
//             featuresArr.push(feature.get('name'));
//           });
//           handleFeature(featuresArr);
//         }
//       });
//     });

//     dragBox.on('boxstart', () => {
//       selectedFeatures.clear();
//     });
//   }, []);

//   // Une fois que la page est chargée il peut écouter les window.onmessage
//   useEffect(() => {
//     window.onmessage = (event) => {
//       if (event.data[0] === 'select' || event.data[0] === 'escape') {
//         const typeSelect = event.data[1];
//         const addInteractions = () => {
//           if (event.data[0] === 'select') {
//             draw = new Draw({
//               source: drawSource,
//               type: typeSelect,
//             });
//             draw.on('drawend', () => {
//               setEdit(true);
//             });
//             map.addInteraction(draw);
//             snap = new Snap();
//             map.addInteraction(snap);
//           }
//           else if (event.data[0] === 'escape') {
//             setCreate(false);
//             tooltip.setPosition(undefined);
//             draw.finishDrawing();
//             draw = undefined;
//           }
//         };
//         map.removeInteraction(draw);
//         map.removeInteraction(snap);
//         map.removeInteraction(modify);
//         addInteractions();
//       }

//       if (event.data[0] === 'deleteOneFeature') {
//         map.getLayers().forEach((layer) => {
//           const source = layer.getSource();
//           if (!isTileLayer(layer, TileLayer)) {
//             source
//               .getFeatures()
//               .forEach(
//                 (feature) => feature.get('name') === event.data[1]
//                   && source.removeFeature(feature),
//               );
//           }
//         });
//       }

//       if (event.data[0] === 'deleteAllFeatures') {
//         map.getLayers().forEach((layer) => {
//           const source = layer.getSource();
//           if (!isTileLayer(layer, TileLayer)) {
//             source.getFeatures().forEach((feature) => {
//               if (selectedFeatures.getArray().includes(feature)) {
//                 source.removeFeature(feature);
//               }
//             });
//           }
//         });
//       }

//       if (event.data[0] === 'edit') {
//         setCreate(true);
//         modify = new Modify({
//           source: drawSource,
//         });
//         map.addInteraction(modify);
//       }

//       if (event.data[0] === 'deleteLayer') {
//         map
//           .getLayers()
//           .forEach(
//             (layer) => layer.get('name') === event.data[1] && map.removeLayer(layer),
//           );
//       }
//       if (event.data[0] === 'showLayer') {
//         map
//           .getLayers()
//           .forEach((layer) => {
//             const source = layer.getSource();
//             console.log(event.data[1]);
//             if (!isTileLayer(layer, TileLayer) && layer.get('name') === event.data[1]) {
//               map.getView().fit(source.getExtent());

//             //   // console.log(source.getExtent(event.data[1]));
//             }
//           });
//         // map.getView().fit(firstSource.getExtent(event.data[1]));
//       }
//       if (event.data[0] === 'changeColor' && newColor[0].color !== undefined) {
//         map.getLayers().forEach((layer) => {
//           if (layer.get('name') === event.data[1] && !event.data[3]) {
//             const paramsR = event.data[2].r;
//             const paramsG = event.data[2].g;
//             const paramsB = event.data[2].b;
//             layer.getStyle().getFill().setColor(`rgba(${paramsR},${paramsG},${paramsB})`);
//             layer.getStyle().getStroke().setColor(`rgba(${paramsR},${paramsG},${paramsB})`);
//             layer.changed();
//           }
//           else if (layer.get('name') === event.data[1] && event.data[3]) {
//             const paramsR = event.data[2].r;
//             const paramsG = event.data[2].g;
//             const paramsB = event.data[2].b;
//             event.data[2].a = 0.5;
//             const paramsA = event.data[2].a;
//             layer.getStyle().getFill().setColor(`rgba(${paramsR},${paramsG},${paramsB},${paramsA})`);
//             // layer.getStyle().getStroke().setColor(`rgba(${paramsR},${paramsG},${paramsB},${paramsA})`);
//             layer.changed();
//           }
//         });
//       }
//       if (event.data[0] === 'toggleVisible') {
//         map.getLayers().forEach((layer) => {
//           if (layer.getVisible()) {
//             return (
//               layer.get('name') === event.data[1].name
//               && layer.setVisible(false)
//             );
//           }
//           return (
//             layer.get('name') === event.data[1].name && layer.setVisible(true)
//           );
//         });
//       }
//     };
//   }, []);

//   return (
//     <>
//       <div className={classes.root}>
//         <CssBaseline />
//         <AppBar
//           position="fixed"
//           className={clsx(classes.appBar, {
//             [classes.appBarShift]: open,
//           })}
//         >
//           <Toolbar>
//             <IconButton
//               color="inherit"
//               aria-label="open drawer"
//               onClick={() => setOpen(true)}
//               edge="start"
//               className={clsx(classes.menuButton, {
//                 [classes.hide]: open,
//               })}
//             >
//               <MenuIcon />
//             </IconButton>
//             <Typography variant="h6" noWrap>
//               Odyssée
//             </Typography>
//           </Toolbar>
//         </AppBar>
//         <Drawer
//           variant="permanent"
//           className={clsx(classes.drawer, {
//             [classes.drawerOpen]: open,
//             [classes.drawerClose]: !open,
//           })}
//           classes={{
//             paper: clsx({
//               [classes.drawerOpen]: open,
//               [classes.drawerClose]: !open,
//             }),
//           }}
//         >
//           <div className={classes.toolbar}>
//             <IconButton onClick={() => setOpen(false)}>
//               {theme.direction === 'rtl' ? (
//                 <ChevronRightIcon />
//               ) : (
//                 <ChevronLeftIcon />
//               )}
//             </IconButton>
//           </div>
//           <Divider />
//           <Menu layers={layersActive} drawerState={open} />
//         </Drawer>
//       </div>

//       <div
//         id="map"
//         style={{
//           width: '100%',
//           height: '100vh',
//         }}
//       />
//       <div
//         id="tool"
//         style={{
//           zIndex: 1500,
//           position: 'absolute',
//         }}
//       >
//         <Tool someProps={someProperties} />
//       </div>
//       {/* <div
//         id="popup"
//         style={{
//           zIndex: 1500,
//           position: 'absolute',
//         }}
//       >
//         <TablePop />
//       </div> */}
//     </>
//   );
// };

// == Class
class Ilion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      draw: {},
      snap: {},
      modify: {},
      drawSource: {},
    };
    this.getRandomColor = this.getRandomColor.bind(this);
    this.randColor = this.randColor.bind(this);
    this.getTransparencyRandomColor = this.getTransparencyRandomColor.bind(
      this
    );
    this.transparencyRandColor = this.transparencyRandColor.bind(this);
    this.insert = this.insert.bind(this);
  }

  componentDidMount() {
    const {
      handleLayers,
      handleFeature,
      handleProperties,
      properties,
      handleSomeProperties,
      handleImportedLayers,
    } = this.props;
    const raster = new TileLayer({
      source: new OSM(),
    });
    const dragAndDropInteraction = new DragAndDrop({
      formatConstructors: [GeoJSON],
    });
    this.state.drawSource = new VectorSource();
    const vector = new VectorLayer({
      source: this.state.drawSource,
      style: new Style({
        fill: new Fill({
          color: "rgba(255, 255, 255, 0.2)",
        }),
        stroke: new Stroke({
          color: "#ffcc33",
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: "#ffcc33",
          }),
        }),
      }),
    });
    const tooltip = new Overlay({
      autoPan: true,
      autoPanAnimation: {
        duration: 250,
      },
      offset: [15, 15],
      element: document.getElementById("tool"),
    });
    const map = new Map({
      view: new View({
        center: [300000, 5900000],
        zoom: 6.6,
        extent: [
          -1249198.2873332978,
          5142345.212601059,
          1849198.2873332978,
          6657654.787398941,
        ],
      }),
      controls: olControl.defaults({
        rotate: false,
        zoom: false,
        attribution: false,
        attributionOptions: false,
      }),
      interactions: defaultInteractions({
        pinchRotate: false,
        pinchZoom: false,
        shiftDragZoom: false,
        keyboard: false,
        doubleClickZoom: false,
        altShiftDragRotate: false,
      }).extend([dragAndDropInteraction]),
      layers: [raster, vector],
      target: "map",
      overlays: [tooltip],
    });

    // instantiate GeoJSON
    const firstSource = new VectorSource();
    firstSource.addFeatures(new GeoJSON().readFeatures(data));
    const firstVector = new VectorLayer({
      source: firstSource,
      name: "FT_Chambre",
      style: new Style({
        fill: new Fill({
          color: this.getRandomColor(),
        }),
        stroke: new Stroke({
          color: this.getRandomColor(),
          width: 2,
        }),
        image: new CircleStyle({
          radius: 7,
          fill: new Fill({
            color: this.getRandomColor(),
          }),
        }),
      }),
    });
    map.addLayer(firstVector);
    handleLayers(firstVector.get("name"), firstSource.getExtent());

    map.on("pointermove", (evt) => {
      if (
        this.state.draw === undefined &&
        map.getFeaturesAtPixel(evt.pixel).length
      ) {
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
      } else {
        tooltip.setPosition(undefined);
      }
    });

    map.on("click", (evt) => {
      if (
        map.getInteractions().getArray().length <= 5 &&
        map.getFeaturesAtPixel(evt.pixel).length
        ) {
          const pixelFeatures = map.getFeaturesAtPixel(evt.pixel);
          handleProperties(pixelFeatures[0].getProperties());
        }
        if (map.getInteractions().getArray().length <= 5 && this.props.properties[0]) {
        const json = JSON.stringify(this.props.properties[0]);
        localStorage.setItem("properties", json);
        window.open("new", "newWindow", "width= 700, height= 450");
      }
    });
    const select = new Select();
    const selectedFeatures = select.getFeatures();

    const dragBox = new DragBox({
      condition: platformModifierKeyOnly,
      className: this.props.classes.dragBox,
    });

    map.addInteraction(select);
    map.addInteraction(dragBox);

    dragBox.on("boxend", function () {
      const extentDragBox = dragBox.getGeometry().getExtent();
      map.getLayers().forEach((layer) => {
        if (!isTileLayer(layer, TileLayer)) {
          layer
            .getSource()
            .forEachFeatureIntersectingExtent(extentDragBox, (feature) => {
              feature.set("name", `feature n°${feature.ol_uid}`);
              feature.set("id", feature.ol_uid);
              selectedFeatures.push(feature);
            });
          const featuresArr = [];
          selectedFeatures.forEach((feature) => {
            featuresArr.push(feature.get("name"));
          });
          handleFeature(featuresArr);
        }
      });
    });
    dragBox.on("boxstart", () => {
      selectedFeatures.clear();
    });
    dragAndDropInteraction.on("addfeatures", (event) => {
      const vectorSource = new VectorSource({
        features: event.features,
      });
      // vectorSource.addFeatures(event.features);
      const indexOfExtention = event.file.name.length - 8;
      const splitFileName = event.file.name.split("");
      const removeExtention = splitFileName.slice(0, indexOfExtention);
      const fileName = removeExtention.join("");
      const colorLayer = this.randColor(this.getRandomColor());
      const transparencyColorLayer = this.transparencyRandColor(this.getTransparencyRandomColor());
      let fileColor;
      let test;
      event.features.forEach((feature) => {
        if (feature.getGeometry() instanceof MultiPolygon) {
          test = true;
          fileColor = new Style({
            fill: new Fill({
              color: transparencyColorLayer,
            }),
            stroke: new Stroke({
              color: "#fff",
              lineDash: [15],
              // lineDashOffset: 2,
              width: 2,
            }),
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: transparencyColorLayer,
              }),
            }),
          });
        } else if (feature.getGeometry() instanceof LineString) {
          test = false;
          fileColor = new Style({
            fill: new Fill({
              color: colorLayer,
            }),
            stroke: new Stroke({
              color: colorLayer,
              width: 2,
            }),
            image: new CircleStyle({
              radius: 7,
              fill: new Fill({
                color: colorLayer,
              }),
            }),
          });
        }
      });
      map.addLayer(
        new VectorLayer({
          source: vectorSource,
          name: fileName,
          extent: event.projection.getExtent(),
          style: fileColor,
        })
      );
      const goodColor = test ? transparencyColorLayer : colorLayer;
      let isMultiPolygon;
      event.features.forEach((feature) => {
        const geom = feature.getGeometry();
        isMultiPolygon = geom instanceof MultiPolygon;
      });
      handleLayers(fileName, vectorSource.getExtent(), goodColor);
      handleImportedLayers(
        fileName,
        vectorSource.getExtent(),
        goodColor,
        isMultiPolygon
      );
      map.getView().fit(vectorSource.getExtent());
    });
    this.setState({
      map,
      selectedFeatures,
      tooltip,
    })
    console.log(this);

  }

  getRandomColor() {
    const letters = "0123456789ABCDEF";
    let color = "#";
    for (let i = 0; i < 6; i++) {
      color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
  }

  randColor(col) {
   col === this.getRandomColor && this.getRandomColor();
  }

  getTransparencyRandomColor() {
    const trans = "0.5"; // 50% transparency
    let colorRGBA = "rgba(";
    for (let i = 0; i < 3; i++) {
      colorRGBA += `${Math.floor(Math.random() * 255)},`;
    }
    colorRGBA += `${trans})`; // add the transparency
    return colorRGBA;
  }

  transparencyRandColor(col) {
    col === this.getTransparencyRandomColor && this.getTransparencyRandomColor();
  }

  insert(mainString, insString, pos) {
    mainString.slice(0, pos) + insString + mainString.slice(pos);
  }
  

  render() {

    window.onmessage = (event) => {
      if (event.data[0] === "select" || event.data[0] === "escape") {
        const typeSelect = event.data[1];
        const addInteractions = () => {
          if (event.data[0] === "select") {
            this.state.draw = new Draw({
              source: this.state.drawSource,
              type: typeSelect,
            });
            // this.state.draw.on("drawend", () => {
            //   setEdit(true);
            // });
            this.state.map.addInteraction(this.state.draw);
            this.state.snap = new Snap();
            this.state.map.addInteraction(this.state.snap);
          } else if (event.data[0] === "escape") {
            // setCreate(false);
            this.state.tooltip.setPosition(undefined);
            this.state.draw.finishDrawing();
            this.state.draw = undefined;
          }
        };
        this.state.map.removeInteraction(this.state.draw);
        this.state.map.removeInteraction(this.state.snap);
        this.state.map.removeInteraction(this.state.modify);
        addInteractions();
      }

      if (event.data[0] === "deleteOneFeature") {
        this.state.map.getLayers().forEach((layer) => {
          const source = layer.getSource();
          if (!isTileLayer(layer, TileLayer)) {
            source
              .getFeatures()
              .forEach(
                (feature) =>
                  feature.get("name") === event.data[1] &&
                  source.removeFeature(feature)
              );
          }
        });
      }

      if (event.data[0] === "deleteAllFeatures") {
        this.state.map.getLayers().forEach((layer) => {
          const source = layer.getSource();
          if (!isTileLayer(layer, TileLayer)) {
            source.getFeatures().forEach((feature) => {
              if (this.state.selectedFeatures.getArray().includes(feature)) {
                source.removeFeature(feature);
              }
            });
          }
        });
      }

      if (event.data[0] === "edit") {
        setCreate(true);
        this.modify = new Modify({
          source: this.state.drawSource,
        });
        this.state.map.addInteraction(this.modify);
      }

      if (event.data[0] === "deleteLayer") {
        this.state.map
          .getLayers()
          .forEach(
            (layer) =>
              layer.get("name") === event.data[1] && this.state.map.removeLayer(layer)
          );
      }
      if (event.data[0] === "showLayer") {
        this.state.map.getLayers().forEach((layer) => {
          const source = layer.getSource();
          if (
            !isTileLayer(layer, TileLayer) &&
            layer.get("name") === event.data[1]
          ) {
            this.state.map.getView().fit(source.getExtent());

            //   // console.log(source.getExtent(event.data[1]));
          }
        });
        // this.state.map.getView().fit(firstSource.getExtent(event.data[1]));
      }
      if (event.data[0] === "changeColor" && newColor[0].color !== undefined) {
        this.state.map.getLayers().forEach((layer) => {
          if (layer.get("name") === event.data[1] && !event.data[3]) {
            const paramsR = event.data[2].r;
            const paramsG = event.data[2].g;
            const paramsB = event.data[2].b;
            layer
              .getStyle()
              .getFill()
              .setColor(`rgba(${paramsR},${paramsG},${paramsB})`);
            layer
              .getStyle()
              .getStroke()
              .setColor(`rgba(${paramsR},${paramsG},${paramsB})`);
            layer.changed();
          } else if (layer.get("name") === event.data[1] && event.data[3]) {
            const paramsR = event.data[2].r;
            const paramsG = event.data[2].g;
            const paramsB = event.data[2].b;
            event.data[2].a = 0.5;
            const paramsA = event.data[2].a;
            layer
              .getStyle()
              .getFill()
              .setColor(`rgba(${paramsR},${paramsG},${paramsB},${paramsA})`);
            // layer.getStyle().getStroke().setColor(`rgba(${paramsR},${paramsG},${paramsB},${paramsA})`);
            layer.changed();
          }
        });
      }
      if (event.data[0] === "toggleVisible") {
        this.state.map.getLayers().forEach((layer) => {
          if (layer.getVisible()) {
            return (
              layer.get("name") === event.data[1].name &&
              layer.setVisible(false)
            );
          }
          return (
            layer.get("name") === event.data[1].name && layer.setVisible(true)
          );
        });
      }
    };
    const { classes } = this.props;
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
                {/* {this.state.theme.direction === "rtl" ? (
                  <ChevronRightIcon />
                ) : (
                  <ChevronLeftIcon />
                )} */}
              </IconButton>
            </div>
            <Divider />
            <Menu layers={this.props.layersActive} drawerState={open} />
          </Drawer>
        </div>

        <div
          id="map"
          style={{
            width: "100%",
            height: "100vh",
          }}
        />
        <div
          id="tool"
          style={{
            zIndex: 1500,
            position: "absolute",
          }}
        >
          <Tool someProps={this.props.someProperties} />
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
  }
}

// == Export
// export default withStyles(styles)(Ilion);
