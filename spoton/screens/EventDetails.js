import React, { useContext, useEffect, useState } from "react";
import { Image, View, StyleSheet, ScrollView, Platform, ActivityIndicator, TouchableOpacity } from "react-native";
import { Avatar, Button, Card, Divider, Icon, IconButton, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";
import { WebView } from "react-native-webview";
import { authApis, endpoints } from "../utils/Apis";
import { MyUserContext } from "../MyContext";
import MyStyles from "../MyStyles";
import MyColor from "../MyColor";
import MySection from "../components/MySection";
import ButtonRoundedHorizontal from "../components/ButtonRoundedHorizontal";
import EventIntro from "../components/EventIntro";
import OrganizerInfo from "../components/OrganizerInfo";
import RenderHtml from 'react-native-render-html';
import { MyStatus } from "../utils/Enum";
import { Rating } from "react-native-ratings";
import { LinearGradient } from "expo-linear-gradient";


const EventDetails = ({ navigation, route }) => {
    const [event, setEvent] = useState(null);
    const [loading, setLoading] = useState(false);
    const [loadingSections, setLoadingSections] = useState(false);
    const [info] = useContext(MyUserContext);
    const [sections, setSection] = useState([])
    const [ratings, setRatings] = useState([])
    const [star, setStar] = useState()

    const loadEvent = async () => {
        try {
            setLoading(true);
            const res = await authApis(info.token).get(endpoints['getEvent'](route.params.event.id));
            setEvent(res.data.data);
        } catch (e) {
            console.error("Lỗi khi tải sự kiện:", e);
        } finally {
            setLoading(false);
        }
    };

    const loadSection = async () => {
        try {
            setLoadingSections(true);
            const res = await authApis(info.token).get(endpoints['getSections'](route.params.event.id));
            setSection(res.data.data)
        } catch (e) {
            console.error("Lỗi khi tải loại vé:", e);
        } finally {
            setLoadingSections(false);
        }
    }


    const interact = async () => {
        try {
            let url = endpoints['interaction'](event?.id, info.user.id, 'watch')
            let res = await authApis(info.token).post(url)
            console.log(url)
            console.log("Đã xem", res.status)
        }
        catch (e) {
            console.log(e)
        }
    }


    useEffect(() => {
        let timer = setTimeout(() => {
            interact()
        }, 10000)
        return () => clearTimeout(timer)
    })


    const loadRating = async () => {
        try {
            let res = await authApis(info.token).get(endpoints['getEvaluations'](route.params.event.id))
            setRatings(res.data.data.content)
        }
        catch (e) {
            console.error(e)
        }
    }

    useEffect(() => {
        if (ratings.length > 0) {
            const avg =
                ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length;
            setStar(avg);
        }
    }, [ratings]);

    useEffect(() => {
        loadEvent();
        loadSection();
        if (route.params.event.status == MyStatus.expired) {
            loadRating()
        }
    }, []);

    const injectedHtml = event ? `
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-size: 110%; 
              margin: 0; 
              padding: 0; 
            }
            img { max-width: 100%; height: auto; } 
          </style>
        </head>
        <body>
          ${event.description}
        </body>
      </html>
    ` : '';

    return (
        <SafeAreaView style={MyStyles.container}>
            {event && (
                <View style={{ flex: 1 }}>
                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={{ paddingBottom: 32 }}
                        nestedScrollEnabled={true}
                    >
                        <EventIntro event={event} />

                        <View style={styles.sections} >
                            <Text style={styles.label} >Loại vé</Text>
                            <Divider style={styles.divider} />
                            {sections &&
                                sections.map(s =>
                                    <MySection key={s.id} section={s} />
                                )
                            }
                        </View>



                        {/* MÔ TẢ */}
                        <View style={styles.descriptionCard}>
                            <Text style={styles.label}>GIỚI THIỆU CHI TIẾT</Text>
                            <Divider style={styles.divider} />

                            <View style={[styles.webViewContainer, { height: 200, overflow: 'hidden' }]}>
                                <WebView
                                    source={{ html: injectedHtml }}
                                    scrollEnabled={false}
                                />

                                <LinearGradient
                                    colors={['rgba(255,255,255,0)', 'rgba(255,255,255,0.9)', 'white']}
                                    style={styles.gradientOverlay}
                                >
                                    <TouchableOpacity onPress={() => navigation.navigate("Description", { source: injectedHtml })}>
                                        <Text style={{ color: MyColor.darkGrey, fontWeight: 700, fontSize: 14 }}>Xem thêm</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>
                        </View>


                        {/* ĐÁNH GIÁ */}
                        {star &&
                            <View style={styles.ratingContainer} >
                                <Text style={styles.label}>Đánh giá</Text>
                                <View style={styles.starContainer} >
                                    <View style={{ flexDirection: 'row', alignItems: 'center' }} >
                                        <Rating
                                            type="star"
                                            ratingCount={5}
                                            imageSize={30}
                                            startingValue={star}
                                            readonly
                                        />
                                        <Text style={{ marginLeft: 16, fontSize: 18, fontWeight: 700 }} >{star}/5</Text>
                                    </View>

                                    <TouchableOpacity onPress={() => navigation.navigate("RatingDetails", { ratings: ratings })}>
                                        <Icon size={30} source='arrow-right' />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }

                        {/* BAN TỔ CHỨC */}
                        <OrganizerInfo organizer={event.organizer} />


                    </ScrollView>

                    {/* NÚT MUA VÉ */}
                    {event.status == MyStatus.running &&
                        <View>
                            <ButtonRoundedHorizontal icon='cart-plus' title="Mua vé" loading={loading} style={{ margin: 16 }}
                                onPress={() => navigation.navigate('Ticket', event)} />
                        </View>
                    }
                </View>
            )}
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({

    label: {
        fontSize: 14,
        fontWeight: 700,
        color: 'grey',
        textTransform: 'uppercase',
        letterSpacing: 1,
    },
    divider: {
        height: 1,
        backgroundColor: MyColor.greyLight,
        marginVertical: 10,
    },
    descriptionCard: {
        margin: 16,
        backgroundColor: 'white',
        borderRadius: 16,
        padding: 16,
    },

    webViewContainer: {
        height: 200,
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        width: '100%',
    },
    webView: {
        flex: 1,
    },
    gradientOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: 100,
        justifyContent: 'flex-end',
        alignItems: 'center',
        paddingBottom: 10,
    },
    sections:
    {
        margin: 16,
        padding: 16,
        backgroundColor: 'white',
        borderRadius: 16
    },
    ratingContainer:
    {
        margin: 16,
        borderRadius: 16,
        backgroundColor: 'white',
        padding: 16,
        gap: 8
    },
    starContainer:
    {
        alignItems: 'flex-start',
        flexDirection: 'row',
        justifyContent: 'space-between'
    }
});

export default EventDetails;