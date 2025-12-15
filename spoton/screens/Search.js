import { useEffect, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { ActivityIndicator, Button, Card, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import Styles from "../components/Styles";
import MySnackBar from "../components/MySnackBar";
import MyColor from "../utils/Color";
import { authApis, endpoints } from "../utils/Apis";
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";

const Search = () => {


    const [q, setQ] = useState('');
    const [page, setPage] = useState(0);

    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showSnack, setShowSnack] = useState(false);
    const [snackColor, setSnackColor] = useState();

    const [hasNext, setHasNext] = useState(true)

    const loadEvents = async () => {
        try {
            setLoading(true);
            let url = `${endpoints.getEvents}?name=${q}&&page=${page}`
            let res = (await authApis()).get(url);
            if (page === (await res).data.data.totalPages - 1) setHasNext(false);
            if (page === 0) {
                setEvents((await res).data.data.content);
            }
            else {
                setEvents([...events, ...(await res).data.data.content]);
            }
        }
        catch (e) {
            setMessage(e?.response?.data?.message || e.message);
            setSnackColor(MyColor['redError']);
            setShowSnack(true);
            setTimeout(() => {
                setShowSnack(false);
            }, 2000);
        }
        finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        if (hasNext && !loading) {
            let timer = setTimeout(() => {
                loadEvents()
            }, 1000);
            return () => clearTimeout(timer);
        }
    }, [q, page]);



    const loadMore = () => {
        if (hasNext && !loading)
            setPage(page + 1);
    }

    useEffect(() => {
        setPage(0)
        setHasNext(true)
    }, [q]);

    return (
        <SafeAreaView style={[Styles.container, {}]} >
            <Searchbar
                style={{
                    margin: 16,
                    backgroundColor: 'white'
                }}
                placeholder="Tìm kiếm"
                onChangeText={(value) => setQ(value)}
                value={q}
            />



            <FlatList
                onEndReached={loadMore}
                ListFooterComponent={loading && <ActivityIndicator size='large' animating color={MyColor.primary} />}
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <Card style={{ margin: 16, backgroundColor: 'white' }}>
                        <Card.Cover source={{ uri: item.image }} />
                        <Card.Content>
                            <Text style={{ fontSize: 22, fontFamily: 'Montserrat-Medium' }} >{item.name}</Text>
                        </Card.Content>
                    </Card>
                )}
            />




            <MySnackBar show={showSnack} label={message} color={snackColor} />
        </SafeAreaView>
    );
}
export default Search;