import * as React from 'react';
import { Button, View, Text, TouchableHighlight, TouchableWithoutFeedback, 
    KeyboardAvoidingView, StyleSheet, SafeAreaView, Keyboard, TextInput, StatusBar, Alert } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FontAwesome } from '@expo/vector-icons';
import { Appbar } from 'react-native-paper';
import AwesomeButton from 'react-native-really-awesome-button';
import { Content } from 'native-base';
import { CreditCardInput } from "react-native-credit-card-input";
import { signup, addCard, checkEmail } from "../../actions/api";
import * as SecureStore from 'expo-secure-store';
import { useDispatch } from "react-redux";
import {User} from '../../actions';
import moment from 'moment';
import { showMessage } from "react-native-flash-message";

function NameScreen({ route, navigation }) {
    const { phoneNumber } = route.params;
    const { userResp } = route.params;
    const [firstName, setFirstName] = React.useState(null);
    const [lastName, setLastName] = React.useState(null);
    return (
        <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{ flex: 1 }}
            >
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Text style={styles.header}>
                            What's your name?
                        </Text>
                        <View style={{flexDirection: 'row', width: '50%', top: 0}}>
                            <Input
                                placeholder='First Name'
                                value={firstName}
                                onChangeText={text => setFirstName(text)}          
                            />
                            <Input
                                placeholder='Last Name'
                                value={lastName}
                                onChangeText={text => setLastName(text)}          
                            />
                        </View>
                        <View style={{ flex : 1 }} />
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ position: 'absolute', right: 8, bottom: 0 }}>
                    <TouchableHighlight>
                        <FontAwesome.Button name="arrow-circle-right" size={60} color="black" backgroundColor='#fff' onPress={() => navigation.navigate('Email', 
                        {
                            phoneNumber: phoneNumber,
                            firstName: firstName,
                            lastName: lastName,
                           userResp: userResp
                        })} >
                        </FontAwesome.Button>
                    </TouchableHighlight>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

function EmailScreen({ route, navigation }) {
    const { firstName } = route.params;
    const { lastName } = route.params;
    const { phoneNumber } = route.params;
    const { userResp } = route.params;
    const [email, setEmail] = React.useState(null);
    const [valid, setValid] = React.useState(false);

    const validateEmail = async () => {
        await checkEmail(email).then(function (data) {
            if(!data){
                navigation.navigate('Card', {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    phoneNumber: phoneNumber,
                    userResp: userResp
                })
            } else {
                setValid(false)
                showMessage({
                    message: "Email already exists",
                    type: "danger",
                });
            }
        })
    }

    return (
        <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{ flex: 1 }}
            >
            <Appbar.Header style={{backgroundColor: '#694fad'}}>
                <Appbar.BackAction
                onPress={() => navigation.goBack()}
                />
                <Appbar.Content
                title="Add Email"
                />
            </Appbar.Header>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <Text style={styles.header}>
                            What's your Email?
                        </Text>
                            <Input
                                placeholder='Email'
                                value={email}
                                onChangeText={text => setEmail(text)}          
                            />                   
                        <View style={{ flex : 1 }} />
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ position: 'absolute', right: 8, bottom: 0 }}>
                    <TouchableHighlight>
                        <FontAwesome.Button name="arrow-circle-right" size={60} color="black" backgroundColor='#fff' onPress={validateEmail} >
                        </FontAwesome.Button>
                    </TouchableHighlight>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

function CardScreen({ route, navigation }) {
    const { firstName } = route.params;
    const { lastName } = route.params;
    const { email } = route.params;
    const { phoneNumber } = route.params;
    const { userResp } = route.params;
    const userType = {"customer": true, "service_provider": false};
    const user = {firstName, lastName, email, phoneNumber, userResp, userType};
    const [card, setCard] = React.useState(null);
    const [valid, setValid] = React.useState(false);
    const dispatch = useDispatch();

    const _onChange = (form) => {
        if(form.valid) {
            let date = moment(form.values.expiry,"MM/YY").format("YYYY-MM-DD");
            let number = form.values.number.replace(/\s+/g,'');
            let cvc = form.values.cvc.replace(/\s+/g,'');
            const newForm = Object.assign({}, form.values, { expiry: date, number: parseInt(number), cvc:  parseInt(cvc) });
            setCard(newForm);
            setValid(true);
        }
    }

    const addUser = async () => {
        if(card){
            if(valid){
                let token = null;
                await signup(user).then(function (responseJson) {
                    SecureStore.setItemAsync('token', responseJson.token);
                    dispatch(User(responseJson)) 
                })
                await SecureStore.getItemAsync('token').then(function(data) {
                    token = data;
                })
                await addCard(card, token).then(function (responseJson) {
                    navigation.navigate('Home')
                })
            }
        } else{
            Alert.alert("Please enter a valid card number")
        }
    }

    return (
        <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : null}
                style={{ flex: 1 }}
            >
            <Appbar.Header style={{backgroundColor: '#694fad'}}>
                <Appbar.BackAction
                onPress={() => navigation.goBack()}
                />
                <Appbar.Content
                title="Add Card"
                />
            </Appbar.Header>
            <StatusBar barStyle="dark-content" />
            <SafeAreaView style={styles.container}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View style={styles.inner}>
                        <CreditCardInput onChange={(form) =>_onChange(form)} />    
                        <View style={{ flex : 1 }} />
                    </View>
                </TouchableWithoutFeedback>
                <View style={{ position: 'absolute', right: 8, bottom: 0}}>
                    <TouchableHighlight>
                        <FontAwesome.Button name="arrow-circle-right" size={60} color="black" backgroundColor='#fff' onPress={() => addUser()} >
                        </FontAwesome.Button>
                    </TouchableHighlight>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}

function SettingsScreen({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Name" options={{
                headerShown: false,
                }} component={NameScreen} />
      <Stack.Screen name="Email" options={{
                headerShown: false,
                }} component={EmailScreen} />
      <Stack.Screen name="Card" options={{
                headerShown: false,
                }} component={CardScreen} />
      <Stack.Screen name="Settings" component={SettingsScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
      <MyStack />
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    inner: {
        padding: 24,
        flex: 1,
        justifyContent: "flex-end",
    },
    header: {
        fontSize: 20,
        marginBottom: 30,
    },
    input: {
        height: 40,
        borderColor: "#000000",
        borderBottomWidth: 1,
        marginBottom: 36,
    },
    btnContainer: {
        backgroundColor: "white",
        marginTop: 12,
    },
});
