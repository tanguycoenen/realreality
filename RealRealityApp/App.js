import React, { Component } from 'react';
import {
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Text,
  KeyboardAvoidingView,
  View,
} from 'react-native';
import { Permissions, Notifications } from 'expo';

export default class RealReality extends Component {

  constructor(props){
    super(props);
    this.state = {
      isLoading: true,
      latitude: null,
      longitude: null,
      error: null,
      token: null,
      notification: null,
      title: 'RealReality',
      body: 'Im feeling so reeeaaaaaal....!',
    };
  }

  async registerForPushNotifications() {
    const { status } = await Permissions.getAsync(Permissions.NOTIFICATIONS);

    if (status !== 'granted') {
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      if (status !== 'granted') {
        return;
      }
    }

    const token = await Notifications.getExpoPushTokenAsync();

    this.subscription = Notifications.addListener(this.handleNotification);
    console.log(token);
    this.setState({
      token,
    });
  }

  sendDelayedPushNotification(token = this.state.token, title = this.state.title, body = this.state.body) {
   setTimeout(function () {
     //return function() { this.sendPushNotification();}
     return fetch('https://exp.host/--/api/v2/push/send', {
       body: JSON.stringify({
         to: token,
         title: title,
         body: body,
         data: { message: `${title} - ${body}` },
       }),
       headers: {
         'Content-Type': 'application/json',
       },
       method: 'POST',
     });
     console.log("****");
   }, 5000);
  }

  sendPushNotification(token = this.state.token, title = this.state.title, body = this.state.body) {
    console.log("Sending notification");
    return fetch('https://exp.host/--/api/v2/push/send', {
      body: JSON.stringify({
        to: token,
        title: title,
        body: body,
        data: { message: `${title} - ${body}` },
      }),
      headers: {
        'Content-Type': 'application/json',
      },
      method: 'POST',
    });
  }

  componentDidMount(){
     fetch('https://realreality.be/json/51.1987722/4.4234877')
      .then(
        (response) => {
          response.json();
          console.log(response.json());
        }
      )
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson,
        }, function(){
          console.log(responseJson);
        });

      })
      .catch((error) =>{
        console.error(error);
      });

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

  handleNotification = notification => {
    console.log('Handling notification');
    this.setState({
      notification,
    });
  };

  render(){

    /*if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      )
    }*/

    return(

       <KeyboardAvoidingView style={styles.container} behavior="padding">
               <Text >RealReality</Text>
               <Text>Latitude: {this.state.latitude}</Text>
               <Text>Longitude: {this.state.longitude}</Text>
               {this.state.error ? <Text>Error: {this.state.error}</Text> : null}
               <TouchableOpacity
                 onPress={() => this.registerForPushNotifications()}
                 style={styles.touchable}>
                 <Text>Register me for notifications!</Text>
               </TouchableOpacity>
               <TouchableOpacity onPress={() => this.sendDelayedPushNotification()} style={styles.touchable}>
                 <Text>Send me a notification!</Text>
               </TouchableOpacity>
               {this.state.token ? (
                 <View>
                   <Text style={styles.text}>Token</Text>
                   <TextInput
                     style={styles.input}
                     onChangeText={token => this.setState({ token })}
                     value={this.state.token}
                   />
                   <FlatList
                    data={this.state.dataSource}
                    renderItem={({item}) => <Text>{item.title}, {item.releaseYear}</Text>}
                    keyExtractor={({id}, index) => id}
                   />
                 </View>
               ) : null}
               {this.state.notification ? (
                 <View>
                   <Text style={styles.text}>Last Notification:</Text>
                   <Text style={styles.text}>{JSON.stringify(this.state.notification.data.message)}</Text>
                 </View>
               ) : null}
         </KeyboardAvoidingView>

    );
  }
}
const styles = StyleSheet.create({
  title: {
    backgroundColor: '#0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    padding: 8,
  },
  text: {
    backgroundColor: '#0f0',
    paddingBottom: 2,
    padding: 8,
  },
  container: {
    backgroundColor: '#0f0',
    flex: 1,
    paddingTop: 40,
  },
  touchable: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderRadius: 4,
    margin: 8,
    padding: 8,
    width: '95%',
  },
  input: {
    height: 40,
    borderWidth: 1,
    margin: 8,
    padding: 8,
    width: '95%',
  },
});
