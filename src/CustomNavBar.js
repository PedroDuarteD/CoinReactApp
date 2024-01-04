import { Appbar, Menu } from "react-native-paper"

export default function CustomNavBar ({navigation,back}){
    return (
        <Appbar.Header>
              {back ? <Appbar.BackAction onPress={navigation.goBack} /> : null}
             <Appbar.Content title={back? 'Detail':'Coins'} />

           {back? <Menu.Item onPress={() => {console.log('Option 1 was pressed ',)}} title="Favorite"  /> : null} 

        </Appbar.Header>
    )
}