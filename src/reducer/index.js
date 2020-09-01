import { combineReducers } from 'redux';

import featureReducer from './featureReducer';
import layerReducer from './layerReducer';

export default combineReducers({
  featureReducer,
  layerReducer,
});
