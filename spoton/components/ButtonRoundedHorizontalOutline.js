import { Button } from "react-native-paper";
import MyColor from "../MyColor.js";
import { TouchableOpacity } from "react-native";
import MyStyles from "../MyStyles";

const ButtonRoundedHorizontalOutline = ({ title, style, icon, onPress, textColor }) => {
    return (
        <TouchableOpacity >
            <Button icon={icon} uppercase='true' style={style} textColor={textColor || MyColor.primary} labelStyle={{ fontSize: 18 }} onPress={onPress} >{title}</Button>
        </TouchableOpacity>
    );
}
export default ButtonRoundedHorizontalOutline;