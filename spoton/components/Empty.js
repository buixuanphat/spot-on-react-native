import { StyleSheet, View } from "react-native"
import { Text } from "react-native-paper"
import MyColor from "../MyColor"


const Empty = () => {
    return (
        <View style={style.container}>
            <Text style={style.text} variant="bodyMedium" >Không tìm thấy dữ liệu</Text>
        </View>
    )
}

const style = StyleSheet.create({
    container:
    {
        backgroundColor: MyColor.red50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 16,
        margin: 16
    },
    text:
    {
        color: MyColor.redError
    }
})

export default Empty