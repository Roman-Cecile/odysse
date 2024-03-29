import { connect } from 'react-redux';

import { saveFeatures } from '../../actions/selectFeatureAction';
import { saveLayers, saveProperties, saveImportedLayers, saveSomeProperties } from '../../actions/saveLayersAction';
// import ilion from '../../components/Ilion/newIlion';
import { initiateAxios } from '../../actions/axiosAction';
import ilion from '../../components/Ilion';

const mapStateToProps = (state) => ({
  featuresTarget: state.featureReducer.features,
  layersActive: state.layerReducer.layers,
  coordinates: state.layerReducer.coordinates,
  someProps: state.layerReducer.someProps,
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
  handleProperties: (properties) => {
    dispatch(saveProperties(properties));
  },
  handleImportedLayers: (layerName, layerExtent, color, geom) => {
    dispatch(saveImportedLayers(layerName, layerExtent, color, geom));
  },
  handleSomeProperties: (properties, length) => {
    dispatch(saveSomeProperties(properties, length))
  },
  initiateAxios: () => {
    dispatch(initiateAxios())
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ilion);
