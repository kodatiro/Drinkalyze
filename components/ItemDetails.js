import React from 'react';
import { Image, Platform, ScrollView, StyleSheet, View } from 'react-native';
import { ProgressBar, Colors, Button, List, Title, Paragraph, Card, Text } from 'react-native-paper';
import { connect } from 'react-redux';
import { Col, Row, Grid } from "react-native-easy-grid";
import moment from 'moment';

class ItemDetails extends React.Component {
 constructor(props){
    super(props);
    this.state = {      
    }    
 }
 render(){
     const item  = this.props.navigation.getParam('item');
     const drink = item.selDrink || { "nameDrink" : "", "alcohol" : "", "brand" : "", "alcoholPer" : "", "quantity" : ""}
    //  alcohol:'', drink:'', serving:'', numOfSrvngs:'', time:'', location:'', bacPer:'',
    // hBlwLmt:'',
    // hZeroPer:''
/*
    <Card>
            <Card.Title title="Inputs" />
                <Card.Content> 
                </Card.Content>
            </Card>
            <Card>
            <Card.Title title="Inputs" />
                <Card.Content>                    
                    <Paragraph>
                        <Text>Alcohol {item.alcohol}</Text>
                        <Text>Drink {item.drink}</Text>
                        <Text>Serving{item.serving}</Text>
                        <Text>Number {item.numOfSrvngs}</Text>
                    </Paragraph>
                </Card.Content>
            </Card>
    //"alcohol":'', "drink":'', "serving":'', "numOfSrvngs":'', "time":'',"timeTicks":"", "location":'', "bacPer":'',"hBlwLmtTicks":'',"hZeroPerTicks":''
    alcohol: "Whiskey"
bacPer: 14343.98782343988
drink: "Ben Nevis 10Y"
hBlwLmtTicks: ""
hZeroPerTicks: 53789954.33789955
location: "48334"
numOfSrvngs: "3"
serving: "large"
time: "17:37"
timeTicks: 1570228653634
    */ 
    return(<Card>
        <Card.Title>
            <Title><Text>Inputs</Text></Title>
        </Card.Title>
            <Card.Content>                    
                    <View>
                        <Text>Alcohol :{item.alcohol}</Text>
                    </View>
                    <View>
                        <Text>Drink : {item.drink}</Text>
                    </View>
                    <View>
                        <Text>Serving : {item.serving}</Text>
                    </View>
                    <View>
                        <Text>Numberof Servings : {item.numOfSrvngs}</Text>
                    </View>
                    <View>
                        <Text>BAC Per : {item.bacPer}</Text>
                    </View>
                    <View>
                        <Text>TimeZeroPerTicks : {item.hZeroPerTicks}</Text>
                    </View>
                    <View>
                        <Text>Date Time : {moment(item.timeTicks).format('DD/MM/YY HH:MM:SS')}</Text>
                    </View>
            </Card.Content>
        </Card>                                           
            );
 }
}

export default ItemDetails;

/*
 <Grid>
                        <Col>
                            <Row><Text>Alcohol</Text></Row>
                            <Row><Text>Drink</Text></Row>
                            <Row><Text>Serving</Text></Row>
                            <Row><Text>Number</Text></Row>                            
                        </Col>
                        <Col><Row><Text>: {item.alcohol}</Text></Row>
                            <Row><Text>: {item.drink}</Text></Row>
                            <Row><Text>: {item.serving}</Text></Row>
                            <Row><Text>: {item.numOfSrvngs}</Text></Row>                            
                        </Col>
                    </Grid>   

*/