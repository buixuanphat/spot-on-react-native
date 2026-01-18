import { useContext, useEffect, useState } from "react"
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from "react-native"
import { Avatar } from "react-native-paper"
import { authApis, endpoints } from "../utils/Apis"
import { MyCommentContext, MyReloadCommentContext, MyUserContext } from "../MyContext"
import ListFooter from "./ListFooter"
import ItemChildComment from "./ItemChildComment"

const ItemComment = ({ comment }) => {

    const [info] = useContext(MyUserContext)

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

    const [childrens, setChildrens] = useState([])
    const [page, setPage] = useState(0)
    const [last, setLast] = useState(false)
    const [totalPages, setTotalPages] = useState(1)
    const [commentInfo, dispatch] = useContext(MyCommentContext)

    const loadChildrenComment = async () => {
        try {
            let url = `${endpoints['getChildrenComment']}?parentId=${comment.id}&&page=${page}`
            let res = await authApis(info.token).get(url)
            if (page == 0) {
                setChildrens(res.data.data.content)
            }
            else {
                setChildrens(prev => [...prev, ...res.data.data.content])
            }
            setLast(res.data.data.last)
            setTotalPages(res.data.data.totalPages)
        }
        catch (e) {
            console.error(e)
        }
    }

    const handleReply = () => {
        dispatch({
            type: "reply",
            payload: {
                parentId: comment.id,
                responseName: comment.user.firstname
            },
        });
    }

    const newComment = useContext(MyReloadCommentContext)

    useEffect(() => {
        if (newComment.parentId) {
            setChildrens([])
            setPage(0)
            loadChildrenComment()
        }
    }, [newComment])


    useEffect(() => {
        if (page < totalPages) {
            loadChildrenComment()
        }
    }, [page])




    return (
        <View style={styles.container} >
            <Avatar.Image style={styles.avatar} size={34} source={{ uri: comment.user.avatar }} />
            <View style={{ gap: 1 }} >
                <View style={styles.userInfo} >
                    <Text style={styles.firstname} >{comment.user.firstname}</Text>
                    <Text style={styles.created} >{timeAgo(comment.createdDate)}</Text>
                </View>
                <Text>{comment.content}</Text>
                <TouchableOpacity onPress={handleReply}>
                    <Text style={styles.response}>Trả lời</Text>
                </TouchableOpacity>
                {comment.childrens > 0 &&
                    <TouchableOpacity onPress={() => setPage(0)} >
                        <Text style={styles.response}>Xem {comment.childrens} câu trả lời</Text>
                    </TouchableOpacity>
                }
                {childrens &&
                    <FlatList
                        data={childrens}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) =>
                            <ItemChildComment
                                comment={item} />
                        }
                        ListFooterComponent={!last &&
                            <ListFooter
                                onPress={() => {
                                    if (!last) setPage(page + 1)
                                }} />}
                    />
                }
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

export default ItemComment