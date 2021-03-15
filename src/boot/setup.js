import AppLoading from 'expo-app-loading';
import * as Font from 'expo-font';
import React, { Component } from "react";

import App from "../App";


export default class Setup extends Component {
  constructor() {
    super();
    this.state = {
      isReady: false
    };
  }
  componentDidMount() {
    this.loadFonts();
  }
  async loadFonts() {
    await Font.loadAsync({
      Roboto: require("native-base/Fonts/Roboto.ttf"),
      Roboto_medium: require("native-base/Fonts/Roboto_medium.ttf"),
      Entypo: require("native-base/Fonts/Entypo.ttf"),
      Feather: require("native-base/Fonts/Feather.ttf"),
      FontAwesome: require("native-base/Fonts/FontAwesome.ttf"),
      Octicons: require("native-base/Fonts/Octicons.ttf"),
    });
    this.setState({ isReady: true });

  }
  render() {
    if (!this.state.isReady) {
      return <AppLoading />;
    }
    return (
        <App />
    );
  }
}
