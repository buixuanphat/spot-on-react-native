import { useContext, useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { authApis, endpoints } from "../utils/Apis"
import { FlatList, StyleSheet } from "react-native"
import MyIndicator from "../components/MyIndicator"
import InvoiceItem from "../components/InvoiceItem"
import { SegmentedButtons } from "react-native-paper"
import { MyStatus } from "../utils/Enum"
import MyColor from "../MyColor"
import { MyUserContext } from "../MyContext"
import Empty from "../components/Empty"

const MyTickets = () => {

    const [invoices, setInvoices] = useState([])
    const [loadingInvoices, setLoadingInvoices] = useState(false)
    const [filter, setFilter] = useState(MyStatus.pending)
    const [info] = useContext(MyUserContext)
    const [refreshing, setRefreshing] = useState(false)

    const loadInvoices = async () => {
        try {
            let url = `${endpoints['getInvoices'](info.user.id)}?status=${filter}`
            setLoadingInvoices(true)
            let res = await authApis(info.token).get(url)
            setInvoices(res.data.data)
        }
        catch (e) {
            console.log(e)
            console.log(e?.response?.data)
        }
        finally {
            setLoadingInvoices(false)
        }
    }

    const filterButton = [
        {
            value: 'pending',
            label: 'Chờ thanh toán',
            icon: 'clock-alert-outline',
        },
        {
            value: MyStatus.paid,
            label: 'Sắp diễn ra',
            icon: 'calendar-clock',
        },
    ]

    useEffect(() => {
        loadInvoices()
    }, [filter])


    const handleRefresh = async () => {
        try {
            setRefreshing(true)
            let url = `${endpoints['getInvoices'](info.user.id)}?status=${filter}`
            let res = await authApis(info.token).get(url)
            setInvoices(res.data.data)
        }
        catch (e) {
            console.log(e)
            console.log(e?.response?.data)
        }
        finally {
            setRefreshing(false)
        }
    }

    return (
        <SafeAreaView style={styles.container} >
            {invoices &&
                <FlatList
                    ListEmptyComponent={<Empty />}
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                    contentContainerStyle={{ paddingBottom: 50 }}
                    ListFooterComponent={loadingInvoices && <MyIndicator />}
                    data={invoices}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <InvoiceItem invoice={item} />
                    )}
                />
            }
            <SegmentedButtons
                style={styles.segmentedButtons}
                value={filter}
                onValueChange={setFilter}
                buttons={filterButton}
                theme={{
                    colors: {
                        secondaryContainer: MyColor.primary50,
                        onSecondaryContainer: MyColor.primary,
                    }
                }}
            />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:
    {
        position: 'relative',
        flex: 1
    },
    segmentedButtons: {
        position: 'absolute',
        margin: 16,
        bottom: 0,
        left: 10,
        right: 10,
        borderRadius: 50,
        backgroundColor: 'white'

    }
})

export default MyTickets