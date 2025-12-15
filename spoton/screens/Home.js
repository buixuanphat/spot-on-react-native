import { Image, Text, TouchableOpacity, View } from "react-native";
import { Icon, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from '../assets/spoton_logo.png'
import Styles from '../components/Styles'
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const Home = ({navigation}) => {
    
    return (
        <SafeAreaView style={Styles.container} >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between'}} >
                <Image style={{ width: 180, height: 100 }} source={logo} />
                <TouchableOpacity 
                style={{ alignSelf: 'center', marginRight: 16, marginBottom:8 }}
                onPress={()=>navigation.getParent()?.navigate('Search')}>
                    <Icon size={36} source='magnify' />
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
}
export default Home;