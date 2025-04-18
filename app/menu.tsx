import { useEffect, useRef, useState } from 'react';
import {
	View,
	Text,
	Image,
	ScrollView,
	TouchableOpacity,
	Alert,
	SafeAreaView,
	findNodeHandle,
	UIManager,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function MenuScreen() {
	const [data, setData] = useState<any[]>([]);
	const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
	const scrollViewRef = useRef<ScrollView>(null);
	const sectionRefs = useRef<any[]>([]);
	const router = useRouter();

	const login = async () => {
		const formData = new FormData();
		formData.append('grant_type', 'password');
		formData.append('client_secret', '0a40f69db4e5fd2f4ac65a090f31b823');
		formData.append('client_id', 'e78869f77986684a');
		formData.append('username', 'support@technopartner.id');
		formData.append('password', '1234567');

		const res = await axios.post(
			'https://soal.staging.id/oauth/token',
			formData,
			{
				headers: {
					'Content-Type': 'multipart/form-data',
				},
			}
		);

		return res.data.access_token;
	};

	const fetchMenu = async () => {
		try {
			const token = await login();

			const res = await axios.post(
				'https://soal.staging.id/api/menu',
				{ show_all: 1 },
				{
					headers: {
						Authorization: `Bearer ${token}`,
					},
				}
			);

			setData(res.data.result.categories);
			if (res.data.result.categories.length > 0) {
				setSelectedCategory(res.data.result.categories[0].category_name);
			}
		} catch (err) {
			console.error('Menu API error:', err);
			Alert.alert('Error', 'Failed to fetch menu');
		}
	};

	useEffect(() => {
		fetchMenu();
	}, []);

	const scrollToCategory = (index: number, name: string) => {
		setSelectedCategory(name);

		const sectionRef = sectionRefs.current[index];
		const sectionHandle = findNodeHandle(sectionRef);
		const scrollHandle = findNodeHandle(scrollViewRef.current);

		if (sectionHandle != null && scrollHandle != null) {
			UIManager.measureLayout(
				sectionHandle,
				scrollHandle,
				() => console.warn('measure failed'),
				(x, y) => {
					scrollViewRef.current?.scrollTo({ y, animated: true });
				}
			);
		}
	};

	return (
		<SafeAreaView className='flex-1 bg-[#F5F5F5]'>
			{/* Compact Header */}
			<View className='bg-white px-4 py-4'>
				<Text className='text-lg font-bold text-black text-center font-ubuntu-bold'>
					MENU
				</Text>
			</View>

			{/* Category Tabs */}
			<View className='bg-white pt-2 border-b border-gray-200'>
				<ScrollView
					horizontal
					showsHorizontalScrollIndicator={false}
					contentContainerStyle={{ paddingHorizontal: 20 }}
				>
					{data.map((cat, i) => (
						<TouchableOpacity
							key={i}
							onPress={() => scrollToCategory(i, cat.category_name)}
							className='mr-4 px-4'
						>
							<Text
								className={`text-base font-medium ${
									selectedCategory === cat.category_name
										? 'text-black'
										: 'text-gray-500'
								}`}
								style={{
									borderBottomWidth:
										selectedCategory === cat.category_name ? 2 : 0,
									borderBottomColor: 'black',
									paddingBottom: 4,
								}}
							>
								{cat.category_name}
							</Text>
						</TouchableOpacity>
					))}
				</ScrollView>
			</View>

			{/* Menu List */}
			<ScrollView
				ref={scrollViewRef}
				className='flex-1 pt-2'
				contentContainerStyle={{ paddingBottom: 80 }}
				showsVerticalScrollIndicator={false}
			>
				{data.map((cat, i) => (
					<View
						key={i}
						ref={(ref) => (sectionRefs.current[i] = ref)}
						collapsable={false}
					>
						<Text className='text-base font-bold text-black my-4 pl-4'>
							{cat.category_name}
						</Text>
						<View className='bg-white'>
							{cat.menu.map((item: any, j: number) => (
								<View className='flex-1' key={j}>
									<View className='bg-white mb-4 p-4 flex-row items-start justify-center gap-2'>
										<Image
											source={{ uri: item.photo }}
											className='w-20 h-full rounded-lg mr-4'
											resizeMode='contain'
										/>
										<View className='flex-1'>
											<Text className='text-base font-semibold text-black'>
												{item.name}
											</Text>
											<Text className='text-gray-500 text-sm mb-1'>
												{item.description}
											</Text>
										</View>
										<Text className='font-bold'>
											{item.price.toLocaleString()}
										</Text>
									</View>
									{j !== cat.menu.length - 1 && (
										<View className='border-b border-gray-200 border-dashed' />
									)}
								</View>
							))}
						</View>
					</View>
				))}
			</ScrollView>

			{/* Bottom Navigation */}
			<View className='absolute bottom-0 left-0 right-0 flex-row justify-around bg-white p-4 border-t border-gray-200'>
				<TouchableOpacity onPress={() => router.push('/home')}>
					<View className='flex-col items-center justify-center'>
						<Image
							source={require('../assets/images/home.png')}
							className='w-6 h-6'
							resizeMode='contain'
						/>
						<Text className='text-gray-500'>Home</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity>
					<View className='flex-col items-center justify-center'>
						<Image
							source={require('../assets/images/menu-active.png')}
							className='w-6 h-6'
							resizeMode='contain'
						/>
						<Text className='text-black font-semibold'>Menu</Text>
					</View>
				</TouchableOpacity>
			</View>
		</SafeAreaView>
	);
}
