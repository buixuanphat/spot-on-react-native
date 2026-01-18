import { SafeAreaView } from "react-native-safe-area-context"
import WebView from "react-native-webview"

const Description = ({ route }) => {
    return (
        <SafeAreaView style={{ flex: 1, padding: 16, backgroundColor:'white' }}>
            <WebView
                source={{
                    html: route.params.source
                }}
            />
        </SafeAreaView>
    )
}
export default Description