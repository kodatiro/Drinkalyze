/**
 * This Component is the place holder to show the list of drinks previously added by the user.
 * We need to show the list of Drinks and a Button to add a new Drink
 */

import React from 'react';
import { ScrollView, View, StyleSheet, Text } from 'react-native';
import { List, Portal, FAB } from 'react-native-paper';
import AddDrinkScreen from '../components/AddDrinkScreen';

// TODO Showcase the list of Drinks previously added.
export default class DrinksScreen extends React.Component{

  state = {
    open: false,
  };
  _onPressHandle = () =>{    
    this.props.navigation.navigate('AddDrink');
  }
  render(){  
    return (<View style={styles.container}> 
          <Text>DrinksScreen </Text>
        </View>);
  }
}

DrinksScreen.navigationOptions = {
  title: 'Previous Drinks',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 15,
    backgroundColor: '#fff',
  },
  fab:{
    
    borderColor:'#000',
   height:30
    
  }
});
/*
  <ScrollView  style={styles.container}>
        <List.Item
                  title="First Item"
                  description="Item description"
                   />
                   <List.Item
                  title="First Item"
                  description="Item description"
                   />
                   <List.Item
                  title="First Item"
                  description="Item description"
                   />
                   <List.Item
                  title="First Item"
                  description="Item description"
                   />
                   <List.Item
                  title="First Item"
                  description="Item description"
                   />
                   <List.Item
                  title="First Item"
                  description="Item description"
                   />
                   <List.Item
                  title="First Item"
                  description="Item description"
                   /><List.Item
                   title="First Item"
                   description="Item description"
                    />
                    <List.Item
                  title="First Item"
                  description="Item description"
                   />
                   <List.Item
                  title="First Item"
                  description="Item description"
                   />
                   <List.Item
                  title="First Item"
                  description="Item description"
                   />
                   <List.Item
                  title="First Item"
                  description="Item description"
                   />
                   <List.Item
                  title="First Item"
                  description="Item description"
                   />
                   <List.Item
                  title="First Item"
                  description="Item description"
                   />
                   <List.Item
                  title="First Item"
                  description="Item description"
                   />
                   <List.Item
                  title="First Item"
                  description="Item description"
                   /><List.Item
                   title="First Item"
                   description="Item description"
                    />
                    <List.Item
                  title="First Item"
                  description="Item description"
                   />
</ScrollView>       
        <View style={styles.fab}>
          <FAB.Group             
             icon={'add'}
             actions={[]}
             onStateChange={({ open }) => this.setState({ open })}
             onPress={()=> this._onPressHandle(this)}
           />
         </View> */