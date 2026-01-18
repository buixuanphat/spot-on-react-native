import { Image, StyleSheet, View } from "react-native"
import { Icon, Text } from "react-native-paper"
import MyColor from "../MyColor"

const EventIntro = ({ event }) => {
    return (
        <View style={styles.ticketWrapper}>
            <View style={styles.ticketContainer}>
                <View style={styles.imageSection}>
                    <Image source={{ uri: event.image }} style={styles.eventImage} />
                    <View style={styles.ticketStubLeft} />
                    <View style={styles.ticketStubRight} />
                </View>

                <View style={styles.dashedLineContainer}>
                    <View style={styles.dashedLine} />
                </View>

                <View style={{ padding: 20 }}>
                    <Text style={styles.eventName}>{event.name}</Text>
                    <View style={styles.infoRow}>
                        <Icon source="calendar" size={20} color={MyColor.primary} />
                        <Text style={styles.infoText}>{event.startTime} - {event.endTime}, {event.date}</Text>
                    </View>
                    <View style={styles.infoRow}>
                        <Icon source="map-marker" size={20} color={MyColor.primary} />
                        <View style={{ flex: 1 }}>
                            <Text style={styles.infoText}>{event.address}</Text>
                            <Text style={styles.subInfoText}>{event.ward}, {event.district}, {event.province}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    ticketWrapper: { padding: 16 },
    ticketContainer: {
        backgroundColor: "white",
        borderRadius: 16,
        overflow: "hidden",
        elevation: 4,
    },
    imageSection: {
        position: 'relative'
    },
    eventImage: {
        width: "100%",
        aspectRatio: 16 / 9,
        resizeMode: "cover"
    },
    ticketStubLeft: {
        position: 'absolute',
        bottom: -10, left: -10,
        width: 20,
        height: 20,
        borderRadius: 10,
        backgroundColor: "#f0f0f0"
    },
    ticketStubRight: {
        position: 'absolute',
        bottom: -10, right: -10,
        width: 20, height: 20,
        borderRadius: 10,
        backgroundColor: "#f0f0f0"
    },
    dashedLineContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 10,
        height: 4,
        overflow: 'hidden'
    },
    dashedLine: {
        flex: 1,
        borderStyle: 'dashed',
        borderWidth: 2,
        borderColor: MyColor.greyLight,
        marginVertical: 4
    },
    eventName: {
        fontSize: 20,
        fontWeight: "bold",
        marginBottom: 14,
    },
    infoRow: {
        flexDirection: "row",
        marginBottom: 8, gap: 8,
        alignItems: 'flex-start'
    },
    infoText: {
        fontSize: 14,
        fontWeight: '600'
    },
    subInfoText: {
        fontSize: 12,
        color: 'grey',
        marginTop: 2
    },
});

export default EventIntro