export const SAVE_FEATURES = 'SELECT_FEATURES';
export const HANDLE_ONE_FEATURE_PROPERTIES = 'HANDLE_ONE_FEATURE_PROPERTIES';
export const HANDLE_CHANGE = 'HANDLE_CHANGE';

export const saveFeatures = (features) => ({
  type: SAVE_FEATURES,
  features,
});

export const handleOneFeatureProperties = (properties) => ({
  type: HANDLE_ONE_FEATURE_PROPERTIES,
  properties,
});

export const handleChange = (name, value) => ({
  type: HANDLE_CHANGE,
  name,
  value,
});
