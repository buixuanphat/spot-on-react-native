import { ActivityIndicator } from "react-native-paper"
import MyColor from "../MyColor"

const MyIndicator = () => {
    return (
        <ActivityIndicator size='large' animating color={MyColor.primary} />
    )
}
export default MyIndicator