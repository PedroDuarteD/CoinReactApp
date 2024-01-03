import * as React from 'react';
import { View, Text,StyleSheet, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { Button, Card } from 'react-native-paper';
import { Linking } from 'react-native';

function AppDetails (){

  const openLink = () => {
    Linking.canOpenURL("https://www.criptofacil.com/wp-content/uploads/2023/11/pouco-bitcoin-nas-exchanges-1536x806.jpg.webp").then(supported => {
      if (supported) {
        Linking.openURL("https://www.criptofacil.com/wp-content/uploads/2023/11/pouco-bitcoin-nas-exchanges-1536x806.jpg.webp");
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  }

  const route = useRoute()

  const args = route.params


    return (
        <View style={styles.container}>
        
      <Image  source={{uri: 'https://www.criptofacil.com/wp-content/uploads/2023/11/pouco-bitcoin-nas-exchanges-1536x806.jpg.webp'}}
  style={{width: 40, height: 40}}></Image>
      <Text>{args.name}</Text>
      <Text>{args.symbol}</Text>
      <Text>{args.price}</Text>

      <Text onPress={openLink}>URL: </Text>
      <Text>{args.slug}</Text>
      <Text>Rank: {args.rank}</Text>
      <Button>Add Favorite</Button>
  
             </View>
    );
  }
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
    row: {
      flex: 1,
      flexDirection: 'row'
    },
    column: {
      flex: 1,
    },
  });
  
  export default AppDetails