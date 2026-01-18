import { useContext, useState } from "react"
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from "react-native"
import { Rating } from "react-native-ratings"
import { SafeAreaView } from "react-native-safe-area-context"
import MyTextInput from "../components/MyTextInput"
import MyColor from "../MyColor"
import ButtonRoundedHorizontal from "../components/ButtonRoundedHorizontal"
import MySnackBar from "../components/MySnackBar"
import { authApis, endpoints } from "../utils/Apis"
import { MyUserContext } from "../MyContext"
import { useNavigation } from "@react-navigation/native"

const RatingEvent = ({ route }) => {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [loading, setLoading] = useState(false)

    const [message, setMessage] = useState('')
    const [showSnack, setShowSnack] = useState(false)
    const [showSuccessSnack, setShowSuccessSnack] = useState(false)

    const [info] = useContext(MyUserContext)

    const nav = useNavigation()

    const getRatingLabel = (sao) => {
        const labels = {
            1: "Tệ",
            2: "Tạm được",
            3: "Bình thường",
            4: "Rất tốt",
            5: "Tuyệt vời"
        };
        return labels[sao];
    }

    const rate = async () => {
        try {
            setLoading(true)
            let res = await authApis(info.token).post(endpoints['createEvaluation'],
                {
                    "userId": info.user.id,
                    "eventId": route.params.eventId,
                    "content": comment,
                    "rating": rating,
                    "invoiceId": route.params.invoiceId
                }
            )
            if (res.status == 200) {
                setMessage("Đánh giá thành công")
                setShowSuccessSnack(true)
                setTimeout(() => {
                    setShowSuccessSnack(false)
                    nav.goBack()
                }, 2000)
            }
        }
        catch (e) {
            console.error(e)
            if (e.response?.data?.message) {
                setMessage(e.response?.data?.message)
                setShowSnack(true)
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
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === "ios" ? "padding" : "height"}
                style={{ flex: 1 }}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>

                    <View style={styles.card}>
                        <View style={styles.ratingSection}>
                            <Text style={styles.label}>Chất lượng dịch vụ</Text>
                            <Rating
                                type="star"
                                ratingCount={5}
                                imageSize={40}
                                startingValue={rating}
                                onFinishRating={(value) => setRating(value)}
                                style={{ paddingVertical: 10 }}
                            />
                            <Text style={styles.ratingLabel}>{getRatingLabel(rating)}</Text>
                        </View>

                        <View style={styles.inputSection}>
                            <Text style={styles.label}>Nhận xét</Text>
                            <MyTextInput
                                placeholder="Chia sẻ thêm về trải nghiệm của mày nhé..."
                                multiline={true}
                                numberOfLines={4}
                                value={comment}
                                onChangeText={setComment}
                                style={styles.customInput}
                            />
                        </View>
                        <ButtonRoundedHorizontal onPress={rate} loading={loading} style={{ marginTop: 16 }} title="Gửi đánh giá" />
                    </View>
                </ScrollView>
                <MySnackBar show={showSnack} label={message} color={MyColor.redError} />
                <MySnackBar show={showSuccessSnack} label={message} color={MyColor.success} />
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: MyColor.background
    },
    scrollContent: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 16,
    },
    card: {
        backgroundColor: 'white',
        borderRadius: 20,
        padding: 16,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    subHeader: {
        fontSize: 14,
        color: '#666',
        textAlign: 'center',
        marginBottom: 20,
        marginTop: 5
    },
    ratingSection: {
        alignItems: 'center',
        marginVertical: 16,
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#444',
        marginBottom: 8,
        alignSelf: 'flex-start'
    },
    ratingLabel: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#FFA41C',
        marginTop: 10,
    },
    inputSection: {
        width: '100%',
        marginVertical: 10,
    },
    customInput: {
        minHeight: 100,
        textAlignVertical: 'top',
        padding: 12,
        backgroundColor: '#F0F0F0',
        borderRadius: 12,
    },
    submitBtn: {
        backgroundColor: '#2196F3',
        paddingVertical: 15,
        borderRadius: 12,
        marginTop: 30,
        alignItems: 'center',
    },
    submitBtnText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    }
})

export default RatingEvent