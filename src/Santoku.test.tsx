import Enzyme, { shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import * as React from 'react';
import { Santoku } from './Santoku';

Enzyme.configure({ adapter: new Adapter() })

function setup() {
  const props = {
    line: {
      index: -1,
      path: '',
      text: '',
      version: -1
    },
    updateIndex: jest.fn(),
    updateText: jest.fn()
  }
  const enzymeWrapper = shallow(<Santoku {...props} />)
  return {
    enzymeWrapper
  }
}

describe('Santoku', () => {
  it('should render self and subcomponents', () => {
    const { enzymeWrapper } = setup()
    expect(enzymeWrapper.find('p.line').text()).toBe("Additional message: ")
  })
})