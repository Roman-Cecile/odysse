export const SAVE_FEATURES = 'SELECT_FEATURES';

export const saveFeatures = (features) => ({
  type: SAVE_FEATURES,
  features,
});
