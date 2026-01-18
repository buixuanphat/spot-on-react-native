import { Text, TouchableOpacity } from "react-native"

const ListFooter = ({ onPress }) => {
    return (
        <TouchableOpacity onPress={onPress} >
            <Text style={{ textAlign: 'center', marginVertical: 8, fontSize: 12, fontWeight: 600, color: 'grey' }} >Xem thêm</Text>
        </TouchableOpacity>
    )
}
export default ListFooter