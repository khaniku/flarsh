import React from 'react';
import { View, Text } from 'react-native-animatable';
import { Appbar } from 'react-native-paper';

export default function Privacy(props) {

    return (
        <View style={{flex: 1}}>
            <Appbar.Header style={{backgroundColor: '#fff'}}>
                <Appbar.BackAction 
                onPress={() => props.navigation.goBack()}
                />
                <Appbar.Content
                title="Privacy"
                />
            </Appbar.Header>
            <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. 
                Mollis nunc sed id semper risus in. Bibendum at varius vel pharetra vel turpis nunc. 
                Suspendisse in est ante in nibh mauris cursus mattis molestie. 
                Sagittis eu volutpat odio facilisis mauris sit amet. Nec dui nunc mattis enim ut. 
                Rhoncus aenean vel elit scelerisque mauris pellentesque pulvinar pellentesque. 
                Dolor sit amet consectetur adipiscing elit. Mi bibendum neque egestas congue quisque egestas. 
                Ultricies mi quis hendrerit dolor magna eget. Fringilla phasellus faucibus scelerisque eleifend donec pretium vulputate. 
                Gravida quis blandit turpis cursus in hac habitasse. Odio tempor orci dapibus ultrices in. 
                Nullam ac tortor vitae purus faucibus. Vivamus arcu felis bibendum ut tristique et. 
                Proin sagittis nisl rhoncus mattis rhoncus urna. Sed risus ultricies tristique nulla aliquet.
            </Text>
        </View>
    )
}