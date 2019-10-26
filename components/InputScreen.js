/**
 * here we add a new Input  
 * 
 */

import React from 'react';
import {View, Text, Button as ButtonRN, StyleSheet, ScrollView, Alert,ActivityIndicator, Platform, TimePickerAndroid, DatePickerIOS} from 'react-native';
import { connect} from 'react-redux';
import { TextInput, Button, Paragraph, Dialog, Portal , Provider, HelperText } from 'react-native-paper';
import Picker from './Picker';
import { inputSubmit } from "../redux/actions/home";
import { getDrinksList } from "../redux/actions/drinks";
import { getUserDetails, addInput } from '../redux/actions/index'
import moment from 'moment';
import customStyles from '../styles';

class InputScreen extends React.Component{
    constructor(props){
        super(props)
        moment.locale('en');
        const dt = new Date();
        const dtme = dt.getHours() + ":"+ dt.getMinutes()

        this.state = {
            visible: false,
            date: new Date(),
            dateSel:dtme,            
            timeTicks:dt.getTime(),
            alcohol:'',            
            numOfSrvngs:'',                                                   
            value : '',
            drink:'',
            serving:'',
            location: '',
            drinksDD:[],
            isValid:true,       
            errorText : '',
            showLoading:false,
            servings:this.props.initialData.servings,
            isIOS: Platform.OS === 'ios' ? true : false
        }
        this.pOnValueChange = this.pOnValueChange.bind(this);
    }
    
    componentDidMount(){                
        const brds = this.props.brands || [];
        this.setState({drinksDD : brds});
    }
    // The return value of the below function will update the component state.
    static getDerivedStateFromProps(nextProps, state){
        if(nextProps.addInputSucess && state.showLoading){            
            nextProps.dispatch(getUserDetails({email:nextProps.loggedInUser.email})); 
            return { ...state, showLoading:false, isValid:false, errorText:'Succesfully Added the Input!'};
        }   
        // whena new Drink is added we are making the Input previous selection to zero to start from begning.
        if(nextProps.addDrinkSucess){
            const dt = new Date();
            const nwS ={ showLoading:false, alcohol: '', drink:'', serving:'', numOfSrvngs:'', errorText : '',  location:'', timeTicks:dt.getTime() };
            return nwS;
        }        
        return null;
    }
    // we are not usign this methods currently, we can use this to show an Alert.
    _checkDrinksAdded = () =>{
        Alert.alert(
            'Info',
            'Looks like you have not added any Drinks yet, Click Proceed to Add Drinks',
            [                            
              { text: 'Proceed', onPress: () => {
                  this.props.navigation.navigate("AddDrink");
                    } 
                },
            ],
            { cancelable: false }
          );
    }

