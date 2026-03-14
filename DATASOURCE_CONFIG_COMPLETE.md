# Complete DBeaver & Application Configuration Setup

## Answer to Your Question

**Q: Don't we need to update the datasource properties?**

**A: No - they're already perfect!** 🎯

The current `application.properties` datasource settings are correct and don't need updating unless you changed your PostgreSQL credentials.

Here's why:

```
✅ Current Configuration Matches Default PostgreSQL Setup
   ├─ Host: localhost (on your computer)
   ├─ Port: 5432 (default PostgreSQL port)
   ├─ Database: lostfound (as required)
   ├─ Username: postgres (default admin user)
   └─ Password: postgres (default password)

✅ These Match DBeaver Connection Defaults
   ├─ Server Host: localhost
   ├─ Port: 5432
   ├─ Username: postgres
   └─ Password: postgres

✅ They Work Together
   DBeaver (GUI) ←→ PostgreSQL ←→ Spring Boot (API)
   Same connection = No issues!
```

## Complete Setup Verification

### 1. PostgreSQL Running
```bash
# Check if PostgreSQL is running
psql --version
# You should see: psql (PostgreSQL) X.X.X
```

### 2. DBeaver Connection Works
- Open DBeaver
- Right-click connection → Test Connection
- Should see: ✅ "Successfully connected to PostgreSQL"

### 3. Database Exists
- Expand connection in DBeaver
- Look for `lostfound` database
- If not there, right-click → Create New Database → Name: `lostfound`

### 4. Spring Boot Connects
- Start backend: `./mvnw spring-boot:run`
- Check backend starts without database errors
- Verify: `curl http://localhost:8080/health` returns 200

### 5. Frontend Works
- Open browser: http://localhost:8080
- Add an item through admin panel
- Switch to DBeaver, refresh `items` table → New item appears ✓

## Configuration Files Reference

### application.properties
```properties
# Current settings (CORRECT - no changes needed unless credentials changed)
spring.datasource.url=jdbc:postgresql://localhost:5432/lostfound
spring.datasource.username=postgres
spring.datasource.password=postgres

# Additional helpful settings
spring.jpa.hibernate.ddl-auto=update  # Auto-create schema
spring.datasource.hikari.maximum-pool-size=10  # Connection pooling
```

### DBeaver Settings
```
Server Host:  localhost
Port:         5432
Database:     lostfound
Username:     postgres
Password:     postgres
```

**Result:** Both point to same database = ✅ Perfect match!

## When to Update Credentials

Update datasource properties **IF and ONLY IF** you:

### Case 1: Changed PostgreSQL Password
```bash
# In DBeaver:
# Right-click connection → Edit Connection → Change password

# In application.properties:
spring.datasource.password=your_new_password
```

### Case 2: Changed PostgreSQL Username
```bash
# In application.properties:
spring.datasource.username=your_new_username
```

### Case 3: PostgreSQL on Different Machine
```bash
# In application.properties:
spring.datasource.url=jdbc:postgresql://192.168.1.100:5432/lostfound
```

### Case 4: PostgreSQL on Different Port
```bash
# In application.properties:
spring.datasource.url=jdbc:postgresql://localhost:5433/lostfound
```

**After any changes:**
```bash
# Restart backend
./mvnw spring-boot:run
```

## Connection String Breakdown

```
JDBC URL: jdbc:postgresql://localhost:5432/lostfound
           │   │          │          │     │        │
           │   │          │          │     │        └─ Database name: lostfound
           │   │          │          │     └───────── Port: 5432
           │   │          │          └──────────────── Server: localhost
           │   │          └───────────────────────── URL separator
           │   └──────────────────────────────────── Database: PostgreSQL
           └─────────────────────────────────────── JDBC protocol
```

## Troubleshooting: Still Have Issues?

### Backend Won't Connect to Database
```
Error: "Cannot connect to database" or "Connection refused"

Solution 1: Check PostgreSQL Running
$ psql -U postgres
postgres=#  (should show this prompt)

Solution 2: Verify DBeaver Connects
- Open DBeaver
- Right-click connection → Test Connection
- Should succeed

Solution 3: Check Credentials Match
- DBeaver: postgres/postgres@localhost:5432
- application.properties: same credentials
- Are they exactly the same?

Solution 4: Check Database Exists
- In DBeaver, expand connection
- Do you see "lostfound" database?
- If not, create it

Solution 5: Check Port 5432 Not Blocked
$ lsof -i :5432
(should show PostgreSQL listening)
```

