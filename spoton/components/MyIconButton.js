import { Button, TouchableOpacity } from "react-native"
import { Icon, Text } from "react-native-paper"
import MyColor from "../MyColor"

const MyIconButton = ({ icon, onPress }) => {
    return (
        <TouchableOpacity style={{
            backgroundColor: MyColor.greyLight,
            padding: 8,
            borderRadius: 8,
            width: 'auto',
            justifyContent: 'center',
            alignItems: 'center'
        }}
            onPress={onPress}
        >
            <Icon size={16} source={icon} />
        </TouchableOpacity>
    )
}
export default MyIconButton