    _isValid = () => {
        const { alcohol, drink, serving, numOfSrvngs, dateSel, location, timeTicks } = this.state;
        if(alcohol ==='' || drink ==='' || serving ==='' || numOfSrvngs ==='' || dateSel === '' || location === ''){
            this.setState({ isValid:false, errorText:'Some of the selection is empty'});
            return false;
        }
        // Disabling the condition to check already selected selection
        //if(this.props.userObject.inputDetailsList.length > 0){
        //     const x = this.props.userObject.inputDetailsList.filter((v,i) => {
        //         return ((v.serving  === serving) && (v.alcohol === alcohol)&& (v.drink===drink)&& (v.numOfSrvngs===numOfSrvngs)&& (v.timeTicks===timeTicks))
        //     });
        //     if(x.length >0){
        //         this.setState({ isValid:false, errorText:'Selected Input Combination already exists, change your selection'});
        //         return false;
        //     }
        // }
        return true;
    }
    // this is called when we submit a new Input to the screen.
    onSubmitPressed = () => {        
        const { alcohol, drink, serving, numOfSrvngs, dateSel, location, timeTicks, bacPer, hBlwLmtTicks, hZeroPerTicks } = this.state;
        moment.locale('en');        
        const dnkML = this.props.servings.filter((v,i) => ((v.type.toLowerCase() === alcohol.toLowerCase()) && (v.value.toLowerCase() === serving.toLowerCase())))[0]["code"];
        const alPer = this.state.drinksDD.filter((v, i) => v.value.toLowerCase() === drink.toLowerCase())[0]["alcohol"];        
        const weight = parseInt(this.props.userObject.weight);
        const r = this.props.userObject.gender === "Male" ? 0.73 : 0.66;
        const bac = (((parseInt(dnkML) * (parseInt(numOfSrvngs)))* ((parseFloat(alPer)/100)) * 0.1738)/(parseInt(weight) * r));
                                
        const oldInput = this.props.input;        
        const newBac = (oldInput.bacPer.toString() !== "0" ? (parseFloat(oldInput.bacPer) + parseFloat(bac)) : parseFloat(parseFloat(bac)).toFixed(4));        
        const hUZP = parseFloat(parseFloat((newBac * 60)/0.016).toFixed(2)); // Calculating the minutes for Hours Untill Zero Percentage.
        //const hUBL = parseFloat((0.1999 * 60)/0.016).toFixed(2);// Limit is 0.2, calculating untll below limit
        const ohUBL = parseFloat(parseFloat(((newBac-0.08) * 60)/0.016).toFixed(2));// Limit is 0.08, calculating untll below limit
        const hUBL = ohUBL <= 0 ? 0 :ohUBL

        if(this._isValid()){
            let userObject = this.props.userObject;
            let input = { alcohol, drink, serving, numOfSrvngs, time:dateSel, timeTicks, location, 
                bacPer:newBac, 
                hBlwLmtTicks:hUBL,  
                hZeroPerTicks:hUZP, 
                inBacPer:newBac, 
                inHBlwLmtTicks:hUBL,
                inHZeroPerTicks:hUZP}
            let email = userObject.email;
            userObject.input = input;
            userObject.inputDetailsList = userObject.inputDetailsList ? userObject.inputDetailsList : [];
            userObject.inputDetailsList.push(input);                    
            this.props.dispatch(addInput(userObject, input, email));            
        }
        const dt = new Date();    
        this.setState({ showLoading:true, alcohol: '', drink:'', serving:'', numOfSrvngs:'',  location:'', timeTicks:dt.getTime() });
        this.props.navigation.navigate("Home");      
    }

    pOnValueChange = (v) =>{
        this.setState({value: v })
       return ;
    }
    
    _showDialog = () => {
        if(Platform.OS === 'ios'){
            this.setState({ visible: true })  
        } else{
            this.openTimePicker();
        }        
        return;
    };

    _hideDialog = () => this.setState({ visible: false });
    
    openTimePicker = async () =>{
        const d = new Date();
        const H = d.getHours(); 
        const M = d.getMinutes();
        try {
            const {action, hour, minute} = await TimePickerAndroid.open({
              hour: H,
              minute: M,
              is24Hour: false, // Will display '2 PM'
            });
            if (action !== TimePickerAndroid.dismissedAction) {
              // Selected hour (0-23), minute (0-59)
              const dtme = hour + ":"+ minute;
              this.setState({ date:d, dateSel: dtme, timeTicks:d.getTime() });
            }
          } catch ({code, message}) {
            console.warn('Cannot open time picker', message);
          }
      }

