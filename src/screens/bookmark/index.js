import React, { Component } from 'react';
import { View, StyleSheet, Image, SafeAreaView, FlatList, StatusBar } from 'react-native';
import {Rating} from 'react-native-elements';
import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Right, Body } from 'native-base';
import { Appbar } from 'react-native-paper';

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

   export default function bookmark(props) {

    return(
          <View style={styles.container}>
            <StatusBar barStyle="light-content" />
            <Appbar.Header style={{backgroundColor: '#000'}}>
                <Appbar.Action icon="close"
                onPress={() => props.navigation.goBack()}
                />
                <Appbar.Content
                title="Bookmarks"
                />
            </Appbar.Header>
            <FlatList
            data={saved}
            renderItem={({ item }) => (
            
            <Card style={{flex: 0}} key={item.id}>
              <CardItem>
                <Left>
                  <Thumbnail source={{uri: item.profile_photo}} />
                  <Body>
                    <Text>{item.business_name}</Text>
                    <Text note>{item.name}</Text>
                  </Body>
                </Left>
              </CardItem>
              <CardItem>
                <Body>
                  {/* <Image  resizeMode="cover" source={{uri: item.background_photo}} style={{height: 120, width: 340, flex: 1}}/> */}
                  <Text>
                    {item.description}
                  </Text>
                </Body>
              </CardItem>
              <CardItem>
              <View style={{flexDirection: 'row'}}>
                <Left>
                    <Rating
                      showRating
                      type="star"
                      fractions={1}
                      startingValue={2.0}
                      imageSize={14}
                      showRating={false}
                      //onFinishRating={this.ratingCompleted}
                      style={styles.ratings}
                    />
                </Left>
                <Right>
                  <Text>{item.location}</Text>
                </Right>
              </View>
              </CardItem>
            </Card> 
            )}
            keyExtractor={(item, index) => index.toString()}
            />
          </View>
      );
   }

   const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
  });