import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Avatar, Divider, Text } from "react-native-paper";
import MyColor from "../MyColor";
import { useNavigation } from "@react-navigation/native";

const OrganizerInfo = ({ organizer }) => {

    const nav = useNavigation()

    return (
        <View style={styles.organizerCard}>
            <Text style={styles.label}>Ban tổ chức</Text>
            <Divider style={styles.divider} />
            <TouchableOpacity onPress={() => nav.navigate("OrganizerEvent", { organizerId: organizer.id })}>
                <Avatar.Image
                    size={100}
                    source={{ uri: organizer.avatar }}
                    style={styles.avatarShadow}
                />
            </TouchableOpacity>
            <Text variant="titleLarge" style={styles.organizerName}>
                {organizer.name}
            </Text>
            <Text style={styles.organizerInfo}>
                {organizer.description}
            </Text>
        </View>
    )
}

const styles = StyleSheet.create({
    organizerCard: {
        backgroundColor: '#fff',
        borderRadius: 16,
        padding: 16,
        margin: 16,

    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    label: {
        fontSize: 14,
        fontWeight: 700,
        color: 'grey',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    organizerName: {
        fontWeight: 'bold',
        color: 'black',
        marginTop: 8
    },
    divider: {
        height: 1,
        backgroundColor: MyColor.greyLight,
        marginVertical: 10,
    },
    organizerInfo: {
        fontSize: 14,
        color: 'grey',
        lineHeight: 20,
        fontStyle: 'italic',
        letterSpacing: 1,
        marginTop: 8
    },
});

export default OrganizerInfo