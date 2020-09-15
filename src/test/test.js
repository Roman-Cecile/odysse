import * as React from 'react';
import axios from 'axios';
import { fetchData } from '../middleware';
jest.mock('axios');
import Adapter from 'enzyme-adapter-react-16';
import { shallow, mount, configure} from 'enzyme';
import LayerPaper from '../components/LayerPaper';
import { saveLayers, SAVE_LAYERS } from "../actions/saveLayersAction";
import { HANDLE_ONE_FEATURE_PROPERTIES, HANDLE_CHANGE, DELETE_ALL_FEATURES, saveFeatures, SAVE_FEATURES } from "../actions/selectFeatureAction";
import { deleteLayer, DELETE_LAYER } from "../actions/deleteLayerAction";
import { deleteFeature, DELETE_FEATURE } from "../actions/deleteFeatureAction";
import reducer from '../reducer/featureReducer'

// === Test actions creators ===
describe("actions", () => {
  it("should create an action to save a layer", () => {
    const layerName = "FT_Chambre"
    const layerExtent = [
      781375.8195699933,
      5395475.575551177,
      782997.9028471755,
      5397113.83745873,
    ]
    const expectedAction = {
        type: SAVE_LAYERS,
        layerName,
        layerExtent,
    }
    expect(saveLayers(layerName, layerExtent)).toEqual(expectedAction)
  });
});

describe("actions", () => {
  it("should create an action to delete a layer", () => {
    const layer = "FT_Chambre"
    const expectedAction = {
      type: DELETE_LAYER,
      layer,
    }
    expect(deleteLayer(layer)).toEqual(expectedAction)
  });
});

describe("actions", () => {
  it("should create an action to delete a feature", () => {
    const feature = 'Feature n°2145';
    const expectedAction = {
      type: DELETE_FEATURE,
      feature,
    }
    expect(deleteFeature(feature)).toEqual(expectedAction)
  })
});

// describe("actions HANDLE_ONE_FEATURE_PROPERTIES", () => {
//   it("should handle feature's properties", () => {
//     const properties
//   })
// })

// === Test Reducer ===
describe('featureReducer', () => {
  it("should return the initial state", () => {
    expect(reducer(undefined, {})).toEqual(
      {
        features: [],
        oneFeatureProperties: {}
      }
    )
  });

  it("should handle SAVE_FEATURES", () => {
    expect(
      reducer(undefined, {
        type: SAVE_FEATURES,
        features: ["feature n°1064"]
      })
    ).toEqual(
      {
        features: ["feature n°1064"],
        oneFeatureProperties: {}
      }
    )
  });

  it("should handle DELETE_FEATURE", () => {
    expect(
      reducer(undefined, {
        type: DELETE_FEATURE,
        features: ["feature n°1064"],
      })
    ).toEqual(
      {
        features: [],
        oneFeatureProperties: {}
      }
    )
  });
  it("should handle HANDLE_ONE_FEATURE_PROPERTIES", () => {
    expect(
      reducer({oneFeatureProperties: {
        STATUT: "A"
      }}, {
        type: HANDLE_ONE_FEATURE_PROPERTIES,
        properties: {STATUT: "E"}
      })
    ).toEqual(
      {
        oneFeatureProperties: {
          STATUT: "E"
        }
      }
    )
  });
  it("should handle HANDLE_CHANGE", () => {
    expect(
      reducer({oneFeatureProperties: {
        STATUT: "A"
      }}, {
        type: HANDLE_CHANGE,
        value: "C",
        name: "STATUT"
      })
    ).toEqual(
      {
        oneFeatureProperties: {
          STATUT: "C"
        }
      }
    )
  });
  it("should handle DELETE_ALL_FEATURES", () => {
    expect(
      reducer(undefined, {
        type: DELETE_ALL_FEATURES,
      })
    ).toEqual(
      {
        features: [],
        oneFeatureProperties: {},
      }
    )
  });
});

// === Test Axios
describe('fetchData', () => {
  
  it('fetches successfully data from an API', async () => {
    const data = {
      data: {
        hits: [
          {
            objectID: '1',
            title: 'a',
          },
          {
            objectID: '2',
            title: 'b',
          },
        ],
      },
    };
 
    axios.get.mockImplementationOnce(() => Promise.resolve(data));
    await expect(fetchData()).resolves.toEqual(data);
  });
 
  it('fetches erroneously data from an API', async () => {
    const errorMessage = 'Network Error';
 
    axios.get.mockImplementationOnce(() =>
      Promise.reject(new Error(errorMessage)),
    );
    await expect(fetchData()).rejects.toThrow(errorMessage);
  });
});

// === Test Component ===
configure({adapter: new Adapter()});
describe('LayerPaper', () => {
  const onSelectLayerMock = jest.fn();
  const props = {
    layersActive: ["feature n°1614", "feature n°1617"],
    // layersActive: () => window.postMessage(['showLayer', "feature n°1614"], "*"),
    deleteLayer: () => onSelectLayerMock('Arg'),
  };
  it("should render.", () => {
    expect(mount(<LayerPaper {...props} />)).toMatchSnapshot();
  } )

  describe("Check props", () => {
    let wrapper;

    // beforeEach(() => {
      // console.log(shallow);
      // });
      // const message = window.postMessage(['showLayer', props.layersActive[0]], 'http://localhost:8080/')
      
      it("should call showLayer when clicking on the span", () => {
      wrapper = shallow(<LayerPaper {...props} />);
      wrapper.find('[color="secondary"]').at(0).simulate("click");
      
      // expect(message).toEqual("feature n°1614");
      expect(onSelectLayerMock).toHaveBeenCalled();
    })
  })
  // it('Should call "onSelectLayer" when clicking on the button', () => {
  //   const wrapper = shallow(<LayerPaper {...props} />);
  //   wrapper.find('.layerActive').simulate('click');
  //   expect(onSelectLayerMock).toHaveBeenCalled();
  // });
});