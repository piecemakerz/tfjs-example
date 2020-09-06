import React, {Fragment} from 'react';
import {
  Button,
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
} from 'react-native';

import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';

import {RealtimeDemo} from './realtime_demo';

const BACKEND_TO_USE = 'rn-webgl';

export type Screen = 'main' | 'realtime';

interface AppState {
  isTfReady: boolean;
  currentScreen: Screen;
}

export default class App extends React.Component<{}, AppState> {
  constructor(props: {}) {
    super(props);
    this.state = {
      isTfReady: false,
      currentScreen: 'main',
    };

    this.showMainScreen = this.showMainScreen.bind(this);
    this.showRealtimeDemo = this.showRealtimeDemo.bind(this);
  }

  async componentDidMount() {
    await tf.setBackend(BACKEND_TO_USE);
    await tf.ready();
    this.setState({
      isTfReady: true,
    });
  }

  showMainScreen() {
    this.setState({currentScreen: 'main'});
  }

  showRealtimeDemo() {
    this.setState({currentScreen: 'realtime'});
  }

  renderMainScreen() {
    return (
      <Fragment>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Realtime Webcam Demo</Text>
          <Button
            onPress={this.showRealtimeDemo}
            title="Show Realtime Webcam Demo"
          />
        </View>
      </Fragment>
    );
  }

  renderRealtimeDemo() {
    return (
      <Fragment>
        <RealtimeDemo returnToMain={this.showMainScreen} />
      </Fragment>
    );
  }

  renderLoadingTF() {
    return (
      <Fragment>
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Loading TF</Text>
        </View>
      </Fragment>
    );
  }

  renderContent() {
    const {currentScreen, isTfReady} = this.state;
    if (isTfReady) {
      switch (currentScreen) {
        case 'main':
          return this.renderMainScreen();
        case 'realtime':
          return this.renderRealtimeDemo();
        default:
          return this.renderMainScreen();
      }
    } else {
      return this.renderLoadingTF();
    }
  }

  render() {
    return (
      <Fragment>
        <StatusBar barStyle="dark-content" />
        <SafeAreaView>
          <View style={styles.body}>{this.renderContent()}</View>
        </SafeAreaView>
      </Fragment>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: 'white',
  },
  body: {
    backgroundColor: 'white',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: 'black',
    marginBottom: 6,
  },
});
