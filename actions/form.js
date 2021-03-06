import {
    SHOW_DIALOG,
    HIDE_DIALOG,
    GETFORM_SRC_REQUEST,
    GETFORM_SRC_SUCCESS,
    GETFORM_SRC_FAILURE
} from '../constants/ActionTypes'

function getFailure(message) {
    return (dispatch) => {
        dispatch({
            type: GETFORM_SRC_FAILURE,
            message
        })
        dispatch(show())
    }
}

function getSuccess(pk_bo, pk_boins,processDefinitionId,processInstanceId) {
    let src = `${window.$ctx}/static/html/rt/browse.html?pk_bo=${pk_bo}&pk_boins=${pk_boins}&processDefinitionId=${processDefinitionId}&processInstanceId=${processInstanceId}`
    return (dispatch) => {
        dispatch({
            type: GETFORM_SRC_SUCCESS
        })
        dispatch(show(src))
    }
}

export function hide() {
    return {
        type: HIDE_DIALOG
    }
}

export function show(src) {
    return (dispatch, getState) => {
        let state = getState()
        let id = state.form.id
        dispatch({
            type: SHOW_DIALOG,
            id,
            src
        })
    }
}

export function getBo(item) {
    return (dispatch, getState) => {
        let { processDefinitionId, processInstanceId } = item
        let url = `${window.$ctx}/tc/getbo?processDefinitionId=${processDefinitionId}&processInstanceId=${processInstanceId}&_=${Date.now()}`
        dispatch({
            type: GETFORM_SRC_REQUEST
        })
        return fetch(url, {
                credentials: 'include',
				cache: 'no-cache'
            }).then( response => {
                if (response.ok) {
                    response.text().then(text => {
                        if (text) {
                            try {
                                let json = JSON.parse(text)
                                let { pk_bo, pk_boins } = json
                                if (pk_bo) {
                                    dispatch(getSuccess(pk_bo, pk_boins,processDefinitionId,processInstanceId))
                                } else {
                                    dispatch(getFailure(`${json.message}`))
                                }
                            } catch (e) {
                                dispatch(getFailure(`${e.message}`))
                            }
                        } else {
                            dispatch(getFailure('Api return nothing……'))
                        }
                    })
                } else {
                    dispatch(getFailure(`${response.status} ${response.statusText}`))
                }
            } )
    }
}
