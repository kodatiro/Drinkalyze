import * as Types from "../actions/types";

const inpObj = {"alcohol":'', "drink":'', "serving":'', "numOfSrvngs":0, "time":0,"timeTicks":0, "updtdTmeTicks":0, "location":'', "bacPer":0,"hBlwLmtTicks":0,"hZeroPerTicks":0, "inBacPer":0,"inHBlwLmtTicks":0,"inHZeroPerTicks":0};                            
const dnkObj = { "nameDrink" : "", "alcohol" : "", "brand" : "", "alcoholPer" : "0", "quantity" : "" };
// Some of the properties are redundant.
const initialUserObj = {    
    "pending": false,
    "showLoading":false,    
    "loggedInUser": {},
    "loginStatus": false,    
    "loggedIn": false,
    "signUpStatus":false,
    "isValidToken": false,    
    "empDetails": {},
    "result": {},
    "drinksList":[],
    "drinksListDD":[],
    "addDrinkSucess":false,
    "addDrinkErrorText":"",
    "addInputSucess":false,
    "addInputErrorText":"",
    "error":"",
    "userObject":{
      "name":"", 
      "height":"", 
      "weight":"", 
      "gender":"", 
      "dob":"",
      "email":"",
      "password":"",
      "inputDetailsList":[inpObj], 
      "drinksList":[dnkObj],      
      "input" : inpObj,
      "addDrink" : dnkObj
    },
    "user": {
      "email": "",
      "displayName": "",
      "registered": false,
      "refreshToken": "",
      "expiresIn": "",
      "emailVerified": false,
      "validSince": "",
      "disabled": false,
      "lastLoginAt": "",
      "createdAt": ""
    }
  
  };

  const handleLoginServerResponseSuccess = (state, action) => {    
    let newState = { ...state };
    if (action.payload !== undefined) {
      newState = Object.assign({}, state, { "pending": false, "loggedIn": true, "loginStatus": true,
      "signUpStatus": false, "isValidToken": true, showLoading:false,"loggedInUser": action.payload, "result": Object.assign({}, action.payload) })  
    }    
    return { ...newState };  
  }
  const handleLoginServerResponseError = (state, action) => {
    let newState = { ...state };
    if (action.payload !== undefined) {
      newState = Object.assign({}, state, { loginStatus: false, showLoading:false, signUpStatus: false, error: action.payload.message, });
    }
    return { ...newState };
  }  
  const handleGetUserDetailsSuccess = (state, action) => {
    let newState = { ...state };
    if (action.payload !== undefined) {
      const val = Object.values(action.payload);
       if(val.length >0){
        const userObject = val[0];  
        const dList = userObject.drinksList || [];
        //const iDet = userObject.inputDetailsList || [];        
        //const ip = iDet[(iDet.length > 0 ? iDet.length -1 : 0)] || inpObj;        
        //userObject.input = (parseFloat(ip.bacPer) > 0 ? ip : inpObj)
        //userObject.addDrink =  dList[(dList.length > 0 ? dList.length -1 : 0)] || dnkObj;   
        //userObject.inputDetailsList = iDet;        
        //userObject.drinksList =  dList;  
        let drinksListDD = dList.map((v, i)=>{ return { label:v.nameDrink, value: v.nameDrink, color:'#5a5858', id:i, brand: v.brand, alcohol:v.alcoholPer, type:v.alcohol }})   
        newState = Object.assign({}, state, { userObject: Object.assign({}, val[0]), drinksListDD });
       }   
       else{
        newState = Object.assign({}, state, { error : "User Data doesnot exist, re-signup again"});
       }       
    } else{
      newState = Object.assign({}, state, { error : "Error retrieving data."});  
    }              
    return { ...newState };
  }
  const handleAddDrinksServerResponseSuccess = (state, action) => {    
    let newState = { ...state };    
    if (action.drinks !== undefined) {
      if(true){
        // let drinksList = state.drinksList;
        // drinksList.push(action.drinks);
        let drinksList = state.userObject.drinksList;
        let drinkListDD = drinksList.map((v, i)=>{ return { type: v.alcohol, label:v.nameDrink, value: v.nameDrink, color:'#5a5858', id:i, brand: v.brand, alcohol:v.alcoholPer}})
        newState = Object.assign({}, state, {  "drinksList" : Object.assign([], drinksList), "addDrinkSucess":true, "drinksListDD": Object.assign([], drinkListDD)}) 
      }       
    }    
    return { ...newState };  
  }  
  const handleAddDrinksServerResponseError = (state, action) => {
    let newState = { ...state };
    return { ...newState };
  }

  export default (state = initialUserObj, action) => {
    switch (action.type) {
      case Types.LOGIN_USER:
        return Object.assign({}, state, { "loggedIn": false, "isValidToken": false, "pending": true, showLoading:true }); 
      case Types.LOGIN_USER_SERVER_RESPONSE_ERROR:
        return handleLoginServerResponseError(state, action);
      case Types.LOGIN_USER_SERVER_RESPONSE_SUCCESS:
        return handleLoginServerResponseSuccess(state, action); 
      case Types.GET_USER:
          return { ...state, addDrinkSucess:false };
      case Types.GET_USER_SERVER_RESPONSE_SUCCESS:
          return handleGetUserDetailsSuccess(state, action);
      case Types.LOGOUT:
            return { ...state, "pending": false,
            "showLoading":false,    
            "loggedInUser": {},
            "loginStatus": false,    
            "loggedIn": false,
            "signUpStatus":false,
            "error": '',
            "isValidToken": false, "userObject" : {
              "name":"", 
              "height":"", 
              "weight":"", 
              "gender":"", 
              "dob":"",
              "email":"",
              "password":"",
              "inputDetailsList":[inpObj], 
              "drinksList":[dnkObj],      
              "input" : inpObj,
              "addDrink" : dnkObj
            } 
          };
      case Types.REGISTER_USER:
        return { ...state, "pending": false,
        "showLoading":false,    
        "loggedInUser": {},
        "loginStatus": false,    
        "loggedIn": false,
        "signUpStatus":false,
        "isValidToken": false, "userObject" : action.payload, error: '', };
      case Types.UPDATE_INPUTS:
            return { ...state};
      case Types.INSERT_NEW_USER:
        return { ...state};
      case Types.INSERT_NEW_USER_SUCCESS:
        return { ...state};      
      case Types.SIGN_UP:
        return { ...state, signUpStatus:false, error: '', showLoading:true };          
      case Types.SIGN_UP_SERVER_RESPONSE_SUCCESS:
          return {
              ...state,
              signUpStatus: true,
              showLoading:false,
              error: '',
              "userObject" : { ...state.userObject, "email": action.payload.email, "password":action.payload.password, "inputDetailsList":[], "drinksList":[], }
          };
      case Types.FORGOT_PASSWORD:
        return { ...state }
      case Types.FORGOT_PASSWORD_SERVER_RESPONSE_SUCCESS:
        return { ...state, error:action.payload.message, showLoading:false }
      case Types.FORGOT_PASSWORD_SERVER_RESPONSE_ERROR:
          return { ...state, error: action.payload.message, showLoading:false }
  
      case Types.SIGN_UP_SERVER_RESPONSE_ERROR:
          return {
              ...state,
              signUpStatus:false,
              showLoading:false,
              error: action.payload.message
          }
      case Types.CLEAR_BAC:
            let uObj = state.userObject;
            uObj.input = inpObj;
            return { ...state, userObject : uObj };
      case Types.UPDATED_BAC:
            let urObj = state.userObject;
            urObj.input = action.input;
            return { ...state, userObject : urObj };
      case Types.UPDATED_BAC_SERVER_RESPONSE_SUCCESS:
            return { ...state}
      case Types.CLEAR_BAC_SERVER_RESPONSE_SUCCESS:
            return { ...state}
      case Types.ADD_DRINKS:
          let drinksList = state.drinksList;
          drinksList.push(action.drinks);
          let drinkListDD = drinksList.map((v, i)=>{ return { label:v.alcohol, value: v.alcohol, color:'#5a5858', id:i, brand: v.brand, alcohol:v.alcoholPer, type:v.alcohol}})
        return Object.assign({}, state, { userObject: action.userObject, drinksListDD:drinkListDD, addDrinkSucess: false}); 
      case Types.ADD_DRINKS_SERVER_RESPONSE_ERROR:
        return handleAddDrinksServerResponseError(state, action);
      case Types.ADD_DRINKS_SERVER_RESPONSE_SUCCESS:
        return handleAddDrinksServerResponseSuccess(state, action);     
        case Types.ADD_INPUTS:          
        return Object.assign({}, state, { userObject: action.userObject, addInputSucess: false}); 
      case Types.ADD_INPUTS_SERVER_RESPONSE_ERROR:
        return {...state, addInputSucess: true,addInputErrorText:"error from server" };
      case Types.ADD_INPUTS_SERVER_RESPONSE_SUCCESS:
        return {...state, addInputSucess: true}
      default:
        return state;
    }
  }