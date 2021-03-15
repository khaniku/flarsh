import React, { Component, useState, useRef} from 'react';
import { View,Button, Text, Alert, StyleSheet, ImageBackground, Keyboard, TextInput, StatusBar,
    Image,KeyboardAvoidingView, TouchableWithoutFeedback, TouchableOpacity, TouchableHighlight, ActivityIndicator} from 'react-native';
import CodeInput from 'react-native-confirmation-code-input';
import MyView from './myView';
import * as firebase from 'firebase';
import * as Animatable from 'react-native-animatable';
import { FontAwesome } from '@expo/vector-icons';
import { parsePhoneNumberFromString } from 'libphonenumber-js'
import Loader from '../../../assets/loader';
import CountDown from 'react-native-countdown-component';
import CountryPicker from 'react-native-country-picker-modal';
import { FirebaseRecaptchaVerifierModal } from "expo-firebase-recaptcha";
import { Container, Header, Left, Body, Right, Button as NativeButton, Icon, Title } from 'native-base';
import { login, checkPhoneNumber } from "../../actions/api";
import * as SecureStore from 'expo-secure-store';
import { Appbar } from 'react-native-paper';
import { useDispatch } from "react-redux";
import {User} from '../../actions';

const firebaseConfig = {
    apiKey: "AIzaSyBr-cXyn6URqYaKMuNlGYXlo8wCoKdf3tQ",
    authDomain: "flarsh-c5380.firebaseapp.com",
    databaseURL: "https://flarsh-c5380.firebaseio.com",
    projectId: "flarsh-c5380",
    storageBucket: "flarsh-c5380.appspot.com",
    messagingSenderId: "612687824348",
    appId: "1:612687824348:web:7e488a8e68f89b8a5b3b19",
    measurementId: "G-RB552SW8GS"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig)
}
const successImageUri = 'https://cdn.pixabay.com/photo/2015/06/09/16/12/icon-803718_1280.png';
const status = "dev"; //change status to production for non testing
const client = "customer";

