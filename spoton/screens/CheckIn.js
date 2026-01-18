import { FlatList, StyleSheet, Text, View, Dimensions } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import QRCode from "react-native-qrcode-svg"
import { useContext, useEffect, useState } from "react"
import { authApis, endpoints } from "../utils/Apis"
import { MyUserContext } from "../MyContext"
import MyIndicator from '../components/MyIndicator.js'
import { Icon } from "react-native-paper"

const { width } = Dimensions.get('window');

const CheckIn = ({ route }) => {
    const [tickets, setTickets] = useState([])
    const [loading, setLoading] = useState(false)
    const [refreshing, setRefreshing] = useState(false)
    const [info] = useContext(MyUserContext)

    const loadTickets = async () => {
        try {
            setLoading(true)
            let res = await authApis(info.token).get(endpoints['getTicketOfInvoice'](route.params.invoiceId))
            setTickets(res.data.data)
        } catch (e) {
            console.error(e.response?.data)
        } finally {
            setLoading(false)
        }
    }

    const refreshTickets = async () => {
        try {
            setRefreshing(true)
            let res = await authApis(info.token).get(endpoints['getTicketOfInvoice'](route.params.invoiceId))
            setTickets(res.data.data)
        } catch (e) {
            console.error(e.response?.data)
        } finally {
            setRefreshing(false)
        }
    }

    useEffect(() => {
        loadTickets()
    }, [route.params.invoiceId])

    const renderTicket = ({ item, index }) => (
        <View style={styles.ticketCard}>
            <View style={styles.ticketTop}>
                <Text style={styles.invoiceId}>Mã vé: {item.id}</Text>
                <Text style={styles.sectionName}>{item.section.name}</Text>
                <Text style={styles.description}>{item.section.description}</Text>
                <View style={[styles.statusBadge, { backgroundColor: item.status === 'available' ? '#FF5252' : '#4CAF50' }]}>
                    {item.status === 'used' && <Icon size={24} source='check-circle' />}
                    <Text style={styles.statusText}>{item.status === 'available' ? 'Chưa sử dụng' : 'Đã sử dụng'}</Text>
                </View>
            </View>


            <View style={styles.dividerContainer}>
                <View style={styles.circleLeft} />
                <View style={styles.dashedLine} />
                <View style={styles.circleRight} />
            </View>

            {/* Phần dưới chứa QR */}
            <View style={styles.ticketBottom}>
                <QRCode
                    value={item.id.toString()}
                    size={180}
                    color="black"
                    backgroundColor="white"
                />
                <Text style={styles.ticketCount}>Vé {index + 1} / {tickets.length}</Text>
            </View>
        </View>
    );

    if (loading && !refreshing) return <MyIndicator />;

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.headerTitle}>Thông tin vé</Text>
            <FlatList
                horizontal
                pagingEnabled
                showsHorizontalScrollIndicator={false}
                refreshing={refreshing}
                onRefresh={refreshTickets}
                data={tickets}
                keyExtractor={(item) => item.id.toString()}
                renderItem={renderTicket}
                contentContainerStyle={styles.listContent}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center',
        margin: 16
    },
    listContent: {
        alignItems: 'center',
    },
    ticketCard: {
        width: width - 32,
        backgroundColor: 'white',
        borderRadius: 20,
        overflow: 'hidden',
        minHeight: 500,
        marginHorizontal: 16
    },
    ticketTop: {
        padding: 20,
        alignItems: 'center',
    },
    invoiceId: {
        fontSize: 16,
        color: '#888',
        marginBottom: 4
    },
    sectionName: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#1a1a1a',
        textAlign: 'center'
    },
    description: {
        fontSize: 14,
        color: '#666',
        marginTop: 4,
    },
    statusBadge: {
        marginTop: 15,
        paddingHorizontal: 15,
        paddingVertical: 5,
        borderRadius: 15,
        flexDirection: 'row',
        gap: 4,
        justifyContent: 'center',
        alignItems: 'center'
    },
    statusText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        height: 30,
    },
    dashedLine: {
        flex: 1,
        height: 1,
        borderStyle: 'dashed',
        borderWidth: 1,
        borderColor: '#DDD',
        marginHorizontal: 5
    },
    circleLeft: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        marginLeft: -10
    },
    circleRight: {
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: '#F5F5F5',
        marginRight: -10
    },
    ticketBottom: {
        padding: 20,
        alignItems: 'center',
        justifyContent: 'center'
    },
    ticketCount: {
        marginTop: 15,
        color: '#999',
        fontStyle: 'italic'
    }
})

export default CheckIn 