# Brief Demo: Deploying a Money Transfer Backend on Render

Here’s a step-by-step i followed deploying your MERN (Node.js/Express) backend on Render.

✅ **Step 1: Push Your Backend Code to GitHub**  
Ensure the backend was in a GitHub repository and that all your latest changes have been commited:
```sh
git add .
git commit -m "Initial commit for Render deployment"
git push origin main
```

✅ **Step 2: Create a Web Service on Render**  
Go to Render and log in.  
Click "New Web Service" → Select "Connect a Git Repository".  
Choose your repository (the one with your backend code).  
Set the correct Root Directory:  
- If your backend package.json is in the repo’s root: leave blank (/).  
- If inside server/: set it to server.

✅ **Step 3: Configure the Deployment Settings**  
**Build Command:**
```sh
npm install
```
**Start Command:**
```sh
npm start
```
**Environment:** Select Node.js 18+.

✅ **Step 4: Set Up Environment Variables**  
Go to "Environment Variables"  
Add the following keys (from your .env file):
```ini
MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/Payment
JWT_SECRET=your_jwt_secret_key
PAYSTACK_SECRET_KEY=your_paystack_secret
```
Click Save.

✅ **Step 5: Deploy the Backend**  
Click "Deploy" and wait for the logs to show "Server running on port 5000" (or your port).  
Copy the Live URL https://payment-be-3tc2.onrender.com

Test the API using Postman and swagger

✅ **Step 6: Us the API URL insdie the frontend**  
Send the Live URL to the frontend.  
**Example API calls:**
```arduino
https://your-app.onrender.com/api/auth/register
https://your-app.onrender.com/api/transactions
https://your-app.onrender.com/api/payments
```

🚀 **The Backend is Now Live on Render!**
