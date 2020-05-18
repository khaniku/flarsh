import React, {useState} from 'react';
import { StyleSheet, View, FlatList, Platform, TouchableOpacity, ScrollView } from "react-native";
import { Block, Text, theme, Icon } from "galio-framework";
import { Appbar } from 'react-native-paper';

export default function preference(props) {

    const renderItem = ({ item }) => {
        const {navigate} = props.navigation;
        return (
            <Block style={styles.rows}>
              <TouchableOpacity onPress={() => navigate(item.id)}>
                <Block row middle space="between" style={{paddingTop:7}}>
                  <Text size={14}>{item.title}</Text>
                  <Icon name="angle-right" family="font-awesome" style={{ paddingRight: 5 }} />
                </Block>
              </TouchableOpacity>
            </Block>
        );
    }

    const privacy = [
        { title: "User Agreement", id: "Agreement", type: "button" },
        { title: "Privacy", id: "Privacy", type: "button" },
        { title: "About", id: "About", type: "button" },
      ];

    return (
        <View style={styles.container}>
            <Appbar.Header style={{backgroundColor: '#fff'}}>
                <Appbar.Action icon="close"
                onPress={() => props.navigation.goBack()}
                />
                <Appbar.Content
                title="Preferences"
                />
            </Appbar.Header>
            <Block style={styles.title}>
                <Text bold center size={theme.SIZES.BASE} style={{ paddingBottom: 5 }}>
                    Privacy Settings
                </Text>
            </Block>
            <FlatList
                data={privacy}
                keyExtractor={(item, index) => item.id}
                renderItem={renderItem}
            />
        </View>
    );
    
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    },
    settings: {
      paddingVertical: theme.SIZES.BASE / 3,
    },
    title: {
      paddingTop: theme.SIZES.BASE,
      paddingBottom: theme.SIZES.BASE / 2,
    },
    rows: {
      height: theme.SIZES.BASE * 2,
      paddingHorizontal: theme.SIZES.BASE,
      marginBottom: theme.SIZES.BASE / 2,
    }
  });
  