import { Button, Icon } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import MyStyles from "../MyStyles";

const ButtonRoundedHorizontal = ({ title, style, icon, onPress, loading, disabled}) => {
    return (
        <TouchableOpacity >
            <Button disabled={disabled} loading={loading} onPress={onPress} icon={icon} uppercase='true' style={[MyStyles.buttonRoundedHorizontal, style]} textColor="white" labelStyle={{ fontSize: 18 }} >{title}</Button>
        </TouchableOpacity>

    );
}
export default ButtonRoundedHorizontal;