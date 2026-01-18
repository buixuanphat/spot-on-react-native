import React, { useContext, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { MyUserContext } from "../MyContext";
import MyColor from "../MyColor";
import { authApis, endpoints } from "../utils/Apis";
import { FlatList, StyleSheet, Text, View } from "react-native";
import { Appbar, Avatar, Button, Card, Dialog, Divider, Icon } from "react-native-paper";
import { TouchableOpacity } from "react-native";
import ButtonRoundedHorizontalOutline from '../components/ButtonRoundedHorizontalOutline'
import MySnackBar from '../components/MySnackBar'


const MY_TIER = {
    copper: "Đồng",
    silver: "Bạc",
    gold: "Vàng"
};

const TIER_COLOR = {
    copper: "#B87333",
    silver: "#C0C0C0",
    gold: "#FFD700"
};

const Profile = () => {
    const [message, setMessage] = useState('')
    const [showSnack, setShowSnack] = useState(false)
    const [showSuccessSnack, setShowSuccessSnack] = useState(false)
    const [showDialog, setShowDialog] = useState(false)

    const [info, dispatch] = useContext(MyUserContext);
    const [loading, setLoading] = useState(false);

    const nav = useNavigation();

    const [isReceivedCoins, setIsReceivedCoins] = useState()
    const [user, setUser] = useState()

    const fetchIsReceivedCoins = async () => {
        try {
            let res = await authApis(info.token).get(endpoints['daily-coins'](info.user.id))
            setIsReceivedCoins(res.data.data)
        }
        catch (e) {
            console.log("Lỗi khi kiểm tra đã nhận xu chưa", e)
        }
    }

    const fetchUserInfo = async () => {
        try {
            setLoading(true)
            let res = await authApis(info.token).get(endpoints['currentUser'])
            setUser(res.data.data)
            console.log(res.data.data)
        }
        catch (e) {
            console.log("Lỗi khi tải thông tin người dùng (Profile)", e)
        }
        finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchIsReceivedCoins()
        fetchUserInfo()
    }, [info.user.id])



    const handleReceive = async () => {
        if (isReceivedCoins) return;
        try {
            setLoading(true);
            const res = await authApis(info.token).post(endpoints['daily-coins'](info.user.id));
            if (res.data.data == true) {
                setIsReceivedCoins(true)
                fetchUserInfo()
            }
        } catch (e) {
            console.log("Lỗi khi nhận xu", e)
        } finally {
            setLoading(false);
        }
    };


    const handleLogout = async () => {
        await AsyncStorage.removeItem("user")
        await AsyncStorage.removeItem("token")
        dispatch({
            type: "logout",
        });
    }



    return (
        <View style={style.container}>
            <Appbar.Header style={style.appbar}>
                <Appbar.Content title="Hồ sơ" titleStyle={style.headerTitle} />
                <Appbar.Action icon='pencil-outline' onPress={() => nav.navigate('Update')} />
            </Appbar.Header>

            <FlatList
                style={{ flex: 1 }}
                ListHeaderComponent={<View>
                    {/* Thông tin người dùng */}
                    {user &&
                        <View style={style.userHeader}>
                            <Avatar.Image
                                size={110}
                                source={{ uri: user?.avatar }}
                                style={style.avatar}
                            />

                            <Text style={style.name}>{user?.lastname} {user?.firstname}</Text>
                            <Text style={style.email}>{user?.email}</Text>

                            <View style={style.statsContainer}>
                                {/* Thông tin xu */}
                                <TouchableOpacity
                                    style={style.statBox}
                                    onPress={handleReceive}>
                                    <View style={style.statCoins}>
                                        <Card.Content style={style.statContent}>
                                            <Text style={style.statNumber}>{user?.coins || 0}</Text>
                                            <Text style={style.statLabel}>
                                                {isReceivedCoins ? "ĐÃ NHẬN XU" : "NHẬN XU NGAY"}
                                            </Text>
                                        </Card.Content>
                                    </View>
                                </TouchableOpacity>
                                {/* Thông tin hạng */}
                                <View style={[style.statBox]}>
                                    <Card.Content style={style.statContent}>
                                        <View style={{ flexDirection: 'row' }} >
                                            <View style={{ width: '10px', height: '10px', borderWidth: 9, backgroundColor: TIER_COLOR[user?.tier] || MyColor.darkGrey, borderColor: TIER_COLOR[user?.tier] || MyColor.darkGrey, borderRadius: 4, marginRight: 8 }} ></View>
                                            <View>
                                                <Text style={[style.statNumber]}>
                                                    {MY_TIER[user?.tier] || "Thành viên"}
                                                </Text>
                                                <Text style={[style.statLabel]}>HẠNG</Text>
                                            </View>
                                        </View>
                                    </Card.Content>
                                </View>
                            </View>
                        </View>
                    }



                    <View style={style.logoutSection}>
                        <View style={{ backgroundColor: 'white', borderRadius: 16 }} >

                            {/* Lịch sử đơn hàng */}
                            <TouchableOpacity onPress={() => nav.navigate("History")} style={{ padding: 12, flexDirection: 'row', justifyContent: 'space-between' }} >
                                <View style={{ flexDirection: 'row', gap: 8 }} >
                                    <Icon size={24} source='history' color={MyColor.darkGrey} />
                                    <Text style={{ fontSize: 16, fontWeight: 600, color: MyColor.darkGrey }} >Lịch sử mua vé</Text>
                                </View>
                                <Icon size={24} source='arrow-right' color={MyColor.darkGrey} />
                            </TouchableOpacity>
                            <Divider />


                            {/* Thống kê */}
                            <TouchableOpacity onPress={() => nav.navigate("Stats")} style={{ padding: 12, flexDirection: 'row', justifyContent: 'space-between' }} >
                                <View style={{ flexDirection: 'row', gap: 8 }} >
                                    <Icon size={24} source='chart-bell-curve-cumulative' color={MyColor.darkGrey} />
                                    <Text style={{ fontSize: 16, fontWeight: 600, color: MyColor.darkGrey }} >Thống kê</Text>
                                </View>
                                <Icon size={24} source='arrow-right' color={MyColor.darkGrey} />
                            </TouchableOpacity>

                            {info.user.role == 'organizer' &&
                                <TouchableOpacity onPress={() => nav.navigate("Scan")} style={{ padding: 12, flexDirection: 'row', justifyContent: 'space-between' }} >
                                    <View style={{ flexDirection: 'row', gap: 8 }} >
                                        <Icon size={24} source='qrcode' color={MyColor.darkGrey} />
                                        <Text style={{ fontSize: 16, fontWeight: 600, color: MyColor.darkGrey }} >Check-In</Text>
                                    </View>
                                    <Icon size={24} source='arrow-right' color={MyColor.darkGrey} />
                                </TouchableOpacity>

                            }


                        </View>


                        {/* Đăng xuất */}
                        <ButtonRoundedHorizontalOutline
                            textColor={MyColor.red}
                            style={style.logoutBtn}
                            title="Đăng xuất"
                            icon='logout'
                            onPress={() => setShowDialog(true)}
                        />
                    </View>
                </View>}
                refreshing={loading}
                onRefresh={fetchUserInfo}
            />
            <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
                <Dialog.Title style={{ fontWeight: 'bold' }}>Đăng xuất</Dialog.Title>
                <Dialog.Content>
                    <Text style={{ fontSize: 16 }}>Bạn chắc chắn muốn đăng xuất chứ?</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={handleLogout}>Xác nhận</Button>
                </Dialog.Actions>
            </Dialog>
            <MySnackBar show={showSnack} label={message} color={MyColor.redError} />
            <MySnackBar show={showSuccessSnack} label={message} color={MyColor.success} />
        </View>
    );
}


