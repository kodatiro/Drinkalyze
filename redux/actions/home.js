import * as Types from './types';

export const inputSubmit = (data) => {
    return {
      type: Types.INPUT_SUBMIT,
      data
    }  
}