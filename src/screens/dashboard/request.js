import React, { useState, useEffect, useRef } from 'react';
import { Platform, View, StyleSheet, Picker, TouchableOpacity } from 'react-native';
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';
import MapView from 'react-native-maps';
import { Container, Header, Content, Card, CardItem, Thumbnail, Title, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { MaterialCommunityIcons } from '@expo/vector-icons'; 

const defaultRegion = {
    latitude: 45.52220671242907,
    longitude: -122.6653281029795,
    latitudeDelta: 0.04864195044303443,
    longitudeDelta: 0.040142817690068,
}

const categories = [
    {
        id: 1,
        name: "Carpenter"
    },
    {
        id: 2,
        name: "Mechanic"
    },
]

const Request = (props) => {
  const [state, setState] = useState({
    location: null,
    errorMessage: null,
    region: null,
    categoryTypes: categories,
    selected: "Test",
  })
  const mapRef = useRef(undefined);


  useEffect(() => {
    if (Platform.OS === 'android' && !Constants.isDevice) {
      setState({
        errorMessage: 'Oops, this will not work on Sketch in an Android emulator. Try it on your device!',
      });
    } else {
      _getLocationAsync();
    }
  }, [])

  const _getLocationAsync = async () => {
    let { status } = await Location.requestPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
      }

    let location = await Location.getCurrentPositionAsync({});
    setState({ location });
    let region = {
        latitude:       location.coords.latitude,
        longitude:      location.coords.longitude,
        latitudeDelta:  0.00922*1.5,
        longitudeDelta: 0.00421*1.5
    }
    setState({ region })
    mapRef.current.animateToRegion(region, 500);
  };

  const [selectedValue, setSelectedValue] = useState("java");

  const loadCatTypes = () => {
    return categories.map(cat_type => (
       <Picker.Item key={cat_type.id} label={cat_type.name} value={cat_type.name} />
    ))
  }

  return (
    <View style={styles.container}>
        <MapView 
            style = {styles.map}
            provider = {MapView.PROVIDER_GOOGLE}
            region = {state.region != null ? state.region : defaultRegion}
            showsUserLocation={Platform.OS === "ios" ? true : false}
            showsMyLocationButton={true}
            followUserLocation={true}
            zoomEnabled={true}
            ref={mapRef}
        >
        </MapView>
        {Platform.OS != "ios" ?
        <TouchableOpacity
          style={styles.myLocationButton}
          onPress={() => {
            _getLocationAsync()
          }}
        >
          <MaterialCommunityIcons name='crosshairs-gps' size={24} />
        </TouchableOpacity>
        : null}
        <Header
          style={styles.headerStyle}
            transparent
          >
         <Left style={{ flex: 1 }}>
            <Button style={styles.menuButton}  transparent onPress={() => props.navigation.openDrawer()}>
                <MaterialCommunityIcons name="menu" size={30} color="black" />
            </Button>
          </Left>
         </Header>
        <View style={styles.categoryDropdown}>
            {/* fix */}
            <Picker
                    selectedValue={selectedValue}
                    onValueChange={(itemValue, itemIndex) => setSelectedValue(itemValue)}
                  >
                    <Picker.Item label="Java" value="java" />
                    <Picker.Item label="JavaScript" value="erfd" />
                    <Picker.Item label="Python" value="ewrr" />
                    <Picker.Item label="PHP" value="bf" />
                    <Picker.Item label="Ruby" value="rerg" />
                    <Picker.Item label="C++" value="dfgg" />
                  </Picker>
        </View>
    </View>
  );
}

const styles = StyleSheet.create({
    container: { 
      flex: 1,
    },
    menu: {
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 10
    },
    map: {
        ...StyleSheet.absoluteFillObject,
    },
    categoryDropdown: {
      width:'80%',
      justifyContent:'flex-end',
      left:35,
      top:80,
      backgroundColor:'#fff',
      position:'absolute',
    },
    headerStyle:{
      backgroundColor: "transparent" ,
      // height: hp('6%'),
      borderBottomWidth: 0,
      shadowOffset: {height: 0, width: 0},
      shadowOpacity: 0,
      elevation: 0,
  },
  myLocationButton: {
    backgroundColor: "#fff",
    position: 'absolute',
    bottom: 10,
    right: 10,
    padding: 15,
    elevation: 3,
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'center',
    borderRadius: 50
  },
  menuButton: {
    backgroundColor: '#fff', 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8
  }
  });

export default Request;