import { Text, TouchableOpacity, View } from "react-native"

const Color = {
    '0': '#2B0F14', 
    '1': '#3A1414',
    '2': '#1F3D2B', 
    '3': '#0F3057', 
    '4': '#1B263B', 
    '5': '#2E1A47', 
    '6': '#2D1B2F', 
    '7': '#3B1F2B', 
    '8': '#1E3A3A', 
    '9': '#0B3C49', 
    '10': '#3A2F1B', 
    '11': '#2F2A1E',
    '12': '#1C1C3C', 
    '13': '#2C1A1D', 
    '14': '#23395D', 
    '15': '#3D2C3C', 
}



const GenreItem = ({ genre, onSelect }) => {

    let color = Math.floor(Math.random() * 16)

    return (
        <TouchableOpacity onPress={() => onSelect(genre)} style={{ minWidth: 80, backgroundColor: Color[color], padding: 16, marginVertical: 8, marginHorizontal: 4, height: 80, justifyContent: 'center', borderRadius: 8, alignItems: 'center' }} >
            <Text style={{ color: 'white', fontSize: 16, fontWeight: 700 }} >{genre}</Text>
        </TouchableOpacity>
    )
}
export default GenreItem