export const DELETE_FEATURE = 'DELETE_FEATURE';
export const DELETE_ALL_FEATURES = 'DELETE_ALL_FEATURES';

export const deleteFeature = (feature) => ({
  type: DELETE_FEATURE,
  feature,
});

export const deleteAllFeatures = () => ({
  type: DELETE_ALL_FEATURES,
});
