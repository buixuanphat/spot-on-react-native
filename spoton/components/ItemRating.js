import { StyleSheet, Text, View } from "react-native"
import { Avatar } from "react-native-paper"
import { Rating } from "react-native-ratings"
import MyColor from "../MyColor"

const ItemRating = ({ rating }) => {

    const timeAgo = (dateString) => {
        const now = new Date()
        const past = new Date(dateString)
        const diffMs = now - past

        const seconds = Math.floor(diffMs / 1000)
        const minutes = Math.floor(seconds / 60)
        const hours = Math.floor(minutes / 60)
        const days = Math.floor(hours / 24)

        if (seconds < 60) return "vừa xong"
        if (minutes < 60) return `${minutes} phút trước`
        if (hours < 24) return `${hours} giờ trước`
        if (days < 7) return `${days} ngày trước`

        return past.toLocaleDateString("vi-VN")
    }





    return (
        <View style={styles.container} >
            <Avatar.Image style={styles.avatar} size={34} source={{ uri: rating.user.avatar }} />
            <View style={{ gap: 4 }} >
                <View style={styles.userInfo} >
                    <Text style={styles.firstname} >{rating.user.firstname}</Text>
                    <Text style={styles.created} >{timeAgo(rating.createdDate)}</Text>
                </View>
                <Rating style={styles.ratingBar}
                    type="star"
                    ratingCount={5}
                    imageSize={24}
                    startingValue={rating.rating}
                    readonly
                    backgroundColor={MyColor.background}
                />
                <Text>{rating.content}</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        marginHorizontal: 16,
        marginVertical: 16,
        flexDirection: 'row',
        backgroundColor: 'white',
    },

    userInfo:
    {
        flexDirection: 'row',
        gap: 8,
    },
    firstname:
    {
        fontSize: 12,
        fontWeight: 700
    },
    created:
    {
        fontSize: 12,
        fontWeight: 500,
        color: 'grey'
    },
    avatar:
    {
        marginRight: 16,
    },
    response:
    {
        fontSize: 12,
        fontWeight: 600,
        color: 'grey'
    },
    ratingBar:
    {
        backgroundColor: MyColor.background
    }
})

export default ItemRating