    _onDateChanged = (d) =>{        
        const dtme = d.getHours() + ":"+ d.getMinutes()
        this.setState({ date:d, dateSel: dtme, timeTicks:d.getTime() });
    }
    _onNumServingsChange = (txt) => {
        //const regx = new RegExp
        // txt.toString().match(/[^0-9.]/g)
        txt= txt.replace(/[^0-9.]/g, '');        
        this.setState({ numOfSrvngs: txt })                 
    }
    _onAlcoholValueChange = (alcohol) => {
        if(alcohol !== null){
            let drks = this.props.drinksDD;
            let brds = this.props.brands;
            let drinks = drks.length > 0 ? drks.concat(brds) : brds;
            let drksDD = drinks.filter((v, i) => v.type.toLowerCase() === alcohol.toLowerCase());
            let drinksDD = drksDD.map((v, i) => {let x = v; x.id = i; return x; });
            this.setState({alcohol, drinksDD});
        }
    }
    _onDrinkChange = (drink) => {
        if(drink !== null){
            const dnkObj = this.state.drinksDD.filter((v, i) => v.value.toLowerCase() === drink.toLowerCase());
            let servings = this.props.servings.filter((v, i) => v.type.toLowerCase() === dnkObj[0]["type"].toLowerCase());            
            this.setState({servings, drink});
        }
    }
    render(){
        const { alcohols, locations } = this.props;
        const { drink, alcohol, serving, numOfSrvngs, drinksDD, dateSel, servings,  showLoading, location, isValid, errorText, isIOS } = this.state;             
        return(
            <Provider>
                <View style={styles.container}>  
                    <ScrollView  style={styles.scrollContainer}>
                        <View style={styles.viewItem}>                            
                            <Picker 
                                lablePH='Select Alcohol'                     
                                items ={alcohols}
                                onValueChange = {this._onAlcoholValueChange}                   
                                value ={alcohol}
                            />
                        </View>
                        <View style={styles.viewItem}>                            
                            <Picker 
                                lablePH='Select Drink'                     
                                items ={drinksDD}
                                onValueChange = {this._onDrinkChange}                   
                                value ={drink}
                            />
                        </View>
                        <View style={styles.viewItem}>                            
                            <Picker 
                                lablePH='Select Serving Type'                     
                                items ={servings}
                                onValueChange = {serving => this.setState({serving})}                   
                                value ={serving}
                            />
                        </View>
                        <View style={styles.viewItem}>                    
                            <TextInput
                                    label='Number of Servings'                                    
                                    mode='flat'
                                    value={numOfSrvngs}    
                                    keyboardType ="number-pad"                                
                                    onChangeText={this._onNumServingsChange} />
                        </View>
                        <ActivityIndicator  style={customStyles.activityIndicator} animating={showLoading}  size="large" color="#0000ff" />                    
                        <View style={styles.viewItemCustom}>
                            <View style={styles.selTmeCon}>
                            <ButtonRN style={styles.btn} title="Select Time"  onPress={this._showDialog}></ButtonRN>
                            <Text style={{ color:'#6f6d6d', fontSize: 16, paddingTop:10,marginLeft:100 }}>{dateSel}</Text>
                            </View>                            
                                <Portal>
                                    <Dialog
                                        visible={this.state.visible}
                                        onDismiss={this._hideDialog}>
                                        <Dialog.Title>Drinks Start Time</Dialog.Title>
                                            <Dialog.Content>
                                            {
                                                    (isIOS ? (<DatePickerIOS date={this.state.date} mode='time' onDateChange={this._onDateChanged} />) :(
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
                        <View style={styles.viewItem}>                            
                            <Picker 
                                lablePH='Select Current Location '                     
                                items ={locations}
                                onValueChange = {location => this.setState({location})}                   
                                value ={location}
                            />
                        </View>
                        <HelperText type="error" visible={!isValid}>
                            {errorText}
                        </HelperText>         
                        <View style={styles.parentButtons}>                                              
                        <Button style={styles.button}  mode="contained"  onPress={this.onSubmitPressed}>
                            Submit 
                        </Button>   
                    </View>   
                    </ScrollView>               
                </View>
            </Provider>);
     } 
}


const styles = StyleSheet.create({
    container:{ flex:1, alignItems:'center', justifyContent:'center',flexDirection:'column' },
    scrollContainer:{ flex:1,width:'100%', marginTop:15},
    viewItem:{width:'100%', padding:10, marginTop:10},
    errorStyle:{ color:'red' },
    selTmeCon:{flex:1,flexDirection:'row', justifyContent:'space-between',color:'#6f6d6d', fontSize: 16},
    btn:{color:'#6f6d6d', fontSize: 16},
    viewItemCustom:{ borderWidth: 1,
        borderColor: '#a2a0a0',
        padding:8, 
        backgroundColor:'#eaeaea', 
        alignItems:'flex-start',
        minHeight:32, width:'95%', 
        margin:10, marginTop:15, marginRight:15},
        customButton:{
            color:'#6f6d6d'
        },
    parentButtons:{
        flex:1,
        flexDirection:'row',  
        justifyContent:'space-around',      
        alignItems:'center',
        width:'100%',    
        height:'20%' ,
        marginTop:15      
      },
      button:{
        width:'75%',        
      }
});

const mapStateToProps = (state) => {
    return {
        initialData: state.initialData,
        alcohols:state.initialData.alcohols,
        servings:state.initialData.servings,
        drinksList:state.login.userObject.drinksList,
        locations:state.initialData.locations,  
        drinksDD:state.login.drinksListDD,
        userObject:state.login.userObject, 
        addInputSucess:state.login.addInputSucess,
        loggedInUser:state.login.loggedInUser,
        brands:state.initialData.brands,
        inputList:state.login.userObject.inputDetailsList,
        input:state.login.userObject.input,
        addDrinkSucess:state.login.addDrinkSucess,
    };
}
export default connect(mapStateToProps)(InputScreen);
