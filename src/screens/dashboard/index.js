import * as React from 'react';
import { createMaterialBottomTabNavigator } from '@react-navigation/material-bottom-tabs';
import Request from './request';
import Discover from './discover';
import { AntDesign } from '@expo/vector-icons'; 
import styles from "./styles";

const Tab = createMaterialBottomTabNavigator();

export default function Index(props) {
  return (
         
        <Tab.Navigator 
            shifting={true}
            barStyle={{ backgroundColor: '#694fad' }}
            sceneAnimationEnabled={false}
            screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                let iconName;

                if (route.name === 'Request') {
                    iconName = focused ? 'home' : 'home';
                } else if (route.name === 'Discover') {
                    iconName = focused ? 'find' : 'find';
                }

                // You can return any component that you like here!
                return <AntDesign name={iconName} size={23} color={color} />;
                },
            })}
            tabBarOptions={{
                activeTintColor: '#0043ca',
                inactiveTintColor: 'gray',
            }}
        >
            <Tab.Screen name="Request" component={Request} />
            <Tab.Screen name="Discover" component={Discover} />
        </Tab.Navigator>
  );
}