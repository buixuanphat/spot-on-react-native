import { Image, Linking, StyleSheet, View } from "react-native"
import { Text, Divider, List, Avatar } from "react-native-paper"
import { MyStatus } from "../utils/Enum"
import ButtonRoundedHorizontal from "./ButtonRoundedHorizontal"
import MyButton from "./MyButton"
import { authApis, endpoints } from "../utils/Apis"
import { useContext } from "react"
import { MyUserContext } from "../MyContext"
import { useNavigation } from "@react-navigation/native"
import MyColor from "../MyColor"

const InvoiceItem = ({ invoice }) => {

    const nav = useNavigation()

    const [info] = useContext(MyUserContext)

    const handlePay = async () => {
        let paymentUrl = await authApis(info.token).post(endpoints['createPaymentUrl'],
            {
                "amount": invoice.totalPayment,
                "orderInfo": `Thanh toán đơn hàng #${invoice.id}`,
                "orderType": "billpayment",
                "txnRef": invoice.id
            }
        )

        Linking.openURL(paymentUrl.data.data);
    }

    return (
        <View style={styles.container}>
            <Text variant="titleLarge" style={styles.eventName}>
                {invoice.event?.name}
            </Text>
            <Text variant="bodySmall" style={styles.address}>
                {invoice.event?.address}, {invoice.event?.ward}
            </Text>

            <Divider style={styles.divider} />



            {invoice.tickets && invoice.tickets.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Vé đã đặt ({invoice.tickets.length})</Text>
                    {invoice.tickets.map((ticket, index) => (
                        <View key={`ticket-${index}`} style={styles.itemRow}>
                            <View style={{ flex: 1 }}>
                                <Text variant="bodyMedium" numberOfLines={1}>{ticket.section.name}</Text>
                            </View>
                            <Text variant="bodyMedium" style={styles.itemPrice}>
                                {ticket.section.price?.toLocaleString()}đ
                            </Text>
                        </View>
                    ))}
                </View>
            )}




            {invoice.merchandises && invoice.merchandises.length > 0 && (
                <View style={styles.section}>
                    <Text style={styles.sectionTitle}>Đồ lưu niệm ({invoice.merchandises.length})</Text>
                    {invoice.merchandises.map((item, index) => (
                        <View key={`merch-${index}`} style={styles.itemRow}>
                            <Image style={styles.image} source={{ uri: item.image }} />
                            <Text variant="bodyMedium" style={{ flex: 1 }} numberOfLines={1}>
                                {item.name}
                            </Text>
                            <Text variant="bodyMedium" style={styles.itemPrice}>
                                {item.price?.toLocaleString()}đ
                            </Text>
                        </View>
                    ))}
                </View>
            )}

            <Divider style={styles.divider} />




            <View style={styles.footer}>
                <View>
                    <Text variant="labelMedium">Tổng cộng</Text>
                    <Text style={styles.totalPrice}>
                        {invoice.totalPayment?.toLocaleString()}
                    </Text>
                </View>

                {invoice.status === MyStatus.pending && (
                    <MyButton title="Thanh toán" icon='cash-clock' onPress={handlePay} />
                )}

                {invoice.status === MyStatus.paid && (
                    <MyButton title="Check-in" icon='cash-clock' onPress={() => nav.navigate("CheckIn", { invoiceId: invoice.id })} />
                )}

                {(invoice.status === MyStatus.expired && invoice.isEvaluated === false) && (
                    <MyButton title="Đánh giá" onPress={() => nav.navigate("Rating", { eventId: invoice.event.id, invoiceId: invoice.id })} />
                )}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        padding: 16,
        borderRadius: 12,
        marginHorizontal: 16,
        marginVertical: 8,
        borderWidth: 3,
        borderColor: MyColor.greyLight
    },
    eventName: {
        fontWeight: 'bold',
        color: '#1a1a1a',
    },
    address: {
        color: '#757575',
        marginTop: 2,
    },
    divider: {
        marginVertical: 12,
        height: 1,
    },
    section: {
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 12,
        fontWeight: 'bold',
        color: '#444',
        marginBottom: 6,
        textTransform: 'uppercase',
    },
    itemRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 6,
    },
    colorIndicator: {
        width: 4,
        height: 20,
        borderRadius: 2,
        marginRight: 8,
    },
    merchImage: {
        marginRight: 8,
        backgroundColor: '#f0f0f0'
    },
    itemPrice: {
        fontWeight: '500',
        marginLeft: 8,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    totalPrice: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#D32F2F',
    },
    image: {
        width: 50,
        height: 50,
        borderRadius: 8,
        marginVertical: 8,
        marginRight: 8
    }
})

export default InvoiceItem;