const style = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8f9fa',
    },
    appbar: {
        backgroundColor: '#fff',
        elevation: 0,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#1a1a1a'
    },
    userHeader: {
        alignItems: 'center',
        paddingVertical: 30,
        backgroundColor: '#fff',
        borderBottomLeftRadius: 30,
        borderBottomRightRadius: 30,
        marginBottom: 8,
    },
    avatar: {
        backgroundColor: '#eee',
        marginBottom: 10,
    },
    name: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#2d3436',
    },
    email: {
        fontSize: 14,
        color: '#636e72',
        marginTop: 4,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 20,
        paddingHorizontal: 16,
        gap: 12,
    },
    statBox: {
        width: '45%',
        borderRadius: 16,
        backgroundColor: MyColor.background,
        overflow: 'hidden',
        borderWidth: 2,
        borderColor: MyColor.greyLight
    },
    statContent: {
        alignItems: 'center',
        paddingVertical: 15,
    },
    statNumber: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#444',
    },
    statLabel: {
        fontSize: 12,
        fontWeight: '600',
        color: 'grey',
        marginTop: 4,
    },
    historyTitle: {
        marginTop: 20,
        fontSize: 16,
        fontWeight: 'bold',
        color: '#2d3436',
        alignSelf: 'flex-start',
        marginLeft: 20,
    },
    listContent: {
        paddingBottom: 40,
    },
    logoutSection: {
        padding: 20,
    },
    logoutBtn: {
        borderColor: MyColor.red,
        borderWidth: 1,
        borderRadius: 50,
        marginTop: 16
    }
});

export default Profile;