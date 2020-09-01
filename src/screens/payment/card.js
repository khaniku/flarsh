import React, { Component } from 'react';
import { View, StyleSheet, Text, StatusBar } from 'react-native';
import { Container, Accordion, Icon, Header, Left, Title, Right, Body, Button, Content, ActivityIndicator} from 'native-base';
import { CreditCardInput, LiteCreditCardInput } from "react-native-credit-card-input";
import {widthPercentageToDP as wp, heightPercentageToDP as hp} from 'react-native-responsive-screen';
import AwesomeButton from 'react-native-really-awesome-button';
import { Appbar } from 'react-native-paper';
import { addCard } from "../../actions/api";
import moment from 'moment';
import { useSelector } from "react-redux";
import { showMessage } from "react-native-flash-message";

export default function Card(props) {
  const [card, setCard] = React.useState(null);
  const token = useSelector(state => state.user.token);
  const [valid, setValid] = React.useState(false);

  const _onChange = (form) => {
      if(form.valid){
        let date = moment(form.values.expiry,"MM/YY").format("YYYY-MM-DD");
        let number = form.values.number.replace(/\s+/g,'');
        let cvc = form.values.cvc.replace(/\s+/g,'');
        const newForm = Object.assign({}, form.values, { expiry: date, number: parseInt(number), cvc:  parseInt(cvc) });
        setCard(newForm);
        setValid(true)
      }
  }

  const save = async () => {
    if(valid) {
      await addCard(card, token).then(function (responseJson) {
        showMessage({
          message: "Card added",
          type: "success",
        });  
      })
    }else {
      showMessage({
        message: "Card is not valid!",
        type: "danger",
      });
    }
  }
    
    return(
        <Container>
          <StatusBar barStyle="light-content" />
            <Appbar.Header style={{backgroundColor: '#fff'}}>
                <Appbar.BackAction 
                onPress={() => props.navigation.goBack()}
                />
                <Appbar.Content
                title="Add Card"
                />
            </Appbar.Header>
          <Content style={{marginTop: 20}}>
            <CreditCardInput onChange={(text) =>_onChange(text)} />
            <View style={{alignItems: 'center'}}>
              <AwesomeButton onPress={() => save()}  textSize={20} stretch={true} style={{marginLeft: 20, marginRight: 20, width: 200, marginTop: 25 }} >Save</AwesomeButton>
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