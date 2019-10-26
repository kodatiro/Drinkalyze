
/**
 * Here we ahve the list of Inputs that are submitted by the User in th past.
 * 
 */

import React from 'react';
import { connect} from 'react-redux';
import { Image, Platform, ScrollView, StyleSheet, View, Text, TouchableHighlight } from 'react-native';
import { ProgressBar, Colors, Button, List, Divider } from 'react-native-paper';
import moment from 'moment';

 class HistoryScreen extends React.Component {
  constructor(props){
      super(props);
      this.state = {
        count:0
      }
  }
  componentDidMount() {
    //Here is the Trick
    const { navigation } = this.props;
    //Adding an event listner om focus
    //So whenever the screen will have focus it will set the state to zero
    this.focusListener = navigation.addListener('didFocus', () => {
      this.setState({ count: 0 });
    });
  }
 
  componentWillUnmount() {
    // Remove the event listener before removing the screen from the stack
    this.focusListener.remove();
    //clearTimeout(this.t);
  }
  // On an Item clicked, we are navogating to the detials of the item.
  // we are apssing the item data to the details component.
  _onItemClickHandler = (context, data) => {
        this.props.navigation.navigate('Details', { item : data });
    }
 render(){
  const { inputList } = this.props;// we are getting the list of the Input from the server
  const il =  inputList ? inputList.reverse() : [];// we are reversing the list ot see th elatest added one on the top of the list.
  return (
    <View style={styles.container}>
        <ScrollView  style={styles.container}>

          {
            il.map((v,i)=>{
            const des = v.alcohol + "  "+ moment(v.timeTicks).format("MM/DD/YY HH:mm:ss")
              return(<View>
                          <TouchableHighlight onPress={()=> this._onItemClickHandler(this, v)}>
                            <List.Item                
                            title={v.drink}
                            description={des}
                            left={props => <List.Icon {...props} icon="local-drink" />}
                            />  
                          </TouchableHighlight>
                          <Divider />
                    </View>)
              })
           }     

        </ScrollView>
    </View>
  );}
}

HistoryScreen.navigationOptions = {
  title: 'History',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

const mapStateToProps = (state) => {
  return {
      inputList:state.login.userObject.inputDetailsList,
  };
}
export default connect(mapStateToProps)(HistoryScreen)