import { FlatList, StyleSheet, Text } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import ItemRating from "../components/ItemRating"
import { Appbar } from "react-native-paper"
import { View } from "react-native"

const RatingDetails = ({ route }) => {
    return (
        <View style={styles.container} >
            <Appbar.Header style={{ backgroundColor: '#fff', elevation: 0 }}>
                <Appbar.Content title="Đánh giá" titleStyle={styles.headerTitle} />
            </Appbar.Header>
            {route.params.ratings &&
                <FlatList
                    data={route.params.ratings}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) =>
                        <ItemRating rating={item} />
                    }
                />
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        backgroundColor: 'white',
        flex: 1
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a'
    },
})

export default RatingDetails