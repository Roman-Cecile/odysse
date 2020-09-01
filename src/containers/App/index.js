import { connect } from 'react-redux';


import App from '../../components/App';
import { deleteFeature, deleteAllFeatures } from '../../actions/deleteFeatureAction';

const mapStateToProps = (state) => ({
  featuresSelected: state.featureReducer.features,
  importedLayer: state.layerReducer.importedLayers,
});

const mapDispatchToProps = (dispatch) => ({
  deleteFeature: (event, feature) => {
    dispatch(deleteFeature(feature));
  },

  deleteAllFeatures: () => {
    dispatch(deleteAllFeatures());
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(App);
