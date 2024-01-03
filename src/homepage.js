import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {Card, Button , Title ,Paragraph } from 'react-native-paper'; 
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';

export default function HomePage(){
    const [crypt, setCrypt] = useState([]);

    const [favorite, setFavorite] = useState([]);

    const navigation = useNavigation();
  useEffect(()=>{

    fetch("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5&convert=USD&CMC_PRO_API_KEY=abd21725-e7b1-4b5a-a84c-4c4067692ebb")
    .then((res)=>{
      return res.json()
      
    }).then((convert)=>{
      console.log("converted")
      setCrypt(convert.data)
    })
  },[])

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


  return (
    <View style={styles.container}>
     <FlatList data={crypt} renderItem={({item})=>
<Card key={item.id} style={styles.column}   onLongPress={()=>onLongPress(item)} >
<Image  source={{uri: 'https://www.criptofacil.com/wp-content/uploads/2023/11/pouco-bitcoin-nas-exchanges-1536x806.jpg.webp'}}
  style={{width: 40, height: 40}}></Image>

<Text  >id: {item.id} Name: {item.name} </Text>

<Text >Symbol: {item.symbol} Price: {item.quote.USD.price}</Text>
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
  

  