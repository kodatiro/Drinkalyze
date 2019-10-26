/*
  This screen is for Barcharts.
  We have implmented Barchart by making use of third-party libraries.

*/ 

import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text,TouchableOpacity, View} from 'react-native';
import {BarChart, Grid, XAxis, YAxis} from 'react-native-svg-charts';
import { connect} from 'react-redux';
import moment from 'moment';
import groupBy from 'lodash/groupBy';
import sum from 'lodash/sum';
import * as scale from 'd3-scale'

class SettingsScreen extends React.Component {
  constructor(props){
    super(props);
    this.state = {
      bacList:[],
      keysList:[]
    }
  }
  componentDidMount(){
    const { inputList } = this.props;  
    let bacPerList = [],   keys = [];
    if(inputList){
        // we get the list of Inputs as a Array of Object, 
        // each object contains properties related to the drinks and bac, time 
        // creating a new Array of Object with bac and date properties.    
        const il = inputList.map((v,i) => {
          return { 'bac': parseFloat(v.inBacPer), 'date':moment(v.timeTicks).format("DD")}
        })
        // Grouping the array of object by date to show in the bar charts
        const gIL = groupBy(il, function(r){      
          return parseInt(r.date);
        })    
        // getting Array of Keys from the grouped 
        keys = Object.keys(gIL);

            // Creating the BAC list to use in BarCharts.     
            bacPerList = keys.reduce((p,v,i)=>{
              let bclst = gIL[keys[i]].map(v => v.bac);
              let sumBCLst = sum(bclst);
              let sB = parseInt(sumBCLst * 100)
              p.push(sB);
              //p.push({'value': sB, 'label': v})
              return p;
            }, [])
        }
    //const lst = gIL[keys[0]].map(v => v.bac);    
    this.setState({ bacList : (bacPerList ? bacPerList : []), keysList:(keys ? keys : []) });
  }
  static getDerivedStateFromProps(nextProps, state){
    return null;
  }

  /*
   <BarChart style={{ height: 200 }}
                data={ bacList }
                svg={{ fill }}
                contentInset={{ top: 30, bottom: 30 }}>
                <Grid/>
            </BarChart>        
            <XAxis
                    style={{ marginTop: 10, marginLeft : 20 }}
                    data={ keysList }
                    scale={scale.scaleBand}
                    formatLabel={ (value, index) => { 
    
                      return keysList[value]
                    } }
                    labelStyle={ { color: 'black', marginLeft : 1 } }
                />  
  flex: 1, marginLeft: 8 
  
  */
  render(){
    const fill = 'rgb(134,65,244)';
    const { bacList, keysList } = this.state;    
    return(
      <View style={{  margin: 20 }}>
        <View>
          <Text>BAC% on each day for alcohol consumed</Text>
        </View>
        { ((bacList.length > 0 && keysList.length > 0) ? (
        <View style={{ height: 200, padding: 20 }}>                  
            <BarChart
                    style={{ flex: 1 }}
                    data={bacList}
                    gridMin={0}
                    svg={{ fill: 'rgb(134, 65, 244)' }}
                />
                <XAxis
                    style={{ marginTop: 10 , marginLeft :20 }}
                    data={ keysList }
                    scale={scale.scaleBand}
                    formatLabel={ (value, index) => keysList[value] }
                    labelStyle={ { color: 'red', marginRight:50, align:'center' } }
                />
          
                </View>   ) : (<View><Text>You have no Data to Show.</Text></View>))}     
      </View>
    );
  }      
}

SettingsScreen.navigationOptions = {
  title: 'Stats',
};

const styles = StyleSheet.create({
  subTextBtm:{
    fontSize:12,
    color:'#6d6d6d'
  },
});

const mapStateToProps = (state) => {
  return {      
    inputList:state.login.userObject.inputDetailsList,      
  };
}
export default connect(mapStateToProps)(SettingsScreen);


/*

 <BarChart style={{ height: 200 }}
                data={ bacList }
                svg={{ fill }}
                contentInset={{ top: 30, bottom: 30 }}>
                <Grid/>
            </BarChart>        
            <XAxis
                    style={{ marginTop: 10, marginLeft : 20 }}
                    data={ keysList }
                    scale={scale.scaleBand}
                    formatLabel={ (value, index) => { 
                      
                      return keysList[value]
                    } }
                    labelStyle={ { color: 'black', marginLeft : 1 } }
                />  

          <BarChart style={{ height: 200 }}
                data={ bacList }
                svg={{ fill }}
                contentInset={{ top: 30, bottom: 30 }}>
                <Grid/>
            </BarChart>        
            <XAxis
                    style={{ marginTop: 10, marginLeft : 20 }}
                    data={ keysList }
                    scale={scale.scaleBand}
                    formatLabel={ (value, index) => { return value} }
                    labelStyle={ { color: 'black' } }
                />


                <YAxis
                    data={bacList}
                    yAccessor={({ index }) => index}
                    scale={scale.scaleBand}
                    contentInset={{ top: 10, bottom: 10 }}
                    spacing={0.2}
                    formatLabel={(_, index) => bacList[ index ].label}
                />
                  <BarChart
                    style={{ flex: 1, marginLeft: 8 }}
                    data={bacList}
                    horizontal={true}
                    yAccessor={({ item }) => item.value}
                    svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                    contentInset={{ top: 10, bottom: 10 }}
                    spacing={0.2}
                    gridMin={0}
                >
                    <Grid direction={Grid.Direction.VERTICAL}/>
                </BarChart>

                 <BarChart
                    style={{ flex: 1, marginLeft: 8 }}
                    data={bacList}
                    horizontal={true}
                    xAccessor={({ item }) => item.value}
                    svg={{ fill: 'rgba(134, 65, 244, 0.8)' }}
                    contentInset={{ top: 10, bottom: 10 }}
                    spacing={0.2}
                    gridMin={0}
                >
                    <Grid direction={Grid.Direction.HORIZONTAL}/>
                </BarChart>     
            <XAxis
                    style={{ marginTop: 10, marginLeft : 20 }}
                    data={ bacList }
                    scale={scale.scaleBand}
                    formatLabel={ (value, index) => { console.log(value + " - value"); return bacList[ index ].label} }
                    labelStyle={ { color: 'black' } }
                />
*/
