import * as React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Snackbar } from 'react-native-paper';

const MySnackBar = ({ show, label, color }) => {
    const [visible, setVisible] = React.useState(show);

    return (

        <Snackbar
            style={{ backgroundColor: color }}
            visible={show}>
            {label}
        </Snackbar>

    );
};

export default MySnackBar;