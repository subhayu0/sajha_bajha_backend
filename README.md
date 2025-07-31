# Sajha Bajha Backend API

A comprehensive e-commerce backend API for Sajha Bajha, a musical instruments marketplace. Built with Node.js, Express, PostgreSQL, and Sequelize.

## 🎵 Features

- **User Authentication & Authorization**
  - JWT-based authentication
  - Role-based access control (User/Admin)
  - Password reset functionality
  - Email verification

- **Product Management**
  - CRUD operations for musical instruments
  - Image upload with Cloudinary
  - Advanced search and filtering
  - Category and brand management
  - Stock management

- **Order Management**
  - Complete order lifecycle
  - Order status tracking
  - Email notifications
  - Payment integration ready

- **Admin Dashboard**
  - User management
  - Product administration
  - Order processing
  - Analytics and statistics

- **Security & Performance**
  - Rate limiting
  - Input validation
  - Error handling
  - Logging and monitoring

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: PostgreSQL
- **ORM**: Sequelize
- **Authentication**: JWT
- **File Upload**: Cloudinary
- **Email**: Nodemailer
- **Security**: Helmet, CORS, Rate Limiting

## 📁 Project Structure

```
sajha_bajha_backend/
├── config/
│   ├── database.js          # Database configuration
│   └── cloudinary.js        # Cloudinary configuration
├── controllers/
│   ├── authController.js    # Authentication logic
│   ├── productController.js # Product management
│   └── orderController.js   # Order processing
├── middleware/
│   ├── auth.js             # Authentication middleware
│   └── errorHandler.js     # Global error handling
├── models/
│   ├── User.js             # User model
│   ├── Product.js          # Product model
│   ├── Order.js            # Order model
│   ├── OrderItem.js        # Order item model
│   └── index.js            # Model associations
├── routes/
│   ├── authRoutes.js       # Authentication routes
│   ├── productRoutes.js    # Product routes
│   └── orderRoutes.js      # Order routes
├── utils/
│   ├── jwt.js              # JWT utilities
│   └── emailService.js     # Email service
├── database/
│   ├── migrations/         # Database migrations
│   └── seeds/             # Sample data
├── uploads/               # File uploads
├── logs/                  # Application logs
├── tests/                 # Test files
├── server.js              # Main application file
└── package.json           # Dependencies
```

## 🚀 Quick Start

### Prerequisites

