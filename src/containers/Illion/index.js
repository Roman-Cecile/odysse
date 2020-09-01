import { connect } from 'react-redux';

import { saveFeatures } from '../../actions/selectFeatureAction';
import { saveLayers, saveProperties, saveImportedLayers } from '../../actions/saveLayersAction';
import Illion from '../../components/Illion';

const mapStateToProps = (state) => ({
  featuresTarget: state.featureReducer.features,
  layersActive: state.layerReducer.layers,
  coordinates: state.layerReducer.coordinates,
  properties: state.layerReducer.properties,
});

const mapDispatchToProps = (dispatch) => ({
  handleFeature: (features) => {
    // console.log('containers', features);
    dispatch(saveFeatures(features));
  },
  handleLayers: (layerName, layerExtent) => {
    dispatch(saveLayers(layerName, layerExtent));
  },
  handleProperties: (properties, coordinates) => {
    dispatch(saveProperties(properties, coordinates));
  },
  handleImportedLayers: (layerName, layerExtent) => {
    dispatch(saveImportedLayers(layerName, layerExtent));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Illion);
