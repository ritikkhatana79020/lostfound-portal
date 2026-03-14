# DBeaver Setup Guide for Lost & Found Portal

## Overview

This guide helps you set up PostgreSQL connection using **DBeaver** (Community or Enterprise Edition) for the Lost & Found Portal application.

## What is DBeaver?

DBeaver is a free, open-source universal database manager and SQL client. It provides a user-friendly interface to manage PostgreSQL databases without needing the command line.

**Download:** https://dbeaver.io/download/

## Prerequisites

- DBeaver installed and running
- PostgreSQL installed and running on `localhost:5432`
- PostgreSQL user credentials:
  - Username: `postgres`
  - Password: `postgres` (or your custom password)

## Step-by-Step Setup

### Step 1: Launch DBeaver

Open DBeaver application. You should see the main window with an empty Connections list.

### Step 2: Create New PostgreSQL Connection

**Method 1: Using Menu**
1. Click **Database** → **New Database Connection**
2. Select **PostgreSQL** from the database list
3. Click **Next**

**Method 2: Using Keyboard Shortcut**
- Press `Ctrl + Shift + N` (Windows/Linux)
- Press `Cmd + Shift + N` (macOS)

**Method 3: Using Connections Panel**
1. Right-click in the "Database" panel on the left
2. Select **New Database Connection**
3. Choose **PostgreSQL**

### Step 3: Configure Connection Settings

Fill in the connection details:

| Field | Value | Notes |
|-------|-------|-------|
| **Server Host** | `localhost` | PostgreSQL server address |
| **Port** | `5432` | Default PostgreSQL port |
| **Database** | `lostfound` | Leave empty for now, we'll create it |
| **Username** | `postgres` | PostgreSQL admin user |
| **Password** | `postgres` | Your PostgreSQL password |
| **Connection Name** | `Lost & Found` | Friendly name for this connection |

**Screenshot Reference:**
```
Connection Name:        [Lost & Found]
Server Host:            [localhost]
Port:                   [5432]
Database:               []
Username:               [postgres]
Password:               [postgres]
[✓] Save password locally
```

### Step 4: Test Connection

1. Click **Test Connection** button at the bottom
2. If prompted to download drivers, click **Download**
3. Wait for PostgreSQL JDBC driver to download
4. You should see a success message: **"Successfully connected to PostgreSQL"**

### Step 5: Finish Setup

1. Click **Finish** to save the connection
2. The connection will appear in the left panel under **Connections**
3. Double-click to expand and view the connection

### Step 6: Create Database

Now create the `lostfound` database:

**Using DBeaver GUI:**
1. Right-click on the connection in the left panel
2. Select **Create New Database**
3. Name: `lostfound`
4. Click **OK**

**Using SQL Query:**
1. Right-click on the connection
2. Select **SQL Editor** → **New SQL Script**
3. Paste this SQL:
```sql
CREATE DATABASE lostfound;
```
4. Execute (Ctrl + Enter)

### Step 7: Verify Database Creation

1. Expand the connection in the left panel
2. You should see **Schemas** → **public**
3. The tables will be created automatically when you start the application

## Connecting the Application

The application is already configured to connect to PostgreSQL at `localhost:5432` with the `lostfound` database.

**Verify in `application.properties`:**
```properties
spring.datasource.url=jdbc:postgresql://localhost:5432/lostfound
spring.datasource.username=postgres
spring.datasource.password=postgres
spring.jpa.hibernate.ddl-auto=update
```

**If you used different credentials, update:**
- `spring.datasource.password` - your PostgreSQL password
- `spring.datasource.username` - your PostgreSQL username

## Common DBeaver Tasks

### View All Tables

1. Expand **Connections** → **Your Connection**
2. Expand **Schemas** → **public**
3. Click **Tables** to see all tables
4. Double-click a table to view data

### Query Data

1. Right-click on **Connections** → **SQL Editor** → **New SQL Script**
2. Write your SQL query:
```sql
SELECT * FROM items;
```
3. Execute with **Ctrl + Enter** or click **Execute** button

### View Table Structure

1. In left panel, expand **Tables**
2. Click on a table (e.g., `items`)
3. Switch to **Properties** tab to see columns and data types
4. Switch to **Data** tab to view records

### Insert Sample Data

