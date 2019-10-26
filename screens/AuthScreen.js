/*
  This is the Authentication  called on the app launch to login
  We are showing the Touch ID/ Face ID to login the user for the second time.

*/
import * as React from 'react';
import {View, StyleSheet, ScrollView,  ActivityIndicator, TouchableHighlight, Switch, Alert } from 'react-native';
import {Card, TextInput, Button, HelperText, Provider, Portal, Text, Paragraph } from 'react-native-paper';
import { loginUser, forgotPassword, registerUserServerReq, getUserDetails , updateUserInputs} from '../redux/actions/index'
import {connect} from 'react-redux';
import customStyles from '../styles';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import {logout} from '../redux/actions/index'

class AuthScreen extends React.Component {
    state = {
        email : '',
        password : '',
        touchMessage:'',
        enabledMessage:'',
        isValid:true,   
        isSaveCred:false,    
        errorText : '', 
        showLoading:false,
        hasHardware: null,
        isEnrolled: null, 
        rememberMe:false
    }
    // By default this is called when a components receives data fromReduxState or Props
    // The return value of the below function will update the component state.
    static getDerivedStateFromProps(nextProps, state){
        if(nextProps.loggedIn){  
            // on Login Success we are calling the server to get the user details/info           
            nextProps.dispatch(getUserDetails({email:nextProps.loggedInUser.email})); 
        }      
        // const email = nextProps.userObject.email;
        // if(nextProps.loggedIn && email !== undefined && email !== "" ){
        //     //nextProps.navigation.navigate('Home');                      
        // }  
        if(!nextProps.showLoading && nextProps.error !==''){
            return { ...state, errorText:nextProps.error, isValid:false, showLoading:false };
        }
        return null;
    }
    
    // By default this is called when a components receives data from ReduxState or Props
    // when data is mapped from redux state to component props this is called by default.
    // For Example after sign-in button is clicked and app receives data form server.
    componentDidUpdate(){
        const email = this.props.userObject.email;
        if(this.props.loggedIn && email !== undefined && email !== "" ){                        
           this._saveCredentials(); 
        }  
    }
    // Below function is not called currently. it is used to show an Alert.
    _showAlertForSaveCred = () => {
        Alert.alert(
            'Enable Touch Login',
            'Save credentials to login using Face/Touch Login?',
            [              
              {
                text: 'Cancel',
                onPress: () => {     
                    this.props.navigation.navigate('Home');                              
                },
                style: 'cancel',
              },
              { text: 'OK', onPress: () => {                    
                this._saveCredentials();
              }},
            ],
            { cancelable: false }
          );
    }

    _saveCredentials = () => {
        this.rememberUser();   
    }
    // This is used to save the credentials entered. 
    // currently when ever the user successfully logs-in we are saving the credentials irrespective of askign the user.

    rememberUser = async()=>{
        const { email, password } = this.state;
        let loginCred = {};
        loginCred.user = email;
        loginCred.password =  password;
        try {
            await SecureStore.setItemAsync('login-cred', JSON.stringify(loginCred));
            this.props.navigation.navigate('Home');   
        } catch(e){
            console.error("Error saving login to keychain" +e);
        }        
    }
    
    // This is called on the Component Launch
    componentDidMount(){
        const item  = this.props.navigation.getParam('logOut');        
        if(item){           
           this.props.dispatch(logout())
        } else {
            this.getRemembereduser();
        }
    }
    // below function is used for toggle button, we are not using it currently.
    // we can have a toggle button to remember me. currently we are savin the credentials for every login.
    toggleRememberMe = value => {
        if(this._isValid()){
            this.setState({ rememberMe:value });
            if(value){
                // user wants to be remembered
                this.rememberUser();
            } else {
                this.forgetUser();
            }
        }        
    }   
    // below method is used to retrieve the saved credentials of the user.
    getRemembereduser = async () => {
        try{
            const loginCred = await SecureStore.getItemAsync('login-cred');
            let loginObj = JSON.parse(loginCred);
            if(loginCred && loginObj){
                this.setState({
                    email: loginObj.user,
                    password : loginObj.password
                })
                this._testhardwareAsync()
            }
        } catch(e){
            console.error( "Error - "+e);
        }
    }
    // below methos is used to remove the saved credentials, we are not using this method. 
    // we are replacing the credentials on every successful login.
     forgetuser = async () =>{
         try {
            await SecureStore.deleteItemAsync('login-cred'); 
         } catch(e){

         }
     }   
    _testhardwareAsync = async () => {
        let hasHardware = await LocalAuthentication.hasHardwareAsync();
        //Determine whether a face or fingerprint scanner is available on the device
        this.setState({ hasHardware, touchMessage:(hasHardware ? '' : 'TouchID not available on device.') });
        //the device has saved fingerprints or facial data to use for authentication
        let isEnrolled = await LocalAuthentication.isEnrolledAsync();
        this.setState({isEnrolled, enabledMessage:(isEnrolled ? '' :'Device has no saved fingerprints or facial data to use.')});
        //Attempts to authenticate via Fingerprint/TouchID (or FaceID if available on the device)
        await this._authenticateAsync();
    }

