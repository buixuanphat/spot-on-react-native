import Profile from "../screens/Profile";
import Home from "../screens/Home";
import MyTickets from "../screens/MyTickets";
import { Icon } from "react-native-paper";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import MyColor from "../MyColor";
import Posts from "../screens/Posts";

const Tab = createBottomTabNavigator()

const MainNav = () => {

    return (
        <Tab.Navigator screenOptions={{ headerShown: false }} >
            <Tab.Screen name="Home" component={Home} options={{ tabBarIcon: ({ color }) => <Icon color={color} source="home" size={24} /> }} />
            <Tab.Screen name="Tickets" component={MyTickets} options={{ tabBarIcon: ({ color }) => <Icon color={color} source="ticket-account" size={24} /> }} />
            <Tab.Screen name="Post" component={Posts} options={{ tabBarIcon: ({ color }) => <Icon color={color} source="newspaper-variant" size={24} /> }} />
            <Tab.Screen name="Profile" component={Profile} options={{ tabBarIcon: ({ color }) => <Icon color={color} source="account" size={24} /> }} />
        </Tab.Navigator>
    );
}
export default MainNav;