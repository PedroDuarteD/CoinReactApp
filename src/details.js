import * as React from 'react';
import { View, Text,StyleSheet, Image } from 'react-native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer, useRoute } from '@react-navigation/native';
import { Button, Card } from 'react-native-paper';
import { Linking } from 'react-native';
import storage from './storage';

function AppDetails (){
const [allFavorite ,setAllFavorite] = React.useState("");

const route = useRoute()

  const args = route.params
React.useEffect(()=>{
loadStorage()
},[])

  const openLink = () => {
    Linking.canOpenURL(args.url).then(supported => {
      if (supported) {
        Linking.openURL(args.url);
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
      setAllFavorite( ret.id) 
    })
  
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

       
        allFavorite.split(", ").map((coin)=>{
          if(coin==item.id.toString()){
            save = false;
            
          }
        
        })

       

      }else if(allFavorite==item.id.toString()){
        save = false
      }
    

    if(save){
       alert("adicionado !")
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
     alert("Error","Já tens favoritos ! ")

    }
   
  }
  


    return (
        <View style={styles.container}>
        
      <Image  source={{uri: args.url}}
  style={{width: 40, height: 40}}></Image>
      <Text>{args.name} - {args.symbol}</Text>
      <Text>( {args.price} $ )</Text>

      <Button onPress={openLink}>Open image</Button>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text>Slug: </Text>
      <Text>{args.slug}</Text>
      </View>

      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
      <Text>Rank: </Text>
      <Text>{args.rank}</Text>
      </View>
     
      <Button onPress={()=> favorite(args)}>Add Favorite</Button>
      <Button onPress={()=> clear()}>Clear all favorites</Button>
  
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