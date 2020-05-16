import React, { Component, useState } from 'react';
import { View, StyleSheet, Button, TouchableOpacity, StatusBar} from 'react-native';
import { Container, Header, Content, ListItem, CheckBox, Text, Body } from 'native-base';
import { Appbar } from 'react-native-paper';

export default function Payment(props) {
    const [cardAvailable, setCardAvailable] = useState(true);
    const [checked, setChecked] = useState(true);

    return (
        <Container>
            <StatusBar barStyle="light-content" />
            <Appbar.Header style={{backgroundColor: '#fff'}}>
                <Appbar.Action icon="close"
                onPress={() => props.navigation.goBack()}
                />
                <Appbar.Content
                title="Payment"
                />
            </Appbar.Header>
            <Content>
            <View style={{marginTop: 20, marginBottom: 10}}>
                <Text style={{textAlign: 'center'}}>Payment Methods</Text>
            </View>
            <ListItem>
                <CheckBox checked={true} color="grey"/>
                <Body>
                <Text>Cash</Text>
                </Body>
            </ListItem>
            {cardAvailable ?
                <ListItem>
                <CheckBox checked={false} color="grey"/>
                <Body>
                    <Text>Card</Text>
                </Body>
                </ListItem> :
                null
            }
            <ListItem>
                <Body>
                    <TouchableOpacity onPress={() => {props.navigation.push('Card')}}>
                    <Text style={{color: '#3b99fc'}}>Add Payment Method</Text>
                    </TouchableOpacity>
                </Body>
                </ListItem>
            </Content>
        </Container>
    )
}

const styles = StyleSheet.create({
    containerPayment: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });