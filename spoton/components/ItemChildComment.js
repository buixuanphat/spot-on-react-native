import { useContext, useState } from "react"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Avatar } from "react-native-paper"
import { authApis, endpoints } from "../utils/Apis"
import { MyCommentContext, MyUserContext } from "../MyContext"
import ListFooter from "./ListFooter"

const ItemChildComment = ({ comment }) => {


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

    const [commentInfo, dispatch] = useContext(MyCommentContext)


    const handleReplyChild = () => {
        dispatch({
            type: "reply",
            payload: {
                parentId: comment.parentId,
                responseName: comment.user.firstname
            },
        });
    }

    return (
        <View style={styles.container} >
            <Avatar.Image style={styles.avatar} size={34} source={{ uri: comment.user.avatar }} />
            <View style={{ gap: 1 }} >
                <View style={styles.userInfo} >
                    <Text style={styles.firstname} >{comment.user.firstname}</Text>
                    <Text style={styles.created} >{timeAgo(comment.createdDate)}</Text>
                </View>
                <Text>{comment.content}</Text>
                <TouchableOpacity onPress={handleReplyChild}>
                    <Text style={styles.response} >Trả lời</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container:
    {
        marginHorizontal: 16,
        marginVertical: 16,
        flexDirection: 'row'
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
    }
})

export default ItemChildComment