- Node.js (v16 or higher)
- PostgreSQL (v12 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd sajha_bajha_backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp env.example .env
   ```
   
   Update the `.env` file with your configuration:
   ```env
   # Server Configuration
   PORT=5000
   NODE_ENV=development
   
   # Database Configuration
   DB_HOST=localhost
   DB_PORT=5432
   DB_NAME=sajha_bajha_db
   DB_USER=postgres
   DB_PASSWORD=your_password
   
   # JWT Configuration
   JWT_SECRET=your_jwt_secret_key_here
   JWT_EXPIRES_IN=7d
   
   # Cloudinary Configuration
   CLOUDINARY_CLOUD_NAME=your_cloud_name
   CLOUDINARY_API_KEY=your_api_key
   CLOUDINARY_API_SECRET=your_api_secret
   
   # Email Configuration
   EMAIL_HOST=smtp.gmail.com
   EMAIL_PORT=587
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. **Database Setup**
   ```bash
   # Create PostgreSQL database
   createdb sajha_bajha_db
   
   # Run migrations
   npm run migrate
   
   # Seed sample data
   npm run seed
   ```

5. **Start the server**
   ```bash
   # Development
   npm run dev
   
   # Production
   npm start
   ```

The API will be available at `http://localhost:5000`

## 📚 API Documentation

### Authentication Endpoints

#### Register User
```http
POST /api/auth/register
Content-Type: application/json

{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "password123",
  "phone": "1234567890",
  "address": "123 Main St, City"
}
```

#### Login
```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

#### Get Profile
```http
GET /api/auth/profile
Authorization: Bearer <token>
```

### Product Endpoints

#### Get All Products
```http
GET /api/products?page=1&limit=12&category=guitar&minPrice=1000&maxPrice=5000
```

#### Get Featured Products
```http
GET /api/products/featured?limit=8
```

#### Get Product by ID
```http
GET /api/products/:id
```

#### Create Product (Admin)
```http
POST /api/products
Authorization: Bearer <admin_token>
Content-Type: multipart/form-data

{
  "name": "Yamaha Guitar",
  "description": "Acoustic guitar",
  "price": 9999,
  "category": "guitar",
  "brand": "Yamaha",
  "stockQuantity": 10,
  "images": [files]
}
```

### Order Endpoints

#### Create Order
```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json

{
  "items": [
    {
      "productId": "uuid",
      "quantity": 2
    }
  ],
  "shippingAddress": {
    "street": "123 Main St",
    "city": "Mumbai",
    "state": "Maharashtra",
    "zipCode": "400001"
  },
  "paymentMethod": "cod"
}
```

#### Get User Orders
```http
GET /api/orders?page=1&limit=10
Authorization: Bearer <token>
```

## 🔐 Authentication

The API uses JWT tokens for authentication. Include the token in the Authorization header:

```http
Authorization: Bearer <your_jwt_token>
```

### Token Structure
```json
{
  "id": "user_uuid",
  "email": "user@example.com",
  "role": "user|admin",
  "iat": 1234567890,
  "exp": 1234567890
}
```

## 🎯 Admin Access

Default admin credentials:
- Email: `admin@sajhabajha.com`
- Password: `admin123`

## 📊 Database Schema

### Users Table
- `id` (UUID, Primary Key)
- `firstName`, `lastName` (String)
- `email` (String, Unique)
- `password` (String, Hashed)
- `phone`, `address` (String)
- `role` (Enum: 'user', 'admin')
- `isActive`, `emailVerified` (Boolean)
- `resetPasswordToken`, `resetPasswordExpires` (String, Date)

### Products Table
- `id` (UUID, Primary Key)
- `name`, `description` (String)
- `price`, `originalPrice` (Decimal)
- `category` (Enum: guitar, piano, drums, etc.)
- `brand`, `model` (String)
- `stockQuantity` (Integer)
- `images` (Array of Strings)
- `specifications` (JSONB)
- `isActive`, `isFeatured` (Boolean)
- `rating`, `reviewCount` (Decimal, Integer)
- `sku` (String, Unique)

### Orders Table
- `id` (UUID, Primary Key)
- `orderNumber` (String, Unique)
- `userId` (UUID, Foreign Key)
- `status` (Enum: pending, confirmed, shipped, etc.)
- `totalAmount`, `subtotal`, `taxAmount`, `shippingAmount` (Decimal)
- `paymentMethod`, `paymentStatus` (Enum)
- `shippingAddress`, `billingAddress` (JSONB)
- `trackingNumber`, `trackingUrl` (String)

## 🧪 Testing

```bash
# Run tests
npm test

# Run tests with coverage
npm run test:coverage
```

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | 5000 |
| `NODE_ENV` | Environment | development |
| `DB_HOST` | Database host | localhost |
| `DB_PORT` | Database port | 5432 |
| `DB_NAME` | Database name | sajha_bajha_db |
| `JWT_SECRET` | JWT secret key | - |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary cloud name | - |
| `EMAIL_HOST` | SMTP host | smtp.gmail.com |
| `EMAIL_USER` | SMTP username | - |
| `EMAIL_PASS` | SMTP password | - |

## 🚀 Deployment

### Production Setup

1. **Environment Configuration**
   ```bash
   NODE_ENV=production
   PORT=5000
   ```

2. **Database Migration**
   ```bash
   npm run migrate
   ```

3. **Start Application**
   ```bash
   npm start
   ```

### Docker Deployment

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact: support@sajhabajha.com

## 🔄 Changelog

### v1.0.0
- Initial release
- User authentication
- Product management
- Order processing
- Admin dashboard
- Email notifications 