# Lost & Found Portal - Complete Implementation Guide

Welcome to the Lost & Found Portal! This document provides a comprehensive overview of the complete system implementation.

## 📋 Quick Overview

The Lost & Found Portal is a full-stack web application designed to help campus students find lost and found items. It features:

- **Backend**: Spring Boot REST API with PostgreSQL
- **Frontend**: Responsive HTML/CSS/JavaScript with Bootstrap 5
- **Features**: Search, filter, admin panel, item matching

---

## 🚀 Quick Start

### Option 1: Run Everything Locally (Recommended for Development)

#### Step 1: Setup Database
```bash
# Start PostgreSQL
brew services start postgresql  # macOS
# OR
sudo service postgresql start  # Linux

# Create database
psql -U postgres
CREATE DATABASE lostfound;
\q
```

#### Step 2: Run Backend
```bash
cd /Users/ritikkhatana/Downloads/lostfound-portal

# Build
./mvnw clean install

# Run
./mvnw spring-boot:run
```

Backend will start at: `http://localhost:8080`

#### Step 3: Access Frontend
Open browser and navigate to:
- **Home Page**: `http://localhost:8080/`
- **Lost Items**: `http://localhost:8080/lost.html`
- **Found Items**: `http://localhost:8080/found.html`
- **Admin Panel**: `http://localhost:8080/admin.html`

### Option 2: Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d

# Access at http://localhost:8080
```

---

## 📁 Project Structure

```
lostfound-portal/
├── src/
│   ├── main/
│   │   ├── java/com/shweta/lostfound_portal/
│   │   │   ├── config/                 # Spring configurations
│   │   │   ├── controller/             # REST controllers
│   │   │   ├── dto/                    # Data transfer objects
│   │   │   ├── enums/                  # Enumerations
│   │   │   ├── exception/              # Exception handlers
│   │   │   ├── model/                  # JPA entities
│   │   │   ├── repository/             # JPA repositories
│   │   │   ├── service/                # Business logic
│   │   │   └── LostfoundPortalApplication.java
│   │   ├── resources/
│   │   │   ├── templates/              # HTML files
│   │   │   │   ├── home.html
│   │   │   │   ├── lost.html
│   │   │   │   ├── found.html
│   │   │   │   └── admin.html
│   │   │   ├── static/                 # Static assets
│   │   │   │   ├── css/
│   │   │   │   │   └── style.css
│   │   │   │   └── js/
│   │   │   │       └── app.js
│   │   │   └── application.properties  # Configuration
│   │   └── test/                       # Unit tests
│   └── pom.xml                         # Maven configuration
├── BACKEND_README.md                   # Backend documentation
├── FRONTEND_README.md                  # Frontend documentation
├── QUICKSTART.md                       # Quick start guide
├── DEPLOYMENT_GUIDE.md                 # Deployment instructions
├── API_TESTING_GUIDE.md               # API testing guide
├── Postman_Collection.json             # Postman API collection
└── docker-compose.yml                  # Docker configuration
```

---

## 🛠️ Technology Stack

### Backend
- **Java 17**
- **Spring Boot 3.5.11**
- **Spring Data JPA**
- **PostgreSQL 12+**
- **Maven 3.6+**

### Frontend
- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **Bootstrap 5.3**
- **Fetch API**

### Tools
- **Git** - Version control
- **Maven** - Build tool
- **Docker** - Containerization
- **PostgreSQL** - Database
- **DBeaver** - Database Management Tool (GUI)

---

## 📖 Documentation Files

### 1. **QUICKSTART.md**
Get up and running in minutes with step-by-step instructions.

### 2. **BACKEND_README.md**
Complete backend documentation including:
- Project structure
- Entity models
- API endpoints with examples
- Database schema
- Running instructions

### 3. **FRONTEND_README.md**
Comprehensive frontend guide covering:
- Page descriptions
- JavaScript architecture
- Styling guide
- Browser compatibility
- Accessibility standards

### 4. **API_TESTING_GUIDE.md**
Detailed API testing documentation:
- All endpoints with examples
- cURL commands
- Postman collection
- Testing scenarios
- Performance testing

### 5. **DEPLOYMENT_GUIDE.md**
Production deployment instructions:
- Local setup
- Production configuration
- Docker deployment
- Cloud deployment (AWS, Heroku, GCP)
- Database backup & recovery
- Monitoring & logging

---

## 🎯 Features Overview

### Public Features

#### 1. View Lost Items
- Browse all reported lost items
- See item details (name, location, date reported)
- View item photos
- Filter by status

#### 2. View Found Items
- Browse all found items
- See item details
- View photos
- Filter by claim status

#### 3. Search Functionality
- Search across item name, description, location, student info
- Real-time search results
- Search works for both lost and found items

#### 4. Item Details
- Detailed modal with full information
- Photo display
- Student/finder information
- Reporting instructions

### Admin Features

#### 1. Add Items
- Create lost item entries
- Create found item entries
- Upload photo URL
- Set item status
- Input validation

#### 2. Manage Items
- View all items in table
- Edit item information
- Delete incorrect entries
- Search and filter items
- Update item status

#### 3. Match Items
- Link lost items with found items
- View matched pairs
- Verify ownership
- Update status to claimed

---

## 🔑 Key Endpoints

### Public Endpoints
```
GET  /               - Welcome page
GET  /health         - Health check
GET  /lost.html      - Lost items page
GET  /found.html     - Found items page
GET  /admin.html     - Admin panel
```

### API Endpoints (Public)
```
GET  /api/items/lost              - Get all lost items
GET  /api/items/found             - Get all found items
GET  /api/items/{id}              - Get item by ID
GET  /api/items/search?keyword=   - Search items
```

### API Endpoints (Admin)
```
POST   /api/admin/items           - Create item
PUT    /api/admin/items/{id}      - Update item
DELETE /api/admin/items/{id}      - Delete item
PUT    /api/admin/match-items     - Match items
```

---

## 🔐 Configuration

### Database Configuration

Edit `src/main/resources/application.properties`:

```properties
# Database
spring.datasource.url=jdbc:postgresql://localhost:5432/lostfound
spring.datasource.username=postgres
spring.datasource.password=postgres

