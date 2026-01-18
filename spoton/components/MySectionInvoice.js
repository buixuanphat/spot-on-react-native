import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Icon, Text, Divider } from "react-native-paper";



const MySectionInvoice = ({ section, amount }) => {



    return (
        <View style={styles.container}>

            <View style={styles.info}>
                <Text variant="bodyMedium" style={styles.name} >{section.name}</Text>
                <Text >{amount}</Text>
            </View>
            <View style={styles.info}>
                <Text numberOfLines={2} ellipsizeMode="tail" >{section.price.toLocaleString()}</Text>
                <Text >{(section.price * amount).toLocaleString()}</Text>
            </View>
            <Divider style={styles.divider} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        borderRadius: 16,
        marginHorizontal: 16,
        marginVertical: 8
    },
    info:
    {
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    divider:
    {
        marginVertical: 8
    },
    name:
    {
        flex: 1,
    }

});

export default MySectionInvoice;