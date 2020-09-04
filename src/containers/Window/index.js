import { connect } from 'react-redux';

import Window from '../../components/Window';

const mapStateToProps = (state) => ({
  properties: state.layerReducer.properties,
});

const mapDispatchToProps = (dispatch) => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Window);
