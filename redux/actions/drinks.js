import * as Types from './types';

  export const addDrinks = (userObject, drinks, email) => {
    return {
      type: Types.ADD_DRINKS,
      userObject,
      drinks,
      email
    }  
  }

  export const getDrinksList = () => {
    return {
      type: Types.GET_DRINKS_LIST
    }  
  }