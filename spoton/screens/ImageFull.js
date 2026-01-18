import React from "react"
import { View, Image, FlatList, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"

const { width } = Dimensions.get("window")

const ImageFull = ({ route }) => {
    const images = route.params?.images || []

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "black" }}>
            <FlatList
                data={images}
                keyExtractor={(item, index) => index.toString()}
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                    <View style={{ width, flex: 1, justifyContent: "center" }}>
                        <Image
                            source={{ uri: item }}
                            style={{
                                width: "100%",
                                height: "100%",
                                resizeMode: "contain",
                            }}
                        />
                    </View>
                )}
            />
        </SafeAreaView>
    )
}

export default ImageFull
