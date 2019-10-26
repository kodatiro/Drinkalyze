import * as Types from "../actions/types";

// Some of the properties are redundant.
  const initialUserObj = {
    inpSub: {alcohol:'', drink:'', serving:'', numOfSrvngs:'', time:'', location:'', bacPer:'',
    hBlwLmt:'',
    hZeroPer:''},
    prevInpSubLst:[],
    bacPer:'',
    hBlwLmt:'',
    hZeroPer:''        
  };

  const handleInputSubmitted = (state, action) => {
    let newState = { ...state };
    let inpSub = '';
    let bac = '';
    let hBL ='';
    let hZP = ''
    let prevInp = state.prevInpSubList.push(inpSub);

    newState = Object.assign({}, state, {
      inpSub,
      prevInpSubLst:prevInp,
      bacPer:bac,      
      hBlwLmt:hBL,
      hZeroPer:hZP        
    });
    return { ...newState };
  }
  
  export default (state = initialUserObj, action) => {
    switch (action.type) {
      case Types.INPUT_SUBMIT:
        return handleInputSubmitted(state, action);      
      default:
        return state;
    }
  }