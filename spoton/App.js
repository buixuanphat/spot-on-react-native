import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { NavigationContainer } from "@react-navigation/native";
import Login from "./screens/Login";
import Register from "./screens/Register";
import MainNav from "./navigations/MainNav";
import Search from "./screens/Search";
import EventDetails from "./screens/EventDetails";
import { MyUserContext } from "./MyContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useEffect, useReducer } from "react";
import MyUserReducer from "./reducers/MyUserReducer";
import Order from "./screens/Order";
import Merchandise from "./screens/Merchandise";
import Ticket from "./screens/Ticket";
import CreatePost from "./screens/CreatePost";
import ImageFull from "./screens/ImageFull";
import UpdateUser from "./screens/UpdateUser";
import CheckIn from "./screens/CheckIn";
import RatingEvent from "./screens/RatingEvent";
import RatingDetails from "./screens/RatingDetails";
import OrganizerEvent from "./screens/OrganizerEvent";
import Stats from "./screens/Stats";
import { PaperProvider } from "react-native-paper";
import History from "./screens/History";
import Description from "./screens/Description";
import ScanQRCode from "./screens/ScanQRCode";

const Stack = createNativeStackNavigator();

export default function App() {
  const [info, dispatch] = useReducer(MyUserReducer, {
    token: null,
    user: null,
  });

  useEffect(() => {
    const loadStorage = async () => {
      const token = await AsyncStorage.getItem("token");
      const userStr = await AsyncStorage.getItem("user");

      if (token && userStr) {
        dispatch({
          type: "login",
          payload: {
            token,
            user: JSON.parse(userStr),
          },
        });
      }
    };

    loadStorage();
  }, []);

  return (
    <MyUserContext.Provider value={[info, dispatch]}>
      <PaperProvider>
        <NavigationContainer>
          <Stack.Navigator>
            {info.token ? (
              <>
                <Stack.Screen name="Main" component={MainNav} options={{ headerShown: false }} />
                <Stack.Screen name="Search" component={Search} options={{ headerShown: false }} />
                <Stack.Screen name="Details" component={EventDetails} options={{ headerShown: false }} />
                <Stack.Screen name="Order" component={Order} options={{ headerShown: false }} />
                <Stack.Screen name="Merchandise" component={Merchandise} options={{ headerShown: false }} />
                <Stack.Screen name="Ticket" component={Ticket} options={{ headerShown: false }} />
                <Stack.Screen name="CreatePost" component={CreatePost} options={{ headerShown: false }} />
                <Stack.Screen name="Image" component={ImageFull} options={{ headerShown: false }} />
                <Stack.Screen name="Update" component={UpdateUser} options={{ headerShown: false }} />
                <Stack.Screen name="CheckIn" component={CheckIn} options={{ headerShown: false }} />
                <Stack.Screen name="Rating" component={RatingEvent} options={{ headerShown: false }} />
                <Stack.Screen name="RatingDetails" component={RatingDetails} options={{ headerShown: false }} />
                <Stack.Screen name="OrganizerEvent" component={OrganizerEvent} options={{ headerShown: false }} />
                <Stack.Screen name="Stats" component={Stats} options={{ headerShown: false }} />
                <Stack.Screen name="History" component={History} options={{ headerShown: false }} />
                <Stack.Screen name="Description" component={Description} options={{ headerShown: false }} />
                <Stack.Screen name="Scan" component={ScanQRCode} options={{ headerShown: false }} />
              </>
            ) : (
              <>
                <Stack.Screen name="Login" component={Login} />
                <Stack.Screen name="Register" component={Register} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </MyUserContext.Provider>
  );
}