# Server
server.port=8080

# JPA
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false

# CORS
spring.web.cors.allowed-origins=http://localhost:3000,http://localhost:8080
spring.web.cors.allowed-methods=GET,POST,PUT,DELETE,OPTIONS
```

### Environment Variables (Production)

```bash
export DB_URL="jdbc:postgresql://host:5432/lostfound"
export DB_USERNAME="lostfound_user"
export DB_PASSWORD="secure_password"
export CORS_ORIGINS="https://yourdomain.com"
```

---

## 📊 Database Schema

### Items Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| id | BIGINT | PRIMARY KEY | Auto-increment ID |
| type | VARCHAR | NOT NULL | LOST or FOUND |
| item_name | VARCHAR | NOT NULL | Name of item |
| description | TEXT | | Item description |
| location | VARCHAR | NOT NULL | Loss/found location |
| photo_url | VARCHAR | | Photo URL |
| student_name | VARCHAR | | For lost items |
| student_number | VARCHAR | | For lost items |
| found_by | VARCHAR | | For found items |
| status | VARCHAR | NOT NULL | Item status |
| date_reported | TIMESTAMP | NOT NULL | Report date |
| date_found | TIMESTAMP | | Date found |
| matched_with | BIGINT | FK | Matched item ID |
| created_at | TIMESTAMP | NOT NULL | Creation timestamp |
| updated_at | TIMESTAMP | | Update timestamp |

---

## 🧪 Testing

### Unit Testing
```bash
./mvnw test
```

### Integration Testing
See **API_TESTING_GUIDE.md** for comprehensive testing documentation.

### Manual Testing
1. Start backend and frontend
2. Test each page loads correctly
3. Test search functionality
4. Test admin operations
5. Test on multiple browsers

---

## 📱 Responsive Design

- **Mobile** (< 576px): Single column layout
- **Tablet** (576px - 768px): Two column layout
- **Desktop** (> 768px): Three column layout

All pages are optimized for:
- Touch interactions
- Smaller screens
- Various device sizes
- Landscape/portrait orientation

---

## ♿ Accessibility

The application follows WCAG 2.1 Level AA standards:

- ✅ Keyboard navigation support
- ✅ Screen reader compatible
- ✅ Color contrast compliance
- ✅ Semantic HTML structure
- ✅ ARIA labels where needed
- ✅ Form label associations

---

## 🚀 Deployment

### Development
```bash
./mvnw spring-boot:run
```

### Production with Docker
```bash
docker-compose up -d
```

### Cloud Platforms
- AWS Elastic Beanstalk
- Heroku
- Google Cloud Run
- Azure App Service

See **DEPLOYMENT_GUIDE.md** for detailed instructions.

---

## 🔧 Troubleshooting

### Common Issues

#### Backend won't start
```bash
# Check port 8080 is available
lsof -i :8080

