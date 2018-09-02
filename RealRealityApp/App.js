import React, { Component } from 'react';
import {StyleSheet, Text, View  } from 'react-native';

export default class RealReality extends Component {
  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      latitude: null,
      longitude: null,
      error: null,
    };
  }
  componentDidMount(){
    //return fetch('https://35.158.121.141/51.1987722/4.4234877')
    /*return fetch('https://facebook.github.io/react-native/movies.json')
      .then((response) => response.json())
      .then((responseJson) => {

        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){

        });

      })
      .catch((error) =>{
        console.error(error);
      });*/
      navigator.geolocation.getCurrentPosition(
      (position) => {
        this.setState({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          error: null,
        });
      },
      (error) => this.setState({ error: error.message }),
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 1000 },
    );
  }

  render(){

    /*if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }*/

    return(
      <View style={{flex: 1, paddingTop:20}}>
        <Text style={styles.title}>RealReality</Text>
        <Text>Latitude: {this.state.latitude}</Text>
        <Text>Longitude: {this.state.longitude}</Text>
       {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  title: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
