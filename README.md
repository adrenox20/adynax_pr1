# 🎓 AI-LMS Platform(NKMKB)

A comprehensive Learning Management System with AI-powered features, coding challenges, and personalized learning plans.

## ✨ Features

- **User Authentication & RBAC** - Secure login with role-based access control
- **Coding Problems Portal** - Practice coding challenges with real-time execution
- **AI-Powered Learning Plans** - Personalized learning paths tailored to your goals
- **Calendar & Assignment Management** - Track deadlines and manage your schedule
- **Real-time Chat & Collaboration** - Connect with peers and mentors
- **Teacher Analytics & Grading** - Monitor student progress and performance
- **Admin Portal & Monitoring** - Comprehensive system administration

## 🚀 Tech Stack

### Backend
- **Node.js** with Express.js
- **MySQL** database with Sequelize ORM
- **JWT** authentication
- **Socket.io** for real-time features
- **Multer** for file uploads
- **Winston** for logging

### Frontend
- **React 19** with TypeScript
- **React Router** for navigation
- **Axios** for API communication
- **Context API** for state management
- **CSS3** with modern design patterns

## 📋 Prerequisites

- Node.js (v16 or higher)
- MySQL (v8.0 or higher)
- npm or yarn package manager

## 🛠️ Installation

### 1. Clone the repository
```bash
git clone <your-repo-url>
cd trs
```

### 2. Backend Setup
```bash
cd backend
npm install
```

Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5002
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRE=7d

# Database Configuration
DB_HOST=localhost
DB_USER=your_db_user
DB_PASS=your_db_password
DB_NAME=ai_lms_db
DB_PORT=3306
```

### 3. Database Setup
```bash
# Create database
npx sequelize-cli db:create

# Run migrations
npx sequelize-cli db:migrate

# Seed initial data (optional)
npx sequelize-cli db:seed:all
```

### 4. Frontend Setup
```bash
cd ../frontend
npm install
```

### 5. Start Development Servers

**Backend:**
```bash
cd backend
npm run dev
# Server runs on http://localhost:5002
```

**Frontend:**
```bash
cd frontend
npm start
# App runs on http://localhost:3000
```

## 🌐 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/me` - Get current user profile

### Problems
- `GET /api/problems` - List coding problems
- `POST /api/problems` - Create new problem
- `GET /api/problems/:id` - Get problem details

### Submissions
- `POST /api/submissions` - Submit code solution
- `GET /api/submissions` - List user submissions

### AI Plans
- `GET /api/ai-plans` - List learning plans
- `POST /api/ai-plans` - Create new plan
- `PUT /api/ai-plans/:id` - Update plan

## 📁 Project Structure

```
trs/
├── backend/
│   ├── config/           # Database and app configuration
│   ├── migrations/       # Database migrations
│   ├── models/          # Sequelize models
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── middleware/  # Custom middleware
│   │   ├── routes/      # API routes
│   │   └── utils/       # Utility functions
│   └── server.js        # Main server file
├── frontend/
│   ├── public/          # Static assets
│   ├── src/
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts
│   │   ├── services/    # API services
│   │   └── App.tsx      # Main app component
│   └── package.json
└── README.md
```

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
cd frontend
npm run build
# Deploy the build/ folder
```

### Backend (Railway/Heroku)
```bash
cd backend
# Add build script to package.json
npm run build
npm start
```

### Database
- Use managed MySQL service (PlanetScale, Supabase, Railway)
- Or deploy MySQL on cloud VPS

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues or have questions:
- Check the [Issues](https://github.com/yourusername/trs/issues) page
- Create a new issue with detailed description
- Contact the development team

## 🙏 Acknowledgments

- Built with modern web technologies
- Inspired by leading LMS platforms
- Community-driven development approach

---

**Happy Learning! 🎉**
