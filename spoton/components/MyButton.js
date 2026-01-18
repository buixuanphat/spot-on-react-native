import { Button, Text, TouchableHighlight, TouchableOpacity, color, textColor, icon } from "react-native"
import { Icon } from "react-native-paper"
import MyColor from "../MyColor"

const MyButton = ({ title, onPress, icon }) => {
    return (
        <TouchableOpacity onPress={onPress} style={{ flexDirection: 'row', borderRadius: 8, padding: 6, backgroundColor: 'white', borderWidth: 1, borderColor: MyColor.primary, gap: 4, justifyContent:'center', alignItems:'center' }}>
            <Icon size={24} color={textColor || MyColor.primary} source={icon} />
            <Text style={{ color: textColor || MyColor.primary, fontWeight: 700, fontSize: 14 }}>{title.toUpperCase()}</Text>
        </TouchableOpacity >

    )
}

export default MyButton
