import { useContext, useEffect, useState } from "react"
import { SafeAreaView } from "react-native-safe-area-context"
import { MyUserContext } from "../MyContext"
import { authApis, endpoints } from "../utils/Apis"
import { KeyboardAvoidingView, Linking, Platform, ScrollView, StyleSheet, View } from "react-native"
import { Button, Dialog, Divider, Icon, Searchbar, Switch, Text } from "react-native-paper"
import MyColor from "../MyColor"
import MySnackBar from "../components/MySnackBar"
import ButtonRoundedHorizontal from "../components/ButtonRoundedHorizontal"
import MyStyles from "../MyStyles"
import MySectionInvoice from "../components/MySectionInvoice"
import MyMerchandiseInvoice from "../components/MyMerchandiseInvoice"
import { MyTier } from "../utils/Enum"

const Order = ({ navigation, route }) => {

    const [sections] = useState(route.params.sections)
    const [merchandises] = useState(route.params.merchandises)
    const [loadingVoucher, setLoadingVoucher] = useState(false)
    const [voucher, setVoucher] = useState()
    const [discount, setDiscount] = useState(0)
    const [showDialog, setShowDialog] = useState(false)

    const [total, setTotal] = useState(route.params.total)
    const [paymentLoading, setPaymentLoading] = useState(false)

    const [code, setCode] = useState()

    const [info] = useContext(MyUserContext)

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [showSnack, setShowSnack] = useState(false)
    const [showSuccessSnack, setShowSuccessSnack] = useState(false)

    const [coins, setCoins] = useState(0)
    const [user, setUser] = useState({})
    const [useCoins, setUseCoins] = useState(false)

    const findVoucherByCode = async () => {
        try {
            setLoadingVoucher(true)
            let url = `${endpoints['getVoucherByCode'](code)}?userId=${info.user.id}&&eventId=${route.params.eventId}`
            let res = await authApis(info.token).get(url)
            if (res.status === 200) {
                setVoucher(res.data.data)
            }
            else {
                setVoucher(null)
            }
        }
        catch (e) {
            if (e.response?.status === 404) {
                setVoucher(null)
                setMessage(e.response?.data?.message)
                setShowSnack(true)
                setTimeout(() => {
                    setShowSnack(false)
                }, 2000)
            }
            console.log(e)
        }
        finally {
            setLoadingVoucher(false)
        }
    }

    const getUserInfo = async () => {
        try {
            let res = await authApis(info.token).get(endpoints['currentUser'])
            setCoins(res.data.data.coins)
            setUser(res.data.data)
        }
        catch (e) {
            console.error(e)
        }
    }


    const interact = async () => {
        try {
            let url = endpoints['interaction'](route.params.eventId, info.user.id, 'buy')
            let res = await authApis(info.token).post(url)
            console.log(url)
            console.log("Đã xem", res.status)
        }
        catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        getUserInfo()
    }, [])




    useEffect(() => {
        if (!voucher) {
            setDiscount(0)
            return
        }

        let isValid = false

        if (!voucher.tier || voucher.tier === MyTier.copper) {
            isValid = true
        }
        else if (voucher.tier === MyTier.silver) {
            isValid =
                user.tier === MyTier.silver ||
                user.tier === MyTier.gold
        }
        else if (voucher.tier === MyTier.gold) {
            isValid = user.tier === MyTier.gold
        }

        if (!isValid) {
            setDiscount(0)
            setMessage("Không đủ điều kiện sử dụng mã giảm giá")
            setShowSnack(true)
            setTimeout(() => {
                setShowSnack(false)
            }, 2000)
            return
        }

        setDiscount(
            voucher.type === 'amount'
                ? voucher.value
                : (voucher.value * route.params.total) / 100
        )
    }, [voucher])


    useEffect(() => {
        if (useCoins == true) {
            setTotal(total - coins)
        }
        else {
            setTotal(total + coins)
        }
    }, [useCoins])

    const order = async () => {
        try {
            setLoading(true)
            let createOrderRequest = {
                "userId": info.user.id,
                "totalPayment": total - discount,
                "tickets": route.params.sections,
                "merchandises": route.params.merchandises,
                "eventId": route.params.eventId,
                "coins": coins
            }
            if (voucher) {
                createOrderRequest = { ...createOrderRequest, voucherId: voucher.id }
            }

            let res = await authApis(info.token).post(endpoints['createInvoice'], (createOrderRequest))
            if (res.status === 200) {
                setMessage("Đặt vé thành công")
                setShowSuccessSnack(true)
                setTimeout(() => {
                    setShowSuccessSnack(false)
                }, 2000)

            }


            let paymentUrl = await authApis(info.token).post(endpoints['createPaymentUrl'],
                {
                    "amount": res.data.data.totalPayment,
                    "orderInfo": `Thanh toán đơn hàng #${res.data.data.id}`,
                    "orderType": "billpayment",
                    "txnRef": res.data.data.id
                }
            )

            interact()

            Linking.openURL(paymentUrl.data.data);
            navigation.pop(5)
        }
        catch (e) {
            console.log(e)
            if (e.response?.data?.message) {
                setMessage(e.response?.data?.message)
                setShowSnack(true)
                setShowDialog(false)
                setTimeout(() => {
                    setShowSnack(false)
                }, 2000)
            }
        }
        finally {
            setLoading(false)
        }
    }


    return (
        <SafeAreaView style={style.container}>
            <KeyboardAvoidingView style={style.info} behavior={Platform.OS === "ios" ? "padding" : "height"}>
                <ScrollView style={style.info}>
                    <View style={style.sections} >
                        <Text style={style.label} >Thông tin đặt vé</Text>
                        <View style={style.sectionLabel}>
                            <Text style={{ fontWeight: 700 }} >Loại vé</Text>
                            <Text style={{ fontWeight: 700 }} >Số lượng</Text>
                        </View>
                        {sections.map(s =>
                            <MySectionInvoice key={s.id} section={s} amount={s.amount} />)}


                        {/* Đồ lưu niệm */}
                        {merchandises.length > 0 && <Text style={style.merchandiseLabel} >Đồ lưu niệm</Text>}
                        {merchandises.map(m => <MyMerchandiseInvoice key={m.id} merchandise={m} />)}


                        {/* Sử dụng xu */}
                        <Divider style={style.divider} />
                        {coins > 0 &&
                            <View style={{ marginHorizontal: 16, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }} >
                                <View style={{ flexDirection: 'row', gap: 8 }} >
                                    <Icon size={24} source='alpha-c-circle-outline' />
                                    <Text style={{ fontSize: 16 }}>Dùng {coins} Xu</Text>
                                </View>
                                <Switch color={MyColor.primary} value={useCoins} onValueChange={() => setUseCoins(!useCoins)} />
                            </View>
                        }



                        {/* Mã giảm giá    */}
                        <Divider style={style.divider} />
                        <Text style={style.voucherLabel}>Mã giảm giá</Text>
                        <Searchbar
                            icon='sale'
                            fontFamily='monospace'
                            style={style.searchBar}
                            placeholder="Nhập mã giảm giá"
                            onChangeText={value => setCode(value)}
                            value={code}
                            loading={loadingVoucher}
                            onSubmitEditing={() => findVoucherByCode()}
                        />
                        {voucher &&
                            <View style={style.voucher}>
                                <Text style={style.code} >{voucher.description}</Text>
                            </View>}
                    </View>
                </ScrollView>
            </KeyboardAvoidingView>

            <View style={style.totalCard}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={MyStyles.textBoldNormal}>Tổng:</Text>

                    <View>
                        <Text style={style.totalPrice} >{(total - discount).toLocaleString()}</Text>
                        {discount > 0 &&
                            <View>
                                <Text style={style.code} >-{discount.toLocaleString()}</Text>
                            </View>}
                    </View>


                </View>
                <ButtonRoundedHorizontal
                    loading={paymentLoading}
                    disabled={total > 0 ? false : true}
                    icon='account-credit-card'
                    title="Thanh toán"
                    onPress={() => setShowDialog(true)}
                />
            </View>

            <Dialog visible={showDialog} onDismiss={() => setShowDialog(false)}>
                <Dialog.Title>Thông báo</Dialog.Title>
                <Dialog.Content>
                    <Text variant="bodyMedium">Vui lòng kiểm tra lại thông tin. Sau khi xác nhận, đơn đặt vé sẽ không thể thay đổi hoặc khôi phục.</Text>
                </Dialog.Content>
                <Dialog.Actions>
                    <Button onPress={order}>Mua vé</Button>
                </Dialog.Actions>
            </Dialog>

            <MySnackBar show={showSnack} label={message} color={MyColor.redError} />
            <MySnackBar show={showSuccessSnack} label={message} color={MyColor.success} />
        </SafeAreaView>
    )
}

const style = StyleSheet.create({
    voucher:
    {
        marginHorizontal: 16,
        marginBottom: 16,
        borderRadius: 16,
        backgroundColor: MyColor.background,
        padding: 8
    },
    code:
    {
        fontFamily: 'monospace',
        fontWeight: 'bold',
        color: MyColor.red
    },
    container:
    {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: MyColor.background,
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
        ],
    sections:
    {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 16,
        overflow: 'hidden'
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
    sectionLabel:
    {
        fontWeight: '700',
        marginHorizontal: 16,
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    merchandiseLabel:
    {
        fontWeight: 700,
        marginHorizontal: 16
    },
    searchBar:
    {
        backgroundColor: MyColor.background,
        margin: 16
    },
    voucherLabel:
    {
        fontWeight: 700,
        marginHorizontal: 16
    },
    divider:
    {
        marginVertical: 8
    },
    info:
    {
        flex: 1,
        overflow: 'scroll'
    },
    discount:
    {

    }

})

export default Order