import * as Types from './types';

export const loginUser = (email, password) => {
  return {
    type: Types.LOGIN_USER,
    payload : {email, password}        
  }  
}

export const logout = () => ({
  type: Types.LOGOUT
});
export const signUp = (signUpData) => ({
  type: Types.SIGN_UP,
  payload: signUpData
});

export const registerUser = (signUpData) => ({
  type: Types.REGISTER_USER,
  payload: signUpData
});

export const registerUserServerReq = (data) => ({
  type: Types.INSERT_NEW_USER,
  payload:data  
});

export const getUserDetails = (data) => ({
  type: Types.GET_USER,
  payload:data  
});

export const updateUserInputs = (data) => ({
  type: Types.UPDATE_INPUTS,
  payload:data  
});

export const getUserDrinks = (data) => ({
  type: Types.UPDATE_DRINK,
  payload:data  
});
export const addInput = (userObject, input, email) => {
  return {
    type: Types.ADD_INPUTS,
    userObject,
    input,
    email
  }  
}

// export const registerUserServerResponseSuccess = (data) => ({
//   type: Types.REGISTER_USER_SERVER_RESPONSE_SUCCESS,
//   payload:data  
// });

// export const registerUserServerResponseError = (data) => ({
//   type: Types.REGISTER_USER_SERVER_RESPONSE_ERROR,
//   payload:data  
// });

export const forgotPassword = (email) => ({
  type: Types.FORGOT_PASSWORD,
  payload: email
});

export const clearBAC = (userObject, email) => ({
  type:Types.CLEAR_BAC,
  userObject,
  email
})

export const updatedBAC = (userObject, input, email) => ({
  type:Types.UPDATED_BAC,
  userObject,
  input,
  email
})