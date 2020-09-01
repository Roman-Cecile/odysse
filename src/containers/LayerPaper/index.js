import { connect } from 'react-redux';

import LayerPaper from '../../components/LayerPaper';
import { deleteLayer } from '../../actions/deleteLayerAction';

const mapStateToProps = (state) => ({
  layersActive: state.layerReducer.layers,
});

const mapDispatchToProps = (dispatch) => ({
  deleteLayer: (layer) => {
    dispatch(deleteLayer(layer));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(LayerPaper);
