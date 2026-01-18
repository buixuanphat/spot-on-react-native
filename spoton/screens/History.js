import { useContext, useEffect, useState } from "react"
import { FlatList, StyleSheet, View } from "react-native"
import { Appbar } from "react-native-paper"
import { MyUserContext } from "../MyContext"
import { authApis, endpoints } from "../utils/Apis"
import { MyStatus } from "../utils/Enum"
import InvoiceItem from '../components/InvoiceItem.js'

const History = () => {

    const [message, setMessage] = useState('')

    const [info] = useContext(MyUserContext)

    const [loading, setLoading] = useState(false)
    const [showSnack, setShowSnack] = useState(false)
    const [showSuccessSnack, setShowSuccessSnack] = useState(false)

    const [invoices, setInvoices] = useState([])

    const loadData = async () => {
        try {
            setLoading(true)
            let res = await authApis(info.token).get(`${endpoints['getInvoices'](info.user.id)}?status=${MyStatus.expired}`)
            setInvoices(res.data.data)
        }
        catch (e) {
            console.log("Lỗi khi tải lịch sử hóa đơn", e)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadData()
    }, [info.user.id])

    return (
        <View style={{ flex: 1 }} >
            <Appbar.Header style={styles.appbar}>
                <Appbar.Content title="Lịch sử" titleStyle={styles.headerTitle} />
            </Appbar.Header>
            {invoices &&
                <FlatList
                    refreshing={loading}
                    onRefresh={loadData}
                    data={invoices}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => <InvoiceItem invoice={item} />}
                />}
        </View>
    )
}
const styles = StyleSheet.create({
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a'
    },
    appbar: {
        backgroundColor: '#fff',
        elevation: 0,
    },
})
export default History