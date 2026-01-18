import React from "react"
import { View, Image, StyleSheet, Dimensions, Text, TouchableOpacity, Pressable } from "react-native"
import MyColor from "../MyColor"
import { useNavigation } from "@react-navigation/native"

const screenWidth = Dimensions.get("window").width

const ImageGrid = ({ images }) => {

    const navigation = useNavigation()

    if (!images || images.length === 0) return null

    if (images.length === 1) {
        return (
            <Pressable onPress={() => navigation.navigate('Image', {
                images: images
            })}>
                <Image
                    source={{ uri: images[0] }}
                    style={styles.single}
                />
            </Pressable>

        )
    }

    if (images.length === 2) {
        return (
            <Pressable onPress={() => navigation.navigate('Image', {
                images: images
            })}>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={{ uri: images[0] }}
                        style={styles.double}
                    />
                    <Image
                        source={{ uri: images[1] }}
                        style={styles.double}
                    />
                </View>
            </Pressable >

        )
    }


    if (images.length === 3) {
        return (
            <Pressable onPress={() => navigation.navigate('Image', {
                images: images
            })}>
                <View style={{ flexDirection: 'row', width: '100%' }}>
                    <Image
                        source={{ uri: images[0] }}
                        style={{ width: '50%', aspectRatio: 1 / 2 }}
                    />

                    <View style={{ flex: 1, flexDirection: 'column' }}>
                        <Image
                            source={{ uri: images[1] }}
                            style={{ flex: 1, width: '100%' }}
                        />
                        <Image
                            source={{ uri: images[2] }}
                            style={{ flex: 1, width: '100%' }}
                        />
                    </View>
                </View>
            </Pressable>
        )
    }


    if (images.length === 4) {
        return (
            <Pressable onPress={() => navigation.navigate('Image', {
                images: images
            })}>
                <View>
                    <View style={{ flexDirection: 'row' }} >
                        <Image
                            source={{ uri: images[0] }}
                            style={styles.double}
                        />
                        <Image
                            source={{ uri: images[1] }}
                            style={styles.double}
                        />
                    </View>
                    <View style={{ flexDirection: 'row' }} >
                        <Image
                            source={{ uri: images[2] }}
                            style={styles.double}
                        />
                        <Image
                            source={{ uri: images[3] }}
                            style={styles.double}
                        />
                    </View>
                </View>
            </Pressable>
        )
    }

    return (
        <Pressable onPress={() => navigation.navigate('Image', {
            images: images
        })}>
            <View>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={{ uri: images[0] }}
                        style={styles.double}
                    />
                    <Image
                        source={{ uri: images[1] }}
                        style={styles.double}
                    />
                </View>
                <View style={{ flexDirection: 'row' }}>
                    <Image
                        source={{ uri: images[2] }}
                        style={styles.double}
                    />
                    <View style={{ width: '50%' }} >
                        <Image
                            source={{ uri: images[3] }}
                            style={{ width: '100%', aspectRatio: 1 / 1 }}
                        />
                        <View style={{
                            position: 'absolute',
                            backgroundColor: MyColor.black50,
                            width: '100%', height: '100%',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}>
                            <Text style={{ fontSize: 40, color: 'white' }} >+{images.length - 4}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </Pressable>
    )
}

const styles = StyleSheet.create({
    single: {
        width: "100%",
        aspectRatio: 1 / 1,
    },
    double:
    {
        width: '50%',
        aspectRatio: 1 / 1
    },
    triple:
    {
        width: '50%',
        aspectRatio: 1 / 2
    }
})


export default ImageGrid
