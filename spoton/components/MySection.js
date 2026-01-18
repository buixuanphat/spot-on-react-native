import React, { useState } from "react";
import { TouchableOpacity, View, StyleSheet, LayoutAnimation, Platform, UIManager } from "react-native";
import { Icon, Text, Divider } from "react-native-paper";
import MyColor from "../MyColor";

const MySection = ({ section }) => {
    const [expand, setExpand] = useState(false);

    return (
        <View style={styles.container}>
            <TouchableOpacity
                onPress={() => setExpand(!expand)}
                style={styles.header}>
                <View style={[styles.colorBar, { backgroundColor: section.color }]} />

                <View style={styles.headerInfo}>
                    <Text style={styles.sectionName}>{section.name}</Text>
                    <Text style={styles.sectionPrice}>{section.price?.toLocaleString()} VNĐ</Text>
                </View>

                <Icon
                    size={24}
                    source={expand ? 'chevron-up' : 'chevron-down'}
                    color="grey"
                />
            </TouchableOpacity>

            {expand && (
                <View style={styles.content}>
                    <Divider style={styles.divider} />

                    <Text style={styles.description}>{section.description}</Text>

                    <View style={styles.footerRow}>
                        <View style={styles.badge}>
                            <Icon source="ticket" size={16} color="#666" />
                            <Text style={styles.badgeText}>Giới hạn: {section.limitTicket} vé/người</Text>
                        </View>

                        <View style={styles.badge}>
                            <Icon source="seat" size={16} color="#666" />
                            <Text style={styles.badgeText}>Còn lại: {section.totalSeats} chỗ</Text>
                        </View>
                    </View>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginVertical: 8,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: MyColor.greyLight
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 15,
    },
    colorBar: {
        width: 6,
        height: '100%',
        borderRadius: 3,
        marginRight: 15,
    },
    headerInfo: {
        flex: 1,
    },
    sectionName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    sectionPrice: {
        fontSize: 14,
        color: MyColor.red,
        marginTop: 2,
        fontWeight: '700'
    },
    content: {
        paddingHorizontal: 15,
        paddingBottom: 15,
    },
    divider: {
        marginBottom: 10,
    },
    description: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
        marginBottom: 15,
    },
    footerRow: {
        flexDirection: 'column',
        gap: 8,
    },
    badge: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingHorizontal: 10,
        paddingVertical: 5,
        borderRadius: 6,
        gap: 5
    },
    badgeText: {
        fontSize: 12,
        color: '#666',
    }
});

export default MySection;