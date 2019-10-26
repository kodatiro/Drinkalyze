/*
  This is the HomeScreen called on the sucessfull login.
  we are calculating the BAC, Time shown on the Home Screen.

*/
import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, View, Text } from 'react-native';
import { ProgressBar, Colors, Button, Card , Title, Paragraph} from 'react-native-paper';
import { connect} from 'react-redux';
import { clearBAC, updatedBAC } from '../redux/actions';
import moment from 'moment';

const inpObj = {"alcohol":'', "drink":'', "serving":'', "numOfSrvngs":0, "time":0,"timeTicks":0, "updtdTmeTicks":0, "location":'', "bacPer":0,"hBlwLmtTicks":0,"hZeroPerTicks":0, "inBacPer":0,"inHBlwLmtTicks":0,"inHZeroPerTicks":0};               


class HomeScreen extends React.Component {

 constructor(props){
    super(props);
    moment.locale('en');
    this.state = {
      diffTicks:0,
      updtdTmeTicks : 0      
    }
 }

// Below function is called when user hits the clear button
_onClearInputaDetailsPressed = () => {
  let { email } = this.props.userObject;
  let { userObject } = this.props;
  var curTicks = new Date().getTime();  
  this.props.dispatch(clearBAC(userObject,email));
  this.setState({diffTicks : 0, updtdTmeTicks:curTicks });
}

// This is called on the Component Launch
componentDidMount(){
  this._onComLoad();
}
// Below is the function called on the load of the component to calculate the values.
// Below function is also called when the user hits the refresh button
_onComLoad = () =>{
  moment.locale('en');  
  // below data we receive from the server.
  let { input, email } = this.props.userObject;
  let { userObject } = this.props;
  let ip = input || inpObj;
  //By Default BAC is zero, if the value is greater than zero, user has a recent Drink input added.
  if(parseFloat(ip.bacPer) > 0){    
    const ticksIni = input.timeTicks;// time when the Input was last updated.
    var curTicks = new Date().getTime();// Current time in ticks    
    // Calculating the Diff of time, of Input added to the current time.
    const diffTicks = moment(curTicks).diff(moment(ticksIni), 'minutes'); // Minutes
    const bac = parseFloat(input.inBacPer);// Getting the initial BAC value when the input is added.
    if(diffTicks >= 0){     
      // Calculating the updated BAC value as the time passed.
      const uBAC =  parseFloat(((diffTicks * 0.016)/60).toFixed(4));  
      ip.bacPer = parseFloat((bac - uBAC).toFixed(4));  
      const inHZPMin = parseFloat(input.inHZeroPerTicks);
      const inHBLMIn = parseFloat(input.inHBlwLmtTicks);      
      ip.hZeroPerTicks = inHZPMin > 0 ? (inHZPMin - diffTicks) : 0;
      ip.hBlwLmtTicks =  inHBLMIn > 0 ? (inHBLMIn - diffTicks) : 0; 
      ip.updtdTmeTicks = curTicks;      
      // if the calculated BAC Percentqage is found negative resetting it to zero
      if(ip.bacPer < 0){ 
        ip = inpObj;       
      }
    } else {
      ip = inpObj;      
    }        
    // Updatign the component state with the updated values
    // TODO move these values to Redux
    this.setState({diffTicks, updtdTmeTicks: curTicks});
  }  else {
    ip = inpObj;      
  } 
  userObject.input = ip;    
  // Dispatching to update the Firebase Database.
  this.props.dispatch(updatedBAC(userObject, ip, email));
}
 render(){
   const { diffTicks, updtdTmeTicks } = this.state;   
   const {name} = this.props.userObject;
   const { bacPer, hBlwLmtTicks, hZeroPerTicks, timeTicks, inBacPer, inHBlwLmtTicks, inHZeroPerTicks } = this.props.userObject.input || inpObj;   
   const upT = diffTicks > 0 ? updtdTmeTicks : timeTicks;
   const tT = upT > 0 ? moment(upT).format("DD/MM/YY HH:mm:ss A") : "00:00:00";
   const bp = parseFloat(parseFloat(bacPer).toFixed(4));
   const ibp = parseFloat(parseFloat(inBacPer).toFixed(4));   
   const opbp = parseFloat(bp/ibp);
   const pbp = opbp ? opbp : 0;
   const oHBL = parseFloat(parseFloat(hBlwLmtTicks)/parseFloat(inHBlwLmtTicks));
   const blTime = parseInt(inHBlwLmtTicks);   
   const hBL  = oHBL ? oHBL : 0;
   const hBLLeft = parseInt(hBlwLmtTicks);
   const oHZP = parseFloat(parseFloat(hZeroPerTicks)/parseFloat(inHZeroPerTicks));
   const zpTime = parseInt(inHZeroPerTicks);
   const hZP = oHZP ? oHZP : 0;
   const hZPLeft = parseInt(hZeroPerTicks);
   const hblHours = hBL > 0 ? (bp < 0.08 ? 0 : hBL) : 0;
   const hzpHours = hZP > 0 ? hZP : 0;
  

  
  return (
    <View style={styles.container}>
        <ScrollView  style={styles.container}>  
          <View style={styles.btmText}>
                <Text style={styles.wParentText}>Welcome {name}</Text>
          </View>                                
          <View style={styles.pView}>
              <Card>
                <Card.Content>
                  <Title style={styles.title}>BAC %</Title><Text style={styles.textBtm}>Current:{bp}%;   Initial:{ibp}%</Text>
                  <ProgressBar progress={pbp} color={Colors.red800} style={styles.pBar} />
                </Card.Content>
              </Card>
              
          </View>       
          <View style={styles.pView}>
              <Card>
                <Card.Content>
                  <Title style={styles.title}>Time Until Below Limit <Text style={styles.titTextBtm}>Limit:0.08;</Text></Title>
                  <Text style={styles.textBtm}>TimeLeft : {hBLLeft} mins</Text>
                  <ProgressBar progress={hblHours} color={Colors.red800} style={styles.pBar} />                  
                </Card.Content>
              </Card>
              {/*<View style={styles.btmText}><Paragraph><Text style={styles.textBtm}>Time: {blTime} mins; Passed: {diffTicks} mins</Text></Paragraph></View>*/}
          </View>       
          <View style={styles.pView}>
              <Card>
                <Card.Content>
                  <Title style={styles.title}>Time Until BAC 0% </Title>
                  <Text style={styles.textBtm}>TimeLeft : {hZPLeft} mins</Text>
                  <ProgressBar progress={hzpHours} color={Colors.red800} style={styles.pBar} />
                  <View><Paragraph><Text></Text></Paragraph></View>
                </Card.Content>
              </Card>
              {/* <View style={styles.btmText}><Paragraph><Text style={styles.textBtm}>Time: {zpTime} mins; Passed: {diffTicks} mins</Text></Paragraph></View>            */}
          </View>             
          <View style={styles.btmText}><Paragraph><Text style={styles.textBtm}>updated at:{tT}</Text></Paragraph></View>
          <View style={styles.parent}>
              <Button  style={styles.button} mode="outlined" onPress={this._onClearInputaDetailsPressed}>
                      Clear
              </Button>  
              <Button  style={styles.button}  mode="outlined"  onPress={this._onComLoad}>
                      Refresh 
              </Button>               
            </View>                                        
        </ScrollView>
    </View>
  );
}
}

