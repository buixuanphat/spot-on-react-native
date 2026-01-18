import { Image, KeyboardAvoidingView, Platform, Text, View } from "react-native";
import InputRoundedHorizontal from "../components/InputRoundedHorizontal";
import ButtonRoundedHorizontal from "../components/ButtonRoundedHorizontal";
import { useState } from "react";
import DatePicker from "../components/DatePicker";
import { format } from 'date-fns';
import MySnackBar from "../components/MySnackBar";
import * as Yup from 'yup'
import { Formik } from "formik";
import Apis, { endpoints } from "../utils/Apis";
import MyColor from "../MyColor";
import MyStyles from "../MyStyles";


const Register = ({ navigation }) => {

    const [secure, setSecure] = useState(true);

    const [errorMessage, setErrorMessage] = useState('');

    const [registering, setRegistering] = useState(false);

    const [showSnack, setShowSnack] = useState(false);
    const [snackColor, setSnackColor] = useState();

    function calculateAge(date) {
        const today = new Date();
        const dob = new Date(date);
        let age = today.getFullYear() - dob.getFullYear();
        const monthDiff = today.getMonth() - dob.getMonth();
        const dayDiff = today.getDate() - dob.getDate();
        if (monthDiff < 0 || (monthDiff === 0 && dayDiff < 0)) {
            age--;
        }
        if (age > 18) return true;
        else return false;
    }

    const registerSchema = Yup.object({
        firstname: Yup.string().trim()
            .min(3, 'Tên phải lớn hơn hoặc bằng 3 ký tự')
            .max(20, 'Tên tối đa 20 ký tự')
            .required('Tên không được để trống'),

        lastname: Yup.string().trim()
            .min(3, 'Họ phải lớn hơn hoặc bằng 3 ký tự')
            .max(20, 'Họ tối đa 20 ký tự')
            .required('Họ không được để trống'),
        email: Yup.string().trim()
            .email("Địa chỉ email không hợp lệ")
            .required("Địa chỉ email không được để trống"),
        dateOfBirth: Yup.string()
            .required("Ngày sinh không được để trống "),
        password: Yup.string().trim()
            .required('Mật khẩu không được để trống')
            .min(8, 'Mật khẩu phải lớn hơn 8 kí tự')
            .max(16, 'Mật khẩu không được quá 16 kí tự'),

        confirmPassword: Yup.string().trim()
            .required('Mật khẩu không trùng khớp')
            .test(
                'confirm',
                'Mật khẩu không trùng khớp',
                function (value) {
                    return value === this.parent.password;
                }
            )
    });




    const register = async (value) => {
        try {
            setRegistering(true);
            let res = await Apis.post(endpoints['register'],
                value
            );
            navigation.navigate('Login');
        }
        catch (e) {
            setErrorMessage(e?.response?.data?.message || e.message);
            setSnackColor(MyColor['redError']);
            setShowSnack(true);
            setTimeout(() => {
                setShowSnack(false);
            }, 2000);
        }
        finally {
            setRegistering(false);
        }
    }

    return (
        <>
            <KeyboardAvoidingView style={[MyStyles.container,]} behavior="padding">
                <View style={{ flex: 1, justifyContent: 'center' }} >
                    <Formik
                        initialValues={{
                            firstname: '',
                            lastname: '',
                            email: '',
                            password: '',
                            confirmPassword: ''
                        }}
                        validationSchema={registerSchema}
                        onSubmit={(value) => register(value)}
                    >
                        {({ handleChange, handleSubmit, values, errors, touched }) =>
                            <View style={{ flex: 1, justifyContent: 'space-between' }}>
                                <View>
                                    <InputRoundedHorizontal
                                        placeholder="Họ"
                                        icon='account'
                                        style={{ marginTop: 16, marginHorizontal: 16 }}
                                        onChange={handleChange('lastname')}
                                        value={values.lastname}
                                        error={errors.lastname}
                                    />


                                    <InputRoundedHorizontal
                                        placeholder="Tên"
                                        icon='account'
                                        style={{ marginTop: 16, marginHorizontal: 16 }}
                                        onChange={handleChange('firstname')}
                                        value={values.firstname}
                                        error={errors.firstname}
                                    />

                                    <DatePicker
                                        style={{ marginTop: 16, marginHorizontal: 16 }}
                                        onChange={handleChange('dateOfBirth')}
                                        value={values.dateOfBirth}
                                        error={errors.dateOfBirth}
                                    />

                                    <InputRoundedHorizontal
                                        placeholder='Địa chỉ email'
                                        icon='email'
                                        style={{ marginTop: 16, marginHorizontal: 16 }}
                                        onChange={handleChange('email')}
                                        value={values.email}
                                        error={errors.email}
                                        type="email-address" 
                                    />

                                    <InputRoundedHorizontal
                                        placeholder='Mật khẩu'
                                        icon='lock'
                                        style={{ marginTop: 16, marginHorizontal: 16 }}
                                        onChange={handleChange('password')}
                                        value={values.password}
                                        error={errors.password}
                                    />

                                    <InputRoundedHorizontal
                                        placeholder='Xác nhận mật khẩu'
                                        icon='lock'
                                        style={{ marginTop: 16, marginHorizontal: 16 }}
                                        onChange={handleChange('confirmPassword')}
                                        value={values.confirmPassword}
                                        error={errors.confirmPassword}
                                    />

                                </View>
                                <View>
                                    <ButtonRoundedHorizontal
                                        loading={registering}
                                        icon='account-plus'
                                        title="Đăng ký"
                                        onPress={handleSubmit}
                                        style={{ marginTop: 16, margin: 16 }} />
                                </View>
                            </View>
                        }
                    </Formik>
                </View>
            </KeyboardAvoidingView>
            <MySnackBar show={showSnack} label={errorMessage} color={snackColor} />
        </>

    );
}
export default Register;