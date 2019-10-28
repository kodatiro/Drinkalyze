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
      keysList:[],
      bacValues:''
    }
  }
  componentDidMount(){
    const { inputList } = this.props;  
    let bacPerList = [],   keys = [], bacVal = [];
    if(inputList){
        // we get the list of Inputs as a Array of Object, 
        // each object contains properties related to the drinks and bac, time 
        // creating a new Array of Object with bac and date properties.    
        const il = inputList.map((v,i) => {
          return { 'bac': parseFloat(v.inBacPer), 'date':moment(v.timeTicks).format("MM/DD")}
        })
        // Grouping the array of object by date to show in the bar charts
        const gIL = groupBy(il, function(r){      
          return r.date;
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
        
        bacVal = keys.reduce((p,v,i)=>{
          let bclst = gIL[keys[i]].map(v => v.bac);
          let sumBCLst = sum(bclst);
          let sB = parseInt(sumBCLst * 100)
          p.push(""+v+" - "+sB+"%");      
          return p;
        }, []);
  }
    //const lst = gIL[keys[0]].map(v => v.bac);    
    this.setState({ bacList : (bacPerList ? bacPerList.slice(0, 7) : []), bacValues: bacVal.join(";   "), keysList:(keys ? keys : []) });
  }
  static getDerivedStateFromProps(nextProps, state){
    return null;
  }

  
  render(){
    const fill = 'rgb(134,65,244)';
    const { bacList, keysList, bacValues } = this.state;    
    return(
      <View style={styles.container}>
        <View>
        <Text style={styles.textDetHead}>BAC% on each day of alcohol consumed</Text>
          <Text style={styles.textDet} >{ bacValues }</Text>
        </View>
        { ((bacList.length > 0 && keysList.length > 0) ? (
        <View style={{flex:1, height: 200, padding: 20 }}>                  
            <BarChart
                    style={{ flex: 1 }}
                    data={bacList}
                    gridMin={0}
                    svg={{ fill: 'rgb(134, 65, 244)' }}
                />
                <XAxis
                    style={{ marginTop: 10 , marginLeft :20 }}
                    data={ bacList }
                    scale={scale.scaleBand}
                    formatLabel={ (value, index) => bacList[value] }
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
  container: {
    flex: 1,
    flexDirection:'column',
    justifyContent:'center',
    backgroundColor: '#fff',      
  },
  parent:{
    flex: 1,
    flexDirection:'row',
    justifyContent:'center',
  },
  textDetHead:{
    margin:20,
    justifyContent:'center',
    alignItems:'center',  
    fontWeight:'bold',  
    fontSize:18,
  },
  textDet:{
    margin:20,    
    fontSize:16,  
    color:'#464444'  
  },
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


