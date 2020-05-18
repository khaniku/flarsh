import React, { Component, useState, useEffect } from 'react';
import {  StyleSheet,
  Dimensions,
  ScrollView,
  ImageBackground,
  Platform } from 'react-native';
import { Block, Text, theme } from "galio-framework";
import { Images, argonTheme } from "../../constants";
import { HeaderHeight } from "../../constants/utils";
import { TextInput, Button} from 'react-native-paper';
import { Input, Avatar } from 'react-native-elements';
import { MaterialIcons } from '@expo/vector-icons'; 
import { FontAwesome } from '@expo/vector-icons';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen';
import * as ImagePicker from 'expo-image-picker';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import { Appbar } from 'react-native-paper';

const { width, height } = Dimensions.get("screen");

const thumbMeasure = (width - 48 - 32) / 3;

export default function Profile(props) {
  const [firstName, setFirstName] = useState("Emeka");
  const [lastName, setLastName] = useState("Kanikwu");
  const [email, setEmail] = useState("emeka@gmail.com");
  const [password, setPassword] = useState("password");
  const [number, setNumber] = useState("+1 555 555 5553");
  const [profilePhoto, setProfilePhoto] = useState(null); 

  useEffect( () => {
    getPermissionAsync();
  }, [])

  const getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  const _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        setProfilePhoto(result.uri)
      }

      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };


  return (
    <Block flex style={styles.profile}>
      <Appbar.Header style={{backgroundColor: '#694fad'}}>
        <Appbar.Action icon="close"
          onPress={() => props.navigation.goBack()}
        />
        <Appbar.Content
          title="Profile"
        />
      </Appbar.Header>
      <Block flex>
        <ImageBackground
          source={Images.ProfileBackground}
          style={styles.profileContainer}
          imageStyle={styles.profileBackground}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ width, marginTop: '15%' }}
          >
            <Block flex style={styles.profileCard}>
              <Block middle style={styles.avatarContainer}>
              <Avatar
                  size={wp('30%')}
                  source={profilePhoto ? {uri:profilePhoto} : {
                    uri:
                      'https://ui-avatars.com/api/?name='+firstName+' '+lastName+'?rounded=true',
                  }}
                  rounded
                  containerStyle={{ padding: 5, borderColor: '#1275bc', borderWidth: 3.0 }}
                  showAccessory={true}
                  onAccessoryPress={_pickImage}
                  accessory={
                      {
                          name: 'md-camera', type: 'ionicon', size: 30,
                          underlayColor: '#aaa',
                          // style: { bottom: 5, right: 5, padding: 2, backgroundColor: '#fff' },
                          containerStyle: { backgroundColor: '#1275bc', width: 26, height: 26, borderRadius: 13, alignItems: 'center' },
                          iconStyle: { fontSize: 15, marginTop: 5 }
                      }
                  }
              />
              </Block>
              <Block style={styles.info}>
              </Block> 
              <Block flex>
                <Block middle style={styles.nameInfo}>
                  <Text bold size={28} color="#32325D">
                    {firstName} {lastName}
                  </Text>
                  <Text size={16} color="#32325D" style={{ marginTop: 10 }}>
                    San Francisco, USA
                  </Text>
                </Block>
                <Block middle style={{ marginTop: 30, marginBottom: 16 }}>
                  <Block style={styles.divider} />
                </Block>
                <Block left>
                  <Input
                    placeholder='Email'
                    value={email}
                    onChangeText={text => setEmail({ text })}
                    leftIcon={
                      <MaterialIcons name="email" size={24} color="black" />
                    }
                  />
                </Block>   
                <Block left>
                <Input
                    placeholder='Password'
                    value={password}
                    onChangeText={text => setPassword({ text })}
                    secureTextEntry={true}
                    leftIcon={
                      <MaterialIcons name="lock" size={24} color="black" />
                    }
                  />
                </Block>
                <Block left>
                  <Input
                      placeholder='Phone Number'
                      value={number}
                      disabled
                      onChangeText={text => setNumber({ text })}
                      leftIcon={
                        <FontAwesome name="phone" size={24} color="black" />
                      }
                    />
                </Block>
                <Block middle>
                <Button mode="contained" style={styles.button} onPress={() => console.log('Pressed')}>
                  Update
                </Button>
                </Block>
              </Block>
            </Block>
          </ScrollView>
        </ImageBackground>
      </Block>
    </Block>
  );
}

const styles = StyleSheet.create({
  profile: {
    marginTop: Platform.OS === "android" ? -HeaderHeight : 0,
    // marginBottom: -HeaderHeight * 2,
    flex: 1
  },
  button: {
    backgroundColor: '#694fad'
  },
  profileContainer: {
    width: width,
    height: height,
    padding: 0,
    zIndex: 1
  },
  profileBackground: {
    width: width,
    height: height / 2
  },
  profileCard: {
    // position: "relative",
    padding: theme.SIZES.BASE,
    marginHorizontal: theme.SIZES.BASE,
    marginTop: 65,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    backgroundColor: theme.COLORS.WHITE,
    shadowColor: "black",
    shadowOffset: { width: 0, height: 0 },
    shadowRadius: 8,
    shadowOpacity: 0.2,
    zIndex: 2
  },
  info: {
    paddingHorizontal: 40
  },
  avatarContainer: {
    position: "relative",
    marginTop: -80
  },
  avatar: {
    width: 124,
    height: 124,
    borderRadius: 62,
    borderWidth: 0
  },
  nameInfo: {
    marginTop: 15
  },
  divider: {
    width: "90%",
    borderWidth: 1,
    borderColor: "#E9ECEF"
  },
  thumb: {
    borderRadius: 4,
    marginVertical: 4,
    alignSelf: "center",
    width: thumbMeasure,
    height: thumbMeasure
  }
});

  

