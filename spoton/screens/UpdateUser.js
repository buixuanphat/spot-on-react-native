import { useContext, useReducer, useState } from "react"
import { MyUserContext } from "../MyContext"
import { SafeAreaView } from "react-native-safe-area-context"
import { View, Text, Image, StyleSheet, TextInput, TouchableOpacity, ScrollView, Alert } from "react-native"
import * as ImagePicker from 'expo-image-picker'
import Button from '../components/ButtonRoundedHorizontal'
import MyTextInput from "../components/MyTextInput"
import Apis, { authApis, endpoints } from "../utils/Apis"
import { useNavigation } from "@react-navigation/native"
import MySnackBar from "../components/MySnackBar"
import MyColor from "../MyColor"


const UpdateUser = () => {

    const nav = useNavigation()

    const [info, dispatch] = useContext(MyUserContext)
    const user = info.user

    const [firstName, setFirstName] = useState(user.firstname)
    const [lastName, setLastName] = useState(user.lastname)
    const [avatar, setAvatar] = useState(user.avatar)
    const [newAvatar, setNewAvatar] = useState({})

    const [showSnack, setShowSnack] = useState(false)
    const [showSuccessSnack, setShowSuccessSnack] = useState(false)
    const [message, setMessage] = useState('')
    const [loading, setLoading] = useState(false)


    const pickImage = async () => {

        let { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Lỗi", "Không thể truy cập thư viện ảnh");
            return;
        }

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [1, 1],
            quality: 1,
        });

        if (!result.canceled) {
            setNewAvatar(result.assets[0]);
        }
    }

    const handleUpdate = async () => {
        try {
            setLoading(true)
            let form = new FormData()
            form.append("firstname", firstName)
            form.append("lastname", lastName)
            if (newAvatar?.uri) {
                form.append("avatar", {
                    uri: newAvatar.uri,
                    name: `avatar_${info.user.id}.jpg`,
                    type: 'image/jpeg'
                })
            }

            let res = await authApis(info.token).patch(endpoints['updateUser'](info.user.id), form, {
                headers:
                {
                    "Content-Type": "multipart/form-data"
                }
            })
            if (res.status == 200) {
                setMessage("Cập nhật thông tin thành công")
                setShowSuccessSnack(true)
                setTimeout(() => {
                    setShowSuccessSnack(false)
                    nav.goBack()
                }, 2000)

                try {
                    let newInfo = await authApis(info.token).get(endpoints['currentUser'])
                    dispatch({
                        type: "update",
                        payload: {
                            user: newInfo.data.data
                        },
                    });
                }
                catch (e) {
                    console.log(e)
                }


            }

        }
        catch (e) {
            console.error(e)
            console.error(e.response?.data?.message)
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
            <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.title}>Chỉnh sửa thông tin</Text>

                <View style={styles.avatarSection}>
                    <TouchableOpacity onPress={pickImage}>
                        <Image
                            source={{ uri: newAvatar?.uri || avatar }}
                            style={styles.avatar}
                        />
                    </TouchableOpacity>
                    <Text style={{ marginTop: 10, color: '#666' }}>Chạm vào ảnh để đổi</Text>
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Họ</Text>
                    <MyTextInput style={styles.input} value={lastName} onChangeText={setLastName} />
                </View>

                <View style={styles.inputGroup}>
                    <Text style={styles.label}>Tên</Text>
                    <MyTextInput value={firstName} onChangeText={setFirstName} />
                </View>

                <Button loading={loading} title='Lưu' onPress={handleUpdate} />
            </ScrollView>
            <MySnackBar show={showSnack} label={message} color={MyColor.redError} />
            <MySnackBar show={showSuccessSnack} label={message} color={MyColor.success} />
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff' },
    content: { padding: 20 },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 30 },
    avatarSection: { alignItems: 'center', marginBottom: 30 },
    avatar: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#eee' },
    cameraIconBadge: {
        position: 'absolute', bottom: 0, right: 0,
        backgroundColor: '#007AFF', padding: 8, borderRadius: 20,
        borderWidth: 2, borderColor: '#fff'
    },
    inputGroup: { marginBottom: 20 },
    label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 8 },
    saveButton: {
        backgroundColor: '#28a745', padding: 15,
        borderRadius: 10, alignItems: 'center', marginTop: 10
    },
    saveButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' }
})

export default UpdateUser