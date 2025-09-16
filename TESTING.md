# Testing the File Upload Functionality

## Issue Fixed

The "Cannot POST /api/upload" error was occurring because the server wasn't properly starting in development mode. The server startup code was commented out, which prevented the server from listening on port 3000.

## How to Test

### 1. Start the Development Server

For Windows:
```bash
npm run dev:windows
```

For Mac/Linux:
```bash
npm run dev
```

You should see output similar to:
```
Server listening on http://0.0.0.0:3000
MongoDB connected successfully
```

### 2. Test Using the HTML Form

Open the test HTML file in your browser:
- Navigate to `src/test-upload.html` in your file explorer and open it with your browser
- The API URL should be set to `http://localhost:3000/api/upload` by default
- Select an image file and click "Upload Image"

### 3. Test Using the JavaScript Script

Alternatively, you can run the test script:
```bash
node src/test-upload.js
```

## Troubleshooting

If you still encounter the "Cannot POST /api/upload" error:

1. Ensure the server is running and you can see the "Server listening" message
2. Verify that the MongoDB connection is successful
3. Check that the API URL in the test form matches the server address (http://localhost:3000/api/upload)
4. Ensure the uploads directory exists and is writable
5. Check the browser console or terminal for any additional error messages

## What Was Fixed

1. Uncommented and moved the server startup code to ensure the server runs in development mode
2. Verified that the upload routes are correctly mounted at `/api/upload`
3. Ensured the development scripts in package.json are properly configured

The server should now be able to receive file uploads at the `/api/upload` endpoint.