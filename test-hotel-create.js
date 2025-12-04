// const axios = require('axios');
// const FormData = require('form-data');
// const fs = require('fs');
// const path = require('path');

// // Configuration
// const API_BASE_URL = 'http://localhost:3000/api/hotels';

// // Test data
// const testHotel = {
//   clientId: '123e4567-e89b-12d3-a456-426614174000', // Replace with a valid client ID
//   name: 'فندق الاختبار',
//   status: true,
//   commission: 10.5,
//   amenities: ['واي فاي', 'موقف سيارات', 'مسبح'],
//   // Optional fields
//   branchName: 'الفرع الرئيسي',
//   contactPerson: 'محمد أحمد',
//   contactNumber: '+201234567890',
//   address: '123 شارع التحرير',
//   city: 'القاهرة',
//   country: 'مصر',
//   description: 'فندق فاخر بموقع ممتاز',
//   contractStartDate: '2025-08-01',
//   contractEndDate: '2026-07-31'
// };

// // Create form data
// const form = new FormData();

// // Add all fields to form data
// Object.entries(testHotel).forEach(([key, value]) => {
//   if (Array.isArray(value)) {
//     form.append(key, JSON.stringify(value));
//   } else if (value instanceof Date) {
//     form.append(key, value.toISOString());
//   } else if (value !== undefined && value !== null) {
//     form.append(key, value);
//   }
// });

// // Add test image if needed
// const testImagePath = path.join(__dirname, 'test-image.jpg');
// if (fs.existsSync(testImagePath)) {
//   form.append('images', fs.createReadStream(testImagePath));
// }

// // Send request
// (async () => {
//   try {
//     console.log('Sending hotel creation request...');
//     const response = await axios.post(API_BASE_URL, form, {
//       headers: {
//         ...form.getHeaders(),
//         'Content-Type': 'multipart/form-data'
//       },
//       maxBodyLength: Infinity,
//     });
    
//     console.log(' Hotel created successfully!');
//     console.log('Response:', JSON.stringify(response.data, null, 2));
//   } catch (error) {
//     console.error(' Error creating hotel:');
//     if (error.response) {
//       console.error('Status:', error.response.status);
//       console.error('Data:', error.response.data);
//     } else if (error.request) {
//       console.error('No response received:', error.request);
//     } else {
//       console.error('Error:', error.message);
//     }
//   }
// })();
