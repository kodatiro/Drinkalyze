import { combineReducers } from 'redux';
import login from './login';
import drinks from './drinks';
import initialData from './initialData';
import home from './home';

export default combineReducers({
    login,
    drinks,
    initialData,
    home
    //timesheet: CreatTimeSheet, another way of creating reducers  
});