import React, { useEffect, useState } from "react";
import { Image, StyleSheet, View } from "react-native";
import { Checkbox, Text, Card } from "react-native-paper";
import MyColor from "../MyColor";

const MyMerchandiseInvoice = ({ merchandise }) => {

    return (
        <View style={styles.card}>
            <View style={styles.container}>
                <Image
                    source={{ uri: merchandise.image }}
                    style={styles.image}
                />
                <View style={styles.infoContainer}>
                    <Text variant="bodyMedium" numberOfLines={2} style={styles.name}>
                        {merchandise.name}
                    </Text>
                    <Text variant="bodyMedium" style={styles.price}>
                        {merchandise.price.toLocaleString()}
                    </Text>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        marginHorizontal: 8,
        marginVertical: 8,
        backgroundColor: "white",
        borderRadius: 16,
    },
    container: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
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
        marginBottom: 4,
    },
    price: {
        fontWeight: "600",
    },

});

export default MyMerchandiseInvoice;