import { connect } from 'react-redux';

import { saveFeatures } from '../../actions/selectFeatureAction';
import { saveLayers, saveProperties, saveImportedLayers } from '../../actions/saveLayersAction';
import ilion from '../../components/Ilion';

const mapStateToProps = (state) => ({
  featuresTarget: state.featureReducer.features,
  layersActive: state.layerReducer.layers,
  coordinates: state.layerReducer.coordinates,
  properties: state.layerReducer.properties,
  newColor: state.layerReducer.importedLayers,
});

const mapDispatchToProps = (dispatch) => ({
  handleFeature: (features) => {
    // console.log('containers', features);
    dispatch(saveFeatures(features));
  },
  handleLayers: (layerName, layerExtent, color) => {
    dispatch(saveLayers(layerName, layerExtent, color));
  },
  handleProperties: (properties, coordinates) => {
    dispatch(saveProperties(properties, coordinates));
  },
  handleImportedLayers: (layerName, layerExtent, color) => {
    dispatch(saveImportedLayers(layerName, layerExtent, color));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ilion);
