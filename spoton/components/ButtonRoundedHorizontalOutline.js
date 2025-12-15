import { Button } from "react-native-paper";
import MyColor from "../utils/Color";
import Styles from "./Styles";
import { TouchableOpacity } from "react-native";

const ButtonRoundedHorizontalOutline = ({ title, style, icon, onPress }) => {
    return (
        <TouchableOpacity >
            <Button icon={icon} uppercase='true' style={[Styles.buttonRoundedHorizontalOutline, style]} textColor={MyColor.primary} labelStyle={{ fontSize: 18 }} onPress={onPress} >{title}</Button>
        </TouchableOpacity>
    );
}
export default ButtonRoundedHorizontalOutline;