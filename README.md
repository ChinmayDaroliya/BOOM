# 🚀 BOOM Platform - Full-Stack Video Streaming Platform

A next-generation social streaming platform that blends short-form and long-form video content with robust community features and monetization capabilities.

## 🛠️ Tech Stack

* **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Shadcn UI
* **Backend**: Next.js API Routes (Node.js)
* **Database**: PostgreSQL with Prisma ORM
* **Authentication**: JWT-based authentication
* **File Storage**: Local file system (for demo purposes)
* **UI Components**: Shadcn UI with custom styling

## ✨ Features

### Core Features
* 🔐 **User Authentication** - Registration, login, and secure session management
* 📹 **Video Upload** - Support for both short-form and long-form content
* 🌊 **Unified Feed** - Scrollable feed displaying both video types
* 💰 **Monetization** - Video purchasing system with wallet integration
* 💬 **Comments** - Real-time commenting system with history
* 🎁 **Creator Gifting** - Send gifts to content creators with gift history
* 👤 **User Dashboard** - Creator analytics and management

### Advanced Features
* 📱 **Responsive Design** - Mobile-first approach with desktop optimization
* 🎯 **Auto-play Videos** - TikTok-style short-form video experience
* 💳 **Virtual Wallet** - Simulated payment system with balance tracking
* 🎨 **Modern UI** - Gradient designs and smooth animations
* 📊 **Analytics Dashboard** - Creator statistics and insights
* 🔄 **Infinite Scroll** - Seamless content discovery
* 📝 **Comment History** - Persistent comment and gift history tracking

## 🚀 Quick Start

### Prerequisites
* Node.js 18+ installed
* PostgreSQL database running
* Git installed

### Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd my-app
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the root directory with the following content:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/boom_db"
JWT_SECRET="your-super-secret-jwt-key"
NEXTAUTH_SECRET="your-nextauth-secret"
```

4. **Set up the database**
```bash
# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma migrate dev --name init
```

5. **Create uploads directory**
```bash
mkdir -p public/uploads
```

6. **Start the development server**
```bash
npm run dev
```

7. **Open your browser**
Navigate to `http://localhost:3000`

## 📁 Project Structure

```
my-app/
├── prisma/
│   └── schema.prisma              # Database schema
├── public/
│   └── uploads/                   # Uploaded video files
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   ├── login/
│   │   │   │   │   └── route.js   # Login API
│   │   │   │   ├── logout/
│   │   │   │   │   └── route.js   # Logout API
│   │   │   │   └── register/
│   │   │   │       └── route.js   # Registration API
│   │   │   ├── comments/
│   │   │   │   └── route.js       # Comments API
│   │   │   ├── videos/
│   │   │   │   ├── [id]/
│   │   │   │   │   ├── gifts/
│   │   │   │   │   │   └── history/
│   │   │   │   │   │       └── route.js  # Gift history API
│   │   │   │   │   └── comments/
│   │   │   │   │       └── history/
│   │   │   │   │           └── route.js  # Comment history API
│   │   │   │   └── route.js       # Video upload API
│   │   │   ├── feed/
│   │   │   │   └── route.js       # Feed API
│   │   │   ├── gift/
│   │   │   │   └── route.js       # Gifting API
│   │   │   ├── purchase/
│   │   │   │   └── route.js       # Video purchase API
│   │   │   └── user/
│   │   │       └── route.js       # User profile API
│   │   ├── dashboard/
│   │   │   └── page.js            # Creator dashboard
│   │   ├── feed/
│   │   │   └── page.js            # Main video feed
│   │   ├── login/
│   │   │   └── page.js            # Login page
│   │   ├── register/
│   │   │   └── page.js            # Registration page
│   │   ├── upload/
│   │   │   └── page.js            # Video upload page
│   │   ├── watch/
│   │   │   └── [id]/
│   │   │       └── page.js        # Video watch page with history
│   │   ├── globals.css            # Global styles
│   │   ├── layout.jsx             # Root app layout
│   │   └── page.jsx               # Home page
│   ├── components/
│   │   ├── ui/
│   │   │   ├── button.js          # Button component
│   │   │   ├── card.jsx           # Card component
│   │   │   ├── dialog.jsx         # Dialog component
│   │   │   ├── input.jsx          # Input component
│   │   │   ├── label.jsx          # Label component
│   │   │   ├── select.jsx         # Select component
│   │   │   ├── tabs.jsx           # Tabs component
│   │   │   └── textarea.jsx       # Textarea component
│   │   ├── CommentSection.js      # Comments UI
│   │   ├── GiftCreator.js         # Gifting interface
│   │   ├── LoadingSkeleton.js     # Loading components
│   │   ├── Navigation.js          # App navigation
│   │   ├── VideoCard.js           # Video card component
│   │   ├── VideoPlayer.js         # Video player
│   │   └── WalletBalance.js       # Wallet display
│   ├── lib/
│   │   ├── auth.js                # Authentication utilities
│   │   ├── prisma.js              # Database client
│   │   └── utils.js               # Utility functions
│   └── middleware.js              # Route protection
├── .env                           # Environment variables
├── .gitignore                     # Git ignore rules
├── next.config.js                 # Next.js configuration
├── package.json                   # Dependencies and scripts
├── tailwind.config.js             # Tailwind CSS config
└── README.md                      # This file
```

