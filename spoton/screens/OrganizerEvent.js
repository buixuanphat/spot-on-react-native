import { useContext, useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { MyUserContext } from "../MyContext"
import { authApis, endpoints } from "../utils/Apis"
import { FlatList, Text } from "react-native"
import MySnackBar from "../components/MySnackBar"
import MyColor from "../MyColor"
import EventItem from "../components/EventItem"
import { useNavigation } from "@react-navigation/native"

const OrganizerEvent = ({ route }) => {

    const nav = useNavigation()

    const [info] = useContext(MyUserContext)
    const [events, setEvents] = useState([])

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [showSnack, setShowSnack] = useState(false)
    const [showSuccessSnack, setShowSuccessSnack] = useState(false)
    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [last, setLast] = useState(false)

    const loadEvents = async () => {
        try {
            setLoading(true)
            let url = `${endpoints['getEvents']}?organizerId=${route.params.organizerId}&&page=${page}`
            let res = await authApis(info.token).get(url)
            setEvents(res.data.data.content)
            setLast(res.data.data.last)
            setTotalPages(res.data.data.totalPages)
            console.log(res.data.data.content)

        }
        catch (e) {
            console.error(e)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        loadEvents()
    }, [route.params.eventId])

    return (
        <SafeAreaView>
            <FlatList
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <EventItem event={item} onPress={() => nav.navigate('Details', { event: item })} />
                }
            />

            <MySnackBar show={showSnack} label={message} color={MyColor.redError} />
            <MySnackBar show={showSuccessSnack} label={message} color={MyColor.success} />
        </SafeAreaView>
    )
}
export default OrganizerEvent