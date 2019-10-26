/**
 * Here we add the list of Custom Drinks.
 * the submitted drinks will he available in the Input Screen
 * 
 * 
 */
import React from 'react';
import {View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { TextInput, Button, Paragraph, Dialog, Portal, Provider, HelperText } from 'react-native-paper';
import Picker from './Picker';
import { connect} from 'react-redux';
import DatePicker from 'react-native-date-picker';
import {  addDrinks } from "../redux/actions/drinks";
import { getUserDetails } from "../redux/actions/index";
import customStyles from '../styles';



 class AddDrinkScreen extends React.Component{

    constructor(props){
        super(props)
        this.state = {
            location: null,
            date: new Date(),
            nameDrink:'',
            type:'',
            alcohol:'',            
            alcoholPer:'',
            quantity:'',
            visible: false,
            numberOfServings:'',
            pLablePH:'Select',  
            isValid:true,       
            errorText : '',                          
            value : '',
            brand:'',
            showLoading:false, 
            brands:[{ type:'Select',
            label: 'Select',
            value: 'Select',
            alcohol:'0.0',              
            color: '#5a5858'}]
        }        
    }

    pOnValueChange = (v) =>{
        this.setState({value: v })
       return ;
    }
    // By default this is called when a components receives data fromReduxState or Props
    static getDerivedStateFromProps(nextProps, state){
        if(nextProps.addDrinkSucess && state.showLoading){            
            nextProps.dispatch(getUserDetails({email:nextProps.loggedInUser.email})); 
            return { ...state, showLoading:false, isValid:false, errorText:'Succesfully Added the Drink!'};            
        }   
        return null;
    }

    _showDialog = () => this.setState({ visible: true });

    _hideDialog = () => this.setState({ visible: false });

    _isValid = () => {
        const { nameDrink, alcohol, brand, alcoholPer, quantity } = this.state;
        if(nameDrink ==='' || alcohol ==='' || brand ==='' || alcoholPer ==='' ){
            this.setState({ isValid:false, errorText:'Some of the selection is empty'});
            return false;
        }
        if(this.props.userObject.drinksList && this.props.userObject.drinksList.length > 0){
            const x = this.props.userObject.drinksList.filter((v,i) => {
                return ((v.nameDrink  === nameDrink) && (v.alcohol === alcohol)&& (v.brand===brand)&& (v.alcoholPer===alcoholPer)&& (v.quantity===quantity))
            });
            if(x.length >0){
                this.setState({ isValid:false, errorText:'Selected Drink Combination already exists, change your selection'});
                return false;
            }
        }
        return true;
    }
    _addDrinkPressed = () => {        
        const { nameDrink, alcohol, brand, alcoholPer, quantity } = this.state;
        if(this._isValid()){
            this.setState({ showLoading:true});
            let userObject = this.props.userObject;
            let drink = { nameDrink, alcohol, brand, alcoholPer, quantity }
            let email = userObject.email;
            userObject.addDrink = drink;
            userObject.drinksList = userObject.drinksList ? userObject.drinksList : [];
            userObject.drinksList.push(drink);
            this.props.dispatch(addDrinks(userObject, drink, email));
            this.setState({nameDrink:'', alcohol:'', brand:'', alcoholPer:'', quantity:''})            
        }            
    };
    //When the Select Alcohol Drop downis cahnged this method is called.
    _onAlcoholValueChange = (alcohol) => {
        if(alcohol !== null){
            let brands = this.props.brands.filter((v, i) => v.type.toLowerCase() === alcohol.toLowerCase());
            this.setState({alcohol, brands, isValid:true, errorText:''});
        }        
    }    

    // When the Brand Drop Down is changed this mehtod will be called
    _onBrandChange = (brand) => {
        if(brand !== null){
            let alcohol = this.props.brands.filter((v, i) => v.value.toLowerCase() === brand.toLowerCase());
            if(alcohol.length > 0){
                this.setState({brand,  isValid:true, errorText:'', alcoholPer: alcohol[0].alcohol});
            }            
        }
    }
    // we render the UI on the Inptu screen
    render(){
        const { isValid, errorText, alcohol, brands, brand, showLoading } = this.state;
        const { alcohols } = this.props;        
        return(
        <Provider>
            <View style={styles.container}>  
            <ScrollView  style={styles.scrollContainer}>
            <View style={styles.viewItem}>                    
                <TextInput
                            label='Drink Name'
                            mode='flat'
                            value={this.state.nameDrink}
                            onChangeText={nameDrink => this.setState({ nameDrink })} />
            </View>
            <View style={styles.viewItem}>                                
                <Picker 
                    lablePH='Select Beverage'                     
                    items ={alcohols}
                    onValueChange = {this._onAlcoholValueChange}                   
                    value ={alcohol}
                />
            </View>
            <View style={styles.viewItem}>   
            <TextInput
                            label='Brand'
                            mode='flat'
                            value={this.state.brand}
                            onChangeText={brand => this.setState({ brand })} />
                {/*<Picker 
                    lablePH='Select Specaility'                     
                    items ={brands}
                    onValueChange = {this._onBrandChange}                   
                    value ={brand}
                /> */}
            </View>
            <View style={styles.viewItem}>                    
                <TextInput
                            label='Alcohol %'
                            mode='flat'                            
                            value={this.state.alcoholPer}
                            onChangeText={alcoholPer => this.setState({ alcoholPer })} />
            </View>                          
            <HelperText type="error" visible={!isValid}>
                {errorText}
            </HelperText>   
            <ActivityIndicator  style={customStyles.activityIndicator} animating={showLoading}  size="large" color="#0000ff" />                          
            <Button icon="add" mode="contained" onPress={this._addDrinkPressed}>
                Add Drink
            </Button>
            </ScrollView>             
        </View>
        </Provider>);
     } 
}

const styles = StyleSheet.create({
    container:{ flex:1, alignItems:'center', justifyContent:'center',flexDirection:'column' },
    scrollContainer:{ flex:1,width:'100%'},
    viewItem:{width:'100%', padding:10, marginTop:15},
    errorStyle:{ color:'red' }
});
const mapStateToProps = (state) => {
    return {
        alcohols:state.initialData.alcohols,
        userObject:state.login.userObject,
        brands:state.initialData.brands,
        addDrinkSucess:state.login.addDrinkSucess,
        loggedInUser:state.login.loggedInUser
    }
}
export default connect(mapStateToProps)(AddDrinkScreen);
