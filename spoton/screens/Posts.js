import { useContext, useEffect, useReducer, useRef, useState } from "react"
import { authApis, endpoints } from "../utils/Apis"
import { MyCommentContext, MyDisplayCommentContext, MyReloadCommentContext, MyUserContext } from "../MyContext"
import { Animated, FlatList, KeyboardAvoidingView, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native"
import MyIndicator from "../components/MyIndicator"
import PostItem from "../components/PostItem"
import { Appbar, Avatar, Button, Icon, Searchbar } from "react-native-paper"
import MyColor from "../MyColor"
import MyCommentReducer from "../reducers/MyCommentReducer"
import Comment from "../components/Comment"


const Posts = ({ navigation }) => {

    const [info] = useContext(MyUserContext)

    const [posts, setPosts] = useState([])
    const [loadingPosts, setLoadingPosts] = useState(false)

    const [page, setPage] = useState(0)
    const [totalPages, setTotalPages] = useState(1)
    const [last, setLast] = useState(false)

    const [searching, setSearching] = useState(false)
    const [kw, setKw] = useState('')

    const [content, setContent] = useState('')
    const [loadingCreteComment, setLoadingCreateComment] = useState(false)
    const [displayComment, setDisplayComment] = useState(false)
    const [commentInfo, dispatch] = useReducer(MyCommentReducer,
        {
            parentId: null,
            responseName: null,
            display: false,
            postId: null
        }
    )

    const [newComment, setNewComment] = useState({})
    const createComment = async () => {
        try {
            setLoadingCreateComment(true)
            let resquest =
            {
                "userId": info.user.id,
                "postId": commentInfo.postId,
                "content": commentInfo.responseName ? `@${commentInfo.responseName}: ` + content : content,
            }
            if (commentInfo.parentId) {
                resquest = { ...resquest, "parentId": commentInfo.parentId }
            }
            let res = await authApis(info.token).post(endpoints.createComment, resquest)
            setNewComment(res.data.data)
            handleDone()
            setContent('')
        }
        catch (e) {
            console.log(e)
        }
        finally {
            setLoadingCreateComment(false)
        }
    }


    const loadPosts = async () => {
        try {
            setLoadingPosts(true)
            let url = `${endpoints['getPosts']}?userId=${info.user.id}&&page=${page}&&kw=${kw}`
            console.log(url)
            let res = await authApis(info.token).get(url)
            if (page == 0) {
                setPosts(res.data.data.content)
            }
            else {
                setPosts(prev => [...prev, ...res.data.data.content])
            }
            setLast(res.data.data.last)
            setTotalPages(res.data.data.totalPages)
        }
        catch (e) {
            console.error(e)
        }
        finally {
            setLoadingPosts(false)
        }
    }


    const handleDone = () => {
        dispatch({
            type: "done",
            payload: {
                parentId: null,
                responseName: null
            },
        });
    }





    const translateY = useRef(new Animated.Value(500)).current;

    useEffect(() => {
        if (displayComment) {
            Animated.timing(translateY, {
                toValue: 0,
                duration: 300,
                useNativeDriver: true,
            }).start();
        } else {
            Animated.timing(translateY, {
                toValue: 500,
                duration: 300,
                useNativeDriver: true,
            }).start();
        }
    }, [displayComment]);


    useEffect(() => {
        if (page < totalPages) loadPosts()
    }, [page])


    const [refreshing, setRefreshing] = useState(false)

    const handleRefresh = async () => {
        try {
            setRefreshing(true)

            setKw('')
            setPage(0)
            setLast(false)
            setTotalPages(1)

            setPosts([])

            let url = `${endpoints['getPosts']}?userId=${info.user.id}&&page=0`
            let res = await authApis(info.token).get(url)

            setPosts(res.data.data.content)
            setLast(res.data.data.last)
            setTotalPages(res.data.data.totalPages)
        }
        catch (e) {
            console.error(e)
        }
        finally {
            setRefreshing(false)
        }
    }


    useEffect(() => {
        const timer = setTimeout(() => {
            setPage(0)
            loadPosts()
        }, 1000)
        return () => clearTimeout(timer)
    }, [kw])



    return (
        <MyCommentContext.Provider value={[commentInfo, dispatch]} >
            <MyReloadCommentContext.Provider value={newComment}>
                <MyDisplayCommentContext.Provider value={[displayComment, setDisplayComment]} >
                    <View style={styles.container} >
                        <Appbar.Header>
                            <Appbar.Content
                                title="Cộng đồng"
                                titleStyle={{
                                    fontSize: 22,
                                    fontWeight: 'bold',
                                    color: '#1a1a1a'
                                }}
                            />

                            <Appbar.Action icon='plus' onPress={() => { navigation.navigate('CreatePost') }} />
                            <Appbar.Action icon='magnify' onPress={() => { setSearching(true) }} />

                        </Appbar.Header>


                        {/* THANH TÌM KIẾM */}
                        {searching && <Searchbar value={kw} onChangeText={setKw} style={styles.searchBar} placeholder="Nhập từ khóa tìm kiếm" />}



                        {/* DANH SÁCH BÀI VIẾT */}
                        {posts ?
                            <FlatList
                                onScrollBeginDrag={() => setSearching(false)}
                                refreshing={refreshing}
                                onRefresh={handleRefresh}
                                onEndReached={() => {
                                    if (!loadingPosts && !last) {
                                        setPage(prev => prev + 1)
                                    }
                                }}
                                ListFooterComponent={loadingPosts && <MyIndicator />}
                                data={posts}
                                keyExtractor={(item) => item.id.toString()}
                                renderItem={({ item }) =>
                                    <PostItem post={item} setContent={setContent} />}
                            /> :
                            <MyIndicator />
                        }



                        {/* DANH SÁCH COMMENTS */}
                        <Modal transparent visible={displayComment} animationType="none">
                            <TouchableOpacity style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.3)' }} onPress={() => setDisplayComment(false)} />
                            <Animated.View style={{
                                flex: 1,
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                height: 500,
                                backgroundColor: 'white',
                                borderTopLeftRadius: 16,
                                borderTopRightRadius: 16,
                                transform: [{ translateY: translateY }],
                            }}>
                                <Text style={{ fontSize: 18, fontWeight: 'bold', margin: 16 }}>Bình Luận</Text>


                                <Comment postId={commentInfo.postId} />




                                {/* NHẬP COMMENTS */}
                                <View style={styles.commentContaner} >
                                    <Avatar.Image style={styles.avatar} size={34} source={{ uri: info.user.avatar }} />
                                    <View style={styles.inputComment} >
                                        {commentInfo.parentId && <Text style={styles.responseName} >@{commentInfo.responseName}</Text>}
                                        <TextInput multiline style={styles.input} value={content} onChangeText={setContent} placeholder="Nhập bình luận" />
                                    </View>
                                    {!loadingCreteComment ?
                                        <TouchableOpacity onPress={createComment}>
                                            <Icon size={34} source='arrow-up-circle' />
                                        </TouchableOpacity> :
                                        <MyIndicator />
                                    }
                                </View>
                            </Animated.View>
                        </Modal>
                    </View>
                </MyDisplayCommentContext.Provider>
            </MyReloadCommentContext.Provider>
        </MyCommentContext.Provider>
    )
}

const styles = StyleSheet.create({
    container:
    {
        flex: 1
    },
    commentContaner:
    {
        flexDirection: 'row',
        gap: 12,
        alignItems: 'center',
        marginVertical: 8,
        marginHorizontal: 16,
        backgroundColor: 'white',
        borderRadius: 8,
        paddingHorizontal: 4,
        position: 'absolute',
        bottom: 0
    },
    inputComment:
    {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: MyColor.background,

        width: '100%',
        borderRadius: 8,
        paddingLeft: 4
    },
    response:
    {
        fontWeight: 900,
        color: MyColor.primary
    },
    input:
    {
        backgroundColor: MyColor.background,
        flex: 1,
        borderRadius: 8,
    },
    responseName:
    {
        fontWeight: 700,
        color: MyColor.primary
    },
    searchBar:
    {
        backgroundColor: 'white',
        marginHorizontal: 16,
        marginTop: 8
    }
})

export default Posts