import * as React from 'react';
import { Button, View, Text, TouchableHighlight, TouchableWithoutFeedback, 
    KeyboardAvoidingView, StyleSheet, SafeAreaView, Keyboard, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { Input } from 'react-native-elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { FontAwesome } from '@expo/vector-icons';
import { Appbar } from 'react-native-paper';
import AwesomeButton from 'react-native-really-awesome-button';
import { Content } from 'native-base';
import { CreditCardInput } from "react-native-credit-card-input";

function NameScreen({ navigation }) {
  return (
    <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : null}
            style={{ flex: 1 }}
        >
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <Text style={styles.header}>
                        What's your name?
                    </Text>
                    <View style={{flexDirection: 'row', width: '50%', top: 0}}>
                        <Input
                            placeholder='First Name'
                            value={""}
                            //onChangeText={text => setEmail({ text })}          
                        />
                        <Input
                            placeholder='Last Name'
                            value={""}
                            //onChangeText={text => setEmail({ text })}          
                        />
                    </View>
                    <View style={{ flex : 1 }} />
                </View>
            </TouchableWithoutFeedback>
            <View style={{ position: 'absolute', right: 8, bottom: 0 }}>
                <TouchableHighlight>
                    <FontAwesome.Button name="arrow-circle-right" size={60} color="black" backgroundColor='#fff' onPress={() => navigation.navigate('Email')} >
                    </FontAwesome.Button>
                </TouchableHighlight>
            </View>
        </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function EmailScreen({ navigation }) {
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
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <Text style={styles.header}>
                        What's your Email?
                    </Text>
                        <Input
                            placeholder='Email'
                            value={""}
                            //onChangeText={text => setEmail({ text })}          
                        />                   
                    <View style={{ flex : 1 }} />
                </View>
            </TouchableWithoutFeedback>
            <View style={{ position: 'absolute', right: 8, bottom: 0 }}>
                <TouchableHighlight>
                    <FontAwesome.Button name="arrow-circle-right" size={60} color="black" backgroundColor='#fff' onPress={() => navigation.navigate('Card')} >
                    </FontAwesome.Button>
                </TouchableHighlight>
            </View>
        </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

function CardScreen({ navigation }) {
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
        <SafeAreaView style={styles.container}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={styles.inner}>
                    <CreditCardInput onChange={(text) =>_onChange(text)} />    
                    <View style={{ flex : 1 }} />
                </View>
            </TouchableWithoutFeedback>
            <View style={{ position: 'absolute', right: 8, bottom: 0}}>
                <TouchableHighlight>
                    <FontAwesome.Button name="arrow-circle-right" size={60} color="black" backgroundColor='#fff' onPress={() => navigation.navigate('Card')} >
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
