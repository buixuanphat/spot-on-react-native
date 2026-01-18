import { useContext, useEffect, useState } from "react"
import { LineChart } from "react-native-chart-kit"
import { SafeAreaView } from "react-native-safe-area-context"
import { MyUserContext } from "../MyContext"
import { authApis, endpoints } from "../utils/Apis"
import { Button, Dimensions, ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import MyIndicator from "../components/MyIndicator"
import { Appbar, Divider, Menu, PaperProvider, TextInput } from "react-native-paper"
import Empty from "../components/Empty"
import MyColor from "../MyColor"

const Stats = () => {

    const screenWidth = Dimensions.get("window").width;

    const [info] = useContext(MyUserContext)

    const [monthlyStats, setMonthlyStats] = useState(null)
    const [loadingMonthlyStats, setLoadingMonthlyStats] = useState(false)
    const [yearlyStats, setYearlyStats] = useState(null)
    const [loadingYearlyStats, setLoadingYearlyStats] = useState(false)
    const [year, setYear] = useState(new Date().getFullYear())
    const [showMenu, setShowMenu] = useState(false)

    const getMonthlyStats = async () => {
        try {
            setLoadingMonthlyStats(true)

            let url = `${endpoints['getMonthlyStats'](info.user.id)}?year=${year}`
            let res = await authApis(info.token).get(url)
            const rawData = res.data.data

            if (!rawData || rawData.length === 0) {
                setMonthlyStats(null)
                return
            }

            setMonthlyStats({
                labels: rawData.map(i => i.label),
                datasets: [
                    {
                        data: rawData.map(i => Number(i.total))
                    }
                ]
            })
        }
        catch (e) {
            console.log(e.response?.data?.message)
        }
        finally {
            setLoadingMonthlyStats(false)
        }
    }


    const getYearlyStats = async () => {
        try {
            setLoadingYearlyStats(true)

            let res = await authApis(info.token).get(endpoints['getYearlyStats'](info.user.id))
            const rawData = res.data.data

            if (!rawData || rawData.length === 0) {
                setYearlyStats(null)
                return
            }

            setYearlyStats({
                labels: rawData.map(i => i.label),
                datasets: [
                    {
                        data: rawData.map(i => Number(i.total))
                    }
                ]
            })
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setLoadingYearlyStats(false)
        }
    }



    useEffect(() => {
        getMonthlyStats()
        getYearlyStats()
    }, [])


    useEffect(() => {
        getMonthlyStats()
    }, [year])



    return (
        <View>
            <Appbar.Header>
                <Appbar.Content
                    title="Thống kê"
                    titleStyle={{
                        fontSize: 22,
                        fontWeight: 'bold',
                        color: '#1a1a1a'
                    }}
                />
            </Appbar.Header>

            <View >
                <View  >
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}  >
                        <Text style={{ marginLeft: 16, fontWeight: 700, fontSize: 16, marginTop: 16 }} >Thống kê  chi tiêu theo tháng  </Text>

                        <Menu
                            visible={showMenu}
                            onDismiss={() => setShowMenu(false)}
                            anchor={
                                <TouchableOpacity onPress={() => setShowMenu(true)}>
                                    <Text
                                        style={{
                                            fontWeight: '700',
                                            fontSize: 16,
                                            marginTop: 16,
                                            color: MyColor.primary,
                                            textDecorationLine: 'underline'
                                        }}
                                    >
                                        ({year})
                                    </Text>
                                </TouchableOpacity>
                            }
                        >
                            {[2023, 2024, 2025, 2026].map(y => (
                                <Menu.Item
                                    key={y}
                                    title={y.toString()}
                                    onPress={() => {
                                        setYear(y);
                                        setShowMenu(false);
                                    }}
                                />
                            ))}
                        </Menu>
                    </View>
                </View>
                {loadingMonthlyStats && <MyIndicator />}
                {!loadingMonthlyStats && monthlyStats == null && <Empty />}
                {monthlyStats &&
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <LineChart
                            data={monthlyStats}
                            width={Math.max(screenWidth, monthlyStats.labels.length * 70)}
                            height={220}
                            chartConfig={{
                                backgroundGradientFrom: "#B3E5FC",
                                backgroundGradientTo: "#29B6F6",
                                decimalPlaces: 0,
                                color: () => MyColor.primary,
                            }}
                            bezier
                            style={{ margin: 16, borderRadius: 16 }}
                        />
                    </ScrollView>
                }
            </View>

            <Divider style={{ marginBottom: 16 }} />

            <View >
                <Text style={{ marginHorizontal: 16, fontWeight: 700, fontSize: 16, }} >Thống kê  chi tiêu theo năm</Text>
                {loadingYearlyStats && <MyIndicator />}
                {!loadingYearlyStats && yearlyStats == null && <Empty />}
                {yearlyStats &&
                    <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                        <LineChart
                            data={yearlyStats}
                            width={Math.max(screenWidth, yearlyStats.labels.length * 70)}
                            height={220}
                            chartConfig={{
                                backgroundGradientFrom: "#E8F5E9",
                                backgroundGradientTo: "#66BB6A",
                                decimalPlaces: 0,
                                color: () => MyColor.darkGreen,
                                style: { borderRadius: 16 }
                            }}
                            bezier
                            style={{ margin: 16, borderRadius: 16 }}
                        />
                    </ScrollView>
                }
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    container:
    {
        margin: 16
    }
})

export default Stats