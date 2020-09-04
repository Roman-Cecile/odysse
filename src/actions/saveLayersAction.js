export const SAVE_LAYERS = 'SAVE_LAYERS';
export const SAVE_PROPERTIES = 'SAVE_PROPERTIES';
export const SAVE_SOME_PROPERTIES = 'SAVE_SOME_PROPERTIES';
export const SAVE_IMPORTED_LAYERS = 'SAVE_IMPORTED_LAYERS';

export const saveLayers = (layerName, layerExtent) => ({
  type: SAVE_LAYERS,
  layerName,
  layerExtent,
});

export const saveImportedLayers = (layerName, layerExtent, color) => ({
  type: SAVE_IMPORTED_LAYERS,
  layerName,
  layerExtent,
  color,
});

export const saveProperties = (properties, coordinates) => ({
  type: SAVE_PROPERTIES,
  properties,
  coordinates,
});

export const saveSomeProperties = (properties) => ({
  type: SAVE_SOME_PROPERTIES,
  properties,
});
