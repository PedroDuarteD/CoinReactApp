import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {Card, Button , Title ,Paragraph } from 'react-native-paper'; 
import { FlatList, Image, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import storage from './storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomePage(){
  const [crypt, setCrypt] = useState([]);
  const [pending, setPending] = useState(true);

    const [favorite, setFavorite] = useState([]);

    const navigation = useNavigation();
  useEffect(()=>{
    fetch("https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=5&convert=USD&CMC_PRO_API_KEY=abd21725-e7b1-4b5a-a84c-4c4067692ebb")
    .then((res)=>{
      if(!res.ok){
        throw Error("could not fetch data !")
      }
      return res.json()
      
    }).then(async (convert)=>{
      
           //  clearCoins()


           //load all coin
        var convert_coins = []

  
        try{
          
          console.log("load coins 1")

            let value = await AsyncStorage.getItem('coins');
            if (value != null){
              loadCoins(convert.data)
            }
            else {
             
   convert.data.map((item)=>{
         convert_coins.push({value: item.quote.USD.price, name: item.name})
        })
          saveCoins(convert_coins)
  setCrypt(
convert.data.map((item)=>{
  return {
      id: 1,
      name: item.name,
      symbol: item.symbol,
      price: item.quote.USD.price.toString().substring(0,3),
      slug: item.slug,
      rank: item.cmc_rank,
      other: ""
    } 
}
  ))
           }


        }catch(erro){
          console.log("erro no catch ")
          
       
        }
        
        setFavorite([])
        loadStorage(convert.data)
      navigation.addListener("focus",()=>{
        console.log("focus ")
     if(convert.data.length>0){
      setFavorite([])
      loadStorage(convert.data)
      } ;
      })
    })
   
    .then(Item =>{
  setPending(false)

    })
   
    .catch(error =>{
      alert("Please check your internet "+error.message)
    })

   
  },[navigation])





  const onPress = (item) =>{
  navigation.navigate('Details', {id: item.id, name: item.name, price: item.price, symbol: item.symbol, slug: item.slug, rank: item.rank})
}


const saveCoins = (c) =>{
  storage.save({
    key: 'coins', 
    data: {
      BTC:  c[0].value,
      ETH:  c[1].value,
      USDT: c[2].value,
      BNB: c[3].value,
      SOL:  c[4].value,
    },
    expires: 5000 * 3600
  });

  
 
}

const clearCoins = async (c) =>{
 
  try {
    const allKeys = await AsyncStorage.getAllKeys(); // Get all keys from AsyncStorage
    await AsyncStorage.multiRemove(allKeys); // Remove all keys

    // Display a success message or perform any other actions
    console.log('All data deleted successfully!');
  } catch (error) {
    // Handle error
    console.log('Error deleting data:', error);
  }
 return c
}

const loadCoins = async (allCoins) =>{

  var erro = false;
  storage
  .load({
    key: 'coins',
    autoSync: true,
    syncInBackground: true,
    syncParams: {
      extraFetchOptions: {
      },
      someFlag: true
    }
  })
  .then(ret => {
  

    var data = [
      {
        symbol : "BTC",
        price: ret.BTC
      },
      {
        symbol : "ETH",
        price: ret.ETH
      },

      {
        symbol : "USDT",
        price: ret.USDT
      },

      {
        symbol : "BNB",
        price: ret.BNB
      },

      {
        symbol : "SOL",
        price: ret.SOL
      },
    ]


    var final = []
    console.log("leng crypt: "+allCoins.length)
    for(var coin =0; coin< allCoins.length; coin++){

      var cry = allCoins[coin]
      for(var old =0; old< data.length; old++){


        var older = data[old]

        if(cry.symbol == older.symbol){   
          console.log("entrou "+cry.symbol+" __ "+older.symbol)
            final.push( {  id: cry.id,
        name: cry.name,
        price: cry.quote.USD.price.toString().substring(0,3), 
        symbol: cry.symbol, 
        slug: cry.slug,
      rank: cry.cmc_rank,
        other: older.price.toString().substring(0,3)})
        }

   
      }
    }

    setCrypt(final)
     
  }).catch(erro=>{
    console.log("error")
    erro = true
  })

  return erro
}

const loadStorage = (allCrypt) =>{
  storage
  .load({
    key: 'favorite',
    autoSync: true,
    syncInBackground: true,
    syncParams: {
      extraFetchOptions: {
      },
      someFlag: true
    }
  })
  .then(ret => {
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

   setFavorite([ {id: ret.id, name: cry.name, symbol: cry.symbol, price: cry.quote.USD.price }])
        }
      })
    }
  
  })
}
if(pending ){
  return <View style={styles.container}><Text  > Loading ...</Text></View>
}else{

}
  return (
    
     <View style={styles.container}>
      <FlatList data={crypt} renderItem={({item})=>
<Card key={item.id} style={styles.row_card}   onPress={()=>onPress(item)} >


  <Image  source={{uri: 'https://www.criptofacil.com/wp-content/uploads/2023/11/pouco-bitcoin-nas-exchanges-1536x806.jpg.webp'}}
  style={{width: 40, height: 40}}></Image>

<View style={{flex: 1, flexDirection: 'column', border: ''}}>
<Text  > {item.name} </Text>
<View style={{flex: 1,flexDirection: 'row'}}>
<Text  style={{fontSize: 10}}> {item.symbol} </Text>
<Text  style={{fontSize: 10, color: (Number(item.price)>Number(item.other))?'green' :Number(item.price)==Number(item.other)? 'grey':'red'}}> {item.price} $  </Text>
<Text   style={{fontSize: 10, color: (Number(item.price)>Number(item.other))?'green'  :Number(item.price)==Number(item.other)? 'grey': 'red'}}>{(Number(item.price)>Number(item.other))?"↑" :(Number(item.price)<Number(item.other))? "↓" : "-"}   </Text>
{ item.other==""? <Text   style={{fontSize: 10}}> </Text>: <Text   style={{fontSize: 10}}>( {item.other} $ ) </Text>}

</View>




</View>
      </Card>
     
      }></FlatList>
<View  style={styles.row}>
      {favorite.map((fav)=> {
        return  <Card  key={fav.id} style={{flex: 1, flexDirection: 'row', paddingLeft: 10}}> 
        
        <Image  source={{uri: 'https://www.criptofacil.com/wp-content/uploads/2023/11/pouco-bitcoin-nas-exchanges-1536x806.jpg.webp'}} style={{width: 15, height: 15}}></Image>  
        
        <Text style={{fontSize: 8}}> {fav.name} {fav.symbol}</Text>

<Text style={{fontSize: 8}}> {fav.price} </Text>
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
      flexDirection: 'row',
    },
    column: {
      flex: 1,
      width: 300,
      padding: 5,
      marginTop: 5
    },
    row_card: {
      flex: 1,
      flexDirection: 'row',
      width: 300,
      padding: 5,
      marginTop: 5,
    },
  });
  

  