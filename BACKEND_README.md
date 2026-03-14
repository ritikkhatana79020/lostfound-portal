# Lost & Found Portal - Backend Implementation

## Overview
The backend has been fully implemented with a complete REST API following Spring Boot best practices and a layered architecture pattern.

## Project Structure

```
src/main/java/com/shweta/lostfound_portal/
├── config/
│   └── CorsConfig.java                 # CORS configuration
├── controller/
│   ├── ItemController.java             # REST API endpoints for items
│   └── WelcomeController.java          # Health check endpoints
├── dto/
│   ├── CreateItemRequest.java          # Request DTO for creating items
│   ├── ItemDTO.java                    # Item data transfer object
│   ├── MatchItemsRequest.java          # Request DTO for matching items
│   └── UpdateItemRequest.java          # Request DTO for updating items
├── enums/
│   ├── ItemStatus.java                 # Item status enumeration
│   └── ItemType.java                   # Item type enumeration
├── exception/
│   └── GlobalExceptionHandler.java     # Global exception handling
├── model/
│   └── Item.java                       # Item JPA entity
├── repository/
│   └── ItemRepository.java             # JPA repository for database operations
├── service/
│   └── ItemService.java                # Business logic layer
└── LostfoundPortalApplication.java    # Spring Boot main application
```

## Technology Stack

- **Java 17**
- **Spring Boot 3.5.11**
- **Spring Data JPA**
- **PostgreSQL**
- **Lombok** (for reducing boilerplate code)
- **Maven** (build tool)

## Database Configuration

The application connects to a PostgreSQL database. Ensure the following are configured in `application.properties`:

```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lostfound
spring.datasource.username=postgres
spring.datasource.password=postgres
```

**Database Setup:**
1. Create a PostgreSQL database named `lostfound`
2. The schema will be automatically created by Hibernate (ddl-auto=update)

## API Endpoints

### Public Endpoints

#### 1. Get All Lost Items
```
GET /api/items/lost
Response: 200 OK
[
  {
    "id": 1,
    "type": "LOST",
    "itemName": "Keys",
    "description": "Two silver keys",
    "location": "Library",
    "studentName": "John Doe",
    "studentNumber": "STU001",
    "status": "LOST",
    "dateReported": "2026-03-14T10:30:00",
    ...
  }
]
```

#### 2. Get All Found Items
```
GET /api/items/found
Response: 200 OK
[
  {
    "id": 2,
    "type": "FOUND",
    "itemName": "Wallet",
    "description": "Black leather wallet",
    "location": "Cafeteria",
    "foundBy": "Security",
    "status": "NOT_CLAIMED",
    "dateFound": "2026-03-14T09:00:00",
    ...
  }
]
```

#### 3. Search Items
```
GET /api/items/search?keyword=keys
Response: 200 OK
Search is performed across:
- itemName
- description
- location
- studentName
- studentNumber
- foundBy

Returns matching items from both LOST and FOUND categories
```

#### 4. Get Item by ID
```
GET /api/items/{id}
Response: 200 OK
{
  "id": 1,
  "type": "LOST",
  "itemName": "Keys",
  ...
}
```

#### 5. Health Check
```
GET /health
Response: 200 OK
{
  "status": "UP",
  "service": "lostfound-portal"
}
```

#### 6. Welcome
```
GET /
Response: 200 OK
{
  "message": "Welcome to Lost & Found Portal API",
  "version": "1.0.0",
  "status": "UP"
}
```

---

### Admin Endpoints

#### 1. Create Item
```
POST /api/admin/items
Content-Type: application/json

Request Body:
{
  "type": "LOST",
  "itemName": "Phone",
  "description": "iPhone 14 Pro",
  "location": "Classroom 101",
  "photoUrl": "https://example.com/photo.jpg",
  "photoPath": "/uploads/photo.jpg",
  "studentName": "Jane Smith",
  "studentNumber": "STU002",
  "foundBy": null,
  "status": "LOST"
}

Response: 201 CREATED
{
  "id": 1,
  "type": "LOST",
  "itemName": "Phone",
  ...
}
```

#### 2. Update Item
```
PUT /api/admin/items/{id}
Content-Type: application/json

Request Body:
{
  "description": "Updated description",
  "location": "Library",
  "photoUrl": "https://example.com/new-photo.jpg",
  "status": "FOUND",
  "studentName": "Updated Name"
}

Response: 200 OK
{
  "id": 1,
  "type": "LOST",
  "itemName": "Phone",
  ...
}
```

#### 3. Delete Item
```
DELETE /api/admin/items/{id}
Response: 204 NO CONTENT
```

#### 4. Match Lost and Found Items
```
PUT /api/admin/match-items
Content-Type: application/json

Request Body:
{
  "lostItemId": 1,
  "foundItemId": 3
}

Response: 200 OK
Returns the matched lost item with matchedWith field set to the found item ID
```

---

## Data Models

