// Purpose: Authentication screen for member login.
import React, { useState } from 'react';
import { View, Text, TextInput, Alert } from 'react-native';
import { useTheme } from '../../theme';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';
import AppButton from '../../components/AppButton';
import appConfig from '../../config/appConfig';

export default function LoginScreen() {
    // In mock mode any member from mocks/members.json can log in (without a password)
    const [email, setEmail] = useState(appConfig.useMock ? 'demo@example.com' : '');
    const [password, setPassword] = useState('');
    const { signIn } = useAuth();
    const navigation = useNavigation();
    const theme = useTheme();

    async function doLogin() {
        const res = await signIn(email, password);
        if (res.ok) {
            navigation.goBack();
        } else {
            Alert.alert('Login failed', res.message || 'Unknown error');
        }
    }

    return (
        <View style={{ flex: 1, padding: theme.spacing.xxl }}>
            <Text style={{ ...theme.typography.h2, marginBottom: theme.spacing.sm, color: theme.colors.text }}>Please enter your credentials</Text>
            <TextInput
                placeholder="Email"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
                style={{ padding: theme.spacing.sm, borderWidth: 1, marginBottom: theme.spacing.sm, borderColor: theme.colors.muted }}
            />
            <TextInput
                placeholder="Password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                style={{ padding: theme.spacing.sm, borderWidth: 1, marginBottom: theme.spacing.sm, borderColor: theme.colors.muted }}
            />
            <AppButton title="Log in" variant="activate" onPress={doLogin} />
        </View>
    );
}
