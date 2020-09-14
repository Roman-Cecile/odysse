import { createStore, compose, applyMiddleware } from 'redux';

// == Import : local
import rootReducer from '../reducer';

// == Enhancers
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
// import axios from '../middleware'

const enhancers = composeEnhancers(
  applyMiddleware(
    // axios
  //   // secondMiddleware,
  ),
);


// == Store
const store = createStore(
  rootReducer,
  // preloadedState,
  enhancers,
);

// == Export
export default store;
