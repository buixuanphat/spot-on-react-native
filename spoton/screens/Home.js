import { Dimensions, FlatList, Image, RefreshControl, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Icon, Searchbar } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import logo from '../assets/spoton_logo.png'
import { useBottomTabBarHeight } from "@react-navigation/bottom-tabs";
import MyStyles from "../MyStyles";
import { useContext, useEffect, useState } from "react";
import { MyUserContext } from "../MyContext";
import { authApis, endpoints } from "../utils/Apis";
import EventItem from "../components/EventItem";
import MyColor from "../MyColor";

const screenWidth = Dimensions.get("window").width;

const Home = ({ navigation }) => {

    const [info] = useContext(MyUserContext)

    const [news, setNews] = useState([])
    const [tops, setTops] = useState([])
    const [recomments, setRecomments] = useState([])

    const [loadingNews, setLoadingNews] = useState(false)
    const [loadingTop, setLoadingTop] = useState(false)
    const [loadingRecomment, setLoadingRecomment] = useState(false)

    const getNewEvents = async () => {
        try {
            setLoadingNews(true)
            let res = await authApis(info.token).get(endpoints['getNewEvents'])
            setNews(res.data.data)
        }
        catch (e) {
            console.log("Lỗi khi tải sự kiện mới", e)
        }
        finally {
            setLoadingNews(false)
        }
    }


    const getTopEvents = async () => {
        try {
            setLoadingTop(true)
            let res = await authApis(info.token).get(endpoints['getTopEvents'])
            setTops(res.data.data)
        }
        catch (e) {
            console.log("Lỗi khi tải sự kiện bán chạy", e)
        }
        finally {
            setLoadingTop(false)
        }
    }


    const getRecomments = async () => {
        try {
            setLoadingRecomment(true)
            let res = await authApis(info.token).get(endpoints['getRecomment'](info.user.id))
            setRecomments(res.data.data)
        }
        catch (e) {
            console.log("Lỗi khi tải sự kiện đề xuất", e)
        }
        finally {
            setLoadingRecomment(false)
        }
    }

    useEffect(() => {
        getNewEvents()
        getTopEvents()
        getRecomments()
    }, [])


    const [refreshing, setRefreshing] = useState(false)
    const handleRefresh = async () => {
        try {
            setRefreshing(true)
            await getNewEvents()
            await getTopEvents()
            await getRecomments()
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setRefreshing(false)
        }
    }


    return (
        <SafeAreaView style={MyStyles.container} >
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }} >
                <Image style={{ width: 180, height: 100 }} source={logo} />
                <TouchableOpacity
                    style={{ alignSelf: 'center', marginRight: 16 }}
                    onPress={() => navigation.getParent()?.navigate('Search')}>
                    <Icon size={36} source='magnify' />
                </TouchableOpacity>
            </View>
            <ScrollView refreshControl={
                <RefreshControl
                    refreshing={refreshing}
                    onRefresh={handleRefresh}
                />
            } >
                {/* Sự kiện mới */}
                <Text style={styles.title} >Sự kiện mới</Text>
                <FlatList
                    onRefresh={handleRefresh}
                    refreshing={refreshing}
                    style={{ marginBottom: 16 }}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={news}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => navigation.navigate('Details', { event: item })}
                            style={{ marginVertical: 8, marginHorizontal: 4, borderRadius: 16 }} >
                            <Image style={{ width: screenWidth, aspectRatio: 16 / 10 }} source={{ uri: item.image }} />
                        </TouchableOpacity>
                    }
                />


                {/* Sự kiện đang bán chạy */}
                <Text style={styles.title} >Đang bán chạy</Text>
                <FlatList
                    style={{ marginBottom: 16 }}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={tops}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => navigation.navigate('Details', { event: item })}
                            style={{ marginVertical: 8, marginHorizontal: 4, borderRadius: 16 }} >
                            <Image style={{ width: screenWidth, aspectRatio: 16 / 10 }} source={{ uri: item.image }} />
                        </TouchableOpacity>
                    }
                />

                {/* Để xuất */}
                {recomments.length > 0 && <Text style={styles.title} >Có thể bạn sẽ thích</Text>}
                <FlatList
                    style={{ marginBottom: 16 }}
                    showsHorizontalScrollIndicator={false}
                    horizontal
                    data={recomments}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) =>
                        <TouchableOpacity onPress={() => navigation.navigate('Details', { event: item })}
                            style={{ marginVertical: 8, marginHorizontal: 4, borderRadius: 16 }} >
                            <Image style={{ width: screenWidth, aspectRatio: 16 / 10 }} source={{ uri: item.image }} />
                        </TouchableOpacity>
                    }
                />
            </ScrollView>
        </SafeAreaView >
    );
}
const styles = StyleSheet.create({
    title:
    {
        fontSize: 18,
        fontWeight: 700,
        color: MyColor.darkGrey,
        marginHorizontal: 16,
    }
})
export default Home;