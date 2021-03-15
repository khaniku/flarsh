import React, { Component, useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView, ActivityIndicator, StatusBar, Platform, Dimensions, TouchableHighlight, TouchableOpacity } from 'react-native';
import {Rating} from 'react-native-elements';
import { Divider, TextInput  } from 'react-native-paper';
import { Container, Segment, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { Appbar } from 'react-native-paper';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
import { CheckBox, SearchBar } from 'react-native-elements';
var { height, width } = Dimensions.get('window');
import Modal from "react-native-modal";
//import DateTimePicker from '@react-native-community/datetimepicker';
import {wrapIntoModal} from 'expo-modal';
import DateTimePicker from "react-native-modal-datetime-picker";
import Moment from 'moment';
import { useSelector } from "react-redux";

const saved = [
    {
       id: 1,
       business_name: 'Flarsh',
       name: 'Emeka Kanikwu',
       profile_photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
       background_photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
       description: 'This is just a random test and does not signify anything or mean anything',
       ratings: 5,
       location: 'Abuja'
    },
    {
       id: 2,
       business_name: 'Runner',
       name: 'Bobby Kanikwu',
       profile_photo: 'https://s3.amazonaws.com/uifaces/faces/twitter/brynn/128.jpg',
       background_photo: 'https://picsum.photos/id/1041/200/300',
       description: 'This is just a random test and does not signify anything or mean anything',
       ratings: 5,
       location: 'Lagos'
    },
   ]

   const Images = [
    { uri: "https://i.imgur.com/sNam9iJ.jpg" },
    { uri: "https://i.imgur.com/N7rlQYt.jpg" },
    { uri: "https://i.imgur.com/UDrH0wm.jpg" },
    { uri: "https://i.imgur.com/Ka8kNST.jpg" }
  ]

   export default function business(props) {
    const user = useSelector(state => state.user.userDetails);
    const [activeIndex, setActiveIndex] = useState(0);
    const [filterModal, setFilterModal] = useState(false);
    const [date, setDate] = useState(new Date());
    const [mode, setMode] = useState(null);
    const [show, setShow] = useState(false);
    const [timeDisable, setTimeDisable] = useState(true)
    const [isLoading, setIsLoading] = useState(false)
    const [homeSpace, setHomeSpace] = useState(true)
    const [workSpace, setWorkSpace] = useState(false)
    const [imageModalStatus, setImageModalStatus] = useState(false)
    const [currentImage, setCurrentImage] = useState("")
    const [isDateTimePickerVisible, setIsDateTimePickerVisible] = useState(false)
    const [due_date, setDue_date] = useState("")

    const onChange = (event, selectedDate) => {
        const currentDate = selectedDate || date;
        setShow(Platform.OS === 'ios');
        setDate(currentDate);
        setTimeDisable(false)
    };

    const showMode = (currentMode) => {
        setShow(true);
        setMode(currentMode);
    };

    const showDateTimePicker = () => {
        setIsDateTimePickerVisible(true)
    };
    
    const hideDateTimePicker = () => {
        setIsDateTimePickerVisible(false)
    };

    const handleDatePicked = date => {
        setDue_date(date)
        hideDateTimePicker()
    };

    const showDatepicker = () => {
        showMode('date');
        setTimeDisable(false)
    };

    const showTimepicker = () => {
        showMode('time');
    };
    

    const segmentClicked = (index) => {
        setActiveIndex(index)
    }

    const workSpaceCheck = () => {
        if (homeSpace && !workSpace) {
            setHomeSpace(false)
            setWorkSpace(true)
        }
    }

    const homeSpaceCheck = () => {
        if (!homeSpace && workSpace) {
            setHomeSpace(true)
            setWorkSpace(false)
        }
    }

    const checkActive = (index) => {
        if(activeIndex !== index){
            return (
                {color: 'grey'}
            )
        } else {
            return (
                {}
            )
        }
    }

    const handleAppointmentBooking = () => {
        setIsLoading(true)
        console.log(user)
    }
    const imageStatus = (image) => {
        setImageModalStatus(true)
        setCurrentImage(image)
    }
    const renderSectionOne = () => {
        return Images.map((image, index) => {
            return (
                <TouchableHighlight
                onPress = {() => imageStatus(image)}
                >
                    <View key={index} style={[{ width: (width) / 3 }, { height: (width) / 3 }, { marginBottom: 2 }, index % 3 !== 0 ? { paddingLeft: 2 } : { paddingLeft: 0 }]}>
                        <Image style={{
                            flex: 1,
                            alignSelf: 'stretch',
                            width: undefined,
                            height: undefined,

                        }}
                            source={image}>
                        </Image>
                    </View>
                </TouchableHighlight>
                
            )
        })

    }

    const renderSection = () => {

        if (activeIndex == 0) {

            return (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>

                    {renderSectionOne()}
                </View>
            )

        }
        else if (activeIndex == 1) {
            return (
                <View>
                   <Text>helo</Text>
                </View>
            )
        }
    }
    const openFilter = () => {
        setFilterModal(true);
    }
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
            <Text style={{color:"#fff", marginBottom: 10, fontWeight: '900'}}>Appointment Details</Text>
            <Divider style={{height: 1, marginBottom: 10, backgroundColor: '#bdbdbd'}} />
              <View style={{ marginBottom: 10 }}>
                  <Text style={{ fontWeight: '700', marginBottom: 10, color: '#fff' }}>Appointment Place</Text>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#fff' }}>Home Space</Text>
                      <CheckBox
                          containerStyle={{ borderWidth: 0, paddingLeft: 0, backgroundColor: 'transparent', marginLeft: 0, marginRight: 0, padding: 0 }}
                          textStyle={{ fontWeight: 'normal', color: '#fff' }}
                          iconRight={true}
                          right
                          checkedColor='#fff'
                          uncheckedColor='#fff'
                          checked={homeSpace}
                          onPress={homeSpaceCheck}
                      />
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Text style={{ color: '#fff' }}>Work Space</Text>
                      <CheckBox
                          containerStyle={{ borderWidth: 0, paddingLeft: 0, backgroundColor: 'transparent', marginLeft: 0, marginRight: 0, padding: 0 }}
                          textStyle={{ fontWeight: 'normal', color: '#fff' }}
                          iconRight={true}
                          right
                          checkedColor='#fff'
                          uncheckedColor='#fff'
                          checked={workSpace}
                          onPress={workSpaceCheck}
                      />
                  </View>
              </View>
              {
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                  <Icon style={{ fontSize: 15, marginRight: 10, color: '#fff' }} name='insert-invitation' type='MaterialIcons' />
                  <Text style={{ fontWeight: '600', marginRight: 20, color: '#fff', fontSize: 14 }}>Select Day:</Text>
                  <TouchableOpacity onPress={showDateTimePicker} style={{ borderColor: '#E5E5E5', borderRadius: 10, borderWidth: 1.5, alignItems: 'center', justifyContent: 'space-between', flex: 1, flexDirection: 'row', paddingHorizontal: 10, paddingVertical: 5, marginRight: 5 }}>
                          { due_date !== "" ? 
                          <Text style={{color:"#fff"}}>{Moment(due_date).format('MMM DD YYYY HH:mm')}</Text>
                          : <Text style={{color:"#fff"}}>{due_date}</Text>}
                          <Icon name='calendar-range' type='MaterialCommunityIcons' style={{ fontSize:20, color:"#fff"}} />
                      </TouchableOpacity>
                      <DateTimePicker
                      isVisible={isDateTimePickerVisible}
                      onConfirm={handleDatePicked}
                      onCancel={hideDateTimePicker}
                      mode='datetime'
                      display={Platform.OS === "ios" ? "inline" : "default"}
                  />
                </View>
              }
               {(isLoading) ? (
                   <Button style={{marginTop:30, justifyContent: 'center'}}><ActivityIndicator color="#fff" /></Button>
               ) : (
                   <Button style={{marginTop:30, justifyContent: 'center'}} onPress={handleAppointmentBooking} disabled={isLoading}><Text>Book now</Text></Button>
               )}
              
            </View>

        </Modal>
      )
    }

    const viewImageModal = () => {
        return (
            <Modal
            isVisible={imageModalStatus}
            style={{ backgroundColor: '#ffffff', borderRadius: 10, marginHorizontal: 30, marginVertical: (height - 400) / 2 }}
            deviceHeight={height}
            backdropColor='transparent'
            onBackdropPress={() => setImageModalStatus(false)}>
                <Image source={currentImage}
            style={{ width: '100%', height: '100%' }} />

            </Modal>
        )
    }
    return(
        <Container style={styles.container}> 
        {renderModal()}
        {viewImageModal()}
           <StatusBar barStyle="light-content" />
            <Appbar.Header style={{backgroundColor: '#fff'}}>
                <Appbar.Action icon="close"
                onPress={() => props.navigation.goBack()}
                />
                <Appbar.Content
                title="AB Rentals"
                />
            </Appbar.Header>
            <Content>
            <View style={{ paddingTop: 10 }}>

{/** User Photo Stats**/}
<View style={{ flexDirection: 'row' }}>

    {/**User photo takes 1/3rd of view horizontally **/}
    <View
        style={{ flex: 1, alignItems: 'center', justifyContent: 'flex-start' }}>
        <Image source={Images[0]}
            style={{ width: 75, height: 75, borderRadius: 37.5 }} />

    </View>

    {/**User Stats take 2/3rd of view horizontally **/}
    <View style={{ flex: 3 }}>

        {/** Stats **/}
        <View
            style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'flex-end'
            }}>
            <View style={{ alignItems: 'center' }}>
                <Text>20</Text>
                <Text style={{ fontSize: 10, color: 'grey' }}>Posts</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
                <Text>205</Text>
                <Text style={{ fontSize: 10, color: 'grey' }}>Followers</Text>
            </View>
            <View style={{ alignItems: 'center' }}>
                <Text>167</Text>
                <Text style={{ fontSize: 10, color: 'grey' }}>Following</Text>
            </View>
        </View>

        {/**Edit profile and Settings Buttons **/}
        <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'flex-start', paddingTop: 10 }}>
        <View style={{ flexDirection: 'row' }}>
            <Button style={{ flex: 3, marginLeft: 20, marginRight: 20, justifyContent: 'center', height: 30, backgroundColor: "#694fad" }} onPress={() => openFilter()}><Text>Book Appointment</Text></Button>
        </View>
           
        </View>
    </View>
</View>

<View style={{ paddingBottom: 10 }}>
    <View style={{ paddingHorizontal: 10 }}>
        <Text style={{ fontWeight: 'bold' }}>Varun Nath</Text>
        <View style={{alignItems:"flex-start"}}>
        <Rating
            showRating
            type="star"
            fractions={1}
            startingValue={2.0}
            imageSize={14}
            showRating={false}
            //onFinishRating={this.ratingCompleted}
            />
        </View>
            
        <Text>Lark | Computer Jock | Commercial Pilot</Text>
        <Text>www.unsureprogrammer.com</Text>
    </View>
</View>


</View>

            <View >
                <View style={{ flexDirection: 'row', justifyContent: 'space-around', borderTopWidth: 1, borderTopColor: '#eae5e5' }}>

                    {renderSection()}
                </View>
            </View>
            </Content>
            
        </Container>
      );
   }

   const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });