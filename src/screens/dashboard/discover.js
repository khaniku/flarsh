import React, { Component, useState, useRef, useEffect} from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Dimensions,
  FlatList
} from "react-native";
import {Rating} from 'react-native-elements';
import MapView from "react-native-maps";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Container, Header, Content, Card, CardItem, Thumbnail, Title, Button, Icon, Left, Right, Body } from 'native-base';

let regionTimeout = null;
const Images = [
    { uri: "https://i.imgur.com/sNam9iJ.jpg" },
    { uri: "https://i.imgur.com/N7rlQYt.jpg" },
    { uri: "https://i.imgur.com/UDrH0wm.jpg" },
    { uri: "https://i.imgur.com/Ka8kNST.jpg" }
  ]
const testData = [
    {
      coordinate: {
        latitude: 45.524548,
        longitude: -122.6749817,
      },
      title: "Best Place",
      description: "This is the best place in Portland",
      image: Images[0],
    },
    {
      coordinate: {
        latitude: 45.524698,
        longitude: -122.6655507,
      },
      title: "Second Best Place",
      description: "This is the second best place in Portland",
      image: Images[1],
    },
    {
      coordinate: {
        latitude: 45.5230786,
        longitude: -122.6701034,
      },
      title: "Third Best Place",
      description: "This is the third best place in Portland",
      image: Images[2],
    },
    {
      coordinate: {
        latitude: 45.521016,
        longitude: -122.6561917,
      },
      title: "Fourth Best Place",
      description: "This is the fourth best place in Portland",
      image: Images[3],
    },
  ]
const defaultRegion = {
    latitude: 45.52220671242907,
    longitude: -122.6653281029795,
    latitudeDelta: 0.04864195044303443,
    longitudeDelta: 0.040142817690068,
}

const { width, height } = Dimensions.get("window");
const CARD_HEIGHT = height / 4;
const CARD_WIDTH = CARD_HEIGHT - 50;


