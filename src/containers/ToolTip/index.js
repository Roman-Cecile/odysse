import { connect } from 'react-redux';


import ToolTip from '../../components/ToolTip';

const mapStateToProps = (state) => ({
  someProps: state.layerReducer.someProps,
  length: state.layerReducer.length,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(ToolTip);
