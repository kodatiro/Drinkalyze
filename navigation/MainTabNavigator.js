/*
  Here we have the Bottom TAB  Navigation defined.
  We import the screen, Icons, Labels for Tabs, and any other properties that we need to have.
  Arrage the screens on the Tab Navigator
*/
import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';
import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import DrinksScreen from '../screens/DrinksScreen';
import SettingsScreen from '../screens/SettingsScreen';
import InputScreen from  '../components/InputScreen';
import AddDrinkScreen from '../components/AddDrinkScreen';
import HistoryScreen from '../components/HistoryScreen';
import ItemDetails from '../components/ItemDetails';

const config = Platform.select({
  web: { headerMode: 'screen' },
  default: {},
});

const HomeStack = createStackNavigator(
  {
    Home: HomeScreen
  },
  {
    initialRouteName: 'Home',
  }
);

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

//HomeStack.path = '';

const DrinksStack = createStackNavigator(
  {
    Drinks: AddDrinkScreen,
  },
  {
    initialRouteName: 'Drinks',
  },
  config
);

DrinksStack.navigationOptions = {
  tabBarLabel: 'Drinks',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'} />
  ),
};

//DrinksStack.path = '';

const SettingsStack = createStackNavigator(
  {
    Settings: SettingsScreen,
  },
  config
);

SettingsStack.navigationOptions = {
  tabBarLabel: 'Stats',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'} />
  ),
};

SettingsStack.path = '';

const HistoryStack = createStackNavigator(
  {
    History: HistoryScreen,
    Details:ItemDetails
  },
  config
);

HistoryStack.navigationOptions = {
  tabBarLabel: 'History',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-settings' : 'ios-settings'} />
  ),
};

//HistoryStack.path = '';


const InputStack = createStackNavigator(
  {
    InputScreen: InputScreen    
  },
  config
);

InputStack.navigationOptions = {
  tabBarLabel: 'Input',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon focused={focused} name={Platform.OS === 'ios' ? 'ios-add-circle-outline' : 'md-add-circle-outline'} />
  ),
};

//InputStack.path = '';


const tabNavigator = createBottomTabNavigator({
  Home:HomeStack,
  Input:InputStack,
  AddDrink:DrinksStack,
  Stats:SettingsStack,
  History:HistoryStack,
});

tabNavigator.path = '';

export default tabNavigator;
