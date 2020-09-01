import { connect } from 'react-redux';


import TablePop from '../../components/TablePop';

const mapStateToProps = (state) => ({
  properties: state.layerReducer.properties,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(TablePop);
