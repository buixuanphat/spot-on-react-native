import { StyleSheet } from "react-native";

export default StyleSheet.create(
    {
        container:
        {
            backgroundColor: '#F7F7F7',
            flex: 1,

        },

        inputRoundedHorizontal:
        {
            elevation: 20,
            backgroundColor: 'white',
            borderTopRightRadius: 50,
            borderTopLeftRadius: 50,
            borderBottomRightRadius: 50,
            borderBottomLeftRadius: 50,
            fontSize: 18,
            fontFamily: 'roboto'
        },

        buttonRoundedHorizontal:
        {
            backgroundColor: '#0D47A1',
            borderRadius: 50,
            padding: 4,
        },
        buttonRoundedHorizontalOutline:
        {
            borderColor: '#0D47A1',
            borderWidth: 1,
            borderRadius: 50,
            padding: 4,
        },
        textBoldSmall:
        {
            fontWeight: 'bold',
            fontSize: 16
        },
        textBoldNormal:
        {
            fontWeight: 'bold',
            fontSize: 18
        }, textBoldBig:
        {
            fontWeight: 'bold',
            fontSize: 20
        }
    }
);