export default function LoginScreen(props) {
    const [user, setUser] = useState(null);
    const [confirmResult, setConfirmResult] = useState(null);
    const [message, setMessage] = useState('');
    const [codeInput, setCodeInput] = useState('');
    const [phoneNumber, setPhoneNumber] = useState(null);
    const [phoneValue, setPhoneValue] = useState(null)
    const [loading, setLoading] = useState(false);
    const [isValidNumber, setIsValidNumber] = useState(false)
    const [errorStatus, setErrorStatus] = useState(true);
    const [isHidden, setIsHidden] = useState(false);
    const [country, setCountry] = useState(null)
    const inputRef = useRef(undefined);
    const recaptchaVerifier = useRef(null);
    const [verificationId, setVerificationId] = useState();
    const [verificationCode, setVerificationCode] = useState();
    const [showButton, setShowButton] = useState(false);
    const [showNoCode, setShowNoCode] = useState(false);
    const [showTimer, setShowTimer] = useState(true);
    const [showLoading, setShowLoading] = useState(false)
    const dispatch = useDispatch();

    DelayedButton = (props) =>{
        setTimeout(() => {
            return setShowButton(true);
        }, 10000);
        showButton ? props.button : ' ';
    
        if (!showButton)
            return null;
        
        if(!showLoading){
            return (
                <Button onPress={() => resendCode()} title="Resend Code"/>
            );
        } else {
            return <View
                    style={{
                    flex: 1,
                    alignContent :'center',
                    justifyContent :'center',
                    }}>
                        <ActivityIndicator size="small" color="#1275bc" />
                    </View>
        }
    }
    
    TimerHider = (props) =>{
        let display = showTimer ? props.timerCountdown : 0;
        if(!showNoCode){
            return (
                <CountDown
                until={display}
                size={18}
                digitStyle={{backgroundColor: '#D6EBEE'}}
                digitTxtStyle={{color: '#000'}}
                timeToShow={['S']}
                timeLabels={{ s: ''}}
                />
            );
        }else{
            return (
                <View></View>
            )
        }
    }
    
    ResendCode = (props) =>{
        const [showResendCode, setShowResendCode] = useState(true);
        let display = showResendCode ? props.text : ''; 
        if(!showNoCode){
            return (
                <Text style={{fontSize: 16, marginTop: 14}}>{display}</Text>
            );
        }else{
            return (
                <View></View>
            )
        }
    }
    
     NoCode = (props) =>{
        setTimeout(() => {
            return setShowNoCode(true)
          }, 10000);
        let display = showNoCode ? props.text : ' ';
        return (
            <Text style={{marginBottom: 30, fontSize: 20}}>{display}</Text>
        );
    }
       
    onEnterText = (number) => {
        if(number.trim() != 0){
            setPhoneNumber(number);
            setErrorStatus(true);
        }else{
            setPhoneNumber(number);
            setErrorStatus(false);
        }
    }

    resendCode = async () => {
        setShowLoading(true)
        try {
            const phoneProvider = new firebase.auth.PhoneAuthProvider();
            const verificationId = await phoneProvider.verifyPhoneNumber(
                phoneNumber,
                recaptchaVerifier.current
            );
            setVerificationId(verificationId);
            setShowLoading(false)
            Alert.alert("Verification code has been sent to your phone.")
        } catch (err) {
            console.log("here: "+err.message)
        }
    }

    signIn = async () => {
        const countryCode = '+'.concat("" , country != null ? country.callingCode : 1);
        const numberConcat = countryCode.concat("" , phoneNumber);
        setPhoneNumber(numberConcat);
        const number = parsePhoneNumberFromString(numberConcat);
        
        if (phoneNumber == null || phoneNumber == undefined){
          Alert.alert("Please enter the text to proceed");
        }else{
            if(number.isValid()){
                // setLoading(true);
                setIsHidden(!isHidden)
                if(status == "production") {
                    try {
                        const phoneProvider = new firebase.auth.PhoneAuthProvider();
                        const verificationId = await phoneProvider.verifyPhoneNumber(
                                numberConcat,
                                recaptchaVerifier.current
                            );
                        setVerificationId(verificationId);
                        //setLoading(false);
                        Alert.alert("Verification code has been sent to your phone.")
                    } catch (err) {
                        //showMessage({ text: `Error: ${err.message}`, color: "red" });
                        console.log("here: "+err.message)
                    }
                }else{
                    setVerificationId(123456); 
                } 
            }else {
                Alert.alert("Number is not valid");
            }
        }
    }

    confirmCode = () => {
        if (confirmResult && codeInput.length) {
            confirmResult.confirm(codeInput)
            .then((user) => {
              setMessage('Code Confirmed!')
            })
            .catch(error => setMessage(`Code Confirm Error: ${error.message}`));
        }
    }

    selectCountry = (value) => {
        setCountry(value);
    }

    signOut = () => {
        firebase.auth().signOut();
    }

    _onFulfill = async (codeInput) => {
        setVerificationCode(codeInput)
        try {
            setLoading(true)
           if(status == "production"){
                const credential = firebase.auth.PhoneAuthProvider.credential(
                verificationId,
                codeInput
                );
                const user = await firebase.auth().signInWithCredential(credential);
                user;
            }
            console.log("Phone authentication successful");
            let number = null;
            const user = {user: {
                "apiKey": "AIzaSyBr-cXyn6URqYaKMuNlGYXlo8wCoKdf3tQ",
                "appName": "[DEFAULT]",
                "authDomain": "flarsh-c5380.firebaseapp.com",
                "createdAt": "1590208476430",
                "displayName": null,
                "email": null,
                "emailVerified": false,
                "isAnonymous": false,
                "lastLoginAt": "1590477366429",
                "phoneNumber": "+19366689685",
                "photoURL": null,
                "providerData":  [
                   {
                    "displayName": null,
                    "email": null,
                    "phoneNumber": "+19366689685",
                    "photoURL": null,
                    "providerId": "phone",
                    "uid": "+19366689685",
                  },
                ],
                "redirectEventId": null,
                "stsTokenManager":  {
                  "accessToken": "eyJhbGciOiJSUzI1NiIsImtpZCI6IjgyMmM1NDk4YTcwYjc0MjQ5NzI2ZDhmYjYxODlkZWI3NGMzNWM4MGEiLCJ0eXAiOiJKV1QifQ.eyJpc3MiOiJodHRwczovL3NlY3VyZXRva2VuLmdvb2dsZS5jb20vZmxhcnNoLWM1MzgwIiwiYXVkIjoiZmxhcnNoLWM1MzgwIiwiYXV0aF90aW1lIjoxNTkwNTU3ODE1LCJ1c2VyX2lkIjoiSFRpQ3p5djJ1eGF3RU5iMGpBSmhaN21LZnMxMyIsInN1YiI6IkhUaUN6eXYydXhhd0VOYjBqQUpoWjdtS2ZzMTMiLCJpYXQiOjE1OTA1NTk4MjMsImV4cCI6MTU5MDU2MzQyMywicGhvbmVfbnVtYmVyIjoiKzE5MzY2Njg5Njg1IiwiZmlyZWJhc2UiOnsiaWRlbnRpdGllcyI6eyJwaG9uZSI6WyIrMTkzNjY2ODk2ODUiXX0sInNpZ25faW5fcHJvdmlkZXIiOiJwaG9uZSJ9fQ.RV-_kdq1-JweW7tZAOES3sltS280ybI6Jo_pyBG83US7-bcJpHb1HTBGG2HyAO9p2yaiaOfYmk0GdYZU0F5sCnYcHrIbr4joBwuQWGPSVAHD4H-R0X4-zMk8rGOWzk300Nki-ki71yfQ8FZS7b5iuff_jvosg8KtqeSyr_iGCkZqFkIWHM05US1OA98pk02hQqS-tzF28ZLTZUiewhQKEriCHhJwiBz0Dtb1wi63sLahvFbIQ_IBh9_hYUK9FvKGLZik-nzP5GsUfXEIpBwOU1BS_4ebDNuSPh4vizS-xMFMistFsOtHWjuEKRWrALxOGpIQhSQSnawM0LvEfOHdhQ",
                  "apiKey": "AIzaSyBr-cXyn6URqYaKMuNlGYXlo8wCoKdf3tQ",
                  "expirationTime": 1590561415300,
                  "refreshToken": "AE0u-NflgfnG_rLlRM8-coZSiXDTj2ynuQlk6gnknco7c91twMUY_0JbB7GOTstZydPrOHpFsBF8CZchKiwOtB7DflNs45_pT3G25aLnBhYArnwr4yy6LxMRzaCNkiHt3ut0scbgQg6nzbWrGTP1_xa3N_Ib7YaJT58gWxyHj8p30Kv9bAEbIYKqFxsdmecbnc65NGJOVd5c",
                },
                "tenantId": null,
                "uid": "HTiCzyv2uxawENb0jAJhZ7mKfs13",
              }}
              
            await checkPhoneNumber(phoneNumber).then(function (responseJson) {
                console.log(responseJson)
                number = responseJson
            })
            if(number) {
                await login(user.user, client).then(function (responseJson) {
                    SecureStore.setItemAsync('token', responseJson.token);
                    dispatch(User(responseJson)) 
                })
                props.navigation.navigate('Home')
                setLoading(false)
            }else{
                setLoading(false)
                props.navigation.navigate('Signup',{
                    screen: 'Name',
                    params: { phoneNumber: phoneNumber, userResp: user.user },
                });
            }
                
          } catch (err) {
            setLoading(false)
            Alert.alert("Code not valid!")
            console.log(err.message)
          }
    }

    renderPhoneNumberInput = () => {
         return (
           <KeyboardAvoidingView  behavior={Platform.OS === "ios" ? "padding" : null} style={styles.container}>
               <FirebaseRecaptchaVerifierModal
                    ref={recaptchaVerifier}
                    firebaseConfig={firebaseConfig}
                />
                <StatusBar barStyle="dark-content" />
                <TouchableWithoutFeedback style={styles.container} onPress={()=>{Keyboard.dismiss() }} >
                    <View style={styles.container}>
                        <ImageBackground source = {require('../../../assets/login.png')} style = {{flex: 1}}>
                            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                                <Animatable.View 
                                animation='zoomIn' iterationCount={1}
                                style={{justifyContent: 'center', alignItems: 'center'}}>
                                    <Text style={{fontWeight: 'bold', fontSize: 50}}>flarsh</Text>
                                </Animatable.View>
                            </View>
                
                            {/** Bottom view **/}
                            <Animatable.View animation='slideInUp' iterationCount={1}>
                                <View style={{ height: 150, backgroundColor: 'white' }}>
                                    <View style={{
                                        opacity: 1, //for animation
                                        alignItems: 'flex-start',
                                        paddingHorizontal: 25,
                                        marginTop: 25, //for animation  
                                    }}>
                                        <Text style= {{ fontSize: 24 }}>Get started </Text>
                                    </View>
                                    <TouchableOpacity>
                                        <View style={{flexDirection: 'row', marginTop: 25, paddingHorizontal: 13}}>
                                            <Loader loading={loading} />
                                            <View style={{flexDirection: 'row', position: 'absolute', left: 10, bottom: 12, zIndex: 100, paddingHorizontal:10, width: '17%'}}>
                                                <CountryPicker
                                                    countryCode={country != null ? country.cca2 : "US"}
                                                    onSelect={selectCountry}
                                                    withEmoji={true}
                                                    withCallingCode={true}
                                                    withFlag={true}
                                                    withFilter={true}
                                                    withFlagButton={true}
                                                />
                                                <Text style={{top: 9, fontSize: 16}}>+{country != null ? country.callingCode : 1}</Text>
                                            </View>
                                            <TextInput
                                                style={{ height: 40, fontSize: 16, left:94, width: '65%', bottom:10 }}
                                                onChangeText={phoneNumber => onEnterText(phoneNumber)}
                                                //value={phoneNumber}
                                                placeholder='Enter your mobile number'
                                                underlineColorAndroid='transparent'
                                                keyboardType='numeric' 
                                            />
                                            { errorStatus == false ? (
                                                <Text style={styles.errorMessage}>
                                                * Please enter your number to proceed.
                                                </Text>
                                            ) : null  }
                                        </View>    
                                    </TouchableOpacity>
                                </View>
                                <View style={{
                                    height: 70,
                                    backgroundColor: 'white',
                                    alignItems: 'flex-start',
                                    justifyContent: 'center',
                                    borderTopColor: '#e8e8ec',
                                    borderTopWidth: 1,
                                    paddingHorizontal: 25,
                                    flexDirection:'row'
                                }}>
                                    <View style={{ position: 'absolute', right: 8, zIndex: 100 }}>
                                        <TouchableHighlight>
                                            <FontAwesome.Button name="arrow-circle-right" size={60} color="black" backgroundColor='#fff' onPress={signIn} >
                                            </FontAwesome.Button>
                                        </TouchableHighlight>
                                    </View>
                                </View>
                            </Animatable.View>
                        </ImageBackground>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
         );
       }
       
       renderMessage = () => {       
         if (!message.length) return null;
         return (
           <Text style={{ padding: 5, backgroundColor: '#000', color: '#fff' }}>{message}</Text>
         );
       }
       
       renderVerificationCodeInput = () => {   
         return (
            <Container>
                {/* <Header style={styles.inputWrapper}>
                    <Left>
                        <NativeButton onPress={() => setVerificationId(false)} transparent>
                            <Icon name='md-arrow-back' style={styles.iconStyle}/>
                        </NativeButton>
                    </Left>
                 </Header> */}
                <Appbar.Header style={{backgroundColor: '#2a3f54'}}>
                    <Appbar.BackAction
                        onPress={() => setVerificationId(false)}
                    />
                    <Appbar.Content
                        title="Verify Code"
                    />
                </Appbar.Header>
                <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : null} style={styles.container}>        
                    <TouchableWithoutFeedback style={styles.container} onPress={()=>{Keyboard.dismiss()}} >
                        <View style={styles.container}>
                            <Loader loading={loading} />
                            <View style={styles.inputWrapper1}>
                                <Text style={styles.inputLabel1}>Enter Verification Code</Text>
                                <CodeInput
                                    ref={inputRef}
                                    secureTextEntry
                                    className={'border-b'}
                                    space={6}
                                    size={35}
                                    codeLength={6}
                                    className='border-circle'
                                    inputPosition='left'
                                    keyboardType='numeric'
                                    onChangeText={value => setCodeInput(value)}
                                    value={codeInput}
                                    onFulfill={(codeInput) => _onFulfill(codeInput)}
                                />
                            </View>
                                <MyView hide={isHidden}>
                                        <View style={{flexDirection: 'row', alignSelf: 'center', marginTop: 20}}>
                                            <ResendCode text='Resend code in'/>
                                            <TimerHider timerCountdown={10}/>
                                        </View>
                                </MyView>
                                <View style={styles.bottomView}>
                                    <NoCode text="Didn't get the code?"/>
                                    <DelayedButton style={styles.resendButton} />
                                </View>
                        </View>
                    </TouchableWithoutFeedback>
                </KeyboardAvoidingView>
            </Container> 
         );
       }
       return (
        <View style={{ flex: 1 }}>
            {!verificationId && renderPhoneNumberInput()}
            {renderMessage()}
            {verificationId && renderVerificationCodeInput()}
            {user && (
                <View
                style={{
                    padding: 15,
                    justifyContent: 'center',
                    alignItems: 'center',
                    backgroundColor: '#77dd77',
                    flex: 1,
                }}>
                    <Image source={{ uri: successImageUri }} style={{ width: 100, height: 100, marginBottom: 25 }} />
                    <Text style={{ fontSize: 25 }}>Signed In!</Text>
                    <Text>{JSON.stringify(user)}</Text>
                    <Button title="Sign Out" color="red" onPress={this.signOut} />
                </View>
            )}
        </View>
      );

}


const styles = StyleSheet.create({
  container: {
    backgroundColor:'#D6EBEE',
    flex: 1,
    flexDirection: 'column',
  },
  errorMessage: {
    fontSize: 10,
    color:"red",
    marginLeft:-100,
    bottom: -20,
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    flexDirection: 'row',
  },
  title: {
    color: 'red',
    fontSize: 16,
    fontWeight: '800',
    paddingVertical: 30
  },
  wrapper: {
    marginTop: 30
  },
  inputWrapper1: {
    paddingVertical: 50,
    paddingHorizontal: 20,
    backgroundColor: '#2a3f54',
    alignItems: 'center',
  },
  inputWrapper: {
    paddingBottom: 30,
    backgroundColor: '#2a3f54',
    alignItems: 'center',
    borderBottomColor:"#2a3f54"
  },
  
  inputLabel1: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '800',
  },

  bottomView: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 10,
  },
  
  noCode: {
    marginBottom: 30,
  },

resendButton: {
    fontSize: 30,
},
codeStyles: {
  alignSelf: 'center',
  marginTop: 20,
},
iconStyle: {
    fontSize: 30,
    color: "#fff",
    marginTop: 5
}   
});