# DBeaver & Spring Boot Configuration Diagram

## How DBeaver and Spring Boot Connect to PostgreSQL

```
┌──────────────────────────────────────────────────────────────┐
│                    Your Computer                             │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────┐                  ┌─────────────────┐   │
│  │  DBeaver GUI    │                  │  Spring Boot    │   │
│  │  (Database      │                  │  Application    │   │
│  │   Client)       │                  │  (REST API)     │   │
│  └────────┬────────┘                  └────────┬────────┘   │
│           │                                    │             │
│  Connection Settings:                         │             │
│  ├─ Host: localhost                          │             │
│  ├─ Port: 5432                               │             │
│  ├─ Username: postgres               application.properties:│
│  ├─ Password: postgres               ├─ URL: jdbc:postgresql://
│  └─ Database: lostfound                │      localhost:5432/
│                                        │      lostfound
│  Username/Password Input:              ├─ Username: postgres
│  ├─ Right-click Connection             ├─ Password: postgres
│  ├─ Edit Connection                    └─ Driver: PostgreSQL
│  └─ Configure credentials
│           │                                    │
│           └────────────┬──────────────────────┘
│                        │
│                        ▼
│        ┌──────────────────────────┐
│        │  PostgreSQL Server       │
│        │  localhost:5432          │
│        ├──────────────────────────┤
│        │  Database: lostfound     │
│        │  Tables:                 │
│        │  ├─ items                │
│        │  └─ (auto-created)       │
│        └──────────────────────────┘
│                 ▲
│                 │
│        Credentials Used:
│        ├─ Username: postgres
│        ├─ Password: postgres
│        └─ Database: lostfound
│
└──────────────────────────────────────────────────────────────┘
```

## Side-by-Side Configuration Comparison

```
┌─────────────────────────────┬──────────────────────────────┐
│    DBeaver Connection       │  application.properties      │
├─────────────────────────────┼──────────────────────────────┤
│ Server Host: localhost      │ URL: jdbc:postgresql://      │
│                             │      localhost:5432/...      │
├─────────────────────────────┼──────────────────────────────┤
│ Port: 5432                  │ (embedded in URL)            │
├─────────────────────────────┼──────────────────────────────┤
│ Database: lostfound         │ (embedded in URL path)       │
├─────────────────────────────┼──────────────────────────────┤
│ Username: postgres          │ username=postgres            │
├─────────────────────────────┼──────────────────────────────┤
│ Password: postgres          │ password=postgres            │
├─────────────────────────────┼──────────────────────────────┤
│ Connected via GUI           │ Connected via JDBC Driver    │
└─────────────────────────────┴──────────────────────────────┘
```

## Configuration Update Workflow

```
USER CHANGES POSTGRESQL PASSWORD
        │
        ▼
┌─────────────────────────┐
│  Update in DBeaver:     │
│                         │
│  1. Right-click Conn    │
│  2. Edit Connection     │
│  3. Change Password     │
│  4. Test Connection ✓   │
└──────────┬──────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│  Update application.properties:             │
│                                             │
│  spring.datasource.password=newpassword    │
└──────────┬──────────────────────────────────┘
           │
           ▼
┌─────────────────────────────────────────────┐
│  Restart Spring Boot:                       │
│                                             │
│  ./mvnw spring-boot:run                    │
└──────────┬──────────────────────────────────┘
           │
           ▼
✓ SYSTEM UPDATED & WORKING
```

## Data Flow: How Items Flow Through System

```
┌──────────────────────────────────────────────────────────────┐
│ 1. USER ADDS ITEM VIA ADMIN PANEL                           │
├──────────────────────────────────────────────────────────────┤
│ Browser Form                                                │
│ └─ Item Name: "Phone"                                       │
│ └─ Location: "Library"                                      │
│ └─ Submit Button Clicked                                    │
└────────────┬─────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│ 2. FRONTEND SENDS HTTP REQUEST                              │
├──────────────────────────────────────────────────────────────┤
│ POST http://localhost:8080/api/admin/items                  │
│ Body: { itemName: "Phone", location: "Library", ... }       │
└────────────┬─────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│ 3. SPRING BOOT PROCESSES REQUEST                            │
├──────────────────────────────────────────────────────────────┤
│ ItemController receives request                             │
│ └─ Validates data                                           │
│ └─ Calls ItemService                                        │
│ └─ ItemService saves to database                            │
└────────────┬─────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│ 4. DATA SAVED TO POSTGRESQL                                 │
├──────────────────────────────────────────────────────────────┤
│ Using credentials from application.properties:              │
│ ├─ Host: localhost                                          │
│ ├─ Port: 5432                                               │
│ ├─ Database: lostfound                                      │
│ ├─ Username: postgres                                       │
│ └─ Password: postgres                                       │
│                                                              │
│ INSERT INTO items (itemName, location, ...)                │
│ VALUES ('Phone', 'Library', ...)                            │
└────────────┬─────────────────────────────────────────────────┘
             │
             ▼
┌──────────────────────────────────────────────────────────────┐
│ 5. VERIFY IN DBEAVER                                        │
├──────────────────────────────────────────────────────────────┤
│ DBeaver Connection (same credentials):                      │
│ ├─ Server: localhost                                        │
│ ├─ Database: lostfound                                      │
│ ├─ Username: postgres                                       │
│ └─ Password: postgres                                       │
│                                                              │
│ Right-click items table → View Data                         │
│ ✓ New item appears in table                                 │
└──────────────────────────────────────────────────────────────┘
```

## URL Connection String Breakdown

```
┌────────────────────────────────────────────────────────────────┐
│  jdbc:postgresql://localhost:5432/lostfound                   │
└────────────────────────────────────────────────────────────────┘
   │     │           │              │     │                  │
   │     │           │              │     │                  └─ Database name
   │     │           │              │     └────────────────────── Database separator
   │     │           │              └──────────────────────────── Port number
   │     │           └─────────────────────────────────────────── Host separator
   │     └───────────────────────────────────────────────────────── Server host
   └───────────────────────────────────────────────────────────────── Protocol + Database type

Components:
├─ Protocol: jdbc
├─ Driver: postgresql
├─ Host: localhost
├─ Port: 5432
└─ Database: lostfound
```

## Configuration Synchronization Checklist

```
When Setting Up or Changing Configuration:

DBeaver Setup:
□ Server Host = localhost
□ Port = 5432
□ Database = lostfound
□ Username = postgres
□ Password = postgres
□ Test Connection → SUCCESS ✓

application.properties Setup:
□ URL contains: localhost:5432/lostfound
□ Username = postgres
□ Password = postgres
□ Matches DBeaver exactly ✓

Verification:
□ Spring Boot starts without DB errors
□ curl http://localhost:8080/health returns 200
□ Can view items in DBeaver
□ Can add items and see them in both places
```

## Environment Variables (Advanced)

For production or multiple environments:

```bash
# Set in environment
export DB_HOST=localhost
export DB_PORT=5432
export DB_NAME=lostfound
export DB_USER=postgres
export DB_PASSWORD=postgres

# Reference in application.properties
spring.datasource.url=jdbc:postgresql://${DB_HOST}:${DB_PORT}/${DB_NAME}
spring.datasource.username=${DB_USER}
spring.datasource.password=${DB_PASSWORD}
```

---

**Remember:** DBeaver and application.properties are just two different ways to access the same PostgreSQL database. They must use identical credentials!