/*
        <View style={styles.pView}>
            <Paragraph><Text>updatedAt:{tT}</Text></Paragraph>
          </View>
*/ 
HomeScreen.navigationOptions = {  
  title: 'Home',
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  pView:{
    width:'100%', 
    padding:20
  },
  pBar:{
    height:30
  },
  wParentText:{
    fontSize:14,
    color:'#6d6d6d',
    marginTop:10
  }, 
  btmText:{
    flex:1,
    flexDirection:'row',
    justifyContent:"center",
    alignItems:"center",
  },
  textBtm:{
    fontSize:16,
    color:'#6d6d6d'
  },
  subTextBtm:{
    fontSize:12,
    color:'#6d6d6d'
  },
  titTextBtm:{
    fontSize:12,
    fontWeight:'400',
    color:'#6d6d6d'
  },
  title:{
    fontSize:22,
    color:'#545252'
  },
  parent:{
    flex:1,
    flexDirection:'row',
    justifyContent:'space-around',
    alignItems:'center',
    width:'100%', 
    padding:20,
    
    
  },
  button:{
    width:'45%',
    height: '100%'
  }
});


const mapStateToProps = (state) =>{
  return{    
    error:state.login.error,
    userObject:state.login.userObject,
    showLoading:state.login.showLoading,    
    input:state.login.userObject.input,    
  }
}
export default connect(mapStateToProps)(HomeScreen);