1. Open SQL Editor
2. Paste and execute:
```sql
INSERT INTO items (type, item_name, description, location, status, date_reported, created_at, updated_at)
VALUES ('LOST', 'Phone', 'iPhone 14', 'Library', 'LOST', NOW(), NOW(), NOW());
```

### Backup Database

1. Right-click on connection
2. Select **Tasks** → **Backup**
3. Choose backup file location
4. Click **Backup**

### Restore Database

1. Right-click on connection
2. Select **Tasks** → **Restore**
3. Select backup file
4. Click **Restore**

## Troubleshooting

### "Cannot connect to PostgreSQL" Error

**Solution 1: Check PostgreSQL is Running**
```bash
# macOS
brew services list | grep postgresql

# Linux
sudo systemctl status postgresql

# Windows
Check Services in System Settings
```

**Solution 2: Verify Credentials**
- Confirm PostgreSQL username/password
- Ensure no extra spaces in password field

**Solution 3: Check Port Availability**
```bash
# macOS/Linux
lsof -i :5432

# Windows
netstat -ano | findstr :5432
```

**Solution 4: Download PostgreSQL Driver**
- DBeaver will prompt to download JDBC driver on first connection
- Click **Download** and wait for completion

### "Database 'lostfound' does not exist"

**Solution:**
1. Create the database in DBeaver (see Step 6)
2. Or run SQL: `CREATE DATABASE lostfound;`

### "Access denied" Error

**Solution:**
1. Verify PostgreSQL username and password in DBeaver
2. Check if password contains special characters (needs escaping)
3. Reset PostgreSQL password if forgotten

## Features to Explore

Once connected, you can:

- **Browse Schema** - View all tables, columns, and relationships
- **Edit Data** - Directly modify records in the GUI
- **Execute Queries** - Run custom SQL scripts
- **Create Reports** - Generate data reports
- **Data Export** - Export to CSV, JSON, Excel
- **Query Debugging** - Debug complex queries
- **Monitor Performance** - View query execution plans
- **Backup/Restore** - Manage database backups

## Integration with Application

### Workflow

1. **Start Backend**
   ```bash
   ./mvnw spring-boot:run
   ```

2. **Monitor in DBeaver** (Optional)
   - Watch the `items` table update in real-time
   - Refresh: Press **F5** on the table

3. **Use Frontend**
   - Open browser: http://localhost:8080
   - Add items through admin panel
   - View them in DBeaver: Right-click `items` table → **View Data**

### Real-time Monitoring

1. Open `items` table in DBeaver
2. Switch to **Data** tab
3. Click **Auto-refresh** (if available)
4. Refresh interval: Configure in preferences

## Best Practices

✅ **Do:**
- Always test connections before saving
- Use meaningful connection names
- Keep passwords secure
- Backup database regularly
- Use transactions for multiple changes

❌ **Don't:**
- Modify schema while application is running
- Delete tables without backup
- Use production credentials in development
- Store passwords in plain text
- Make changes without understanding impact

## Advanced Configuration

### Connection Pooling

For better performance, DBeaver uses connection pooling:

**Settings:**
1. Right-click connection
2. Select **Edit Connection**
3. Go to **Pool** tab
4. Adjust minimum/maximum pool size (default: 5/30)

### SSH Tunnel (Remote PostgreSQL)

If PostgreSQL is on a remote server:

1. Edit connection
2. Go to **SSH** tab
3. Enable **Use SSH tunnel**
4. Configure SSH credentials
5. Test and save

### SSL Connection

For secure connections:

1. Edit connection
2. Go to **SSL** tab
3. Enable **Use SSL**
4. Configure certificates
5. Test and save

## Additional Resources

- **DBeaver Documentation:** https://dbeaver.com/docs/
- **PostgreSQL Documentation:** https://www.postgresql.org/docs/
- **DBeaver Community:** https://github.com/dbeaver/dbeaver
- **Database Design:** https://www.postgresql.org/docs/current/ddl.html

## Support

If you encounter issues:

1. Check **Help** → **Support/Feedback** in DBeaver
2. Visit DBeaver Community: https://github.com/dbeaver/dbeaver/discussions
3. Check PostgreSQL logs for errors
4. Review Lost & Found Portal documentation

---

**Last Updated:** March 14, 2026
**Version:** 1.0
**Compatible with:** DBeaver 6.0+, PostgreSQL 10+

