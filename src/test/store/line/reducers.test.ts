import reducer from '../../../store/line/reducers'
import * as types from '../../../store/line/types'

describe('line reducer', () => {
    it('should handle UPDATE_TEXT', () => {
        expect(
            reducer(undefined, {
                text: 'Updated text',
                type: types.UPDATE_TEXT
            })
        ).toEqual({
            index: -1,
            path: '',
            text: 'Updated text',
            version: -1
        })
    })
})