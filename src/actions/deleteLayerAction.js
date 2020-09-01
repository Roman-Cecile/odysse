export const DELETE_LAYER = 'DELETE_LAYER';
export const DELETE_IMPORTED_LAYER = 'DELETE_IMPORTED_LAYER';

export const deleteLayer = (layer) => ({
  type: DELETE_LAYER,
  layer,
});

export const deleteImportedLayer = (layer) => ({
  type: DELETE_IMPORTED_LAYER,
  layer,
});
