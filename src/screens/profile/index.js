import React, { Component } from 'react';
import { Text, View, StyleSheet, Image, Button, StatusBar } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Card } from 'react-native-paper';
import { Appbar } from 'react-native-paper';

export default function Profile(props) {

    return (
        <View style = {styles.container}>
            <StatusBar barStyle="light-content" />
            <Appbar.Header style={{backgroundColor: '#000'}}>
                <Appbar.Action icon="close"
                onPress={() => props.navigation.goBack()}
                />
                <Appbar.Content
                title="Profile"
                />
            </Appbar.Header>
           <View style={{backgroundColor: '#000'}}>
             <View style={styles.profileTop}>
               <View style={styles.detailsHolder}>
                 <Image source = {require('../../../assets/default.png')} style = {styles.profilePhoto}/>
                 <Text style={styles.username}>Kanikwu Emeka</Text>
                 <Text style={styles.userLocation}>Abuja, Nigeria</Text>
               </View>
             </View>
           </View>                         
           <View style={styles.profileBottom}>
             <Card style={styles.phoneNumber}>
               <View style={styles.phoneHolder}>
                 <Feather name="phone"  style={styles.phoneIcon} />
                 <View style={styles.numberDetails}>
                   <Text style={styles.phone}>Phone Number</Text>
                   <Text style={styles.userNumber}>0706 239 1349</Text>
                 </View>
               </View>
             </Card>
             <Card style={styles.phoneNumber}>
               <View style={styles.phoneHolder}>
                 <MaterialCommunityIcons name="email"  style={styles.phoneIcon} />
                 <View style={styles.numberDetails}>
                   <Text style={styles.phone}>Email</Text>
                   <Text style={styles.userNumber}>flarsh@gmail.com</Text>
                 </View>
               </View>
             </Card>
             <Card style={styles.phoneNumber}>
               <View style={styles.phoneHolder}>
                 <MaterialCommunityIcons name="lock"  style={styles.phoneIcon} />
                 <View style={styles.numberDetails}>
                   <Text style={styles.phone}>Password</Text>
                   <Text style={styles.userNumber}>xxxxxxx</Text>
                 </View>
               </View>
             </Card>
           </View>
       </View>
     );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
    },
    profileTop: {
      height:'45%',
      width:'100%',
      alignItems:'center',
      marginTop:0,
      position: 'relative',
    },
    profileBottom: {
      height:'55%',
      width:'94%',
      marginLeft: 10,
    },
    profilePhoto: {
      height: 100,
      width: 100,
      borderRadius: 50,
      alignItems: 'center',
      marginLeft: 23
    },
    username: {
      fontWeight:'bold',
      fontSize:20,
      color:'white',
      marginTop:10,
      fontFamily:'Times New Roman'
    },
    linearGradient: {
      flex: 1,
      paddingLeft: 15,
      paddingRight: 15,
    },
    detailsHolder: {
      position: 'absolute',
      bottom: -85,
    },
    userLocation: {
      fontSize:15,
      color:'#ccc',
      fontFamily:'Times New Roman',
      fontStyle: 'italic',
      marginLeft: 23
    },
    phoneNumber: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.8,
      shadowRadius: 2,  
      elevation: 3,
      marginTop: 20,
      paddingTop: 10,
      height: 60
    },
    phone: {
      color: '#8e8e8e',
    },
    userNumber: {
  
    },
    phoneHolder:{
      marginLeft: 10,
      position: 'relative',
    },
    phoneIcon: {
      position: 'absolute',
      bottom: 5,
      fontSize: 20
    },
    numberDetails: {
      left:30    
    }
  });
  

