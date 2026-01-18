import { Image, KeyboardAvoidingView, Platform, ScrollView, View } from "react-native";
import MyStyles from "../MyStyles.js"
import Logo from '../assets/spoton_logo.png'
import InputRoundedHorizontal from "../components/InputRoundedHorizontal";
import ButtonRoundedHorizontal from "../components/ButtonRoundedHorizontal";
import ButtonRoundedHorizontalOutline from "../components/ButtonRoundedHorizontalOutline";
import { useContext, useReducer, useState } from "react";
import MySnackBar from "../components/MySnackBar";
import Apis, { authApis, endpoints } from "../utils/Apis";
import * as Yup from 'yup'
import { Formik } from "formik";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MyUserContext } from "../MyContext";


const Login = ({ navigation }) => {

    const [secure, setSecure] = useState(true);

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [showSnack, setShowSnack] = useState(false);
    const [snackColor, setSnackColor] = useState();

    const [, dispatch] = useContext(MyUserContext)


    const login = async (value) => {
        try {
            setLoading(true);

            const res = await Apis.post(endpoints.login, value);
            const token = res.data.data.token;

            const userRes = await authApis(token).get(endpoints.currentUser);
            const user = userRes.data.data;

            await AsyncStorage.setItem("token", token);
            await AsyncStorage.setItem("user", JSON.stringify(user));

            dispatch({
                type: "login",
                payload: { token, user },
            });
        } catch (e) {
            console.log(e);
        } finally {
            setLoading(false);
        }
    };


    const loginSchema = Yup.object(
        {
            email: Yup.string().trim()
                .required('Email không được để trống'),
            password: Yup.string().trim()
                .required('Mật khẩu không được để trống')
        }
    );

    return (
        <>
            <KeyboardAvoidingView style={[MyStyles.container,]} behavior={"padding"} >
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}  >
                    <Image source={Logo} style={{ width: 300, height: 300 }} />
                </View>
                <View style={{ flex: 1 }} >
                    <Formik
                        initialValues={{
                            email: '',
                            password: ''
                        }}
                        validationSchema={loginSchema}
                        onSubmit={(value) => { login(value) }}
                    >
                        {({ handleChange, handleSubmit, values, errors, touched }) =>
                            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                <View>
                                    <InputRoundedHorizontal
                                        placeholder="Địa chỉ email"
                                        icon='email'
                                        style={{ marginHorizontal: 16 }}
                                        type="email-address"
                                        onChange={handleChange('email')}
                                        error={errors.email}
                                        value={values.email}
                                    />

                                    <InputRoundedHorizontal
                                        placeholder="Mật khẩu"
                                        icon='lock'
                                        style={{ marginTop: 16, marginHorizontal: 16 }}
                                        secure={secure}
                                        onPressIcon={() => setSecure(!secure)}
                                        onChange={handleChange('password')}
                                        error={errors.password}
                                        value={values.password} />
                                </View>


                                <View style={{ marginBottom: 16, marginHorizontal: 16 }}>
                                    <ButtonRoundedHorizontal icon='login' title="Đăng nhập" loading={loading} onPress={handleSubmit} />
                                    <ButtonRoundedHorizontalOutline icon='account-plus' title="Đăng ký" style={{ marginTop: 12 }} onPress={() => navigation.navigate('Register')} />
                                </View>
                            </View>
                        }
                    </Formik>
                </View>

            </KeyboardAvoidingView>
            <MySnackBar show={showSnack} label={message} color={snackColor} />
        </>
    );
}
export default Login;