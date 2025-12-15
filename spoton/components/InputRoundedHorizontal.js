import { HelperText, TextInput } from "react-native-paper";
import Styles from "./Styles";
import { TouchableOpacity, View } from "react-native";
import { useState } from "react";

const InputRoundedHorizontal = ({ icon, placeholder, style, secure, type, onPressIcon, error, onChange, onPress, edit }) => {

    return (
        <View >

            <TextInput style={[Styles.inputRoundedHorizontal, style]}
                editable={edit}
                onPress={onPress}
                left={<TextInput.Icon icon={icon} onPress={onPressIcon} />}
                placeholder={placeholder}
                placeholderTextColor="gray"
                activeUnderlineColor="transparent"
                underlineColor='transparent'
                secureTextEntry={secure}
                keyboardType={type}
                onChangeText={(value) => {

                    onChange(value)
                }} />
            {error && <HelperText style={{ marginLeft: 32 }} numberOfLines={1} type="error">
                {error}
            </HelperText>}

        </View>

    );
}
export default InputRoundedHorizontal;