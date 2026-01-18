import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context"
import { authApis, endpoints } from "../utils/Apis";
import { MyUserContext } from "../MyContext";
import { FlatList, ScrollView, StyleSheet, View } from "react-native";
import { ActivityIndicator, Text } from "react-native-paper";
import MyMerchandise from "../components/MyMerchandise";
import MyColor from "../MyColor";
import MyStyles from "../MyStyles";
import ButtonRoundedHorizontal from "../components/ButtonRoundedHorizontal";
import MyIndicator from "../components/MyIndicator";
import Empty from "../components/Empty";

const Merchandise = ({ navigation, route }) => {

    const [merchandises, setMerchandises] = useState([])

    const [selectedMerchandises, setSelectedMerchandises] = useState([])

    const [loading, setLoading] = useState(false)

    const [total, setTotal] = useState(0)

    const [info] = useContext(MyUserContext)

    const fetchEventMerchandises = async () => {
        try {
            setLoading(true);
            let res = await authApis(info.token).get(endpoints['getEventMerchandises'], {
                params: {
                    'eventId': route.params.eventId
                }
            });
            setMerchandises(res.data.data);
        }
        catch (e) {
            console.error(e)
        }
        finally {
            setLoading(false);
        }
    }

    const handleChange = (selected) => {
        setSelectedMerchandises(prev => {
            const exists = prev.find(sm => sm.id === selected.id)

            if (exists) {
                return prev.filter(sm =>
                    sm.id !== selected.id
                )
            }
            return [...prev, selected]
        })
    }

    useEffect(() => {
        fetchEventMerchandises();
    }, []);


    useEffect(() => {
        let sum = route.params.total
        selectedMerchandises.forEach(sm => {
            sum += (sm.price)
        })
        setTotal(sum)
    }, [selectedMerchandises]);

    return (
        <SafeAreaView style={style.container}>
            <Text style={style.label} >Đồ lưu niệm</Text>
            <FlatList
                ListFooterComponent={loading && <MyIndicator />}
                ListEmptyComponent={<Empty />}
                data={merchandises}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <MyMerchandise merchandise={item} onChange={(value) => handleChange(value)} />}
            />
            <View style={style.totalCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={MyStyles.textBoldNormal}>Tổng:</Text>
                    <Text style={style.totalPrice} >{total?.toLocaleString()} VNĐ</Text>
                </View>
                <ButtonRoundedHorizontal disabled={total > 0 ? false : true} icon='arrow-right' title="Tiếp tục" onPress={() => navigation.navigate('Order', {
                    eventId: route.params.eventId,
                    total: total,
                    sections: route.params.selected,
                    merchandises: selectedMerchandises
                })} />
            </View>
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container:
    {
        flex: 1,
        backgroundColor: MyColor.background
    },
    label: {
        fontSize: 14,
        fontWeight: 700,
        color: 'grey',
        textTransform: 'uppercase',
        letterSpacing: 1,
        marginHorizontal: 16,
        marginTop: 16,
        marginBottom: 8
    },
    totalCard:
    {
        backgroundColor: 'white',
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'space-between'
    },
    totalPrice:
        [
            MyStyles.textBoldNormal,
            {
                color: MyColor.red
            }
        ]
})


export default Merchandise