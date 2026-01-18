import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Checkbox, Text, Card } from "react-native-paper";
import MyColor from "../MyColor";

const MyMerchandise = ({ merchandise, onChange }) => {

    const [checked, setChecked] = useState(false);
    const [isFirstRender, setIsFirstRender] = useState(true)

    const handlePress = () => {
        setChecked(!checked);
    };

    useEffect(() => {
        if (!isFirstRender) {
            if (checked === true) {
                onChange({ ...merchandise.merchandise, checked })
            }
            if (checked === false) {
                onChange({ ...merchandise.merchandise, checked })
            }
        }
    }, [checked])


    useEffect(() => {
        console.log(merchandise)
        if (isFirstRender) {
            setIsFirstRender(false)
            return
        }
    })


    return (
        <Card style={styles.card} onPress={handlePress}>
            <View style={styles.container}>
                <Image
                    source={{ uri: merchandise.merchandise.image }}
                    style={styles.image}
                />

                <View style={styles.infoContainer}>
                    <Text variant="titleMedium" numberOfLines={2} style={styles.name}>
                        {merchandise.merchandise.name}
                    </Text>
                    <Text variant="bodyLarge" style={styles.price}>
                        {merchandise.merchandise.price.toLocaleString()} VNĐ
                    </Text>
                </View>


                <View style={styles.checkboxContainer}>
                    <Checkbox
                        status={checked ? "checked" : "unchecked"}
                        onPress={handlePress}
                        color={MyColor.primary}
                    />
                </View>
            </View>
        </Card>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 16,
        marginVertical: 8,
        backgroundColor: "white",
        elevation: 2,
        borderRadius: 12,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 8,
        backgroundColor: MyColor.background
    },
    infoContainer: {
        flex: 1,
        marginLeft: 16,
        justifyContent: "center",
    },
    name: {
        fontWeight: "bold",
        marginBottom: 4,
    },
    price: {
        color: MyColor.redError,
        fontWeight: "600",
    },
    checkboxContainer: {
        marginLeft: 8,
    },
});

export default MyMerchandise;