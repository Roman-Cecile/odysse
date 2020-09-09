import {
  SAVE_LAYERS,
  SAVE_PROPERTIES,
  SAVE_IMPORTED_LAYERS,
  SAVE_SOME_PROPERTIES,
} from '../actions/saveLayersAction';
import {
  DELETE_LAYER,
  DELETE_IMPORTED_LAYER,
} from '../actions/deleteLayerAction';

import { CHANGE_COLOR } from '../actions/colorAction';

export const initialState = {
  layers: [],
  importedLayers: [],
  properties: {},
  someProps: {},
  length: 0,
  coordinates: [],
  color: {},
  visibility: true,
};

const LayerReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SAVE_LAYERS: {
      const layerInState = state.layers;
      const newLayer = { name: action.layerName, extent: action.layerExtent, color: action.color };
      layerInState.push(newLayer);
      return {
        ...state,
        layers: [...layerInState],
      };
    }
    case SAVE_IMPORTED_LAYERS: {
      const layerInState = state.importedLayers;
      const newLayer = { name: action.layerName, extent: action.layerExtent, color: action.color };
      layerInState.push(newLayer);
      return {
        ...state,
        importedLayers: [...layerInState],
      };
    }
    case DELETE_LAYER: {
      const { importedLayers, layers } = state;
      const index = layers.indexOf(action.layer);
      layers.splice(index, 1);
      importedLayers.forEach((importedLayer) => {
        if (importedLayer.name === action.layer.name) {
          const indexImportedLayers = importedLayers.indexOf(action.layer);
          importedLayers.splice(indexImportedLayers, 1);
          return {
            ...state,
            layers: [...layers],
            importedLayers: [...importedLayers],
          };
        }
      });
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
    case SAVE_SOME_PROPERTIES:
      return {
        ...state,
        someProps: action.properties,
        length: action.length,

      };
    case CHANGE_COLOR: {
      const { importedLayers } = state;
      importedLayers.map((layer) => {
        if (layer.name === action.name) {
          layer.color = action.hex;
        }
      });

      return {
        ...state,
        importedLayers: [...importedLayers],
      };
    }
    default:
      return state;
  }
};

export default LayerReducer;