### Item Entity

| Field | Type | Description |
|-------|------|-------------|
| id | Long | Auto-incremented primary key |
| type | ItemType | LOST or FOUND |
| itemName | String | Name of the item |
| description | Text | Detailed description |
| location | String | Location where item was lost/found |
| photoUrl | String | URL to item photo |
| photoPath | String | File path to item photo |
| studentName | String | Name of student (for lost items) |
| studentNumber | String | Student ID (for lost items) |
| foundBy | String | Name/entity that found the item |
| status | ItemStatus | LOST, FOUND, CLAIMED, NOT_CLAIMED |
| dateReported | DateTime | When item was reported |
| dateFound | DateTime | When item was found |
| matchedWith | Long | ID of matched item (opposite type) |
| createdAt | DateTime | Record creation timestamp |
| updatedAt | DateTime | Last update timestamp |

### Enumerations

**ItemType:**
- LOST
- FOUND

**ItemStatus:**
- LOST
- FOUND
- CLAIMED
- NOT_CLAIMED

---

## Input Validation

- **Item Name**: Required, must not be empty
- **Location**: Required, must not be empty
- **Type**: Required, must be LOST or FOUND
- **Status**: Optional, defaults to NOT_CLAIMED
- **Photo**: Optional, can be URL or file path

---

## Error Handling

The application uses a global exception handler that returns standardized error responses:

```json
{
  "timestamp": "2026-03-14T10:30:00",
  "status": 404,
  "error": "Not Found",
  "message": "Item not found with id: 999",
  "path": "/api/items/999"
}
```

### Common HTTP Status Codes
- **200 OK**: Successful GET request
- **201 CREATED**: Successful POST request
- **204 NO CONTENT**: Successful DELETE request
- **400 BAD REQUEST**: Invalid input/missing required fields
- **404 NOT FOUND**: Resource not found
- **500 INTERNAL SERVER ERROR**: Server error

---

## CORS Configuration

Cross-Origin Resource Sharing is enabled for:
- Origins: `http://localhost:3000`, `http://localhost:8080`
- Methods: GET, POST, PUT, DELETE, OPTIONS
- Headers: All headers allowed
- Credentials: Allowed
- Max Age: 3600 seconds

---

## Running the Application

### Prerequisites
- Java 17 or higher
- PostgreSQL installed and running
- Database `lostfound` created

### Steps
1. Update `application.properties` with your database credentials
2. Build the project:
   ```bash
   ./mvnw clean install
   ```
3. Run the application:
   ```bash
   ./mvnw spring-boot:run
   ```
4. Access the API at: `http://localhost:8080`

---

## Testing the API

You can test the API using:
- **cURL**
- **Postman**
- **Insomnia**
- **REST Client** (IDE extensions)

### Example cURL Commands

```bash
# Get all lost items
curl http://localhost:8080/api/items/lost

# Get all found items
curl http://localhost:8080/api/items/found

# Search items
curl http://localhost:8080/api/items/search?keyword=phone

# Create an item
curl -X POST http://localhost:8080/api/admin/items \
  -H "Content-Type: application/json" \
  -d '{"type":"LOST","itemName":"Keys","description":"Silver keys","location":"Library","studentName":"John","studentNumber":"STU001","status":"LOST"}'

# Update an item
curl -X PUT http://localhost:8080/api/admin/items/1 \
  -H "Content-Type: application/json" \
  -d '{"status":"CLAIMED"}'

# Delete an item
curl -X DELETE http://localhost:8080/api/admin/items/1

# Match items
curl -X PUT http://localhost:8080/api/admin/match-items \
  -H "Content-Type: application/json" \
  -d '{"lostItemId":1,"foundItemId":3}'
```

---

## Features Implemented

✅ **Public Features:**
- View all lost items
- View all found items
- Search functionality across multiple fields
- Get item details by ID

✅ **Admin Features:**
- Create new item entries
- Update item information
- Delete item entries
- Match lost items with found items
- Update item status

✅ **Backend Features:**
- REST API architecture
- PostgreSQL database integration
- JPA/Hibernate ORM
- Input validation
- Global exception handling
- CORS support
- Health check endpoints

---

## Future Enhancements

1. **Authentication & Authorization**: Add JWT-based security
2. **Image Upload**: Implement actual image file upload functionality
3. **Pagination**: Add pagination to list endpoints
4. **Filtering**: Advanced filtering by status, date range, etc.
5. **Notifications**: Email/SMS notifications for claimed items
6. **Analytics**: Track statistics on found/lost items
7. **Frontend**: HTML/CSS/JavaScript interface

---

## Support & Documentation

For more information about Spring Boot, visit:
- [Spring Boot Official Documentation](https://spring.io/projects/spring-boot)
- [Spring Data JPA Guide](https://spring.io/guides/gs/accessing-data-jpa/)
- [PostgreSQL JDBC Driver](https://jdbc.postgresql.org/)

