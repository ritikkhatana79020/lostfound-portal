# Quick Start Guide - Lost & Found Portal Backend

## Prerequisites
- Java 17 or higher
- PostgreSQL 12 or higher
- Maven 3.6+ (or use the included Maven wrapper)

## Setup Instructions

### Step 1: Set Up PostgreSQL Database

```bash
# Connect to PostgreSQL
psql -U postgres

# Create the database
CREATE DATABASE lostfound;

# Verify creation
\l
```

### Step 2: Verify PostgreSQL Connection with DBeaver

1. **Open DBeaver**
2. **Create New Connection:**
   - Click "New Database Connection" (or Ctrl+Shift+N)
   - Select "PostgreSQL"
   - Click "Next"
3. **Configure Connection:**
   - Server Host: `localhost`
   - Port: `5432`
   - Database: `lostfound`
   - Username: `postgres`
   - Password: `postgres`
4. **Test Connection:** Click "Test Connection"
5. **Finish:** Click "Finish"

### Step 3: Verify Database Configuration

The application is already configured in `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lostfound
spring.datasource.username=postgres
spring.datasource.password=postgres
```

**These settings match the DBeaver connection. Update them if you used different PostgreSQL credentials.**

### Step 3: Build the Project

```bash
cd /Users/ritikkhatana/Downloads/lostfound-portal

# Build with Maven wrapper
./mvnw clean install
```

### Step 4: Run the Application

```bash
# Using Maven wrapper
./mvnw spring-boot:run

# OR using Java directly (after build)
java -jar target/lostfound-portal-0.0.1-SNAPSHOT.jar
```

You should see output like:
```
Started LostfoundPortalApplication in 4.5 seconds
```

### Step 5: Verify the Application

Open your browser or use curl to test:

```bash
# Check health
curl http://localhost:8080/health

# Get all lost items
curl http://localhost:8080/api/items/lost

# Get all found items
curl http://localhost:8080/api/items/found
```

---

## Available API Endpoints

### 🔍 Public Endpoints (No Authentication)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Welcome message and API info |
| GET | `/health` | Health check |
| GET | `/api/items/lost` | Get all lost items |
| GET | `/api/items/found` | Get all found items |
| GET | `/api/items/{id}` | Get item by ID |
| GET | `/api/items/search?keyword=text` | Search items |

### 🛠️ Admin Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/admin/items` | Create new item |
| PUT | `/api/admin/items/{id}` | Update item |
| DELETE | `/api/admin/items/{id}` | Delete item |
| PUT | `/api/admin/match-items` | Match lost & found items |

---

## Sample API Requests

### Create a Lost Item
```bash
curl -X POST http://localhost:8080/api/admin/items \
  -H "Content-Type: application/json" \
  -d '{
    "type": "LOST",
    "itemName": "Car Keys",
    "description": "Silver car keys with blue keychain",
    "location": "Library Building",
    "studentName": "Alice Johnson",
    "studentNumber": "STU001",
    "status": "LOST"
  }'
```

### Create a Found Item
```bash
curl -X POST http://localhost:8080/api/admin/items \
  -H "Content-Type: application/json" \
  -d '{
    "type": "FOUND",
    "itemName": "Wallet",
    "description": "Brown leather wallet",
    "location": "Lost and Found Desk",
    "foundBy": "Security",
    "status": "NOT_CLAIMED"
  }'
```

### Update Item Status
```bash
curl -X PUT http://localhost:8080/api/admin/items/1 \
  -H "Content-Type: application/json" \
  -d '{
    "status": "CLAIMED"
  }'
```

### Search Items
```bash
curl "http://localhost:8080/api/items/search?keyword=keys"
```

### Match Items
```bash
curl -X PUT http://localhost:8080/api/admin/match-items \
  -H "Content-Type: application/json" \
  -d '{
    "lostItemId": 1,
    "foundItemId": 4
  }'
```

### Delete Item
```bash
curl -X DELETE http://localhost:8080/api/admin/items/1
```

---

## Database Schema

The application automatically creates the `items` table with the following structure:

```sql
CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    type VARCHAR(50) NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    photo_url VARCHAR(500),
    photo_path VARCHAR(500),
    student_name VARCHAR(255),
    student_number VARCHAR(50),
    found_by VARCHAR(255),
    status VARCHAR(50) NOT NULL,
    date_reported TIMESTAMP NOT NULL,
    date_found TIMESTAMP,
    matched_with BIGINT,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP,
    CONSTRAINT fk_matched_item FOREIGN KEY(matched_with) REFERENCES items(id)
);
```

---

## Testing with Postman

1. Download [Postman](https://www.postman.com/downloads/)
2. Import the following collection (or create requests manually):

### Create a New Request
- **Method**: GET
- **URL**: http://localhost:8080/api/items/lost
- Click "Send"

### Create Items
- **Method**: POST
- **URL**: http://localhost:8080/api/admin/items
- **Headers**: Content-Type: application/json
- **Body** (raw JSON):
```json
{
  "type": "LOST",
  "itemName": "Phone",
  "description": "iPhone 14",
  "location": "Library",
  "studentName": "John Doe",
  "studentNumber": "STU001",
  "status": "LOST"
}
```

---

## Troubleshooting

### Connection Refused
- Ensure PostgreSQL is running
- Check database URL in `application.properties`
- Verify database exists: `psql -U postgres -c "\\l"`

### Port 8080 Already in Use
- Change port in `application.properties`:
  ```properties
  server.port=8081
  ```

### Build Failures
- Clear cache: `./mvnw clean`
- Rebuild: `./mvnw clean install`
- Check Java version: `java -version` (should be 17+)

### Database Errors
- Delete the database and recreate: `DROP DATABASE lostfound; CREATE DATABASE lostfound;`
- Application will recreate all tables on startup

---

## Project Structure

```
lostfound-portal/
├── src/
│   ├── main/
│   │   ├── java/com/shweta/lostfound_portal/
│   │   │   ├── config/              # Spring configuration
│   │   │   ├── controller/          # REST endpoints
│   │   │   ├── dto/                 # Data transfer objects
│   │   │   ├── enums/               # Enumerations
│   │   │   ├── exception/           # Exception handlers
│   │   │   ├── model/               # JPA entities
│   │   │   ├── repository/          # Database repositories
│   │   │   ├── service/             # Business logic
│   │   │   └── LostfoundPortalApplication.java
│   │   └── resources/
│   │       └── application.properties
│   └── test/
│       └── java/.../LostfoundPortalApplicationTests.java
├── pom.xml                          # Maven configuration
├── BACKEND_README.md                # Detailed API documentation
└── QUICKSTART.md                    # This file
```

---

## Next Steps

1. ✅ Backend API is implemented and running
2. 📝 Next: Create frontend (HTML/CSS/JavaScript) to consume these APIs
3. 🔐 Optional: Add authentication/authorization
4. 📸 Optional: Implement image upload functionality
5. 📧 Optional: Add email notifications

---

## Support

For detailed API documentation, see [BACKEND_README.md](./BACKEND_README.md)

For issues or questions, check:
- Spring Boot Logs: Check console output for errors
- Database: Verify PostgreSQL is running and accessible
- Dependencies: Run `./mvnw dependency:tree` to check dependency resolution

