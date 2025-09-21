# VerdantCart

A modern e-commerce platform for gardening enthusiasts, offering plants, tools, seeds, and educational content to help users create their perfect garden.

![VerdantCart Hero](attached_assets/generated_images/Hero_garden_scene_c1a60c82.png)

## 🌱 Features

### Core Functionality
- **Product Catalog**: Browse plants, gardening tools, and seeds with detailed information
- **Shopping Cart**: Session-based cart management with persistent storage
- **Educational Guides**: Comprehensive gardening guides with difficulty levels
- **Category Navigation**: Organized product browsing by plant types, tools, and seeds
- **Responsive Design**: Mobile-first approach with modern UI components

### Product Categories
- **Plants**: Indoor and outdoor plants with care instructions
- **Tools**: Professional-grade gardening equipment
- **Seeds**: Variety of seeds for different growing conditions
- **Guides**: Step-by-step gardening tutorials

## 🛠️ Tech Stack

### Frontend
- **React 18** with TypeScript
- **Vite** for fast development and building
- **Tailwind CSS** for styling
- **Radix UI** for accessible component primitives
- **Framer Motion** for animations
- **TanStack Query** for data fetching and caching
- **Wouter** for lightweight routing

### Backend
- **Express.js** with TypeScript
- **Drizzle ORM** for database operations
- **PostgreSQL** with Neon serverless
- **Express Sessions** for cart management
- **Passport.js** for authentication (ready for implementation)

### UI Components
- **shadcn/ui** component library
- **Lucide React** icons
- **Recharts** for data visualization
- **React Hook Form** with Zod validation

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL database (Neon recommended)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/gayatriiv/city-roots.git
   cd VerdantCart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL=your_neon_database_url
   SESSION_SECRET=your_session_secret
   NODE_ENV=development
   PORT=3000
   ```

4. **Database Setup**
   ```bash
   npm run db:push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
VerdantCart/
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── lib/           # Utilities and API client
│   │   └── hooks/         # Custom React hooks
│   └── public/            # Static assets
├── server/                # Backend Express application
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   └── storage.ts         # Database connection
├── shared/                # Shared TypeScript types and schemas
│   └── schema.ts          # Database schema and Zod validators
└── attached_assets/       # Project assets and images
```

## 🎨 Design System

VerdantCart follows an earth-inspired design system with:

### Color Palette
- **Forest Green**: Primary brand color for headers and CTAs
- **Sage Green**: Secondary actions and backgrounds  
- **Earth Brown**: Text and borders
- **Cream**: Light backgrounds and cards
- **Terracotta**: Accent color for promotions

### Typography
- **Primary**: Inter (clean, modern readability)
- **Accent**: Playfair Display (headers and brand elements)

## 🗄️ Database Schema

### Core Tables
- **users**: User authentication and profiles
- **products**: Product catalog with categories, pricing, and inventory
- **cart_items**: Session-based shopping cart items
- **guides**: Educational content and tutorials

### Key Features
- Session-based cart persistence
- Product categorization and filtering
- Review and rating system
- Featured products and guides

## 🔧 Available Scripts

### Development
```bash
npm run dev          # Start development server
npm run check        # TypeScript type checking
```

### Production
```bash
npm run build        # Build for production
npm start           # Start production server
```

### Database
```bash
npm run db:push     # Push schema changes to database
```

## 🌐 API Endpoints

### Products
- `GET /api/products` - Fetch all products
- `GET /api/products/:category` - Fetch products by category
- `GET /api/products/featured` - Fetch featured products

### Cart
- `GET /api/cart/:sessionId` - Fetch cart items
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/:sessionId/:productId` - Update cart item quantity
- `DELETE /api/cart/:sessionId/:productId` - Remove cart item

### Guides
- `GET /api/guides` - Fetch all guides
- `GET /api/guides/featured` - Fetch featured guides

## 🚀 Deployment

The application is configured for deployment on platforms like:
- **Vercel** (recommended for full-stack)
- **Netlify** (frontend) + **Railway** (backend)
- **Heroku**
- **Docker** containers

### Build Configuration
- Frontend builds to `dist/` directory
- Backend compiles with esbuild for optimal performance
- Environment variables configured via platform settings

## 🔮 Future Enhancements

### Planned Features
- [ ] User authentication and profiles
- [ ] Order management system
- [ ] Payment integration (Stripe ready)
- [ ] Product reviews and ratings
- [ ] Wishlist functionality
- [ ] Admin dashboard
- [ ] Email notifications
- [ ] Search functionality
- [ ] Inventory management

### Technical Improvements
- [ ] Image optimization and CDN
- [ ] Caching strategies
- [ ] SEO optimization
- [ ] Performance monitoring
- [ ] Automated testing suite

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🌟 Acknowledgments

- Design inspiration from modern e-commerce platforms
- Component library built with shadcn/ui
- Icons provided by Lucide React
- Nature imagery and plant photography

---

**VerdantCart** - Cultivating beautiful gardens, one plant at a time. 🌱