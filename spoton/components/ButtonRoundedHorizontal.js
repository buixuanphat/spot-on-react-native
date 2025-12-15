import { Button } from "react-native-paper";
import Styles from "./Styles";
import { TouchableOpacity } from "react-native";

const ButtonRoundedHorizontal = ({ title, style, icon, onPress,loading }) => {
    return (
        <TouchableOpacity disabled={loading} >
            <Button loading={loading} onPress={onPress} icon={icon} uppercase='true' style={[Styles.buttonRoundedHorizontal, style]} textColor="white" labelStyle={{ fontSize: 18 }} >{title}</Button>
        </TouchableOpacity>

    );
}
export default ButtonRoundedHorizontal;