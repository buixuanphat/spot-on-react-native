import { TextInput } from "react-native"

const MyTextInput = ({ value, onChangeText, multiline }) => {
    return (
        <TextInput
            multiline={multiline}
            value={value}
            onChangeText={onChangeText}
            style={{
                borderWidth: 1,
                borderColor: '#ddd',
                padding: 12,
                borderRadius: 8,
                fontSize: 16
            }} />
    )
}
export default MyTextInput