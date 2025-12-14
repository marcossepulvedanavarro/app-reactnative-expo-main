import { StyleProp, StyleSheet, Text, TouchableOpacity, ViewStyle } from 'react-native'

interface ButtonProps {
    type?: 'primary' | 'outline' | 'success' | 'danger' | 'warning';
    text: string;
    onPress?: () => void;
    style?: StyleProp<ViewStyle>
    disabled?: boolean;
    loading?: boolean;
}

export default function Button({
    type = 'primary',
    text,
    onPress,
    style,
    disabled = false,
    loading = false,
}: ButtonProps) {
    return (
        <TouchableOpacity style={[styles.button, styles[type], style, (disabled || loading) && styles.disabled]} onPress={onPress} disabled={disabled || loading}>
            <Text style={[styles.buttonText, type === 'outline' && styles.buttonTextOutline]}>
                {loading ? 'Cargando...' : text}
            </Text>
        </TouchableOpacity>
    )
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: '#007AFF',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 8,
    },  
    primary: {
        backgroundColor: '#1ceb49ff',
    },
    outline: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: '#1ceb49ff',
    },
    success: {
        backgroundColor: '#28a745',
    },
    danger: {
        backgroundColor: '#dc3545',
    },
    warning: {
        backgroundColor: '#ffc107',
    },  
    buttonText: {
        color: '#ffffff',
        fontSize: 16,
        textAlign: 'center',
    },
    buttonTextOutline: {
        color: '#1ceb49ff',
    },
    disabled: {
        opacity: 0.6,
    },
})