import React, {createContext, useContext, useReducer} from 'react';

const initialState = {
    user: null,
    token: null
}

const tokenReducer = (state, action) => {
    switch (action.type) {
        case "SET_TOKEN":
            return action.value;
        case "CLEAR_TOKEN":
            return null;
        default:
            return state;
    }
};

const userReducer = (state, action) => {
    switch (action.type) {
        case "CHANGE_USER":
            return action.value;
        default:
            return state;
    }
};

const projectsReducer = (state, action) => {
    switch (action.type) {
        case "SET_PROJECTS":
            return action.value;
        default:
            return state;
    }
};

const combineReducers = (state, action) => ({
    user: userReducer(state.user, action),
    token: tokenReducer(state.token, action),
    projects: projectsReducer(state.projects, action),
})

const StateContext = createContext({});

export const StateProvider = props =>(
    <StateContext.Provider value={useReducer(combineReducers, getIntialState('edirect'))}>
        {props.children}
    </StateContext.Provider>
);

export const useStateValue = () => useContext(StateContext);

export const persistState = (storageKey, state) => {
    window.localStorage.setItem(storageKey, JSON.stringify(state));
}
export const getIntialState = (storageKey) => {
    let savedState = window.localStorage.getItem(storageKey);

    if (savedState) {
        return JSON.parse(savedState );
    }

    return initialState
}