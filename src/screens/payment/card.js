import React, { Component } from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import { Container, Accordion, Icon, Header, Left, Title, Right, Body, Button, Content, ActivityIndicator} from 'native-base';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AwesomeButton from 'react-native-really-awesome-button';
import { Appbar } from 'react-native-paper';

export default function Card(props) {
    
    const _onChange = (form) => console.log(form);
    
    return(
        <Container>
          <StatusBar barStyle="light-content" />
            <Appbar.Header style={{backgroundColor: '#000'}}>
                <Appbar.BackAction 
                onPress={() => props.navigation.goBack()}
                />
                <Appbar.Content
                title="Payment"
                />
            </Appbar.Header>
          <Content style={{marginTop: 20}}>
          <CreditCardInput onChange={(text) =>_onChange(text)} />
          <View style={{alignItems: 'center'}}>
            <AwesomeButton  textSize={20} stretch={true} style={{marginLeft: 20, marginRight: 20, width: 200, marginTop: 25 }} >Save</AwesomeButton>
          </View>
          </Content>
        </Container>
    );
}

const styles = StyleSheet.create({
    containerPayment: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });