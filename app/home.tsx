import { useEffect, useState, useRef } from 'react';
import {
	View,
	Text,
	Image,
	ScrollView,
	RefreshControl,
	TouchableOpacity,
	Alert,
	ImageBackground,
	Modal,
	Dimensions,
} from 'react-native';
import axios from 'axios';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
	const [data, setData] = useState<any>(null);
	const [refreshing, setRefreshing] = useState(false);
	const [bannerIndex, setBannerIndex] = useState(0);
	const [qrVisible, setQrVisible] = useState(false);
	const bannerScrollRef = useRef<ScrollView>(null);
	const [bannerModalVisible, setBannerModalVisible] = useState(false);

	const router = useRouter();

	// === Fetch home data with fresh token ===
	const fetchData = async () => {
		try {
			const res = await axios.get('http://localhost:3001/api/home');
			setData(res.data.result);
		} catch (err) {
			console.error('API error:', err);
			Alert.alert('Error', 'Failed to fetch data. Please try again.');
		}
	};

	useEffect(() => {
		fetchData();
	}, []);

	const onRefresh = () => {
		setRefreshing(true);
		fetchData().finally(() => setRefreshing(false));
	};

	// Auto-slide banner every 2 seconds
	useEffect(() => {
		const interval = setInterval(() => {
			if (data?.banner?.length) {
				setBannerIndex((prev) => (prev + 1) % data.banner.length);
			}
		}, 2000);
		return () => clearInterval(interval);
	}, [data]);

	return (
		<View className='flex-1 bg-[#F5F5F5] relative'>
			<ScrollView
				className='flex-1'
				refreshControl={
					<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
				}
			>
				{/* Header with Logo */}
				<View className='flex-row items-center p-4'>
					<Image
						source={require('../assets/images/logo-techno.png')}
						className='w-40 h-10'
						resizeMode='contain'
					/>
				</View>

				{/* Section with Pattern Background */}
				<ImageBackground
					source={require('../assets/images/pattern BG.jpg')} // <- change to your actual path
					className='p-6 w-full'
				>
					{/* Main Card */}
					{data ? (
						<View className='bg-white rounded-lg p-4'>
							<Text className='text-gray-500'>{data.greeting}</Text>
							<Text className='text-black font-bold text-lg'>{data.name}</Text>

							<View className='flex-row items-center justify-between w-full mt-2'>
								{/* Left side: QR code + labels */}
								<View className='flex-row items-center gap-4'>
									<TouchableOpacity
										className='w-12 h-12'
										onPress={() => setQrVisible(true)}
									>
										<Image
											source={{ uri: data.qrcode }}
											className='w-12 h-12'
											resizeMode='contain'
										/>
									</TouchableOpacity>

									<View>
										<Text className='text-gray-500'>Saldo</Text>
										<Text className='text-gray-500 mt-1'>Points</Text>
									</View>
								</View>

								{/* Right side: values */}
								<View className='items-end'>
									<Text className='text-black'>
										Rp {data.saldo.toLocaleString()}
									</Text>
									<Text className='text-green-500'>{data.point}</Text>
								</View>
							</View>
						</View>
					) : (
						<Text className='text-center text-gray-500'>Loading...</Text>
					)}
				</ImageBackground>

				{/* Banner Carousel */}
				{data?.banner?.length > 0 && (
					<View className='mb-4'>
						<ScrollView
							ref={bannerScrollRef}
							horizontal
							pagingEnabled
							scrollEnabled={false}
							showsHorizontalScrollIndicator={false}
						>
							{data.banner.map((url: string, idx: number) => (
								<Image
									key={idx}
									source={{ uri: url }}
									className='w-[100vw] h-[180px]'
									resizeMode='cover'
									style={{
										marginRight: idx === data.banner.length - 1 ? 0 : 8,
									}}
								/>
							))}
						</ScrollView>

						<View className='flex-row justify-between mt-2 px-4'>
							{/* Dot indicators */}
							<View className='flex-row justify-center items-center'>
								{data.banner.map((_: any, i: number) => (
									<View
										key={i}
										className={`w-2 h-2 mx-2 rounded-full ${
											i === bannerIndex ? 'bg-[#00D78B]' : 'bg-gray-300'
										}`}
									/>
								))}
							</View>

							{/* View All button */}
							<View className='flex items-end'>
								<TouchableOpacity
									onPress={() => setBannerModalVisible(true)}
									className='px-4 py-2 flex-row items-center justify-end'
								>
									<Text className='text-[#00D78B] font-medium mr-1'>
										View All
									</Text>
									<Image
										source={require('../assets/images/arrow-right.png')}
										className='w-5 h-5'
										resizeMode='contain'
									/>
								</TouchableOpacity>
							</View>
						</View>
					</View>
				)}
			</ScrollView>

			{/* QR Code Fullscreen Modal */}
			<Modal visible={qrVisible} animationType='slide' transparent={false}>
				<View className='flex-1 bg-white justify-center items-center px-4'>
					<Text className='text-md text-center mb-10'>
						Show the QR Code below to the cashier
					</Text>
					{data?.qrcode && (
						<Image
							source={{ uri: data.qrcode }}
							className='w-[175px] h-[175px] mb-6'
							resizeMode='contain'
						/>
					)}
					<TouchableOpacity
						onPress={() => setQrVisible(false)}
						className='absolute top-4 right-4 p-2'
					>
						<Text className='text-xl font-bold'>✕</Text>
					</TouchableOpacity>
				</View>
			</Modal>

			{/* Banner Modal */}
			<Modal
				visible={bannerModalVisible}
				animationType='slide'
				transparent={false}
			>
				<View className='flex-1 bg-white pt-12 px-4'>
					<TouchableOpacity
						onPress={() => setBannerModalVisible(false)}
						className='absolute top-4 right-4 p-2 z-10'
					>
						<Text className='text-xl font-bold'>✕</Text>
					</TouchableOpacity>

					<ScrollView className='mt-4'>
						{data?.banner?.map((url: string, index: number) => (
							<Image
								key={index}
								source={{ uri: url }}
								className='w-full h-48 rounded-xl mb-4'
								resizeMode='cover'
							/>
						))}
					</ScrollView>
				</View>
			</Modal>

			{/* Bottom Navigation */}
			<View className='absolute bottom-0 left-0 right-0 flex-row justify-around bg-white p-4 border-t border-gray-200'>
				<TouchableOpacity>
					<View className='flex flex-col items-center'>
						<Image
							source={require('../assets/images/home-active.png')}
							className='w-6 h-6'
							resizeMode='contain'
						/>
						<Text className='text-black font-semibold'>Home</Text>
					</View>
				</TouchableOpacity>
				<TouchableOpacity onPress={() => router.push('/menu')}>
					<View className='flex flex-col items-center'>
						<Image
							source={require('../assets/images/menu.png')}
							className='w-6 h-6'
							resizeMode='contain'
						/>
						<Text className='text-gray-500'>Menu</Text>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	);
}
