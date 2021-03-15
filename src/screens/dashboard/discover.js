import React, { Component, useState, useRef, useEffect} from "react";
import {
  StyleSheet,
  Text,
  View,
  Animated,
  Image,
  Dimensions,
  FlatList,
  Keyboard,
  ActionSheetIOS,
  KeyboardAvoidingView
} from "react-native";
import {Rating} from 'react-native-elements';
import MapView from "react-native-maps";
import { TouchableOpacity } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from '@expo/vector-icons'; 
import { Container, Header, Content, Card, CardItem, Thumbnail, Title, Button, Icon, Left, Right, Body } from 'native-base';
import Modal from "react-native-modal";
import { CheckBox, SearchBar } from 'react-native-elements';
import { Divider } from 'react-native-paper';
import RNPickerSelect from 'react-native-picker-select';
import {allBusinesses} from "../../actions/api";
import {allCategory} from "../../actions/api";
import * as Location from 'expo-location';
import { getDistance, getPreciseDistance } from 'geolib';

let regionTimeout = null;
const Images = [
    { uri: "https://i.imgur.com/sNam9iJ.jpg" },
    { uri: "https://i.imgur.com/N7rlQYt.jpg" },
    { uri: "https://i.imgur.com/UDrH0wm.jpg" },
    { uri: "https://i.imgur.com/Ka8kNST.jpg" }
  ]

