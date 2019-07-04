import { combineReducers } from 'redux';
import context from './context';
import countries from './countries';
import settlement from './settlement';
export default combineReducers({
  context,
  countries,
  settlement
});
