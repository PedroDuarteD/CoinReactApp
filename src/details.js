import * as React from 'react';
import { View, Text,StyleSheet, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { Button, Card } from 'react-native-paper';
import { Linking } from 'react-native';
import { ToastAndroid } from 'react-native';
import storage from './storage';

function AppDetails (){
const [allFavorite ,setAllFavorite] = React.useState("");


React.useEffect(()=>{
loadStorage()
},[])

  const openLink = () => {
    Linking.canOpenURL("https://www.criptofacil.com/wp-content/uploads/2023/11/pouco-bitcoin-nas-exchanges-1536x806.jpg.webp").then(supported => {
      if (supported) {
        Linking.openURL("https://www.criptofacil.com/wp-content/uploads/2023/11/pouco-bitcoin-nas-exchanges-1536x806.jpg.webp");
      } else {
        console.log("Don't know how to open URI: " + this.props.url);
      }
    });
  }
  const loadStorage = () =>{
    storage
    .load({
      key: 'favorite',
  
      // autoSync (default: true) means if data is not found or has expired,
      // then invoke the corresponding sync method
      autoSync: true,
  
      // syncInBackground (default: true) means if data expired,
      // return the outdated data first while invoking the sync method.
      // If syncInBackground is set to false, and there is expired data,
      // it will wait for the new data and return only after the sync completed.
      // (This, of course, is slower)
      syncInBackground: true,
  
      // you can pass extra params to the sync method
      // see sync example below
      syncParams: {
        extraFetchOptions: {
          // blahblah
        },
        someFlag: true
      }
    })
    .then(ret => {
      // found data go to then()
      console.log("details: storage: "+ret.id)
      setAllFavorite( ret.id) 
    })
    .catch(err => {
      // any exception including data not found
      // goes to catch()
      console.warn(err.message);
      switch (err.name) {
        case 'NotFoundError':
          // TODO;
          break;
        case 'ExpiredError':
          // TODO
          break;
      }
    });
  }

  const clear = (item) =>{
    storage.save({
      key: 'favorite', // Note: Do not use underscore("_") in key!
      data: {
        id: "",
      },
      // if expires not specified, the defaultExpires will be applied instead.
      // if set to null, then it will never expire.
      expires: 1000 * 3600
    });
  }
  const favorite = (item) =>{
    var save = true;

      if(allFavorite.includes(",")){

        var contador = 0
        allFavorite.split(", ").map((coin)=>{
          if(coin==item.id.toString()){
            save = false;
            
          }
          contador +=1
        })

        if(contador==4){
          save = false
        }

      }else if(allFavorite==item.id.toString()){
        save = false
      }
    

      if(!save && contador==4){
        ToastAndroid.show("Não podes adicionar mais !",ToastAndroid.SHORT)

      } else if(save){
        ToastAndroid.show("adicionado !",ToastAndroid.SHORT)
        storage.save({
      key: 'favorite', // Note: Do not use underscore("_") in key!
      data: {
        id: allFavorite==""? item.id.toString(): allFavorite+", "+item.id.toString(),
      },
      // if expires not specified, the defaultExpires will be applied instead.
      // if set to null, then it will never expire.
      expires: 1000 * 3600
    });
    }else{
      ToastAndroid.show("Error Já está nos favoritos ! ",ToastAndroid.SHORT)

    }
   
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
      <Button onPress={()=> favorite(args)}>Add Favorite</Button>
      <Button onPress={()=> clear()}>Clear</Button>
  
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