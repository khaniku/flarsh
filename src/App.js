import React from 'react';
import { StyleSheet, Text, View, AsyncStorage, ActivityIndicator } from 'react-native';
import LoginScreen from './screens/auth/login';
import Discover from './screens/dashboard/discover';
import Request from './screens/dashboard/request';
import Map from './screens/dashboard';
import Main from './screens/home';
import { createStackNavigator, TransitionPresets } from '@react-navigation/stack';
import { Root } from "native-base";
import FlashMessage from "react-native-flash-message";
import { Provider as PaperProvider , DarkTheme as PaperDarkTheme} from 'react-native-paper';
import { NavigationContainer, useLinking } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from "redux";
import thunk from 'redux-thunk';
import reducers from "./reducers";
import { persistStore, persistReducer } from "redux-persist";
import { PersistGate } from "redux-persist/integration/react";
import { Asset } from 'expo-asset';

Asset;
const Stack = createStackNavigator();

function AuthStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" options={{
        headerShown: false,
        }}
        component={LoginScreen} 
      />
    </Stack.Navigator>
  );
}

function Home() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Home"  options={{
                headerShown: false,
                }}
                screenOptions={{
                    headerShown: false,
                    gestureEnabled: true,
                    cardOverlayEnabled: true,
                    ...TransitionPresets.ModalPresentationIOS,
                  }}
                  mode="modal"
                component={Map} 
            />
            <Stack.Screen name="Login" options={{
                headerShown: false,
                }}
                component={LoginScreen} 
            />
    </Stack.Navigator>
    )
}

function renderLoading() {
  return(
    <View
      style={{
        flex: 1,
        padding: 20,
        alignContent: 'center',
        justifyContent: 'center',

      }}>
      <ActivityIndicator size="large" color="#1275bc" />
    </View>
  )
}

const persistConfig = {
  key: "root", // name of the key for storing the data
  storage: AsyncStorage // storage to use. defaults to AsyncStorage
};
const persistedReducer = persistReducer(persistConfig, reducers);
const store = createStore(persistedReducer, applyMiddleware(thunk));
let persistor = persistStore(store);

export default function App() {

  return (
    <Provider store={store}>
      <PersistGate loading={renderLoading()} persistor={persistor}>
        <Root>
          {/* <StatusBar barStyle="dark-content" hidden={true}  /> */}
          <PaperProvider>
            <NavigationContainer>
              <Main />
              <FlashMessage position="top" /> 
            </NavigationContainer>
          </PaperProvider>
        </Root>
      </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
