import React from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Text } from "react-native-paper";
import { MyStatus } from "../utils/Enum";
import MyColor from "../MyColor";

const EventItem = ({ event, onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={style.container}>
            <Card style={style.card}>
                <Image
                    source={typeof event.image === 'string' ? { uri: event.image } : event.image}
                    style={style.image}
                    resizeMode="cover"
                />

                {event.status == MyStatus.expired &&
                    <View style={{ marginHorizontal: 16, marginTop: 8, backgroundColor: MyColor.red, padding: 4, width: 100, borderRadius: 50, alignItems: 'center' }}>
                        <Text style={{ color: 'white', fontWeight: 700 }} >Đã kết thúc</Text>
                    </View>
                }

                <View style={style.content}>
                    <Text variant="titleMedium" style={style.title} numberOfLines={1}>
                        {event.name}
                    </Text>

                    <Text variant="bodySmall" style={style.subtitle}>
                        {event.date}, {event.province}
                    </Text>
                </View>
            </Card>
        </TouchableOpacity>
    );
};

const style = StyleSheet.create({
    container: {
        marginVertical: 8,
        marginHorizontal: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
    },
    image: {
        width: '100%',
        height: 150,
    },
    content: {
        padding: 12,
    },
    title: {
        fontSize: 18,
        color: '#1a1a1a',
    },
    subtitle: {
        color: 'grey',
        marginTop: 4,
    }
});

export default EventItem;