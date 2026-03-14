# API Testing Guide - Lost & Found Portal

## Table of Contents
1. [Testing Tools](#testing-tools)
2. [API Endpoints Summary](#api-endpoints-summary)
3. [Detailed Test Scenarios](#detailed-test-scenarios)
4. [cURL Examples](#curl-examples)
5. [Postman Testing](#postman-testing)
6. [Response Codes & Error Handling](#response-codes--error-handling)

---

## Testing Tools

### Recommended Tools
- **cURL** - Command-line tool (built-in on macOS/Linux)
- **Postman** - Full-featured API testing platform
- **Insomnia** - REST client alternative
- **VS Code REST Client** - Simple VS Code extension
- **Thunder Client** - VS Code integrated client

### Installation
```bash
# cURL - already installed on macOS
# Postman - Download from https://www.postman.com/downloads/

# Insomnia - Download from https://insomnia.rest/
# VS Code REST Client - Install from VS Code extensions

# Thunder Client - Install from VS Code extensions
```

---

## API Endpoints Summary

### Public Endpoints
| HTTP Method | Endpoint | Description | Auth Required |
|-------------|----------|-------------|---------------|
| GET | `/` | Welcome page | No |
| GET | `/health` | Health check | No |
| GET | `/api/items/lost` | All lost items | No |
| GET | `/api/items/found` | All found items | No |
| GET | `/api/items/{id}` | Item by ID | No |
| GET | `/api/items/search` | Search items | No |

### Admin Endpoints
| HTTP Method | Endpoint | Description | Auth Required |
|-------------|----------|-------------|---------------|
| POST | `/api/admin/items` | Create item | No* |
| PUT | `/api/admin/items/{id}` | Update item | No* |
| DELETE | `/api/admin/items/{id}` | Delete item | No* |
| PUT | `/api/admin/match-items` | Match items | No* |

*Currently no authentication required. Should be added in production.

---

## Detailed Test Scenarios

### Scenario 1: Create a Lost Item

**Purpose**: Add a new lost item to the system

**Request Details**:
- **Method**: POST
- **URL**: `http://localhost:8080/api/admin/items`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "type": "LOST",
  "itemName": "Samsung Galaxy Phone",
  "description": "Black Samsung Galaxy S21 with silver case",
  "location": "Engineering Building",
  "photoUrl": "https://example.com/phone.jpg",
  "studentName": "Alex Johnson",
  "studentNumber": "STU12345",
  "status": "LOST"
}
```

**Expected Response** (201 Created):
```json
{
  "id": 1,
  "type": "LOST",
  "itemName": "Samsung Galaxy Phone",
  "description": "Black Samsung Galaxy S21 with silver case",
  "location": "Engineering Building",
  "photoUrl": "https://example.com/phone.jpg",
  "studentName": "Alex Johnson",
  "studentNumber": "STU12345",
  "status": "LOST",
  "dateReported": "2026-03-14T10:30:45.123456",
  "createdAt": "2026-03-14T10:30:45.123456",
  "updatedAt": "2026-03-14T10:30:45.123456"
}
```

---

### Scenario 2: Create a Found Item

**Purpose**: Add a found item to the system

**Request Details**:
- **Method**: POST
- **URL**: `http://localhost:8080/api/admin/items`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "type": "FOUND",
  "itemName": "Brown Leather Wallet",
  "description": "Contains multiple credit cards and ID",
  "location": "Lost & Found Desk",
  "photoUrl": "https://example.com/wallet.jpg",
  "foundBy": "Security Guard - John Smith",
  "status": "NOT_CLAIMED"
}
```

**Expected Response** (201 Created):
```json
{
  "id": 2,
  "type": "FOUND",
  "itemName": "Brown Leather Wallet",
  "description": "Contains multiple credit cards and ID",
  "location": "Lost & Found Desk",
  "photoUrl": "https://example.com/wallet.jpg",
  "foundBy": "Security Guard - John Smith",
  "status": "NOT_CLAIMED",
  "dateFound": "2026-03-14T10:30:45.123456",
  "createdAt": "2026-03-14T10:30:45.123456",
  "updatedAt": "2026-03-14T10:30:45.123456"
}
```

---

### Scenario 3: Get All Lost Items

**Purpose**: Retrieve all reported lost items

**Request Details**:
- **Method**: GET
- **URL**: `http://localhost:8080/api/items/lost`

**Expected Response** (200 OK):
```json
[
  {
    "id": 1,
    "type": "LOST",
    "itemName": "Samsung Galaxy Phone",
    "description": "Black Samsung Galaxy S21 with silver case",
    "location": "Engineering Building",
    "studentName": "Alex Johnson",
    "studentNumber": "STU12345",
    "status": "LOST",
    "dateReported": "2026-03-14T09:00:00",
    "createdAt": "2026-03-14T09:00:00",
    "updatedAt": "2026-03-14T09:00:00"
  },
  {
    "id": 3,
    "type": "LOST",
    "itemName": "Car Keys",
    "description": "Silver keys with blue keychain",
    "location": "Library",
    "studentName": "Jane Doe",
    "studentNumber": "STU67890",
    "status": "LOST",
    "dateReported": "2026-03-13T14:30:00",
    "createdAt": "2026-03-13T14:30:00",
    "updatedAt": "2026-03-13T14:30:00"
  }
]
```

---

### Scenario 4: Search Items

**Purpose**: Find items by keyword

**Request Details**:
- **Method**: GET
- **URL**: `http://localhost:8080/api/items/search?keyword=phone`

**Query Parameters**:
- `keyword` (required): Search term (searches across itemName, description, location, studentName, studentNumber, foundBy)

**Expected Response** (200 OK):
```json
[
  {
    "id": 1,
    "type": "LOST",
    "itemName": "Samsung Galaxy Phone",
    ...
  }
]
```

---

### Scenario 5: Update Item Status

**Purpose**: Mark an item as claimed or update its information

**Request Details**:
- **Method**: PUT
- **URL**: `http://localhost:8080/api/admin/items/1`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "status": "CLAIMED"
}
```

**Expected Response** (200 OK):
```json
{
  "id": 1,
  "type": "LOST",
  "itemName": "Samsung Galaxy Phone",
  "description": "Black Samsung Galaxy S21 with silver case",
  "location": "Engineering Building",
  "studentName": "Alex Johnson",
  "studentNumber": "STU12345",
  "status": "CLAIMED",
  "dateReported": "2026-03-14T09:00:00",
  "updatedAt": "2026-03-14T11:45:30.123456"
}
```

---

### Scenario 6: Match Lost and Found Items

**Purpose**: Link a lost item with its corresponding found item

**Request Details**:
- **Method**: PUT
- **URL**: `http://localhost:8080/api/admin/match-items`
- **Content-Type**: `application/json`

**Request Body**:
```json
{
  "lostItemId": 1,
  "foundItemId": 2
}
```

**Expected Response** (200 OK):
```json
{
  "id": 1,
  "type": "LOST",
  "itemName": "Samsung Galaxy Phone",
  ...
  "matchedWith": 2
}
```

---

### Scenario 7: Delete an Item

**Purpose**: Remove an item from the system

**Request Details**:
- **Method**: DELETE
- **URL**: `http://localhost:8080/api/admin/items/1`

**Expected Response** (204 No Content):
```
(No body)
```

---

## cURL Examples

### Basic Health Check
```bash
curl http://localhost:8080/health
```

### Get All Lost Items
```bash
curl http://localhost:8080/api/items/lost
```

### Get All Found Items
```bash
curl http://localhost:8080/api/items/found
```

### Create a Lost Item
```bash
curl -X POST http://localhost:8080/api/admin/items \
  -H "Content-Type: application/json" \
  -d '{
    "type": "LOST",
    "itemName": "Laptop",
    "description": "Dell Inspiron 15 inch",
    "location": "Computer Lab",
    "studentName": "Bob Wilson",
    "studentNumber": "STU11111",
    "status": "LOST"
  }'
```

### Search for Items
```bash
curl "http://localhost:8080/api/items/search?keyword=laptop"
```

### Get Specific Item
```bash
curl http://localhost:8080/api/items/1
```

### Update Item Status
```bash
curl -X PUT http://localhost:8080/api/admin/items/1 \
  -H "Content-Type: application/json" \
  -d '{"status": "CLAIMED"}'
```

### Match Items
```bash
curl -X PUT http://localhost:8080/api/admin/match-items \
  -H "Content-Type: application/json" \
  -d '{
    "lostItemId": 1,
    "foundItemId": 5
  }'
```

### Delete an Item
```bash
curl -X DELETE http://localhost:8080/api/admin/items/1
```

### Pretty Print Response with jq
```bash
curl http://localhost:8080/api/items/lost | jq '.'
```

---

## Postman Testing

### Import Collection

1. Open Postman
2. Click "Import"
3. Paste the following JSON or create requests manually

### Manual Setup

**1. Create Environment Variable**
- Set variable: `base_url` = `http://localhost:8080`

**2. Create Requests**

#### Request 1: Get Lost Items
```
Name: Get Lost Items
Method: GET
URL: {{base_url}}/api/items/lost
```

#### Request 2: Create Lost Item
```
Name: Create Lost Item
Method: POST
URL: {{base_url}}/api/admin/items
Headers: Content-Type: application/json
Body (raw):
{
  "type": "LOST",
  "itemName": "Textbook",
  "description": "Advanced Java Programming",
  "location": "Library 3rd Floor",
  "studentName": "Charlie Brown",
  "studentNumber": "STU22222",
  "status": "LOST"
}
```

#### Request 3: Search Items
```
Name: Search Items
Method: GET
URL: {{base_url}}/api/items/search?keyword=textbook
```

#### Request 4: Update Item
```
Name: Update Item Status
Method: PUT
URL: {{base_url}}/api/admin/items/1
Headers: Content-Type: application/json
Body (raw):
{
  "status": "CLAIMED"
}
```

#### Request 5: Match Items
```
Name: Match Items
Method: PUT
URL: {{base_url}}/api/admin/match-items
Headers: Content-Type: application/json
Body (raw):
{
  "lostItemId": 1,
  "foundItemId": 2
}
```

#### Request 6: Delete Item
```
Name: Delete Item
Method: DELETE
URL: {{base_url}}/api/admin/items/1
```

---

## Response Codes & Error Handling

### Success Responses

| Status Code | Meaning | Example |
|------------|---------|---------|
| 200 OK | Request succeeded | GET, PUT |
| 201 CREATED | Resource created | POST /api/admin/items |
| 204 NO CONTENT | Resource deleted | DELETE |

### Error Responses

| Status Code | Meaning | Example |
|------------|---------|---------|
| 400 BAD REQUEST | Invalid input | Missing required fields |
| 404 NOT FOUND | Resource not found | Item ID doesn't exist |
| 500 INTERNAL SERVER ERROR | Server error | Database connection failure |

### Error Response Format

```json
{
  "timestamp": "2026-03-14T10:30:45.123456",
  "status": 404,
  "error": "Not Found",
  "message": "Item not found with id: 999",
  "path": "/api/items/999"
}
```

---

## Testing Checklist

- [ ] Health check returns 200 OK
- [ ] Create lost item returns 201 CREATED
- [ ] Create found item returns 201 CREATED
- [ ] Get all lost items returns 200 OK with array
- [ ] Get all found items returns 200 OK with array
- [ ] Search items returns matching results
- [ ] Get item by ID returns 200 OK
- [ ] Update item status returns 200 OK
- [ ] Match items returns 200 OK with matchedWith set
- [ ] Delete item returns 204 NO CONTENT
- [ ] Invalid requests return 400 BAD REQUEST
- [ ] Non-existent items return 404 NOT FOUND
- [ ] CORS headers are present in response

---

## Performance Testing

### Load Testing with Apache Bench
```bash
# Test 1000 requests with 10 concurrent
ab -n 1000 -c 10 http://localhost:8080/api/items/lost

# Test with POST
ab -n 100 -c 5 -p payload.json -T application/json http://localhost:8080/api/admin/items
```

### Using wrk
```bash
# 4 threads, 100 connections, 30 seconds
wrk -t4 -c100 -d30s http://localhost:8080/api/items/lost
```

---

## Common Issues and Solutions

### Issue: 404 Not Found on POST
**Solution**: Ensure POST endpoint is `/api/admin/items` not `/api/items`

### Issue: 400 Bad Request
**Solution**: Check Content-Type header is `application/json` and body is valid JSON

### Issue: 500 Internal Server Error
**Solution**: Check server logs for database connection errors

### Issue: CORS Error in Browser
**Solution**: Verify CORS is configured in application.properties

---

## Next Steps

1. Test all endpoints manually
2. Create comprehensive integration tests
3. Add authentication/authorization
4. Set up CI/CD pipeline with automated API tests
5. Add API documentation with Swagger/OpenAPI

