import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { format, setDate } from 'date-fns';
import { HelperText, Icon } from 'react-native-paper';
import MyStyles from '../MyStyles';

export default function DatePicker({ style, onChange, error }) {

    const [date, setDate] = useState();
    const [show, setShow] = useState(false);


    return (
        <View style={style}>
            <TouchableOpacity
                onPress={() => setShow(true)}
                style={[MyStyles.inputRoundedHorizontal, { padding: 16, flexDirection: 'row' }]}
            >
                <Icon source="calendar-range" size={24} />
                <Text style={{ fontSize: 18, marginLeft: 16 }}>{date}</Text>
            </TouchableOpacity>

            <DateTimePickerModal
                isVisible={show}
                mode="date"
                onConfirm={(value) => {
                    setDate(format(value, 'yyyy-MM-dd'));
                    setShow(false);
                    onChange(format(value, 'yyyy-MM-dd'));
                }
                }
                onCancel={() => setShow(false)}
                maximumDate={new Date()}
            />
            {error && <HelperText style={{ marginLeft: 32 }} numberOfLines={1} type="error">
                {error}
            </HelperText>}
        </View>
    );
}
