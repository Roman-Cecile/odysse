import { connect } from 'react-redux';

import ImportedLayers from '../../components/ImportedLayer';
import { deleteImportedLayer } from '../../actions/deleteLayerAction';

const mapStateToProps = (state) => ({
  importedLayers: state.layerReducer.importedLayers,
});

const mapDispatchToProps = (dispatch) => ({
  deleteImportedLayer: (layer) => {
    dispatch(deleteImportedLayer(layer))
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImportedLayers);
