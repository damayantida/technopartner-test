const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/home', async (req, res) => {
	try {
		const formData = new URLSearchParams();
		formData.append('grant_type', 'password');
		formData.append('client_secret', '0a40f69db4e5fd2f4ac65a090f31b823');
		formData.append('client_id', 'e78869f77986684a');
		formData.append('username', 'support@technopartner.id');
		formData.append('password', '1234567');

		const tokenRes = await axios.post(
			'https://soal.staging.id/oauth/token',
			formData,
			{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
		);

		const token = tokenRes.data.access_token;

		const homeRes = await axios.get('https://soal.staging.id/api/home', {
			headers: { Authorization: `Bearer ${token}` },
		});

		res.json(homeRes.data);
	} catch (err) {
		console.error('Home proxy error:', err.message);
		res.status(500).json({ error: 'Something went wrong on /api/home.' });
	}
});

app.post('/api/menu', async (req, res) => {
	try {
		const formData = new URLSearchParams();
		formData.append('grant_type', 'password');
		formData.append('client_secret', '0a40f69db4e5fd2f4ac65a090f31b823');
		formData.append('client_id', 'e78869f77986684a');
		formData.append('username', 'support@technopartner.id');
		formData.append('password', '1234567');

		const tokenRes = await axios.post(
			'https://soal.staging.id/oauth/token',
			formData,
			{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
		);

		const token = tokenRes.data.access_token;

		const menuRes = await axios.post(
			'https://soal.staging.id/api/menu',
			{ show_all: 1 },
			{
				headers: { Authorization: `Bearer ${token}` },
			}
		);

		res.json(menuRes.data);
	} catch (err) {
		console.error('Menu proxy error:', err.message);
		res.status(500).json({ error: 'Something went wrong on /api/menu.' });
	}
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () =>
	console.log(`Proxy running on http://localhost:${PORT}`)
);
