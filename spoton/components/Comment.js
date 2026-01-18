import { useContext, useEffect, useState } from "react"
import { FlatList, StyleSheet, Text, View } from "react-native"
import { authApis, endpoints } from "../utils/Apis"
import { MyCommentContext, MyDisplayCommentContext, MyReloadCommentContext, MyUserContext } from "../MyContext"

import ItemComment from "./ItemComment"
import ListFooter from "./ListFooter"



const Comment = () => {

    const [parentComment, setParentComment] = useState([])
    const [totalPages, setTotalPages] = useState(1)
    const [last, setLast] = useState(false)
    const [info] = useContext(MyUserContext)
    const [commentInfo, dispatch] = useContext(MyCommentContext)
    const newComment = useContext(MyReloadCommentContext)
    const [page, setPage] = useState(0)

    const loadParentComment = async () => {
        try {
            let url = `${endpoints['getParentComments']}?postId=${commentInfo.postId}&&page=${page}`
            console.log("URL: " + url)
            let res = await authApis(info.token).get(url)
            if (page == 0) {
                setParentComment(res.data.data.content)
            }
            else {
                setParentComment(prev => [...prev, ...res.data.data.content])
            }
            setLast(res.data.data.last)
            setTotalPages(res.data.data.totalPages)
        }
        catch (e) {
            console.log(e)
            console.log(e.response?.data)
        }
    }



    useEffect(() => {
        if (page < totalPages) {
            loadParentComment()
        }
    }, [page])


    useEffect(() => {
        if (newComment) {
            setPage(0)
            setParentComment([])
            loadParentComment()
        }
    }, [newComment])



    return (
        <FlatList
            data={parentComment}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) =>
                <ItemComment
                    comment={item} />
            }
            ListFooterComponent={!last ?
                <View>
                    <ListFooter onPress={() => {
                        if (!last) setPage(page + 1)
                    }} />
                    <View style={{ margin: 25 }}></View>
                </View> :
                <View style={{ margin: 25 }}></View>
            }
        />
    )
}

export default Comment