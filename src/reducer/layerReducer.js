import {
  SAVE_LAYERS,
  SAVE_PROPERTIES,
  SAVE_IMPORTED_LAYERS,
} from '../actions/saveLayersAction';
import {
  DELETE_LAYER,
  DELETE_IMPORTED_LAYER
} from '../actions/deleteLayerAction';


export const initialState = {
  layers: [],
  importedLayers: [],
  properties: {},
  coordinates: [],
};

const LayerReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SAVE_LAYERS: {
      const layerInState = state.layers;
      const newLayer = { name: action.layerName, extent: action.layerExtent };
      layerInState.push(newLayer);
      return {
        ...state,
        layers: [...layerInState],
      };
    }
    case SAVE_IMPORTED_LAYERS: {
      const layerInState = state.importedLayers;
      const newLayer = { name: action.layerName, extent: action.layerExtent };
      layerInState.push(newLayer);
      return {
        ...state,
        importedLayers: [...layerInState],
      };
    }
    case DELETE_LAYER: {
      const { importedLayers, layers } = state;
      const indexImportedLayers = importedLayers.indexOf(action.layer);
      const index = layers.indexOf(action.layer);
      importedLayers.splice(indexImportedLayers, 1);
      layers.splice(index, 1);
      return {
        ...state,
        layers: [...layers],
        importedLayers: [...importedLayers],
      };
    }
    case DELETE_IMPORTED_LAYER: {
      const { importedLayers, layers } = state;
      const indexImportedLayers = importedLayers.indexOf(action.layer);
      const indexlayers = layers.indexOf(action.layer);
      importedLayers.splice(indexImportedLayers, 1);
      layers.splice(indexlayers, 1);
      return {
        ...state,
        importedLayers: [...importedLayers],
        layers: [...layers],
      };
    }
    case SAVE_PROPERTIES:
      return {
        ...state,
        properties: [action.properties],
        coordinates: [action.coordinates],
      };
    default:
      return state;
  }
};

export default LayerReducer;
