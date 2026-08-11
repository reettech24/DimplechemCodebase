require('dotenv').config();
const express = require('express');
//const { GoogleAuth } = require('google-auth-library');
const cors = require('cors');
const path = require("path");
const bodyParser = require('body-parser');
const authRoutes = require('./routes/auth.routes');
const googleRoutes = require('./routes/google.routes');

const app = express();


//const serviceAccountKey = require('./service-account-key.json');

// Define the scopes your service account has been delegated in Google Workspace Admin Console
//const scopes = ['https://www.googleapis.com/auth/gmail.readonly'];

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.json()); // Parses incoming JSON requests
app.use(express.urlencoded({ extended: true })); // Parses URL-encoded data

// Serve static files from the "uploads" folder
app.use("/uploads", express.static(path.join(__dirname, "uploads")));


// Routes
app.use('/api/auth', authRoutes);
app.use('/api', googleRoutes);


// Endpoint to get an access token for a specific user
// app.post('/api/get-gmail-access-token', async (req, res) => {
//   const { userEmailToImpersonate } = req.body; // Expecting the salesperson's email from frontend

//   if (!userEmailToImpersonate) {
//     return res.status(400).json({ error: 'User email to impersonate is required.' });
//   }

//   try {
//     const auth = new GoogleAuth({
//       credentials: {
//         client_email: serviceAccountKey.client_email,
//         private_key: serviceAccountKey.private_key,
//       },
//       scopes: scopes,
//       // Crucial for Domain-Wide Delegation: impersonate the user
//       // The 'subject' parameter tells Google which user's data you want to access.
//       clientOptions: {
//         subject: userEmailToImpersonate,
//       },
//     });

//     // Get the access token
//     const accessToken = await auth.getAccessToken();

//     //console.log("accessToken",accessToken);

//     if (!accessToken) {
//       throw new Error('Failed to obtain access token.');
//     }

//     res.json({ accessToken: accessToken });
//   } catch (error) {
//     console.error('Error generating access token:', error);
//     res.status(500).json({ error: 'Failed to generate access token. Check backend logs for details.' });
//   }
// });


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
