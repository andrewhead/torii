import * as actions from '../../../store/line/actions'
import * as types from '../../../store/line/types'

describe('actions', () => {
    it('should create an action for updating text', () => {
        const text = 'Updated text'
        const expectedAction = {
            text,
            type: types.UPDATE_TEXT
        }
        expect(actions.updateText(text)).toEqual(expectedAction)
    })
})