export default function Discover({ navigation }) {
    const [region, setRegion] = useState(defaultRegion);
    const [markers, setMarkers] = useState(testData);
    const [stateIndex, setStateIndex] = useState(0);
    const [animation, setAnimation] = useState(new Animated.Value(0));
    const mapRef = useRef(null);

    useEffect( () => {
        animation.addListener(({ value }) => {
            let index = Math.floor(value / CARD_WIDTH + 0.3); // animate 30% away from landing on the next item
            if (index >= markers.length) {
                index = markers.length - 1;
            }
            if (index <= 0) {
              index = 0;
            }
            clearTimeout(regionTimeout);
            regionTimeout = setTimeout(() => {
              if (stateIndex !== index) {
                setStateIndex(index);
                const { coordinate } = markers[index];
                mapRef.current.animateToRegion(
                  {
                    ...coordinate,
                    latitudeDelta: region.latitudeDelta,
                    longitudeDelta: region.longitudeDelta,
                  },
                  350
                );
              }
            }, 0.5);
        });
      }, [])
    
    const interpolations = markers.map((marker, index) => {
        const inputRange = [
            (index - 1) * CARD_WIDTH,
            index * CARD_WIDTH,
            ((index + 1) * CARD_WIDTH),
        ];
        const scale = animation.interpolate({
            inputRange,
            outputRange: [0.6, 1, 0.6],
            //outputRange: [1, 2.5, 1],
            extrapolate: "clamp",
        });
        const opacity = animation.interpolate({
            inputRange,
            outputRange: [0.35, 1, 0.35],
            extrapolate: "clamp",
        });

        return { scale, opacity};
    });

    return (
        <View style={styles.container}>   
          <MapView
            ref={mapRef}
            initialRegion={region}
            //provider = {MapView.PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
          >

            {markers.map((marker, index) => {
              const scaleStyle = {
                transform: [
                  {
                    scale: interpolations[index].scale,
                  },
                ],
              };
              const opacityStyle = {
                opacity: interpolations[index].opacity,
              };

              return (
                <MapView.Marker key={index} coordinate={marker.coordinate}>
                  <Animated.View style={[styles.markerWrap, opacityStyle]}>
                    <Animated.View style={[styles.ring, scaleStyle]} />
                    <View style={styles.marker} />
                  </Animated.View>
                </MapView.Marker>
              );
            })}
          </MapView>
          <Header
              style={styles.headerStyleDiscover}
                transparent
            >
          <Left style={{ flex: 1 }}>
                  <Button  transparent onPress={() => navigation.openDrawer()}>
                      <MaterialCommunityIcons name="menu" size={30} color="black" />
                  </Button>
              </Left>
          </Header>
          <Animated.ScrollView
            horizontal
            scrollEventThrottle={1}
            showsHorizontalScrollIndicator={false}
            snapToInterval={CARD_WIDTH}
            onScroll={Animated.event(
              [
                {
                  nativeEvent: {
                    contentOffset: {
                      x: animation,
                    },
                  },
                },
              ],
              { useNativeDriver: true }
            )}
            style={styles.scrollView}
            contentContainerStyle={styles.endPadding}
          >
            <FlatList
            data={markers}
            contentContainerStyle={{
              flexDirection: 'row',
            }}
            renderItem={({ item, index }) => (
              <TouchableOpacity key={index}  onPress={() => navigation.navigate('bookmark')}>
                <View style={styles.card}  key={index}>
                  <Image
                  source={item.image}
                  style={styles.cardImage}
                  resizeMode="cover"
                  />
                  <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>{item.name}</Text>
                  <Text numberOfLines={1} style={styles.cardDescription}>
                      {item.description}
                  </Text>
                  </View>
                  <View>
                      <Rating
                      showRating
                      type="star"
                      fractions={1}
                      startingValue={2.0}
                      imageSize={14}
                      showRating={false}
                      // onFinishRating={this.ratingCompleted}
                      style={styles.ratings}
                      />
                  </View>
                </View>
              </TouchableOpacity>

              )}
              keyExtractor={(item, index) => index.toString()}
              />
          </Animated.ScrollView>
        </View>
      );

}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative'
    },
    map: {
      flex: 1
    },
    scrollView: {
      position: "absolute",
      bottom: 30,
      left: 0,
      right: 0,
      paddingVertical: 10,
    },
    endPadding: {
      paddingRight: width - CARD_WIDTH,
    },
    card: {
      padding: 10,
      elevation: 2,
      backgroundColor: "#FFF",
      marginHorizontal: 10,
      shadowColor: "#000",
      shadowRadius: 5,
      shadowOpacity: 0.3,
      shadowOffset: { x: 2, y: -2 },
      height: 200,
      width: 150,
      overflow: "hidden",
      borderRadius: 30,
    },
    cardImage: {
      flex: 3,
      width: "100%",
      height: "100%",
      alignSelf: "center",
      borderRadius: 8.5,
    },
    textContent: {
      flex: 1,
    },
    cardtitle: {
      fontSize: 13,
      marginTop: 5,
      fontWeight: "bold",
    },
    cardDescription: {
      fontSize: 12,
      color: "#444",
    },
    markerWrap: {
      alignItems: "center",
      justifyContent: "center",
    },
    marker: {
      position: "absolute",
      width: 12,
      height: 12,
      borderRadius: 6,
      backgroundColor: "#3484F0",
      //backgroundColor: "green",
    },
    ring: {
      width: 30,
      height: 30,
      borderRadius: 12,
      backgroundColor: "#C4DBFA",
      //backgroundColor: "orange",
     // borderWidth: 1,
      //borderColor: "rgba(65, 116, 169, 0.9)",
    },
    ratings: {
       paddingVertical: 10,
       alignItems: 'center',
       justifyContent: 'center',
    },
    searchBar: {
      position: "absolute",
      bottom: 500,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      width:'100%',
      height:50,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: 'row',
      paddingRight:'5%',
      paddingLeft:'5%',
    },
    selectDropdown: {
      position: "absolute",
      bottom: 450,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(255, 255, 255, 0)',
      width:'100%',
      height:40,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: 'row',
      paddingRight:'5%',
      paddingLeft:'5%',
    },
    innerDropdown: {
      width:'90%',
      backgroundColor:'white',
      borderWidth:1,
      borderColor:'white',
      shadowOffset:{  width: 3,  height: 5,  },
      shadowColor: 'black',
      shadowOpacity: 0.9,
    },
    discoverBar: {
      width:'45%',
      height: '100%',
      backgroundColor: '#8b9dc3',
      borderWidth:1,
      borderColor:'white',
      borderTopLeftRadius:10,
      alignItems: "center",
      justifyContent: "center",
    },
    nearbyBar: {
      width:'45%',
      height: '100%',
      backgroundColor: 'white',
      borderWidth:1,
      borderColor:'white',
      borderTopRightRadius:10,
      alignItems: "center",
      justifyContent: "center",
    },
    menu: {
      position: 'absolute',
      top: 10,
      left: 10,
      zIndex: 10
    },
    discoverText: {
      fontSize:16,
    },
    nearbyText: {
      fontSize:16,
    },
    headerStyleDiscover:{
      backgroundColor: "transparent" ,
      // height: hp('6%'),
      borderBottomWidth: 0,
      shadowOffset: {height: 0, width: 0},
      shadowOpacity: 0,
      elevation: 0,
  },
  });