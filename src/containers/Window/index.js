import { connect } from 'react-redux';

import Window from '../../components/Window';
import { handleOneFeatureProperties, handleChange } from '../../actions/selectFeatureAction';

const mapStateToProps = (state) => ({
  properties: state.featureReducer.oneFeatureProperties,
});

const mapDispatchToProps = (dispatch) => ({
  handleOneFeatureProperties: (properties) => {
    dispatch(handleOneFeatureProperties(properties));
  },
   handleChange: (event) => {
     dispatch(handleChange(event.target.name, event.target.value));
   }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(Window);
