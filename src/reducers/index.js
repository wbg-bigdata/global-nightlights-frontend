import { combineReducers } from 'redux';
import settlement from './settlement';
import context from './context';
export default combineReducers({
  context,
  settlement
});
