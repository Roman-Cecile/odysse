import { connect } from 'react-redux';

import ImportedLayers from '../../components/ImportedLayer';
import { deleteImportedLayer } from '../../actions/deleteLayerAction';
import { changeColor } from '../../actions/colorAction';

const mapStateToProps = (state) => ({
  importedLayers: state.layerReducer.importedLayers,
  color: state.layerReducer.color.hex,
});

const mapDispatchToProps = (dispatch) => ({
  deleteImportedLayer: (layer) => {
    dispatch(deleteImportedLayer(layer));
  },
  handleNewColor: (color, name) => {
    // console.log(color);
    dispatch(changeColor(color.hex, color.rgb, name));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ImportedLayers);
