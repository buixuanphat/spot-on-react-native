import { Text, TouchableOpacity, View } from "react-native"
import { Icon } from "react-native-paper"
import MyColor from "../MyColor"

const MyChip = ({ label, showIcon, onRemove, icon, startIcon, startIconColor, onSelect }) => {
    return (
        <View style={{ gap: 4, paddingVertical: 4, paddingHorizontal: 10, marginVertical: 8, marginHorizontal: 4, backgroundColor: 'white', borderRadius: 50, flexDirection: 'row', alignSelf: 'flex-start' }} >
            {startIcon && <TouchableOpacity  ><Icon size={24} source={startIcon} color={startIconColor} /></TouchableOpacity>}
            <Text onPress={() => onSelect && onSelect(label)} style={{ fontSize: 18, fontWeight: 500 }} >{label}</Text>
            {showIcon && <TouchableOpacity onPress={onRemove} ><Icon size={24} source={icon} color={MyColor.red} /></TouchableOpacity>}
        </View>
    )
}
export default MyChip