import { createStore } from 'redux';
import { appReducer } from './reducer';
import { initialState } from './state';

export const store = createStore(appReducer, initialState);
