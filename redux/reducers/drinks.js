import * as Types from "../actions/types";

// Some of the properties are redundant.
const initialUserObj = {
    "drinksList":[],
    "drinksListDD":[],
    "addDrinkSucess":false,
    "addDrinkErrorText":"",
  };

  const handleAddDrinksServerResponseSuccess = (state, action) => {    
    let newState = { ...state };    
    if (action.drinks !== undefined) {
      if(true){
        let drinksList = state.drinksList;
        drinksList.push(action.drinks);
        //let drinkListDD = drinksList.map((v, i)=>{ return { label:i+1, value: v, color:'#5a5858'}})
        let drinkListDD = drinksList.map((v, i)=>{ return { label:v.alcohol, value: v.alcohol, color:'#5a5858'}})
        newState = Object.assign({}, state, { "drinksList": Object.assign([], drinksList), "addDrinkSucess":true,"drinksListDD": Object.assign([], drinkListDD)}) 
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
     /* case Types.ADD_DRINKS:
        return Object.assign({}, state); 
      case Types.ADD_DRINKS_SERVER_RESPONSE_ERROR:
        return handleAddDrinksServerResponseError(state, action);
      case Types.ADD_DRINKS_SERVER_RESPONSE_SUCCESS:
        return handleAddDrinksServerResponseSuccess(state, action);  */     
      default:
        return state;
    }
  }