import { CameraView, useCameraPermissions } from 'expo-camera';
import { useContext, useEffect, useState } from 'react';
import { Text, View, Button, Dimensions } from 'react-native';
import MySnackBar from '../components/MySnackBar';
import MyColor from '../MyColor';
import { authApis, endpoints } from '../utils/Apis';
import { MyUserContext } from '../MyContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import ButtonRoundedHorizontal from '../components/ButtonRoundedHorizontal';

const screenWidth = Dimensions.get("window").width;

const ScanQRCode = () => {
    const [permission, requestPermission] = useCameraPermissions();
    const [scanned, setScanned] = useState(false);

    const [loading, setLoading] = useState(false)
    const [message, setMessage] = useState('')
    const [showSnack, setShowSnack] = useState(false)
    const [showSuccessSnack, setShowSuccessSnack] = useState(false)

    const [info] = useContext(MyUserContext)

    const check = async (id) => {
        try {
            setLoading(true)
            let res = await authApis(info.token).patch(`${endpoints['check-in']}?id=${id}`)
            if (res.data.data == true) {
                setMessage("Đã Check-In")
                setShowSuccessSnack(true)
                setTimeout(() => {
                    setShowSuccessSnack(false)
                }, 2000)
            }
        }
        catch (e) {
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

    useEffect(() => {
        if (!permission) return;
        if (!permission.granted) {
            requestPermission();
        }
    }, [permission]);

    if (!permission) {
        return <Text>Đang kiểm tra quyền camera...</Text>;
    }

    if (!permission.granted) {
        return <Text>Chưa có quyền camera</Text>;
    }

    return (
        <SafeAreaView style={{ flex: 1 }}>
            <CameraView
                style={{ flex: 1 }}
                barcodeScannerSettings={{
                    barcodeTypes: ['qr'],
                }}
                onBarcodeScanned={
                    scanned
                        ? undefined
                        : ({ data }) => {
                            check(data)
                            setScanned(true);
                        }
                }
            />

            {scanned && (
                <View style={{ margin: 16, position: 'absolute', bottom: 16, width: screenWidth - 32 }} >
                    <ButtonRoundedHorizontal
                        title="Quét lại"
                        onPress={() => setScanned(false)}
                    />
                </View>
            )}
            <MySnackBar show={showSnack} label={message} color={MyColor.redError} />
            <MySnackBar show={showSuccessSnack} label={message} color={MyColor.success} />
        </SafeAreaView>
    );
};

export default ScanQRCode;