### DBeaver Can't Connect
```
Error: "Cannot connect to server"

Solution 1: PostgreSQL Not Running
$ brew services start postgresql  (macOS)
$ sudo service postgresql start   (Linux)

Solution 2: Wrong Host/Port
- Check Server Host: localhost
- Check Port: 5432

Solution 3: Wrong Credentials
- Username: postgres (default)
- Password: postgres (default)
- Did you change them?

Solution 4: Firewall Blocking
- Check firewall allows port 5432
- Try: telnet localhost 5432
```

### Added Item in Admin Panel But Not Showing in DBeaver
```
Solution 1: Refresh DBeaver
- Right-click "items" table
- Press F5 or click Refresh

Solution 2: Verify Backend Running
- Check terminal: ./mvnw spring-boot:run
- Should show: "Started LostfoundPortalApplication"

Solution 3: Check Application Errors
- Look at backend terminal
- Any red error messages?

Solution 4: Verify Data Actually Saved
- In DBeaver SQL Editor, run:
  SELECT COUNT(*) FROM items;
- Should show row count > 0
```

## Complete Setup Checklist

```
BEFORE YOU START:
□ Java 17+ installed (java -version)
□ PostgreSQL installed (psql --version)
□ DBeaver installed and launched

STEP 1: PostgreSQL Setup
□ PostgreSQL service running
□ Default user: postgres
□ Default password: postgres

STEP 2: DBeaver Connection
□ Create new PostgreSQL connection
□ Server Host: localhost
□ Port: 5432
□ Username: postgres
□ Password: postgres
□ Test Connection → SUCCESS ✓
□ Create database: lostfound

STEP 3: Application Configuration
□ application.properties has correct settings
□ Spring datasource URL: jdbc:postgresql://localhost:5432/lostfound
□ Username: postgres
□ Password: postgres

STEP 4: Start Application
□ Run: ./mvnw spring-boot:run
□ No database connection errors
□ Application starts successfully

STEP 5: Verify Setup
□ Frontend loads: http://localhost:8080
□ Backend health: curl http://localhost:8080/health
□ Can add items through admin panel
□ Items appear in DBeaver table

YOU'RE DONE! ✅
```

## Quick Reference Card

| Component | Current Value | Where to Change |
|-----------|---------------|-----------------|
| PostgreSQL Host | localhost | OS, application.properties |
| PostgreSQL Port | 5432 | OS, application.properties |
| Database Name | lostfound | DBeaver, application.properties |
| Username | postgres | DBeaver, application.properties |
| Password | postgres | DBeaver, application.properties |
| Backend Port | 8080 | application.properties |
| Frontend URL | http://localhost:8080 | browser |

## Summary

**Current Status: ✅ READY**

Your `application.properties` is perfectly configured. DBeaver and Spring Boot are both set up to use the same PostgreSQL database with the same credentials.

**What to do next:**
1. ✅ Start PostgreSQL
2. ✅ Verify DBeaver connection
3. ✅ Run backend: `./mvnw spring-boot:run`
4. ✅ Open frontend: http://localhost:8080
5. ✅ Test by adding items and viewing in DBeaver

**No configuration changes needed unless you changed PostgreSQL credentials!**

---

## Related Documentation Files

- **[DBEAVER_SETUP.md](./DBEAVER_SETUP.md)** - Detailed DBeaver setup guide
- **[DBEAVER_APP_PROPERTIES_SYNC.md](./DBEAVER_APP_PROPERTIES_SYNC.md)** - Synchronizing DBeaver & application.properties
- **[CONFIG_DIAGRAMS.md](./CONFIG_DIAGRAMS.md)** - Visual configuration diagrams
- **[QUICKSTART.md](./QUICKSTART.md)** - Quick start guide
- **[DEPLOYMENT_GUIDE.md](./DEPLOYMENT_GUIDE.md)** - Production deployment

---

**Last Updated:** March 14, 2026
**Version:** 1.0
**Status:** Production Ready ✅

