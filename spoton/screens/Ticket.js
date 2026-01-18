import { useContext, useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context"
import { ActivityIndicator, Icon, IconButton, Text } from "react-native-paper";
import { authApis, endpoints } from "../utils/Apis";
import { MyUserContext } from "../MyContext";
import { ScrollView, StyleSheet, View } from "react-native";
import MySectionOrder from "../components/MySectionOrder";
import MyStyles from "../MyStyles";
import MyColor from "../MyColor";
import ButtonRoundedHorizontal from "../components/ButtonRoundedHorizontal";


const Ticket = ({ navigation, route }) => {

    const [sections, setSections] = useState([])

    const [loading, setLoading] = useState()

    const [info] = useContext(MyUserContext)

    const [total, setTotal] = useState(0)

    const [selectedSections, setSelectedSections] = useState([])

    const handleChange = (selected) => {
        setSelectedSections(prev => {
            const exists = prev.find(ss => ss.id === selected.id)

            if (exists) {
                if (selected.amount > 0) {
                    return prev.map(ss =>
                        ss.id === selected.id ? selected : ss
                    )
                }
                else {
                    return prev.filter(ss =>
                        ss.id !== selected.id
                    )
                }
            }
            return [...prev, selected]
        })
    }


    const loadSection = async () => {
        try {
            setLoading(true);
            const res = await authApis(info.token).get(endpoints['getSections'](route.params.id));
            setSections(res.data.data)
        } catch (e) {
            console.error("Lỗi khi tải loại vé:", e);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadSection()
    }, [])

    useEffect(() => {
        console.log("Danh sách đã chọn: " + JSON.stringify(selectedSections))
        let sum = 0
        selectedSections.forEach(ss => {
            sum += (ss.price * ss.amount)
        })
        setTotal(sum)
    }, [selectedSections])


    return (
        <SafeAreaView style={style.container} >
            {sections ?
                <ScrollView>
                    {sections.map(s =>
                        <MySectionOrder key={s.id} section={s} onChange={(value) => {
                            handleChange(value)
                        }} />)}
                </ScrollView>
                :
                <ActivityIndicator size='large' />}


            <View style={style.totalCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={MyStyles.textBoldNormal}>Tổng:</Text>
                    <Text style={style.totalPrice} >{total.toLocaleString()} VNĐ</Text>
                </View>
                <ButtonRoundedHorizontal disabled={total > 0 ? false : true} icon='arrow-right' title="Tiếp tục" onPress={() => navigation.navigate('Merchandise', {
                    eventId: route.params.id,
                    total: total,
                    selected: selectedSections
                })} />
            </View>


        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    container:
    {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'space-between'
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

export default Ticket