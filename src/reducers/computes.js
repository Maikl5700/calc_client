import update from 'immutability-helper';
import { CURRENT_COMPUTES } from "actions/types";
// const initialState = []
const initialState = {
    computes: []
}

const reducer = (state = initialState, action) => {
    const { type } = action
    const { payload } = action

    switch (type) {
        case CURRENT_COMPUTES:
            return update(state, {
                computes: { $set: payload }
            })

        default:
            return state
    }
}

export default reducer