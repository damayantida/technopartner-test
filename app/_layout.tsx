import { Stack } from 'expo-router';
import './global.css';

import {
	useFonts,
	Ubuntu_400Regular,
	Ubuntu_700Bold,
} from '@expo-google-fonts/ubuntu';
import * as SplashScreen from 'expo-splash-screen';
import { useCallback } from 'react';
import { View, Text } from 'react-native';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
	const [fontsLoaded] = useFonts({
		Ubuntu_400Regular,
		Ubuntu_700Bold,
	});

	const onLayoutRootView = useCallback(async () => {
		if (fontsLoaded) {
			await SplashScreen.hideAsync();
		}
	}, [fontsLoaded]);

	if (!fontsLoaded) return null;

	return (
		<View onLayout={onLayoutRootView} className='flex-1 font-ubuntu'>
			<Stack screenOptions={{ headerShown: false }} />
		</View>
	);
}
