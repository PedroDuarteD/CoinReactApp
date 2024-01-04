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

    const [favorite, setFavorite] = useState([]);

    var mobile = true

    const navigation = useNavigation();



  useEffect(()=>{
    fetch(
      mobile? "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=10&convert=USD&CMC_PRO_API_KEY=abd21725-e7b1-4b5a-a84c-4c4067692ebb":
      "https://cryptocoinback.pedroduarte.online/api/data",{
    })
    .then((res)=>{
        if(!res.ok){
          throw Error("could not fetch data !")
        }
        return res.json()
      
     }).then(async (convert)=>{
     
 // clearCoins()

           //load all coin
      

           var list = []

           for(var globalIndex=0; globalIndex< convert.data.length; globalIndex++){

              var coin = convert.data[globalIndex]

            //Verify if is in storage
            var value = await AsyncStorage.getItem(coin.slug.toLowerCase());
            if (value!=null){
             const save = await loadCoins( coin.slug.toLowerCase())
           console.log("valor do storage: ",save)

           var url = await loadLogo(coin.id, coin.slug)

              list.push({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                price: coin.quote.USD.price.toString().substring(0,5),
                slug: coin.slug,
          url: url,
                rank: coin.cmc_rank,
                other: save.value

              })


            }else{
              console.log("save to storage: ",coin.name)
              saveCoins({name: coin.slug.toLowerCase(), value: coin.quote.USD.price.toString().substring(0,5)})
              var url = await loadLogo(coin.id, coin.slug)
              list.push({
                id: coin.id,
                name: coin.name,
                symbol: coin.symbol,
                price: coin.quote.USD.price.toString().substring(0,5),
                slug: coin.slug,
          url: url,
                rank: coin.cmc_rank,
                other: ""

              })
            }

           }



           setCrypt(
            list
        )

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
    key: c.name, 
    data: {
      value: c.value
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

const loadCoins = async (name) =>{

var save = "";
  await storage
  .load({
    key: name,
    autoSync: true,
    syncInBackground: true,
    syncParams: {
      extraFetchOptions: {
      },
      someFlag: true
    }
  })
  .then(async ret => {
  
    console.log("valor do storaeg   kkk ",ret)
   save = ret

   return ret

     
  }).catch(erro=>{
    console.log("error pe ",erro.message)
  })
  console.log("valor especifico storeage return ",save)
  return save
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
       .catch(erro=>{
        console.log("erro ",erro.message)
       })

       return url
}

const ChangeText = (e)=>{
  setSearch(e)
  console.log("tex: "+e)

  if(e==""){


    fetch(
      mobile? "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=10&convert=USD&CMC_PRO_API_KEY=abd21725-e7b1-4b5a-a84c-4c4067692ebb":
      "https://cryptocoinback.pedroduarte.online/api/data",{
    })
    .then((res)=>{
        if(!res.ok){
          throw Error("could not fetch data !")
        }
        return res.json()
      
     })
     .then(async json =>{

var list = []


for(var index=0; index <json.data.length; index++){
  var item = json.data[index]


const url = await loadLogo(item.id, item.slug)


var other=""
var value = await AsyncStorage.getItem(item.slug.toLowerCase());
if(value!=null){
other =  await loadCoins( item.slug.toLowerCase())
}

  list.push( {
    id: item.id,
        name: item.name,
        symbol: item.symbol,
        price: item.quote.USD.price.toString().substring(0,5),
        slug: item.slug,
  url: url,
        rank: item.cmc_rank,
       
        other: other.value})
}




    setCrypt(
      list
    )

     })
  }else{


    fetch(
      mobile? "https://pro-api.coinmarketcap.com/v1/cryptocurrency/listings/latest?start=1&limit=500&convert=USD&CMC_PRO_API_KEY=abd21725-e7b1-4b5a-a84c-4c4067692ebb":
      "https://cryptocoinback.pedroduarte.online/api/all",{
    })
    .then((res)=>{
        if(!res.ok){
          throw Error("could not fetch data !")
        }
        return res.json()
      
     })
     .then(async json =>{

var list = []


for(var index=0; index <json.data.length; index++){
  var item = json.data[index]

  if(item.slug.toString().includes(e.toLowerCase())){

const url = await loadLogo(item.id, item.slug)

var value = await AsyncStorage.getItem(item.slug.toLowerCase());
var other=""
if (value!=null){
  other = await loadCoins( item.slug.toLowerCase())
}
console.log("url: ",url)
  list.push( {
    id: item.id,
        name: item.name,
        symbol: item.symbol,
        price: item.quote.USD.price.toString().substring(0,5),
        slug: item.slug,
  url: url,
        rank: item.cmc_rank,
       
        other: other.value})
}
}




    setCrypt(
      list
    )

     })



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
             list.push({id: cry.id, name: cry.name,url: url, symbol: cry.symbol, price: cry.quote.USD.price.toString().substring(0,5), slug: cry.slug, rank: cry.cmc_rank })
         
               }
          }
         }

         setFavorite(list)

       
        
       
    }else{
  

for(var index=0; index <allCrypt.length; index++){
var item = allCrypt[index]
if(item.id==ret.id){
  const logo  = await loadLogo(item.id, item.slug)
  console.log("data pe: ",item)
  setFavorite([ {id: ret.id, name: item.name,url: logo, symbol: item.symbol, price: item.quote.USD.price.toString().substring(0,5), slug: item.slug, rank: item.cmc_rank }])

  }
}


    }
  
  })
}
if(pending ){
  return <View style={styles.container}><Text  > Loading ...</Text></View>
}else{





  return (
    
     <View style={styles.container}>
      <TextInput style={styles.input} placeholder='Coin' onChangeText={(e)=>ChangeText(e)} value={search}/>
    {crypt.length==0? <Text  > Sem Coins </Text>:<FlatList style={{height: 300, marginBottom: 10, marginTop: 10}} data={crypt} renderItem={({item}) =>{



        return <Card key={item.id} style={styles.row_card}   onPress={()=>onPress(item)} >


{item.url==""? <Text  > Sem Imagem </Text>: <Image  source={{uri: item.url}}
  style={{width: 40, height: 40}}></Image> }
 

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

     
      }></FlatList>}
      
<View  style={styles.row}>
      {favorite.map((fav)=> {
        return  <Card  key={fav.id} onPress={()=>onPress(fav)} style={{flex: 1, flexDirection: 'row', paddingLeft: 10}}> 
       {fav.url=""? <Text style={{fontSize: 10}}> Sem Image</Text> : <Image style={{paddingTop: 10,width: 30, height: 30}}  source={{uri: fav.url}}></Image>  } 
       
        
       <Text style={{fontSize: 10}}> {fav.name} {fav.symbol}</Text>

<Text style={{fontSize: 8}}> {fav.price.toString().substring(0,5)} </Text>
</Card>
      })}
      </View>
      <StatusBar style="auto" />
    </View> 
  );


  

}
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