# Quick Start Guide

## Your Application is Running! 🎉

**URL:** http://localhost:5176

## Step 1: Create Demo Accounts

### Option A: Use the Sign Up Page

1. Go to http://localhost:5176/signup
2. Create an **Admin** account:
   - Full Name: Admin User
   - Email: admin@justfence.com
   - Phone: +91 98765 43210
   - Location: Bangalore
   - Password: admin123
   - Confirm Password: admin123
   - Role: **Admin**

3. Create a **Customer** account:
   - Full Name: Rajesh Kumar
   - Email: rajesh@email.com
   - Phone: +91 98765 43211
   - Location: Chennai
   - Password: customer123
   - Confirm Password: customer123
   - Role: **Customer**

## Step 2: Seed Sample Data

1. Go to the Sign In page: http://localhost:5176/signin
2. Click the **"Seed Sample Data"** button in the bottom-right corner
3. Wait for the success message

This will populate your database with:
- ✅ 5 Fencing Products
- ✅ 5 Customer Quotes
- ✅ 3 Active Projects

## Step 3: Test the Application

### Test Customer Portal:
1. Sign in with: rajesh@email.com / customer123
2. Explore:
   - **Products** - Browse all fencing products
   - **My Projects** - View project status
   - **Calculator** - Calculate fencing costs
   - **Profile** - Update your information

### Test Admin Portal:
1. Sign out and sign in with: admin@justfence.com / admin123
2. Explore:
   - **Dashboard** - View business metrics
   - Navigate through sidebar menu

## Troubleshooting

### If you see "No products available":
- Make sure you clicked the "Seed Sample Data" button
- Check the browser console for any errors

### If login doesn't work:
- Make sure you created the user accounts first
- Check that Firebase Authentication is enabled in your Firebase Console

### If you see Firebase errors:
- Verify your Firebase configuration in `src/config/firebase.js`
- Make sure Firestore and Authentication are enabled in Firebase Console

## What's Next?

The application is fully functional! You can:
1. Create more users through the sign-up page
2. Add more products, quotes, and projects
3. Customize the styling and branding
4. Add more admin management features
5. Deploy to production (Firebase Hosting, Vercel, or Netlify)

## Need Help?

Check the README.md file for complete documentation and setup instructions.

Enjoy your fencing business management application! 🚀
