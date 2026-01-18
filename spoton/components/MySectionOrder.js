import React, { useEffect, useState } from "react";
import { TouchableOpacity, View, StyleSheet } from "react-native";
import { Icon, Text, Divider } from "react-native-paper";
import MyColor from "../MyColor";
import MyIconButton from "./MyIconButton";
import GreyBackGroundText from "./GreyBackgroundText";


const MySectionOrder = ({ section, onChange }) => {
    const [amount, setAmount] = useState(0)
    const [total, setTotal] = useState(0)
    const [isFirstRender, setIsFirstRender] = useState(true)


    const handleAdd = () => {
        if (amount < section.limitTicket && amount < section.totalSeats) {
            setAmount(amount + 1)
            setTotal(total + section.price)
        }

    }

    const handleMinus = () => {
        if (amount > 0) {
            setAmount(amount - 1)
            setTotal(total - section.price)
        }

    }

    useEffect(() => {
        !isFirstRender &&
            onChange({
                ...section,
                amount
            })
    }, [amount])


    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false)
            return
        }
    })


    return (
        <View style={styles.container}>
            <TouchableOpacity
                style={styles.header}
            >
                {/* Vạch màu bên trái */}
                <View style={[styles.colorBar, { backgroundColor: section.color || MyColor.primary }]} />

                <View style={styles.headerInfo}>
                    <Text style={styles.sectionName}>{section.name}</Text>
                    <Text style={styles.sectionPrice}>{section.price?.toLocaleString()} VNĐ</Text>
                </View>
            </TouchableOpacity>


            <View style={styles.content}>
                <Divider style={styles.divider} />

                <Text style={styles.description}>{section.description}</Text>

                <View style={styles.footerRow}>
                    <View style={styles.badge}>
                        <Icon source="ticket" size={16} color="#666" />
                        <Text style={styles.badgeText}>Giới hạn: {section.limitTicket} vé</Text>
                    </View>

                    <View style={styles.badge}>
                        <Icon source="seat" size={16} color="#666" />
                        <Text style={styles.badgeText}>Tổng: {section.totalSeats} chỗ</Text>
                    </View>
                </View>
            </View>

            <View>
                <Divider style={styles.divider} />
                <View style={styles.adjustAmount} >
                    <GreyBackGroundText value={total.toLocaleString()} textStyle={styles.totalPrice} />
                    <View style={styles.action}>
                        <MyIconButton icon='minus' onPress={handleMinus} />
                        <GreyBackGroundText value={amount} />
                        <MyIconButton icon='plus' onPress={handleAdd} />
                    </View>
                </View>

            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 12,
        elevation: 2,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        overflow: 'hidden'
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
        fontWeight: '600'
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
        flexDirection: 'row',
        gap: 15,
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
    },
    adjustAmount:
    {
        flexDirection: 'row',
        padding: 16,
        gap: 8,
        justifyContent: 'space-between'
    },
    action:
    {
        flexDirection: 'row',
        gap: 8
    },
    totalPrice:
    {
        fontWeight: 'bold',
    }
});

export default MySectionOrder;