import { Image, KeyboardAvoidingView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import { Avatar, Icon } from "react-native-paper"
import MyColor from "../MyColor"
import ImageGrid from "./ImageGrid"
import { useContext, useEffect, useState } from "react"
import { authApis, endpoints } from "../utils/Apis"
import { MyCommentContext, MyDisplayCommentContext, MyReloadCommentContext, MyUserContext } from "../MyContext"
import Comment from "./Comment"

const PostItem = ({ post }) => {

    const [isLiked, setIsLiked] = useState(post.isLiked)

    const [emotions, setEmotions] = useState(post.emotions)

    const newComment = useContext(MyReloadCommentContext)
    const [comments, setComments] = useState(post.comments)

    const [loadingLike, setLoadingLike] = useState(false)

    const [info] = useContext(MyUserContext)

    const [commentInfo, dispatch] = useContext(MyCommentContext)

    const [displayComment, setDisplayComment] = useContext(MyDisplayCommentContext)

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

    const handleView = () => {
        dispatch({
            type: "view",
            payload: {
                postId: post.id
            },
        });

        setDisplayComment(true)
    }

    const handleLike = async () => {

        try {
            setLoadingLike(true)
            let res = await authApis(info.token).post(endpoints['like'],
                {
                    "postId": post.id,
                    "userId": info.user.id
                }
            )
            if (res.data.data == true) {
                setIsLiked(true)
                setEmotions(emotions + 1)
            }
            else {
                setIsLiked(false)
                setEmotions(emotions - 1)
            }
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setLoadingLike(false)
        }
    }


    const getNumberOfComment = async () => {
        let res = await authApis(info.token).get(endpoints['getNumberOfComment'](post.id))
        setComments(res.data.data)
    }

    useEffect(() => {
        if (newComment) getNumberOfComment()
    }, [newComment])


    return (
        <View style={styles.container} >

            {/* THÔNG TIN BÀI VIẾT */}
            <View style={styles.userInfo} >
                <Avatar.Image size={50} source={{ uri: post.user.avatar }} />
                <View>
                    <Text style={styles.firstname} >{post.user.firstname}</Text>
                    <Text style={styles.createdDate} >{timeAgo(post.createdDate)}</Text>
                </View>

            </View>

            <Text style={styles.caption} >{post.caption}</Text>
            {post.event &&
                <Image style={styles.image} source={{ uri: post.event.image }} />
            }
            {post.images && <ImageGrid images={post.images} />}



            {/* SỐ LƯỢT TƯƠNG TÁC */}
            <View style={styles.interactiveContainer} >
                <TouchableOpacity onPress={handleLike} style={styles.interactive} >
                    {isLiked ?
                        <Icon color={MyColor.pink} size={24} source='heart' />
                        :
                        <Icon color='black' size={24} source='heart-outline' />
                    }
                    <Text>{emotions}</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.interactive} onPress={handleView}>
                    <Icon color='black' size={24} source='comment-outline' />
                    <Text>{comments}</Text>
                </TouchableOpacity>
            </View>
        </View>)
}

const styles = StyleSheet.create({
    container:
    {
        backgroundColor: 'white',
        marginVertical: 8
    },
    image:
    {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: 'white'
    },
    userInfo:
    {
        marginHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 8,
        gap: 8
    },
    caption:
    {
        marginHorizontal: 16,
        marginBottom: 8
    },
    firstname:
    {
        fontWeight: 700,
        fontSize: 16
    },
    createdDate:
    {
        fontSize: 12,
        color: 'grey'
    },
    interactiveContainer:
    {
        flexDirection: 'row',
        marginHorizontal: 16,
        marginVertical: 8,
        gap: 16
    },
    interactive:
    {
        flexDirection: 'row',
        gap: 4
    },
})

export default PostItem