import _ from 'lodash';
import {
  ADD_SERIE,
  ADD_SERIES,
  REMOVE_SERIE,
  REMOVE_ALL_SERIES,
  SERIE_RENAMED
} from '../actions/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case SERIE_RENAMED:
      return { ...state, [action.payload.path]: action.payload };
    case ADD_SERIES:
      return { ...state, ..._.mapKeys(action.payload, 'path')}
    case ADD_SERIE:
      return { ...state, [action.payload.path]: action.payload };
    case REMOVE_SERIE:
      return _.omit(state, action.payload.path);
    case REMOVE_ALL_SERIES:
      return INITIAL_STATE
    default:
      return state;
  }
}
