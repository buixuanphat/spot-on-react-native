import { View } from "react-native"
import { Text } from "react-native-paper"
import MyColor from "../MyColor"

const GreyBackGroundText = ({ value , textStyle }) => {
    return (
        <View style={{
            backgroundColor: MyColor.greyLight,
            padding: 6,
            borderRadius: 8,
            width: 'auto'
        }}>
            <Text style={textStyle} >{value}</Text>
        </View>
    )
}
export default GreyBackGroundText