# Check PostgreSQL is running
psql -U postgres

# Check logs
./mvnw spring-boot:run | tail -f
```

#### Frontend not loading
```bash
# Check backend is running
curl http://localhost:8080/health

# Check browser console for errors
# Open DevTools → Console tab

# Clear browser cache and reload
```

#### Database connection error
```bash
# Verify credentials in application.properties
# Check PostgreSQL is running
brew services list

# Verify database exists
psql -U postgres -l | grep lostfound
```

See **QUICKSTART.md** or **DEPLOYMENT_GUIDE.md** for more solutions.

---

## 📈 Performance Metrics

### Target Performance
- Page load time: < 2 seconds
- Search response: < 500ms
- Admin operations: < 1 second
- Database query: < 100ms

### Optimization Techniques
- CSS minification
- JavaScript bundling
- Image optimization
- Caching strategies
- CDN for static assets
- Database indexing

---

## 🛡️ Security Features

- Input validation (client-side & server-side)
- SQL injection prevention via JPA
- XSS protection (HTML escaping)
- CORS configuration
- Error handling without exposing sensitive info
- Environment variable for sensitive data

### Future Security Enhancements
- JWT authentication
- Role-based access control
- HTTPS/SSL enforcement
- Rate limiting
- Audit logging

---

## 📝 Sample Data

Sample data is automatically loaded on startup if the database is empty:

- 3 lost items (Car Keys, iPhone, Student ID)
- 3 found items (Wallet, Laptop, Water Bottle)

Modify `DataInitializer.java` to add custom sample data.

---

## 🤝 Contributing

### Code Style
- Follow Java conventions (PascalCase for classes)
- Use meaningful variable names
- Add comments for complex logic
- Write tests for new features

### Git Workflow
```bash
git checkout -b feature/your-feature
git add .
git commit -m "Add your feature"
git push origin feature/your-feature
```

---

## 📞 Support & Resources

### Documentation
- [Spring Boot Guide](https://spring.io/guides)
- [Bootstrap 5 Docs](https://getbootstrap.com/docs/5.0/)
- [MDN Web Docs](https://developer.mozilla.org/)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

### Getting Help
1. Check the documentation files
2. Review error messages in console
3. Check browser DevTools
4. Review backend logs
5. Consult troubleshooting guide

---

## 📄 License

This project is part of an academic assignment for campus IT infrastructure.

---

## 🎓 Learning Outcomes

This project demonstrates:
- Full-stack web development
- REST API design and implementation
- Database design and management
- Frontend framework usage
- Responsive design principles
- UI/UX best practices
- Deployment and DevOps basics

---

## ✅ Checklist Before Production

- [ ] Database backups configured
- [ ] Environment variables set
- [ ] HTTPS/SSL enabled
- [ ] CORS properly configured
- [ ] Error handling tested
- [ ] Performance tested under load
- [ ] Security audit completed
- [ ] Logging configured
- [ ] Monitoring setup
- [ ] Documentation updated

---

## 📊 Project Statistics

- **Backend Lines of Code**: ~1,500
- **Frontend Lines of Code**: ~2,000
- **API Endpoints**: 10
- **Database Tables**: 1
- **HTML Pages**: 4
- **Deployment Options**: 4

---

## 🎯 Future Roadmap

**Phase 2**:
- User authentication
- Email notifications
- Advanced analytics

**Phase 3**:
- Mobile app (React Native)
- AI-powered matching
- Social features

**Phase 4**:
- Blockchain for verification
- Integration with campus systems
- Machine learning recommendations

---

## 📞 Contact & Support

For questions or issues:
1. Review documentation files
2. Check QUICKSTART.md for common issues
3. Review API_TESTING_GUIDE.md for testing help
4. See DEPLOYMENT_GUIDE.md for deployment help

---

**Thank you for using the Lost & Found Portal!** 🎉

For the latest updates, documentation, and support, refer to the individual documentation files:
- [QUICKSTART.md](./QUICKSTART.md) - Get started quickly
- [BACKEND_README.md](./BACKEND_README.md) - Backend details
- [FRONTEND_README.md](./FRONTEND_README.md) - Frontend details
- [API_TESTING_GUIDE.md](./API_TESTING_GUIDE.md) - API testing
- [DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md) - Production deployment

