import React, { Component, useState } from 'react';
import { View, StyleSheet, Image, SafeAreaView, FlatList, StatusBar, Dimensions } from 'react-native';
import {Rating} from 'react-native-elements';
import { Container, Segment, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { Appbar } from 'react-native-paper';
import EntypoIcon from 'react-native-vector-icons/Entypo';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'
var { height, width } = Dimensions.get('window');

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
    const [activeIndex, setActiveIndex] = useState(0);

    const segmentClicked = (index) => {
        setActiveIndex(index)
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

    const renderSectionOne = () => {
        return Images.map((image, index) => {
            return (
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
    return(
        <Container style={styles.container}> 
           <StatusBar barStyle="light-content" />
            <Appbar.Header style={{backgroundColor: '#fff'}}>
                <Appbar.Action icon="close"
                onPress={() => props.navigation.goBack()}
                />
                <Appbar.Content
                title="AB Rentals"
                />
            </Appbar.Header>
            <View>
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

                                <View
                                    style={{ flexDirection: 'row' }}>

                                    {/** Edit profile takes up 3/4th **/}
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
                            </View>{/**End edit profile**/}
                        </View>
                    </View>

                    <View style={{ paddingBottom: 10 }}>
                        <View style={{ paddingHorizontal: 10 }}>
                            <Text style={{ fontWeight: 'bold' }}>Varun Nath</Text>
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
            </View>
            
        </Container>
      );
   }

   const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });