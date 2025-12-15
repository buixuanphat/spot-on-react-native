import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./screens/Login";
import Register from "./screens/Register";
import MainNav from "./navigations/MainNav";
import { useFonts } from "expo-font";
import Search from "./screens/Search";
import EventDetails from "./screens/EventDetails";

const Stack = createNativeStackNavigator();

export default function App() {
  const [fontsLoaded] = useFonts({
    'Montserrat-Medium': require('./assets/fonts/Montserrat-Medium.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <Stack.Navigator>
        {/* <Stack.Screen name='Login' component={Login} options={{title: "Đăng nhập"}}/>
        <Stack.Screen name="Register" component={Register} options={{title: "Đăng ký"}}/> */}
        <Stack.Screen name='Main' component={MainNav} options={{ headerShown: false }} />
        <Stack.Screen name='Search' component={Search} options={{ headerShown: false }} />
        <Stack.Screen name='Details' component={EventDetails} options={{ headerShown: false }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

