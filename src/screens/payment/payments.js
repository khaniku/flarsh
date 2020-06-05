import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Button, TouchableOpacity, StatusBar, FlatList, Image} from 'react-native';
import { Container, Header, Content, ListItem, CheckBox, Text, Body, Right } from 'native-base';
import { Appbar } from 'react-native-paper';
import { fetchPayments } from '../../actions';
import { useSelector, useDispatch } from "react-redux";
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';

export default function Payment(props) {
    const [cardAvailable, setCardAvailable] = useState(true);
    const [checked, setChecked] = useState(true);
    const token = useSelector(state => state.user.token);
    const card = useSelector(state => state.card);
    const dispatch = useDispatch();

    const fetchCard = async () => {
        dispatch(await fetchPayments(token));
    }

    const trim = (number) => {
        let num = number % 10000;
        return num;
    }

    useEffect(() => {
        fetchCard();
    }, [])

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
            <View>
                <View style={{marginTop: 20, marginBottom: 10}}>
                    <Text style={{textAlign: 'center'}}>Payment Methods</Text>
                </View>
                {/* <ListItem>
                    <CheckBox checked={true} color="grey"/>
                    <Body>
                    <Text>Cash</Text>
                    </Body>
                </ListItem> */}
                    <FlatList
                        data={card}
                        renderItem={({ item }) => (
                            <ListItem key={item.id} onPress={() => props.navigation.push('oneCard',{
                                id: item.id
                            })}>
                                <CheckBox checked={item.payment_type} color="grey"/>
                                <Body style={{flexDirection: 'row'}}>
                                    <MaterialCommunityIcons name="dots-horizontal" size={24} color="black" />
                                    <Text style={{marginTop: 3}}>{trim(item.card_number)}</Text>
                                    <Right>
                                        <Entypo name="chevron-right" size={24} color="black" />                                
                                    </Right>
                                </Body>
                            </ListItem> 
                        )}
                        //Setting the number of column
                        keyExtractor={(item, index) => index.toString()}
                    />
                <ListItem>
                    <Body>
                        <TouchableOpacity onPress={() => {props.navigation.push('Card')}}>
                        <Text style={{color: '#3b99fc'}}>Add Payment Method</Text>
                        </TouchableOpacity>
                    </Body>
                </ListItem>
            </View>
        </Container>
    )
}

const styles = StyleSheet.create({
    containerPayment: {
      flex: 1,
      backgroundColor: '#fff',
    },
  });