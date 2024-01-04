import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import {Card, Button , Title ,Paragraph } from 'react-native-paper'; 
import { FlatList, Image, StyleSheet, Text, View, TextInput } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import storage from './storage';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function HomePage(){
  const [crypt, setCrypt] = useState([]);
  const [pending, setPending] = useState(true);
  const [search, setSearch] = useState("");
  const [nocoin, setNoCoin] = useState(true);

    const [favorite, setFavorite] = useState([]);


    const navigation = useNavigation();
  useEffect(()=>{
    fetch("https://cryptocoinback.pedroduarte.online/api/data",{
    })
    .then((res)=>{
        if(!res.ok){
          throw Error("could not fetch data !")
        }
        return res.json()
      
     }).then(async (convert)=>{
      console.log("consola ",convert)


           //load all coin
        var convert_coins = []

  
        try{
          
          console.log("load coins 1")

            let value = await AsyncStorage.getItem('coins');
            if (value!=null){
              console.log("um dois")
              loadCoins(convert.data)
            }
            else {
             
   convert.data.map((item)=>{
         convert_coins.push({value: item.quote.USD.price, name: item.name})
        })
          saveCoins(convert_coins)


const cr =convert.data.map((item)=>{

  return {
      id: item.id,
      name: item.name,
      symbol: item.symbol,
      price: item.quote.USD.price.toString().substring(0,3),
      slug: item.slug,
      rank: item.cmc_rank,
      url: "",
      visible: true,
      other: ""
    } 
}
  )

  for(var index=0; index< cr.length; index++){
    var c =  cr[index]
   const url = await loadLogo(c.id, c.slug)
   c.url = url;
  }

  setCrypt(
    cr
)
           }


        }catch(erro){
             clearCoins()

          console.log("erro no catch ",erro.message)
          console.log("erro no catch ",convert)
          convert.data.map((item)=>{
            convert_coins.push({value: item.quote.USD.price, name: item.name})
           })
             //saveCoins(convert_coins)
     setCrypt(
   convert.data.map((item)=>{
     return {
         id: item.id,
         name: item.name,
         symbol: item.symbol,
         price: item.quote.USD.price.toString().substring(0,3),
         slug: item.slug,
         rank: item.cmc_rank,
         visible: true,
         other: ""
       } 
   }
     ))
       
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
  navigation.navigate('Details', {id: item.id, name: item.name, price: item.price, symbol: item.symbol, slug: item.slug, rank: item.rank, url: item.url})
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
  .then(async ret => {
  

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
          const url = await loadLogo(cry.id,cry.slug)
          console.log("entrou "+cry.symbol+" __ "+older.symbol)
            final.push( {  id: cry.id,
        name: cry.name,
        price: cry.quote.USD.price.toString().substring(0,3), 
        symbol: cry.symbol, 
      visible: true,
      url: url,
        slug: cry.slug,
      rank: cry.cmc_rank,
        other: older.price.toString().substring(0,3)})
        }

   
      }
    }

    setCrypt(final)
     
  }).catch(erro=>{
    console.log("error pe ",erro.message)
    erro = true
  })

  return erro
}

async function loadLogo  (id,slug) {
  var url = "";
     await fetch("https://cryptocoinback.pedroduarte.online/api/logo?slug="+slug,{
      })
      .then((res)=>{
          return res.json()
       })
       .then(item=>{
        url=item.data[id].logo
       })

       return url
}

const ChangeText = (e)=>{
  setSearch(e)
  console.log("tex: "+e)

  if(e==""){
    setNoCoin(true)
    setCrypt(crypt.map(item =>{
 return {
  id: item.id,
      name: item.name,
      symbol: item.symbol,
      price: item.price,
      slug: item.slug,
      rank: item.rank,
      url: item.url,
      visible: true,
      other: item.other}
}))
  }else{

var no = false
    setCrypt(
     crypt.map(item =>{
    if(item.slug.toString().includes(e.toLowerCase())){
      no = true
      return {
        id: item.id,
            name: item.name,
            symbol: item.symbol,
            price: item.price,
            slug: item.slug,
      url: item.url,
            rank: item.rank,
            visible: true,
            other: item.other}
    }else{
      return {
        id: item.id,
            name: item.name,
            symbol: item.symbol,
            price: item.price,
            slug: item.slug,
            rank: item.rank,
            visible: false,
      url: item.url,
            other: item.other}
    }
  }))

  setNoCoin(no)
  }

 

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
  .then(async ret => {
    if(
      ret.id.includes(",") ){

        const ids = ret.id.toString().split(", ")
        console.log("render 1")
         var list = [] 


         for(var index_ids=0; index_ids <ids.length; index_ids++){
          for(var index_crypt=0; index_crypt <allCrypt.length; index_crypt++){

            var cry = allCrypt[index_crypt]

            var item = ids[index_ids]

            if(cry.id==item){
              const url =   await loadLogo(cry.id, cry.slug)
             list.push({id: cry.id, name: cry.name,url: url, symbol: cry.symbol, price: cry.quote.USD.price })
         
               }
          }
         }

         setFavorite(list)

       
        
       
    }else{
  

for(var index=0; index <allCrypt.length; index++){
var item = allCrypt[index]
if(item.id==ret.id){
  const logo  = await loadLogo(item.id, item.slug)
  setFavorite([ {id: ret.id, name: item.name,url: logo, symbol: item.symbol, price: item.quote.USD.price }])

  }
}


    }
  
  })
}
if(pending ){
  return <View style={styles.container}><Text  > Loading ...</Text></View>
}else{

}




  return (
    
     <View style={styles.container}>
      <TextInput style={styles.input} placeholder='Coin' onChangeText={(e)=>ChangeText(e)} value={search}/>
    {!nocoin? <Text  > Sem Coins </Text>:<FlatList style={{height: 300, marginBottom: 10, marginTop: 10}} data={crypt} renderItem={({item}) =>{

if(item.visible){


        return <Card key={item.id} style={styles.row_card}   onPress={()=>onPress(item)} >


  <Image  source={{uri: item.url}}
  style={{width: 40, height: 40}}></Image>

<View style={{flex: 1, flexDirection: 'column'}}>
<Text  > {item.name} </Text>
<View style={{flex: 1,flexDirection: 'row'}}>
<Text  style={{fontSize: 10}}> {item.symbol} </Text>
<Text  style={{fontSize: 10, color: (Number(item.price)>Number(item.other))?'green' :Number(item.price)==Number(item.other)? 'grey':'red'}}> {item.price} $  </Text>
<Text   style={{fontSize: 10, color: (Number(item.price)>Number(item.other))?'green'  :Number(item.price)==Number(item.other)? 'grey': 'red'}}>{(Number(item.price)>Number(item.other))?"↑" :(Number(item.price)<Number(item.other))? "↓" : "-"}   </Text>
{ item.other==""? <Text   style={{fontSize: 10}}> </Text>: <Text   style={{fontSize: 10}}>( {item.other} $ ) </Text>}

</View>




</View>
      </Card>
   }
    }

     
      }></FlatList>}
      
<View  style={styles.row}>
      {favorite.map((fav)=> {
        return  <Card  key={fav.id} style={{flex: 1, flexDirection: 'row', paddingLeft: 10}}> 
        
        <Image style={{paddingTop: 10,width: 30, height: 30}}  source={{uri: fav.url}}></Image>  
        
        <Text style={{fontSize: 10}}> {fav.name} {fav.symbol}</Text>

<Text style={{fontSize: 8}}> {fav.price.toString().substring(0,3)} </Text>
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
      paddingTop: 10,
      height: 100
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
    input: {
      height: 40,
      width: 300,
      borderWidth: 1,
      padding: 10,
      borderRadius: 5,
      marginTop: 10
    }
  });
  

  