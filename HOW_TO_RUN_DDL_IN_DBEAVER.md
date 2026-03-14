# How to Execute DDL Queries in DBeaver

## 📌 Quick Methods

### Method 1: Run SQL File Directly (Easiest)

1. **Open DBeaver**
2. **Right-click on your PostgreSQL connection**
3. **Select: SQL Editor → Execute Script from File**
4. **Browse to: `SQL_DDL_QUICK.sql`**
5. **Click Execute**
6. ✅ **Done! All DDL queries run automatically**

---

### Method 2: Create New SQL Script

1. **Open DBeaver**
2. **Right-click connection → SQL Editor → New SQL Script**
3. **Paste content from `SQL_DDL_QUICK.sql`**
4. **Press Ctrl + Enter** to execute all
5. ✅ **Check results in Messages tab**

---

### Method 3: Copy-Paste Query by Query (Detailed)

1. **Open DBeaver**
2. **Right-click connection → SQL Editor → New SQL Script**
3. **Copy first query:**
   ```sql
   CREATE DATABASE lostfound;
   ```
4. **Paste in editor**
5. **Press Ctrl + Enter** or click Execute button
6. **Check for success message**
7. **Repeat for each query**

---

## 🎯 Step-by-Step Guide

### Step 1: Connect to PostgreSQL

```
In DBeaver:
├─ Expand Database
├─ Right-click "Connections"
├─ Click "New Database Connection"
├─ Select "PostgreSQL"
├─ Configure (Host: localhost, Port: 5432, etc.)
└─ Test & Finish
```

### Step 2: Create Database

```
1. Right-click connection → SQL Editor → New SQL Script
2. Copy and paste:
   CREATE DATABASE lostfound;
3. Execute (Ctrl + Enter)
4. See success message
```

### Step 3: Connect to the New Database

```
1. Close current SQL editor
2. Double-click the lostfound database (or right-click → Connect)
3. New SQL Editor opens (now connected to lostfound database)
```

### Step 4: Create Enums

```sql
-- Copy both lines and execute together
CREATE TYPE item_type AS ENUM ('LOST', 'FOUND');
CREATE TYPE item_status AS ENUM ('LOST', 'FOUND', 'CLAIMED', 'NOT_CLAIMED');
```

### Step 5: Create Table

```sql
-- Copy the entire CREATE TABLE statement
CREATE TABLE items (
    -- ... (full table definition)
);
```

### Step 6: Create Indexes

```sql
-- Execute each index creation (can do multiple at once)
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_status ON items(status);
-- ... (rest of indexes)
```

### Step 7: Create Trigger

```sql
-- Run function creation first
CREATE OR REPLACE FUNCTION update_updated_at_column() ...

-- Then run trigger
CREATE TRIGGER trigger_update_items_updated_at ...
```

### Step 8: Create Views

```sql
-- Run each view creation
CREATE OR REPLACE VIEW view_lost_items_unclaimed AS ...
CREATE OR REPLACE VIEW view_found_items_unclaimed AS ...
-- ... (rest of views)
```

### Step 9: Insert Sample Data

```sql
-- Run both INSERT statements
INSERT INTO items (type, item_name, ...) VALUES ...
INSERT INTO items (type, item_name, ...) VALUES ...
```

---

## ✅ Verification in DBeaver

### Check Database Created
```
1. Right-click connection → Refresh (F5)
2. Expand "Databases" folder
3. Should see "lostfound" database
```

### Check Table Created
```
1. Expand lostfound database
2. Expand "Schemas" → "public"
3. Expand "Tables"
4. Should see "items" table
```

### Check Table Structure
```
1. Right-click "items" table
2. Click "View Data" or "Properties"
3. See all columns and their types
```

### Check Indexes
```
1. Expand "items" table
2. Expand "Indexes" folder
3. Should see all index names
```

### Check Views
```
1. Expand "Views" folder under public schema
2. Should see all 4 views
```

### Check Sample Data
```
1. Right-click "items" table
2. Select "View Data"
3. Should see 6 rows of sample data
```

---

## 🐛 Troubleshooting

### Error: "Database already exists"

```sql
-- If database exists, drop it first
DROP DATABASE IF EXISTS lostfound;

-- Then create new
CREATE DATABASE lostfound;
```

### Error: "Type already exists"