    _authenticateAsync = async () => {
        let authenticationResult = await LocalAuthentication.authenticateAsync();
        if(authenticationResult && authenticationResult.success){            
            this.onLoginPressed();
        }
    }
    //Below func is called when user click hte forgot password link on the login page.
    onForgotPasswordPressed = () => {
        const { email, password } = this.state;
        if(email !==""){
            this.props.dispatch(forgotPassword(email.toLocaleLowerCase()));
        } else{
            this.setState({ isValid:false, errorText:'Enter your valid email before clicking forgot-password. You will receive Email to reset.'});
        }        
    }    
    _isValid = () => {
        const { email, password } = this.state;
        if(email ==='' || password ===''){
            this.setState({ isValid:false, errorText:'Email and Passwords cannot be empty'});
            return false;
        }
        if(email.indexOf('@') === -1){
            this.setState({ isValid:false, errorText:'Email is not valid'});
            return false;
        }
        return true;
    }

     onLoginPressed =() =>{
        const { email, password } = this.state;
        if(this._isValid()){
            this.setState({showLoading:true});            
            this.props.dispatch(loginUser(email.toLocaleLowerCase(), password));            
        }                 
    }
     onSignupPressed =() =>{
        this.props.navigation.navigate('Register')
    }
    render(){
        const { isValid, errorText, showLoading, touchMessage, enabledMessage } = this.state;
        return(<View style={styles.container}>          
        
        <ScrollView  style={styles.scrollContainer}>   
            
            <Card style={styles.card}>
                <TextInput
                style={styles.textBox}
                    label='Email'
                    value={this.state.email}
                    keyboardType = "email-address"
                    onChangeText={email => this.setState({email:email.toLowerCase()})} />

                <TextInput
                style={styles.textBox}
                    label='Password'
                    value={this.state.password}
                    secureTextEntry= {true}
                    onChangeText={password => this.setState({password})} />  
                    </Card>          
                    <HelperText type="error" visible={!isValid}>
                        {errorText}
                    </HelperText>        
                    <HelperText type="info" >
                        {touchMessage}
                    </HelperText>        
                    <HelperText type="info" >
                        {enabledMessage}
                    </HelperText>                    
                    <ActivityIndicator  style={customStyles.activityIndicator} animating={showLoading}  size="large" color="#0000ff" />                    
                    <View style={styles.parentButtons}>
                        <Button  style={styles.button} mode="outlined" onPress={this.onLoginPressed}>
                            Login
                        </Button>  
                        <Button  style={styles.button}  mode="outlined"  onPress={this.onSignupPressed}>
                            Signup 
                        </Button>   
                    </View>                       
                    <View style={styles.versionParent}>                        
                        <TouchableHighlight onPress={this.onForgotPasswordPressed}>
                                <Text  style={styles.versionText}> Forgot Password  ? </Text>
                        </TouchableHighlight>                           
                    </View>
                        <View style={styles.version}><Text  style={styles.versionText}>v 1.1.0</Text></View>
                </ScrollView>

        </View>)
    }
}
/*
<Button  style={styles.btn}  mode="text"  onPress={this.onForgotPasswordPressed}>
</Button>   
   {renderValidationError}
 </View>              
                <View style={styles.parentB} >
                <View>
                        <Switch value={this.state.rememberMe}
                        onValueChange={(value) => this.toggleRememberMe(value)}
                        /><Text>Remember Me</Text>
                    </View>
*/ 
AuthScreen.navigationOptions = {
    title: 'Login',
  };


  const styles = StyleSheet.create({
      card:{
          marginTop :200
      },
    container: {
      flex: 1,
      flexDirection:'column',
      justifyContent:'space-around',
      backgroundColor: '#fff',      
    },
    loadingParent:{
        flex: 1,
      flexDirection:'column',
      justifyContent:'space-around',
      alignItems:'center',  
    },
    activityIndicator:{          
        justifyContent:'space-around',
        alignItems:'center',         
    },
    scrollContainer:{ flex:1,width:'100%', marginTop:35},
    textBox:{
        margin:10,
    },
    parent:{
        flex:1,
        justifyContent:'flex-end',
    },
    parentB:{
        flex:1,
        justifyContent:'flex-start',
    },
    parentButtons:{         
      flex:1,
      flexDirection:'row',
      justifyContent:'space-around',
      alignItems:'center',
      width:'100%',    
      height:'70%'           
    },
    button:{
      width:'45%',      
    },
    btn:{
        width:'75%',
        marginTop:50
      },
      versionParent :{
          ...this.parentButtons,
          marginTop: 50,
          marginLeft: 130

      },      
      version:{
          flex:1,
          flexDirection:'row',
          alignItems:"center",
          justifyContent:'space-around',          
          marginTop:50
      },
      versionText:{
        color: '#6f6d6d',
        textDecorationLine:'underline'
      }
  });
  
  // Here the state is the Redux State whihc is the Applications State.
  // we map from redux State to the component.
  const mapStateToProps = (state) =>{
      return{
        loggedIn:state.login.loggedIn,
        pending:state.login.pending,
        error:state.login.error,
        userObject:state.login.userObject,
        showLoading:state.login.showLoading,
        loggedInUser:state.login.loggedInUser
      }
  }
  export default connect(mapStateToProps)(AuthScreen)