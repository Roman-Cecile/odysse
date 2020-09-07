import {
  SAVE_FEATURES,
  HANDLE_ONE_FEATURE_PROPERTIES,
  HANDLE_CHANGE,
} from 'src/actions/selectFeatureAction';
import { DELETE_FEATURE, DELETE_ALL_FEATURES } from 'src/actions/deleteFeatureAction';

export const initialState = {
  features: [],
  oneFeatureProperties: {},
};

const featureReducer = (state = initialState, action = {}) => {
  switch (action.type) {
    case SAVE_FEATURES:
      // console.log('reducer', action.features);
      action.features.map((feature) => {
        if (state.features.includes(feature)) {
          return { ...state };
        }
      });
      return {
        ...state,
        features: action.features,
      };
    case DELETE_FEATURE: {
      const index = state.features.indexOf(action.feature);
      state.features.splice(index, 1);
      return {
        ...state,
        features: [...state.features],
      };
    }
    case HANDLE_ONE_FEATURE_PROPERTIES:
      return {
        ...state,
        oneFeatureProperties: action.properties,
      };
    case HANDLE_CHANGE: {
      state.oneFeatureProperties[action.name] = action.value;
      return {
        ...state,
        oneFeatureProperties: {...state.oneFeatureProperties}
      };
    }
    case DELETE_ALL_FEATURES:
      return {
        ...state,
        features: [],
      };
    default:
      return state;
  }
};

export default featureReducer;
