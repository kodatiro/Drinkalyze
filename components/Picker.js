import React from 'react';
import RNPickerSelect, { defaultStyles } from 'react-native-picker-select';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';

const Picker = (props) => {
    if(Array.isArray(props.items) && props.items.length > 0){  
      //const labelValue =   Array.isArray(props.value) ? props.value[0]["label"] : (props.value.label || "") ;
      //fontFamily: 'Helvetica Neue'
      return(<View style={{ borderWidth: 1,
    borderColor: '#a2a0a0',padding:10,paddingTop:15, backgroundColor:'#eaeaea', minHeight:52}}>
    <RNPickerSelect
      placeholder={{ label: props.lablePH, value: null, color: '#5a5858' }}
      items={props.items}      
      onValueChange={props.onValueChange}
      style={{ 
        ... styles.inputIOS, 
            iconContainer: {
              top: 5,
              right: 0,
            },
            placeholder: {
              color: '#737171',
              fontSize: 16
              
            }
      }}
      value={(props.value ? (props.value.label || props.value) : "")}
      Icon={() => {
        return (
          <View
            style={styles.iconStyle}
          />
        );
      }}
    /></View>);
    } else{
      return(<View></View>)
    }
}

Picker.propTypes = {
    lablePH : PropTypes.string,
    colorPH : PropTypes.string,
    items : PropTypes.arrayOf(PropTypes.object),
    onValueChange : PropTypes.func,
    style: PropTypes.object,
    value : PropTypes.string 
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  iconContainer: {
    top: 5,
    right: 0,
  },
  placeholder: {
    color: 'purple',
    fontSize: 20,
    fontWeight: 'bold',
  },
  inputIOS: {
    fontSize: 20,
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 4,
    justifyContent:'center',
    alignItems:'center',
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  inputAndroid: {
    fontSize: 16,
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderWidth: 0.5,
    borderColor: 'purple',
    borderRadius: 8,
    color: 'black',
    paddingRight: 30, // to ensure the text is never behind the icon
  },
  iconStyle:{
    backgroundColor: 'transparent',
    borderTopWidth: 10,
    borderTopColor: 'gray',
    borderRightWidth: 10,
    borderRightColor: 'transparent',
    borderLeftWidth: 10,
    borderLeftColor: 'transparent',
    width: 0,
    height: 0,
  },
  
});


export default Picker;