## 🔧 API Documentation

### Authentication
```http
POST /api/auth/register    # Register new user
POST /api/auth/login       # User login
POST /api/auth/logout      # User logout
GET /api/user              # Get current user
```

### Videos
```http
GET /api/feed?page=1       # Get video feed
POST /api/videos           # Upload video
GET /api/videos/[id]       # Get specific video
```

### Comments and History
```http
POST /api/comments         # Add comment
GET /api/comments?videoId=1 # Get comments
GET /api/videos/[id]/comments/history # Get comment history
GET /api/videos/[id]/gifts/history    # Get gift history
```

### Interactions
```http
POST /api/purchase         # Purchase video
POST /api/gift             # Gift creator
```

## 🎮 User Journey

### For Viewers
1. **Register/Login** - Create account or sign in
2. **Browse Feed** - Scroll through videos in unified feed
3. **Watch Content** - View free content or purchase paid videos
4. **Interact** - Comment on videos and gift creators
5. **View History** - Check comment and gift history
6. **Manage Wallet** - Check balance and transaction history

### For Creators
1. **Upload Videos** - Add short-form or long-form content
2. **Set Pricing** - Configure video pricing for monetization
3. **Dashboard** - Track views, earnings, and engagement
4. **Community** - Respond to comments and engage with audience
5. **Track History** - Monitor comment and gift history

## 🎨 Design Features

* **Gradient Backgrounds** - Modern purple/pink gradients
* **Auto-play Videos** - Smooth short-form video experience
* **Responsive Design** - Works on mobile and desktop
* **Loading States** - Skeleton loaders for better UX
* **Micro-interactions** - Smooth hover effects and transitions

## 🔒 Security Features

* **JWT Authentication** - Secure token-based auth
* **Route Protection** - Middleware-based route guards
* **Input Validation** - Server-side validation for all inputs
* **File Upload Security** - Restricted file types and sizes
* **SQL Injection Protection** - Prisma ORM prevents SQL injection

## 🚀 Performance Optimizations

* **Next.js 14** - Latest performance improvements
* **Image Optimization** - Next.js automatic image optimization
* **Code Splitting** - Automatic code splitting for better loading
* **Caching** - Efficient API response caching
* **Lazy Loading** - Components load on demand

## 🧪 Testing the Platform

### Test User Accounts
After setup, create test accounts:
- Creator: `creator@test.com`
- Viewer: `viewer@test.com`
- Both passwords: `password123`

### Test Scenarios
1. **Upload Flow**: Login as creator → Upload video → Set price
2. **Purchase Flow**: Login as viewer → Browse feed → Purchase video
3. **Gifting Flow**: Watch video → Gift creator → Check wallet balance
4. **History Flow**: Add comments → Send gifts → Check history tab

## 🔄 Development Workflow

```bash
# Development
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server

# Database
npx prisma studio    # Open database browser
npx prisma migrate   # Run migrations
npx prisma generate  # Generate Prisma client

# Code Quality
npm run lint         # Run ESLint
npm run format       # Format code with Prettier
```

## 🎯 Key Differentiators

1. **Unified Feed** - Both short and long-form content in one stream
2. **Creator Economy** - Built-in monetization and gifting
3. **Modern Stack** - Latest Next.js 14 with App Router
4. **Responsive Design** - Mobile-first approach
5. **Real-time Features** - Live comments and interactions

## 🌟 Future Enhancements

* Real-time notifications
* Advanced analytics dashboard
* Video streaming optimization
* Mobile app (React Native)
* Live streaming capabilities
* Advanced recommendation engine
* Creator revenue sharing
* Community features (followers, DMs)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📧 Support

For questions or support:
- Email: hr@boomofficial.com
- Website: www.boomofficial.com

## 📄 License

This project is part of the BOOM Entertainment technical assessment.

---

**Built with ❤️ for the BOOM Entertainment Full-Stack Developer Assignment**