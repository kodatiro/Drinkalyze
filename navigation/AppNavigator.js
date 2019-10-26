/*
  Here we define the Main Container for the App
  Main Container uses the Bottom Tab Navigator
  We switch between the Authentication screen and Tab Navigator Screen.
  
*/

import React from 'react';
import { createAppContainer, createSwitchNavigator } from 'react-navigation';
import AuthScreen from '../screens/AuthScreen';
import MainTabNavigator from './MainTabNavigator';
import { createStackNavigator } from 'react-navigation-stack';
import RegisterScreen from '../components/RegisterScreen';
import SignupScreen from '../components/SignUpScreen';

const AuthStack = createStackNavigator({
  Login: AuthScreen,    
  Register: RegisterScreen,  
  Signup: SignupScreen,  
})

export default createAppContainer(
  createSwitchNavigator({
    Auth:AuthStack,
    // You could add another route here for authentication.
    // Read more at https://reactnavigation.org/docs/en/auth-flow.html
    Main: MainTabNavigator,
  },{
    initialRouteName: 'Auth',
  })
);