const categoriesIOS = ['Cancel', 'Carpenter', 'Mechanic', "Test", "MakeUp Artist"]

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
    const [markers, setMarkers] = useState([]);
    const [holdMarkers, setHoldMarkers] = useState([]);
    const [filterModal, setFilterModal] = useState(false);
    const [category, setCategory] = useState(null);
    const [catLabel, setCatLabel] = useState([]);
    const [stateIndex, setStateIndex] = useState(0);
    const [search, setSearch] = useState(null);
    const [animation, setAnimation] = useState(new Animated.Value(0));
    const [trueData, setTrueData] = useState([])
    const [highLow, setHighLow] = useState(false) //rating state for high to low
    const [lowHigh, setLowHigh] = useState(false) //rating state for low to high
    const [nearby, setNearby] = useState(false) 
    const [location, setLocation] = useState(null) 
    const mapRef = useRef(null);

    
    let hold_state = holdMarkers
    useEffect( () => {

        (async () => {
          let location = await Location.getCurrentPositionAsync({});
          setLocation(location)
          console.log(location)
        })();

        allBusinesses().then(function (data) { 
          console.log(data)
          setMarkers(data)
          setHoldMarkers(data)
        })
        allCategory().then(function (data) { 
          console.log("data")
          console.log(data)
          let arr = []
          data.map(val => {
            let obj = {}
            obj["label"] = val.name
            obj["value"] = val._id
            arr.push(obj)

          })
          setCatLabel(arr)
        })
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
      
    const openFilter = () => {
      setFilterModal(true);
    }

    const searchFilterFunction = text => {
        setSearch(text);
        let newArr = hold_state.filter(val => {
          return val.title.toLowerCase().includes(text.toLowerCase())
        })
        setMarkers(newArr)
         
    };

    const resetSearch = () => {
      setSearch('');
    }

    const openDrawer = () => {
      navigation.openDrawer();
      Keyboard.dismiss();
    }

    const onSelectCategory = () =>
    ActionSheetIOS.showActionSheetWithOptions(
      {
        options: categoriesIOS,
        destructiveButtonIndex: 2,
        cancelButtonIndex: 0
      },
      buttonIndex => {
        setCategory(categoriesIOS[buttonIndex])
      }
    );
    
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

    let rating_high_low = () => {
      let hold_state = holdMarkers
      if (!lowHigh && !highLow){
        setHighLow(true)
        setLowHigh(false)
        let newArr = hold_state.sort((a, b) => {
        return b.rating - a.rating
        })
        setMarkers(newArr)

      } else if(!lowHigh && highLow){
        setHighLow(false)
        setLowHigh(false)
        setMarkers(hold_state)
      } else {
        setLowHigh(false)
        setHighLow(true)

        let newArr = hold_state.sort((a, b) => {
        return b.rating - a.rating
        })
        setMarkers(newArr)
      }
      //lowHigh ? (setHighLow(true)) && (setLowHigh(false)) : setHighLow(true) && (setLowHigh(false))
    }

    let rating_low_high = () => {
      if (!lowHigh && !highLow){
        setHighLow(false)
        setLowHigh(true)

        let newArr = hold_state.sort((a, b) => {
        return a.rating - b.rating
        })
        setMarkers(newArr)
      } else if(lowHigh && !highLow){
        setHighLow(false)
        setLowHigh(false)
        setMarkers(hold_state)
      } else {
        setLowHigh(true)
        setHighLow(false)

        let newArr = hold_state.sort((a, b) => {
        return a.rating - b.rating
        })
        setMarkers(newArr)
      }
      //highLow ? (setLowHigh(true)) && (setHighLow(false)) : setLowHigh(true) && (setHighLow(false))
    }

    let find_by_distance = (curr_user_lat, curr_user_long) => {
      if(nearby){
        setNearby(false)
        setMarkers(hold_state)
      } else {
        setNearby(true)
        let newArr = hold_state.sort((a, b) => {
          let first_distance = calculateDistance(curr_user_lat, curr_user_long) - calculateDistance(a.coordinate.latitude, a.coordinate.longitude)
          let second_distance = calculateDistance(curr_user_lat, curr_user_long) - calculateDistance(b.coordinate.latitude, a.coordinate.longitude)
          let result =  (first_distance) - (second_distance)
          console.log(result)
          return result
          })
        setMarkers(newArr)
        
      }
      
    }

    let find_by_selected_value = (value) => {
      if ( value != null){
        let newArr = hold_state.filter(val => {
        return val.category._id === value
      })
      setMarkers(newArr)
      } else {
        setMarkers(hold_state)
      }
      
    }

    const calculateDistance = (lat1, long1) => {
      var dis = getPreciseDistance(
        { latitude: 	lat1, longitude: long1 },
        { latitude: 8.975073, longitude: 7.376306 }
      );

      var dis_in_km = dis / 1000
      //alert(`Distance\n\n${dis} Meter\nOR\n${dis / 1000} KM`);
      return dis_in_km
    };
    
    const renderModal = () => {
      return (
        <Modal
          isVisible={filterModal}
          style={{ backgroundColor: '#694fad', borderRadius: 10, marginHorizontal: 30, marginVertical: (height - 400) / 2 }}
          deviceHeight={height}
          backdropColor='transparent'
          onBackdropPress={() => setFilterModal(false)}
      >
          <View style={{ marginTop: 22, height: 400, paddingVertical: 15, paddingHorizontal: 20 }}>
            <View>
              <Text style={{ color: '#fff', textAlign: 'center', fontSize: 18, }}>Filters</Text>
              <Icon style={{ color: 'white', position: 'absolute', top: 0, right: 0 }} name='clear' type='MaterialIcons' onPress={() => setFilterModal(false)} />
              <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: '700', marginBottom: 10, color: '#fff' }}>Categories</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <RNPickerSelect
                      onValueChange={(value) => find_by_selected_value(value)}
                      style={{color: '#fff'}}
                      items={catLabel}
                  />
                </View>
              </View>
              <Divider style={{height: 2, marginBottom: 10, backgroundColor: '#bdbdbd'}} />
              <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: '700', marginBottom: 10, color: '#fff' }}>Ratings</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#fff' }}>High - Low</Text>
                      <CheckBox
                          containerStyle={{ borderWidth: 0, paddingLeft: 0, backgroundColor: 'transparent', marginLeft: 0, marginRight: 0, padding: 0 }}
                          textStyle={{ fontWeight: 'normal', color: '#fff' }}
                          iconRight={true}
                          right
                          checkedColor='#fff'
                          uncheckedColor='#fff'
                          onPress={() => rating_high_low()}
                          checked={highLow}
                      />
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#fff' }}>Low - High</Text>
                      <CheckBox
                          containerStyle={{ borderWidth: 0, paddingLeft: 0, backgroundColor: 'transparent', marginLeft: 0, marginRight: 0, padding: 0 }}
                          textStyle={{ fontWeight: 'normal', color: '#fff' }}
                          iconRight={true}
                          right
                          checkedColor='#fff'
                          uncheckedColor='#fff'
                          onPress={() => rating_low_high()}
                          checked={lowHigh}
                      />
                  </View>
              </View>
              <Divider style={{height: 2, marginBottom: 10, backgroundColor: '#bdbdbd'}} />
              <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: '700', marginBottom: 10, color: '#fff' }}>Distance</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#fff' }}>Nearby</Text>
                      {location !== null ? (
                        <CheckBox
                          containerStyle={{ borderWidth: 0, paddingLeft: 0, backgroundColor: 'transparent', marginLeft: 0, marginRight: 0, padding: 0 }}
                          textStyle={{ fontWeight: 'normal', color: '#fff' }}
                          iconRight={true}
                          right
                          checkedColor='#fff'
                          uncheckedColor='#fff'
                          onPress={() => find_by_distance(location.coords.latitude, location.coords.longitude)}
                          checked={nearby}
                      />
                      ) : null}
                      
                  </View>
              </View>
          </View>
        </View>
      </Modal>
      )
    }

    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
      >
        <View style={styles.container}>
          {renderModal()}
          <MapView
            ref={mapRef}
            initialRegion={region}
            //provider = {MapView.PROVIDER_GOOGLE}
            style={StyleSheet.absoluteFillObject}
            onPress={Keyboard.dismiss}
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
                  <Button style={styles.menuButton} transparent onPress={() => openDrawer()}>
                      <MaterialCommunityIcons name="menu" size={30} color="black" />
                  </Button>
              </Left>
          </Header>
          <View style={styles.searchFilter}>
                <SearchBar
                    placeholder='Search'
                    round
                    onChangeText={text => searchFilterFunction(text) }
                    value={search}
                    onClear={text => resetSearch()}
                    containerStyle={{ backgroundColor: '#fff', width: width * 0.7, marginRight: 10, borderBottomWidth: 0, borderTopWidth: 0, padding: 0, borderColor: 'transparent' }}
                    inputContainerStyle={{ backgroundColor: '#fff', borderWidth: 1, borderBottomWidth: 1, borderColor: '#939393', height: 40, borderRadius: 5,  borderColor: 'transparent' }}
                    inputStyle={{ fontSize: 12 }}
                    autoCorrect={false}
                />
                <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                    <Text style={{ marginRight: 10 }}>Filter</Text>
                    <Icon name='filter-list' type='MaterialIcons' style={{ color: '#694fad' }} onPress={() => openFilter()} />
                </View>
              </View>
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
              <TouchableOpacity key={index}  onPress={() => navigation.navigate('business')}>
                <View style={styles.card}  key={index}>
                  <Image
                  source={{uri: item.image}}
                  style={styles.cardImage}
                  resizeMode="cover"
                  />
                  <View style={styles.textContent}>
                  <Text numberOfLines={1} style={styles.cardtitle}>{item.title}</Text>
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
        </KeyboardAvoidingView>
      );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      position: 'relative'
    },
    result: {
      fontSize: 64,
      textAlign: "center"
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
      elevation: 5,
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
  searchFilter: {
    flexDirection: 'row',
    marginLeft: '2%', 
    marginRight: '2%', 
    borderRadius: 10, 
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, 
    backgroundColor: '#fff', 
    padding: 10, 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 20, 
    marginTop: 20
  },
  menuButton: {
    // backgroundColor: '#fff',
    shadowColor: "#000",
    marginLeft: 8, 
    marginTop: 10,
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.30,
    shadowRadius: 4.65,
    elevation: 8
  }
});