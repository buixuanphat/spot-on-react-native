import { createNativeBottomTabNavigator } from "@react-navigation/bottom-tabs/unstable";
import Profile from "../screens/Profile";
import Home from "../screens/Home";
import Tickets from "../screens/Tickets";

const Tab = createNativeBottomTabNavigator();

const MainNav = () => {

    return (
        <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} />
            <Tab.Screen name="Tickets" component={Tickets} />
            <Tab.Screen name="Profile" component={Profile} />
        </Tab.Navigator>
    );
}
export default MainNav;