import { Text, View, TextInput, TouchableOpacity, Image } from 'react-native';
import { useState } from 'react';
import { useRouter } from 'expo-router';

export default function Index() {
	const router = useRouter();
	const [email, setEmail] = useState('');
	const [password, setPassword] = useState('');

	const handleLogin = () => {
		router.push('/home');
	};

	return (
		<View className='flex-1 items-center justify-center px-6'>
			<Image
				source={require('../assets/images/logo-techno.png')}
				resizeMode='contain'
				className='mb-20'
			/>

			{/* Email Input */}
			<View className='w-full mb-6 flex justify-center items-center'>
				<Text className='text-base font-medium mb-2 text-[#A7A7A7] text-center'>
					Email
				</Text>
				<TextInput
					value={email}
					onChangeText={setEmail}
					keyboardType='email-address'
					autoCapitalize='none'
					className='text-gray-900 bg-primary w-full max-w-[198px] shadow-md rounded-lg p-2 text-center'
				/>
			</View>

			{/* Password Input */}
			<View className='w-full mb-8 flex justify-center items-center'>
				<Text className='text-base font-medium mb-2 text-[#A7A7A7] text-center'>
					Password
				</Text>
				<TextInput
					value={password}
					onChangeText={setPassword}
					secureTextEntry
					className='text-gray-900 bg-primary w-full max-w-[198px] shadow-md rounded-lg p-2 text-center'
				/>
			</View>

			{/* Login Button */}
			<TouchableOpacity
				onPress={handleLogin}
				className='bg-primary px-10 py-3 rounded-lg shadow-md'
			>
				<Text className='text-gray-800 font-semibold'>Login</Text>
			</TouchableOpacity>
		</View>
	);
}
