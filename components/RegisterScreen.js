/*
    In this screen we are registering the User with their personal informations
    we will be saving the values locally when moving to the next screen to collect the username password.

*/ 

import * as React from 'react';
import {View, Button as ButtonRN,  ScrollView, StyleSheet, Text, DatePickerIOS, DatePickerAndroid, Platform, TouchableOpacity} from 'react-native';
import {Card, TextInput,Button,  Dialog, Portal , Provider, HelperText } from 'react-native-paper';
import { registerUser } from '../redux/actions/index'
import moment from 'moment';
import { connect} from 'react-redux';
import Picker from './Picker';


const ErrorValidationLabel = ({ txtLbl }) => (    
    <Paragraph  style={styles.errorStyle}>
            <Text>{txtLbl}</Text>
        </Paragraph>    
    );
 class RegisterScreen extends React.Component { 
    constructor(props){
        super(props)                 
        this.state = {        
            name : '',
            height:'',
            weight:'',
            gender:'',            
            isValid:true,     
            visible:false,  
            errorText : '', 
            date: new Date(),
            dateSel:'', 
            dateError:'Age limit 21 years or older',
            dateErrorType:'info',
            isIOS: Platform.OS === 'ios' ? true : false
        }
    }
    onClearPressed =() =>{
        this.setState({
        name : '',
        height:'',
        weight:'',
        gender:'',
        date: new Date(),
        })
    }
    _isValid = () => {         
        const { name, height, weight, gender, dateSel } = this.state;
        if(name ==='' || height ==='' || weight ==='' || gender ==='' || dateSel ===''){
            this.setState({ isValid:false, errorText:'Some of the selection is empty'});
            return false;
        }
        return true;
    }
    _showDialog = () => {
        if(Platform.OS === 'ios'){
            this.setState({ visible: true })  
        } else{
            this.openDatePicker();
        }        
        return;
    };
    openDatePicker = async () =>{
        try {
            const curYear = new Date().getFullYear();
            const {action, year, month, day} = await DatePickerAndroid.open({
            // Use `new Date()` for current date.
            // May 25 2020. Month 0 is January.
            date: new Date()
          });
          if (action !== DatePickerAndroid.dismissedAction) {
            //alert({year,month,day})
            // Selected year, month (0-11), day            
            if(parseInt(curYear) - parseInt(year) >= 21){            
                const d = new Date(year+"-"+(parseInt(month) + 1)+"-"+day);
                const dtme = moment(d).format("MM-DD-YYYY")  
                this.setState({ date:d, dateSel: dtme });   
            } else{
                this.setState({ dateErrorType:'error', date:'',
                dateSel:''});
            }             
          }
        } catch ({code, message}) {
          console.warn('Cannot open date picker', message);
        }
      }

    _hideDialog = () => this.setState({ visible: false });
    
    _onDateChanged = (d) =>{        
        const dtme = moment(d).format("MM-DD-YYYY");
        const curYear = new Date().getFullYear();
        const year =  moment(d).format("YYYY"); 
        if(parseInt(curYear) - parseInt(year) >= 21){    
            this.setState({ date:d, dateSel: dtme });
        } else{
            this.setState({ dateErrorType:'error', date:'',
            dateSel:''});
        }
    }
    onSubmitPressed =() =>{        
        
        const { name, height, weight, gender, dateSel } = this.state;
        if(this._isValid()){
            this.props.navigation.navigate('Signup');
            this.props.dispatch(registerUser({ name, height, weight, gender, dob:dateSel }));
            
        }
    }
    render(){
        const { genderDD } = this.props;
        const { isValid, errorText, dateSel,  gender, isIOS, dateErrorType, dateError } = this.state;
        return(<View style={styles.container}>
            <ScrollView  style={styles.container}>            
            <View style={styles.viewItem}>   
                <TextInput
                    style={styles.textBox}
                    label='Name'
                    value={this.state.name}
                    onChangeText={name => this.setState({name})} />
                    </View>  
            <View style={styles.viewItem}>   
                <TextInput
                style={styles.textBox}
                    label='Height(in cms)'
                    value={this.state.height}
                    keyboardType = "numbers-and-punctuation"
                    onChangeText={height => this.setState({height})} />
                    </View>  
            <View style={styles.viewItem}>   
                <TextInput
                    style={styles.textBox}
                    label='Weight(in lbs)'
                    value={this.state.weight}
                    keyboardType = "numbers-and-punctuation"
                    onChangeText={weight => this.setState({weight})} />
                    </View>  
            <View style={styles.viewItemPic}>  
                            <Picker 
                                lablePH='Select Gender'                     
                                items ={genderDD}
                                onValueChange = {gender => this.setState({gender})}                   
                                value ={gender}
                            />                 
            </View>  
                <View style={styles.viewItemCustom}>                
                            <View style={styles.selTmeCon}>                                
                                    <ButtonRN  title="DateOfBirth" onPress={this._showDialog} ></ButtonRN>
                                    <Text style={{ color:'#6f6d6d', fontSize: 16, paddingTop:10,marginLeft:100 }}>{dateSel}</Text>                                
                            </View>                                                    
                                <Portal>
                                    <Dialog
                                        visible={this.state.visible}
                                        onDismiss={this._hideDialog}>
                                        <Dialog.Title>Select Time</Dialog.Title>
                                            <Dialog.Content>
                                                {
                                                    (isIOS ? (<DatePickerIOS 
                                                        date={this.state.date} 
                                                        mode='date' 
                                                        onDateChange={this._onDateChanged} />) :(
                                                            <View></View> 
                                                        ))                                          
                                                }                                                
                                            </Dialog.Content>
                                        <Dialog.Actions>
                                            <Button onPress={this._hideDialog}>Cancel</Button>
                                            <Button onPress={this._hideDialog}>Done</Button>
                                        </Dialog.Actions>
                                    </Dialog>
                                </Portal>
                    </View>        
                    <HelperText type={dateErrorType}>
                                    {dateError}
                                </HelperText>
                    <HelperText type="error" visible={!isValid}>
                        {errorText}
                </HelperText>                       
                    <View style={styles.viewItem}>  
                     
                <View style={styles.parentButtons}>
                    <Button  style={styles.button} mode="outlined" onPress={this.onClearPressed}>
                        Clear
                    </Button>  
                    <Button  style={styles.button}  mode="outlined"  onPress={this.onSubmitPressed}>
                        Next 
                    </Button>   
                </View>            
            </View>  
            </ScrollView>
        </View>)
    }
}