```sql
-- Drop enums first (if re-running)
DROP TYPE IF EXISTS item_type CASCADE;
DROP TYPE IF EXISTS item_status CASCADE;

-- Then create
CREATE TYPE item_type AS ENUM ('LOST', 'FOUND');
```

### Error: "Relation already exists"

```sql
-- Drop table first (if re-running)
DROP TABLE IF EXISTS items CASCADE;

-- Then create new
CREATE TABLE items (...)
```

### Error: "Cannot find file"

```
1. Ensure SQL_DDL_QUICK.sql is in correct path
2. Try absolute path instead of relative
3. Or copy-paste content directly into editor
```

### Script Execution Failed

```
1. Check DBeaver error messages
2. Scroll in Messages tab to see full error
3. Check for missing semicolons
4. Check database connection is active
5. Try executing queries one by one
```

---

## 📊 Expected Output

### Successful Database Creation
```
Query Result:
[n/a] 0 rows, execution time: 123 ms
(Connected to: PostgreSQL lostfound)
```

### Successful Table Creation
```
Query Result:
[n/a] 0 rows, execution time: 456 ms
```

### Successful Index Creation
```
Query Result:
[n/a] 0 rows, execution time: 78 ms
(Created 1 index successfully)
```

### Successful Data Insert
```
Query Result:
[n/a] 6 rows inserted, execution time: 234 ms
```

---

## 🎬 Complete Workflow (Visual)

```
DBeaver Launch
    ↓
New PostgreSQL Connection
    ↓
Connect to PostgreSQL
    ↓
SQL Editor → Execute CREATE DATABASE
    ↓
Refresh & Connect to lostfound DB
    ↓
SQL Editor → Execute CREATE TYPE (Enums)
    ↓
SQL Editor → Execute CREATE TABLE
    ↓
SQL Editor → Execute CREATE INDEXES
    ↓
SQL Editor → Execute CREATE TRIGGER & FUNCTION
    ↓
SQL Editor → Execute CREATE VIEWS
    ↓
SQL Editor → Execute INSERT DATA
    ↓
View Data in Table
    ↓
✅ SUCCESS!
```

---

## 🔄 Re-running DDL (Fresh Setup)

If you need to start over:

```sql
-- Drop everything (CAREFUL!)
DROP VIEW IF EXISTS view_items_matched CASCADE;
DROP VIEW IF EXISTS view_items_claimed CASCADE;
DROP VIEW IF EXISTS view_found_items_unclaimed CASCADE;
DROP VIEW IF EXISTS view_lost_items_unclaimed CASCADE;
DROP TRIGGER IF EXISTS trigger_update_items_updated_at ON items;
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP TABLE IF EXISTS items CASCADE;
DROP TYPE IF EXISTS item_status CASCADE;
DROP TYPE IF EXISTS item_type CASCADE;

-- Now run the complete DDL again
-- (Copy all queries from SQL_DDL_QUICK.sql)
```

---

## 📝 DBeaver Tips & Tricks

### Auto-format SQL
```
Select all text (Ctrl + A)
Press Ctrl + Shift + F
(Automatically indents and formats)
```

### Execute Selection Only
```
Select specific queries
Press Ctrl + Enter
(Only selected queries execute)
```

### Show Execution Plan
```
Select a query
Right-click → Explain Plan
(See how database executes it)
```

### Save Script
```
File → Save Script As
Save as: .sql file
(Can open later)
```

### Export Results
```
Right-click result table
Export → Choose format (CSV, Excel, etc.)
```

### View Table Statistics
```
Right-click table
View Log → Statistics
(See table size, row count, etc.)
```

---

## ✨ Best Practices

✅ **Do:**
- Execute DDL in logical order
- Check success after each step
- Keep backups
- Test in development first
- Use SQL Editor for complex scripts

❌ **Don't:**
- Run DROP statements without backup
- Skip verification steps
- Close DBeaver mid-execution
- Modify DDL during application runtime
- Ignore error messages

---

## 📁 Files Available

| File | Use Case |
|------|----------|
| **SQL_DDL_QUICK.sql** | Copy-paste entire script |
| **SQL_DDL_COMPLETE.sql** | Reference with detailed comments |
| **DDL_QUERIES_REFERENCE.md** | Learn what each query does |
| **ALL_DDL_QUERIES.md** | Quick list of all queries |

---

**Ready to execute? Start with [SQL_DDL_QUICK.sql](./SQL_DDL_QUICK.sql)** 🚀

