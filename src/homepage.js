import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {Card, Button , Title ,Paragraph } from 'react-native-paper'; 
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import storage from './storage';

export default function HomePage(){
  const [crypt, setCrypt] = useState([]);
  const [pending, setPending] = useState(true);

    const [favorite, setFavorite] = useState([]);

    const navigation = useNavigation();
  useEffect(()=>{
console.log("use effect home")
    fetch("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5&convert=USD&CMC_PRO_API_KEY=abd21725-e7b1-4b5a-a84c-4c4067692ebb")
    .then((res)=>{
      if(!res.ok){
        throw Error("could not fetch data !")
      }
      setPending(false)

      return res.json()
      
    }).then((convert)=>{
      setCrypt(convert.data)
      loadStorage(convert.data)

      navigation.addListener("focus",()=>{
        console.log("focus ")
     if(convert.data.length>0){
      setFavorite([])
      loadStorage(convert.data)
      } ;
      })
    })
    .catch(error =>{
      alert("Please check your internet "+error.message)
    })

   
  },[navigation])

  const addFav = (item) =>{
    var alreadyIn = false;
    favorite.map((i)=> {
        if(item.id==i.id){
          alreadyIn = true;
        }
    })
    if(!alreadyIn){
      setFavorite([...favorite, {id: item.id, name: item.name, symbol: item.symbol, price: item.quote.USD.price }])

    }
  }



  const onLongPress = (item) =>{
  navigation.navigate('Details', {id: item.id, name: item.name, price: item.quote.USD.price, symbol: item.symbol, slug: item.slug, rank: item.cmc_rank})
}

const loadStorage = (allCrypt) =>{
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

    if(
      ret.id.includes(",") ){

        const ids = ret.id.toString().split(", ")
        console.log("render 1")
         var list = [] 
          ids.map((item)=>{
        
            allCrypt.map((cry)=>{
              if(cry.id==item){

            list.push({id: cry.id, name: cry.name, symbol: cry.symbol, price: cry.quote.USD.price })
               
              }
            })
         
           


          })
               setFavorite(list)
    }else{
      allCrypt.map((cry)=>{
        if(cry.id==ret.id){

   setFavorite([...favorite, {id: ret.id, name: cry.name, symbol: cry.symbol, price: cry.quote.USD.price }])
        }
      })
    }
  
  })
}
if(pending){
  return <View style={styles.container}><Text  > Loading ...</Text></View>
}else{

}
  return (
    
     <View style={styles.container}><FlatList data={crypt} renderItem={({item})=>
<Card key={item.id} style={styles.column}   onLongPress={()=>onLongPress(item)} >
<Image  source={{uri: 'https://www.criptofacil.com/wp-content/uploads/2023/11/pouco-bitcoin-nas-exchanges-1536x806.jpg.webp'}}
  style={{width: 40, height: 40}}></Image>

<Text  > Name: {item.name} {item.symbol}</Text>

<Text  style={{fontSize: 10}}>Price: {item.quote.USD.price} </Text>
      </Card>
     
      }></FlatList>
<View  style={styles.row}>
      {favorite.map((fav)=> {
        return  <Card  key={fav.id} style={styles.column}> 
        
        <Image  source={{uri: 'https://www.criptofacil.com/wp-content/uploads/2023/11/pouco-bitcoin-nas-exchanges-1536x806.jpg.webp'}} style={{width: 20, height: 20}}></Image>  
        
        <Text > {fav.name} {fav.symbol}</Text>

<Text > {fav.price} </Text>
</Card>
      })}
      </View>
      <StatusBar style="auto" />
     
     
    
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
  

  