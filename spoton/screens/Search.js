import { useContext, useEffect, useRef, useState } from "react";
import { Animated, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import MySnackBar from "../components/MySnackBar";
import MyColor from "../MyColor";
import { authApis, endpoints, provinceApis } from "../utils/Apis";
import { MyUserContext } from "../MyContext";
import Empty from "../components/Empty";
import MyIndicator from "../components/MyIndicator";
import MyStyles from "../MyStyles";
import EventItem from "../components/EventItem";
import GenreItem from "../components/GenreItem";
import MyChip from "../components/MyChip";

const Search = ({ navigation }) => {

    const [isFirstLoad, setIsFirstLoad] = useState(true);

    const [q, setQ] = useState('');
    const [page, setPage] = useState(0);

    const [events, setEvents] = useState([]);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showSnack, setShowSnack] = useState(false);
    const [snackColor, setSnackColor] = useState();

    const [hasNext, setHasNext] = useState(true)

    const [info] = useContext(MyUserContext)

    const [loadingGenre, setLoadingGenre] = useState(false)
    const [genres, setGenres] = useState([])
    const [genre, setGenre] = useState('')
    const [provinces, setProvinces] = useState([])
    const [location, setLocation] = useState('')
    const [displayProvince, setDisplayProvince] = useState(false)

    const loadProvinces = async () => {
        try {
            let res = await provinceApis().get()
            setProvinces(res.data)
        }
        catch (e) {
            console.log(e)
        }
    }

    const loadEvents = async () => {
        try {
            setLoading(true)
            let url = `${endpoints.getEvents}?name=${q}&&page=${page}&&status=public&&genre=${genre}&&province=${location}`
            console.log(url)
            let res = await authApis(info.token).get(url);
            if (page === res.data.data.totalPages - 1) setHasNext(false);
            if (page === 0) {
                setEvents(res.data.data.content);
            }
            else {
                setEvents([...events, ...res.data.data.content]);
            }
        }
        catch (e) {
            console.log(e)
            console.log(e?.response?.data?.message)
            if (e?.response?.data?.message) {
                setMessage(e?.response?.data?.message)
                setSnackColor(MyColor['redError']);
                setShowSnack(true);
                setTimeout(() => {
                    setShowSnack(false);
                }, 2000);
            }
        }
        finally {
            setLoading(false);
            setIsFirstLoad(false)
        }
    }



    const loadGenres = async () => {
        try {
            setLoadingGenre(true)
            let res = await authApis(info.token).get(endpoints['getGenres'])
            setGenres(res.data.data)
        }
        catch (e) {
            console.log("Lỗi khi tải thể loại", e)
        }
        finally {
            setLoadingGenre(false)
        }
    }


    useEffect(() => {
        loadGenres()
        loadProvinces()
        loadProvinces()
    }, [])


    const loadMore = () => {
        if (hasNext && !loading)
            setPage(page + 1);
    }


    useEffect(() => {
        loadEvents()
    }, [page])

    useEffect(() => {
        let timer = setTimeout(() => {
            setPage(0)
            setHasNext(true)
            loadEvents()
        }, 1000);
        return () => clearTimeout(timer);
    }, [q]);


    useEffect(() => {
        setPage(0)
        setHasNext(true)
        loadEvents()
    }, [location, genre]);



    const translateY = useRef(new Animated.Value(500)).current;

    useEffect(() => {
        if (displayProvince) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: 500,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [displayProvince]);

    return (
        <SafeAreaView style={style.container} >
            <Searchbar
                style={style.searchBar}
                placeholder="Tìm kiếm"
                onChangeText={(value) => setQ(value)}
                value={q}
            />



            <FlatList
                ListHeaderComponent={
                    <View>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            data={genres}
                            keyExtractor={(item) => item.id.toString()}
                            renderItem={({ item }) => <GenreItem onSelect={(value) => setGenre(value)} genre={item.name} />}
                        />
                        <View style={{ flexDirection: 'row' }} >
                            {genre && <MyChip label={genre} showIcon={true} icon='close' onRemove={() => setGenre('')} />}
                            {events.length > 0 && !location && <MyChip startIcon='map-marker' onSelect={() => setDisplayProvince(true)} label="Địa điểm" />}
                            {location && <TouchableOpacity><MyChip onRemove={() => setLocation('')} showIcon={true} icon='close' label={location} /></TouchableOpacity>}
                        </View>
                        {!isFirstLoad && events.length === 0 && !loading && <Empty />}
                    </View>
                }
                style={{ flex: 1 }}
                onRefresh={loadEvents}
                refreshing={loading}
                onEndReached={(events.length > 0 && !loading) ? loadMore : null}
                data={events}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <EventItem event={item} onPress={() => navigation.navigate('Details', { event: item })} />
                )}
            />


            <Modal transparent visible={displayProvince} animationType="none">
                <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setDisplayProvince(false)} />
                <Animated.View style={{
                    flex: 1,
                    position: 'absolute',
                    bottom: 0,
                    width: '100%',
                    height: 500,
                    backgroundColor: 'white',
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                    transform: [{ translateY: translateY }],
                }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 16 }}>Tỉnh thành</Text>
                    {provinces.length > 0 &&
                        <FlatList
                            data={provinces}
                            keyExtractor={(item) => item.code.toString()}
                            renderItem={({ item }) => <MyChip onSelect={(value) => setLocation(value)} label={item.name} />}
                        />
                    }
                </Animated.View>
            </Modal>

            <MySnackBar show={showSnack} label={message} color={snackColor} />
        </SafeAreaView>
    );
}

const style = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: MyColor.background
    },
    searchBar:
    {
        backgroundColor: 'white',
        margin: 16
    }
})

export default Search;