import { CURRENT_COMPUTES } from "actions/types";

const updateComputes = (current_computes) => (dispatch) => {
    dispatch({
        type: CURRENT_COMPUTES,
        payload: current_computes
    })
}

export { updateComputes }