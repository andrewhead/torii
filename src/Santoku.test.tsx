import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import { Santoku } from './Santoku';

Enzyme.configure({ adapter: new Adapter() })

const defaultState = {
  lineVersions: {
    allLineVersions: [],
    byId: {}
  },
  lines: {
    allLines: [],
    byId: {}
  },
  steps: {
    allSteps: [],
    byId: {}
  }
}

function setup() {
  const props = {
    ...defaultState,
    steps: {
      allSteps: ["0"],
      byId: {
        0: {
          linesAdded: [],
          linesRemoved: []
        }
      }
    }
  }
  const enzymeWrapper = shallow(<Santoku {...props} />)
  return {
    enzymeWrapper
  }
}

describe('Santoku', () => {
  it('should render self and subcomponents', () => {
    const { enzymeWrapper } = setup()
    const snippets = enzymeWrapper.find('Snippet');
    expect(snippets.length).toBe(1);
    expect(snippets.getElement().key).toEqual("0");
  })
})