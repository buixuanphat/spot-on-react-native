import { useContext, useState } from "react"
import { Image, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Avatar, Icon } from "react-native-paper"
import { MyUserContext } from "../MyContext"
import { SafeAreaView } from "react-native-safe-area-context"
import * as ImagePicker from 'expo-image-picker'
import ButtonRoundedHorizontal from "../components/ButtonRoundedHorizontal"
import MyStyles from "../MyStyles"
import { authApis, endpoints } from "../utils/Apis"
import MySnackBar from "../components/MySnackBar"
import MyColor from "../MyColor"


const CreatePost = ({ navigation }) => {

    const [showSnack, setShowSnack] = useState(false)
    const [showSuccessSnack, setShowSuccessSnack] = useState(false)
    const [message, setMessage] = useState('')

    const [info] = useContext(MyUserContext)
    const [images, setImages] = useState([])
    const [uploadLoading, setUploadLoading] = useState(false)
    const [caption, setCaption] = useState('')

    const pickImages = async () => {
        const { granted } =
            await ImagePicker.requestMediaLibraryPermissionsAsync()

        if (granted) {
            const res = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 1
            })

            if (!res.canceled) {
                setImages(res.assets)
                console.log(res)
            }
        }
        else {
            alert("Không có quyền truy cập thư viện ảnh")
            return
        }
    }

    const uploadPost = async () => {
        try {
            const form = new FormData()
            form.append('userId', info.user.id)
            form.append('caption', caption)
            images &&
                images.forEach((img, index) => {
                    form.append('images', {
                        uri: img.uri,
                        name: `image_${index}.jpg`,
                        type: 'image/jpeg'
                    })
                })

            setUploadLoading(true)
            let res = await authApis(info.token).post(endpoints['createPost'], form,
                {
                    headers:
                    {
                        "Content-Type": "multipart/form-data"
                    }
                }
            )
            if (res.status == 200) {
                setMessage("Tạo bài viết thành công")
                setShowSuccessSnack(true)
                setTimeout(() => {
                    setShowSuccessSnack(false)
                    navigation.goBack()
                }, 2000)
            }
        }
        catch (e) {
            console.log(e)
            console.log(e.response?.data?.message)
        }
        finally {
            setUploadLoading(false)
        }
    }


    return (
        <SafeAreaView style={styles.container} >
            <View>
                <View style={styles.userInfo} >
                    <Avatar.Image size={50} source={{ uri: info.user.avatar }} />
                    <View>
                        <Text style={styles.firstname}>{info.user.firstname}</Text>
                    </View>
                </View>
                <TextInput
                    value={caption}
                    onChangeText={setCaption}
                    multiline
                    numberOfLines={4}
                    placeholder="Nhập nội dung..."
                    style={styles.inputCaption}
                />

                <ScrollView style={styles.listPreviewImage} horizontal showsHorizontalScrollIndicator={false}>
                    {images.map((img, index) => (
                        <Image
                            key={index}
                            source={{ uri: img.uri }}
                            style={styles.previewImage}
                        />
                    ))}
                </ScrollView>


                <TouchableOpacity style={styles.addImage} onPress={pickImages}>
                    <Icon color="black" size={24} source='image-plus' />
                    <Text numberOfLines={1}>Thêm ảnh</Text>
                </TouchableOpacity>
            </View>




            <View style={styles.bottomCard}>
                <ButtonRoundedHorizontal
                    loading={uploadLoading}
                    disabled={uploadLoading}
                    icon='upload'
                    title="Đăng bài"
                    onPress={() => uploadPost()}
                />
            </View>
            <MySnackBar show={showSnack} label={message} color={MyColor.redError} />
            <MySnackBar show={showSuccessSnack} label={message} color={MyColor.success} />

        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container:
    {
        marginVertical: 8,
        flex: 1
    },
    image:
    {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: 'white'
    },
    userInfo:
    {
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        gap: 8
    },
    caption:
    {
        marginHorizontal: 16,
        marginBottom: 8
    },
    firstname:
    {
        fontWeight: 700,
        fontSize: 16
    },
    createdDate:
    {
        fontSize: 12,
        color: 'grey'
    },
    inputCaption:
    {
        margin: 16,
        borderWidth: 1,
        borderColor: "grey",
        padding: 10,
        borderRadius: 8
    },
    addImage:
    {
        margin: 16,
        borderRadius: 8,
        elevation: 4,
        backgroundColor: 'white',
        padding: 8,
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'flex-start'
    },
    previewImage: {
        width: 120,
        height: 120,
        borderRadius: 8,
        marginHorizontal: 8
    },
    listPreviewImage:
    {
        marginHorizontal: 8
    },
    bottomCard:
    {
        backgroundColor: 'white',
        padding: 16,
        flexDirection: 'column',
        justifyContent: 'space-between',
        position: 'absolute',
        bottom: 0,
        width: '100%'
    },
})

export default CreatePost