import * as React from 'react';
import {View,  ScrollView, StyleSheet, Text, ActivityIndicator} from 'react-native';
import {Card, TextInput, Button, HelperText} from 'react-native-paper';
import { signUp, registerUserServerReq } from '../redux/actions/index'
import { connect} from 'react-redux';
import customStyles from '../styles';


class SignUpScreen extends React.Component {
    state = {
        email:'',
        password:'',
        confirmpassword:'',
        isValid:true,       
        errorText : '',
        showLoading:false  
    }
    onClearPressed =() =>{
        this.setState({email:'',
        password:'',
        confirmpassword:'',
        })
    }
    static getDerivedStateFromProps(nextProps, state){
        if(nextProps.signUpStatus){
            nextProps.dispatch(registerUserServerReq(nextProps.userObject));
            nextProps.navigation.navigate('Login');
        } 
        if(nextProps.error !==""){
           // this.setState({ isValid:false, errorText:nextProps.error});
           return { ...state, errorText:nextProps.error, isValid:false, showLoading:false };
        }       
        return null;
    }
    _isValid = () => {
        const { email, password, confirmpassword } = this.state;
        
        if(email ==='' || password ==='' || confirmpassword ===''){
            this.setState({ isValid:false, errorText:'Fields cannot be empty'});
            return false;
        }
        if(!email.includes('@')){
            this.setState({ isValid:false, errorText:'Email is not valid'});
            return false;
        }
        if(password !== confirmpassword){
            this.setState({ isValid:false, errorText:'Confirm Password Doesnot Match with Password, Can you check again?'});
            return false;
        }
        return true;
    }
    onSubmitPressed =() =>{
        //this.props.navigation.navigate('Login')
        const { email, password } = this.state;
        if(this._isValid()){       
            this.setState({ showLoading:true });     
            this.props.dispatch(signUp({ email, password }));
        }
    }
    render(){
        const { isValid, errorText, showLoading } = this.state;        
        return(<View style={styles.container}>
            <ScrollView  style={styles.container}>            
                <TextInput
                    label='Email'
                    style={styles.textBox}
                    value={this.state.email}
                    onChangeText={email => this.setState({email: email.toLowerCase()})} />

                <TextInput
                    style={styles.textBox}
                    label='Password'
                    value={this.state.password}
                    onChangeText={password => this.setState({password})} />
                
                <TextInput
                    style={styles.textBox}
                    label='Confirm'
                    value={this.state.confirmpassword}
                    onChangeText={confirmpassword => this.setState({confirmpassword})} />
                
                <HelperText type="error" visible={!isValid}>
                        {errorText}
                </HelperText>
                <ActivityIndicator  style={customStyles.activityIndicator} animating={showLoading}  size="large" color="#0000ff" />                    
                <View style={styles.parentButtons}>
                    <Button  style={styles.button} mode="outlined" onPress={this.onClearPressed}>
                        Clear
                    </Button>  
                    <Button  style={styles.button}  mode="outlined"  onPress={this.onSubmitPressed}>
                        Submit 
                    </Button>   
                    </View>            
            </ScrollView>
        </View>)
    }
}
SignUpScreen.navigationOptions = {  
    title: 'Register',
  };


const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
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
        height:'20%' 
        //borderColor:'#000',
        // borderWidth:10,        
      },
    textBox:{
        margin:10,
    },
    button:{
      width:'45%',
      height: '100%'
    }
  });
  
  
const mapStateToProps = (state) => {
    return {
        signUpStatus:state.login.signUpStatus,
        error:state.login.error,
        userObject:state.login.userObject
    };
}
  export default connect(mapStateToProps)(SignUpScreen);