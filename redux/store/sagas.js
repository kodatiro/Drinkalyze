import { takeEvery, call, put, select, take, fork, all, takeLatest } from 'redux-saga/effects';
import * as Types from '../actions/types';
import { eventChannel } from 'redux-saga';
import { GetDataFromServer, deleteTodoAPI } from '../service';
import { auth, storage, db } from '../../firebase';
import {registerUserServerResponseSuccess, registerUserServerResponseError} from '../actions/types';
const database = db;

function* fetchLoginUser(action) {
  try {
    var result = {"login":true} 
    yield put({ type: Types.LOGIN_USER_SERVER_RESPONSE_SUCCESS, result });

/*
    console.log("Action->" + JSON.stringify(action));
    let formBody = {};
    formBody.firstname = "asdfg";//action.code;
    formBody.lastname = "zxcvbb"; //action.provider;
    formBody.age = "34"
    //const reqMethod = "POST";
    const reqMethod = "GET";
    const loginUrl = baseUrl + '/user/1';
    const response = yield call(GetDataFromServer, loginUrl, '', '');

    const result = yield response.json();
    console.log("ADS" + result.workingdetails);
    console.log("Result ->" + JSON.stringify(result))
    console.log('Result Json' + result);
    if (result.error) {
      yield put({ type: "LOGIN_USER_SERVER_REPONSE_ERROR", error: result.error });
    } else {
      yield put({ type: Types.LOGIN_USER_SERVER_RESPONSE_SUCCESS, result });
    }*/
  } catch (error) {
    // yield put({ type: Types.SERVER_CALL_FAILED, error: error.message });
    console.log(error);
  }
}
const loginUserServiceCall = (email, password) => {  
  return auth.signInWithEmailAndPassword(email, password);
};

function* loginAsync(action) {  
  try{      
      const response = yield call(loginUserServiceCall, action.payload.email, action.payload.password);      
      if(response.user){
          yield put({
              type: Types.LOGIN_USER_SERVER_RESPONSE_SUCCESS,
              payload: action.payload
          });
      }
  } catch(e) {            
      yield put({
          type: Types.LOGIN_USER_SERVER_RESPONSE_ERROR,
          payload: e
      });
  }
}


function* logoutAsync() {  
  const response = yield call(LogoutUserServiceCall);
  yield put({
      type: 'LOGOUT_ASYNC',
      payload: response
  });
}

const signUpServiceCall = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password);
};

function* signUpAsync(action) {
  try{      
      const response = yield call(signUpServiceCall, action.payload.email, action.payload.password);      
      if(response.code) {
          yield put({type: Types.SIGN_UP_SERVER_RESPONSE_ERROR, payload: response});
      } else {
          yield put({type: Types.SIGN_UP_SERVER_RESPONSE_SUCCESS, payload: action.payload});
      }
  }
  catch(e) {      
      yield put({type: Types.SIGN_UP_SERVER_RESPONSE_ERROR, payload: e});
  }
}

const forgotPasswordServiceCall = (email) => {
  return auth.sendPasswordResetEmail(email);
};

function* forgotPasswordAsync(action) {  
  const response = yield call(forgotPasswordServiceCall, action.payload);
  if(true){
    yield put({type: Types.FORGOT_PASSWORD_SERVER_RESPONSE_SUCCESS, payload: {message:"An email has been sent to reset the password."}});
  } else {
     yield put({type: Types.FORGOT_PASSWORD_SERVER_RESPONSE_ERROR, payload: action.payload});
  }
}




function insertNewUser(item) {
  const newItemRef = database.ref('Users').push();
  return newItemRef.set(item);
}

function* createNewUserItemSaga() {
  const action = yield take(Types.INSERT_NEW_USER);
  try {
    const response = yield call(insertNewUser, action.payload);       
    yield put({ type: Types.INSERT_NEW_USER_SUCCESS, payload: response });      
  } catch (error) {
      yield put({ type: Types.INSERT_NEW_USER_ERROR, payload:error });  
      console.log(error);
  }
}
function createEventChannelToFindUser(loggedInUserEmail){
  const listener = eventChannel(emit => {      
      database.ref('Users').orderByChild("email").equalTo(loggedInUserEmail)
      .on('value', (data) => {
        if(data.val()){
          return emit(data.val())
        } else{//if Business User, emp is not found
          return emit({});
        }          
      });
          return () => database.ref('Users').off(listener);
  });
  return listener; 
}

function* getLoggedInUserDetails(action){
  const getDataChannel = createEventChannelToFindUser(action.payload.email);
  while(true) {
      const item = yield take(getDataChannel); 
      yield put({type: Types.GET_USER_SERVER_RESPONSE_SUCCESS, payload:item});    
  }  
} 

function* updateUserObject(action){
  const tasksDb = database.ref('Users').orderByChild("email").equalTo(action.email);  
  tasksDb.once("child_added", function(snapshot){        
        snapshot.ref.update(action.userObject);
  });  
  yield put({ type: Types.ADD_DRINKS_SERVER_RESPONSE_SUCCESS, drinks:action.drinks });
  // return tasksDb.on('value', function(snapshot){
  //   //snapshot would have list of NODES that satisfies the condition
  //   console.log(snapshot.val());
  //   snapshot.ref.update(action.task);
  // });
}

function* updateInputUserObject(action){
  const tasksDb = database.ref('Users').orderByChild("email").equalTo(action.email);  
  tasksDb.once("child_added", function(snapshot){        
        snapshot.ref.update(action.userObject);
  });  
  if(action.type ===  Types.ADD_INPUTS){
    yield put({ type: Types.ADD_INPUTS_SERVER_RESPONSE_SUCCESS, input:action.input });
  }
  if(action.type ===  Types.ADD_DRINKS){
    yield put({ type: Types.ADD_INPUTS_SERVER_RESPONSE_SUCCESS, input:action.input });
  }
  if(action.type ===  Types.CLEAR_BAC){
    yield put({ type: Types.CLEAR_BAC_SERVER_RESPONSE_SUCCESS, error:"" });
  }
  if(action.type ===  Types.UPDATED_BAC){
    yield put({ type: Types.UPDATED_BAC_SERVER_RESPONSE_SUCCESS, input:action.input });
  }
  
  // return tasksDb.on('value', function(snapshot){
  //   //snapshot would have list of NODES that satisfies the condition
  //   console.log(snapshot.val());
  //   snapshot.ref.update(action.task);
  // });
}

export default function* rootSaga(params) {
    yield takeLatest(Types.LOGIN_USER, loginAsync);    
    yield takeLatest(Types.SIGN_UP, signUpAsync);    
    yield takeLatest(Types.LOGOUT, logoutAsync);     
    yield takeLatest(Types.FORGOT_PASSWORD, forgotPasswordAsync);  
    yield fork(createNewUserItemSaga);
    yield takeLatest(Types.GET_USER, getLoggedInUserDetails);
    yield takeLatest(Types.ADD_DRINKS, updateUserObject); 
    yield takeLatest(Types.ADD_INPUTS, updateInputUserObject); 
    yield takeLatest(Types.UPDATED_BAC, updateInputUserObject); 
    yield takeLatest(Types.CLEAR_BAC, updateInputUserObject); 

  }