RegisterScreen.navigationOptions = {  
    title: 'Register',
  };
  

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    viewItem:{width:'100%', marginTop:15},
    viewItemPic:{
        ...this.viewItem,
        padding:10
    },
    parent:{
      flex:1,
      flexDirection:'row',
      justifyContent:'space-around',
      alignItems:'center',
      width:'100%', 
      padding:20,            
    },
    parentButtons:{
        flex:1,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center',
        width:'100%',    
        height:'20%',
        marginTop:15 
        //borderColor:'#000',
        // borderWidth:10,        
      },
    textBox:{
        margin:10,
    },
    button:{
      width:'45%',
      height: '100%'
    },
    viewItemCustom:{ borderWidth: 1,
        borderColor: '#a2a0a0',
        padding:8, 
        backgroundColor:'#eaeaea', 
        alignItems:'flex-start',
        minHeight:32, width:'95%', 
        margin:10, marginTop:20, marginRight:15},
        customButton:{
            color:'#6f6d6d'
        },
        selTmeCon:{flex:1,flexDirection:'row', justifyContent:'space-between',color:'#6f6d6d', fontSize: 16},

  });
  

  const mapStateToProps = (state) => {
    return {
        genderDD:state.initialData.gender,
    };
}
export default connect(mapStateToProps)(RegisterScreen);
