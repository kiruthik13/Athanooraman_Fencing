# JustFence - Fencing Business Management Application

A production-ready React + Firebase application for managing a fencing business with separate portals for customers and administrators.

## Features

### Customer Portal
- Browse fencing products with detailed specifications
- View project status and progress
- Interactive cost calculator
- Profile management
- Quote requests

### Admin Portal
- Dashboard with key business metrics
- Product management
- Quote management
- Project tracking
- Customer management
- Reports and analytics

## Tech Stack

- **Frontend**: React 18 + Vite
- **Routing**: React Router v6
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Charts**: Recharts
- **Backend**: Firebase (Auth, Firestore, Storage)
- **PDF Generation**: jsPDF
- **Date Handling**: date-fns

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Firebase Configuration

Your Firebase configuration is already set up in `src/config/firebase.js`.

### 3. Seed Sample Data

To populate the database with sample products, quotes, and projects:

1. Start the development server:
```bash
npm run dev
```

2. Open the browser console and run:
```javascript
import { seedDatabase } from './src/data/seedData.js';
seedDatabase();
```

Or create demo users through the sign-up page.

### 4. Create Demo Users

**Admin Account:**
- Email: admin@justfence.com
- Password: admin123
- Role: Admin

**Customer Account:**
- Email: rajesh@email.com
- Password: customer123
- Role: Customer

You can create these accounts using the Sign Up page.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## Project Structure

```
src/
├── components/
│   ├── auth/           # Authentication components
│   ├── customer/       # Customer portal components
│   ├── admin/          # Admin portal components
│   └── common/         # Shared components
├── contexts/           # React contexts (Auth)
├── config/             # Firebase configuration
├── data/               # Sample data and seeding
└── App.jsx             # Main app component
```

## Features Implemented

✅ Complete authentication system (Sign Up, Sign In, Forgot Password)
✅ Role-based access control (Customer/Admin)
✅ Customer portal with products, projects, calculator, and profile
✅ Admin portal with dashboard and management features
✅ Responsive design for mobile, tablet, and desktop
✅ Real-time data synchronization with Firestore
✅ Toast notifications for user feedback
✅ Loading states and error handling
✅ Sample data seeding

## Firebase Collections

- **users**: User profiles and authentication data
- **products**: Fencing products catalog
- **quotes**: Customer quotes and pricing
- **projects**: Active and completed projects

## Demo Credentials

### Admin
- Email: admin@justfence.com
- Password: admin123

### Customer
- Email: rajesh@email.com
- Password: customer123

## License

MIT

## Support

For issues or questions, please contact support@justfence.com
