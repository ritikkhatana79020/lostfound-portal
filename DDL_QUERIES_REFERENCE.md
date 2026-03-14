# DDL Queries Reference Guide - Lost & Found Portal

## Overview

DDL (Data Definition Language) queries are used to define and manage database structures. This guide includes all DDL queries for the Lost & Found Portal database.

---

## 1. CREATE DATABASE

### Query
```sql
CREATE DATABASE lostfound;
```

### Explanation
- Creates a new PostgreSQL database named `lostfound`
- This is where all the application data is stored
- Only needs to be run once during initial setup

### Verify
```sql
-- List all databases
\l

-- Connect to the database
\c lostfound
```

---

## 2. CREATE ENUM TYPES

### Item Type Enum
```sql
CREATE TYPE item_type AS ENUM ('LOST', 'FOUND');
```

**Values:**
- `LOST` - Item has been reported as lost
- `FOUND` - Item has been found and reported

### Item Status Enum
```sql
CREATE TYPE item_status AS ENUM ('LOST', 'FOUND', 'CLAIMED', 'NOT_CLAIMED');
```

**Values:**
- `LOST` - Item is lost (for lost type)
- `FOUND` - Item has been found (for lost type)
- `CLAIMED` - Item has been claimed by owner
- `NOT_CLAIMED` - Item hasn't been claimed yet

### Explanation
- PostgreSQL ENUM types restrict values to specified options
- Ensures data integrity at database level
- More efficient than VARCHAR with constraints

### Verify
```sql
-- List all enum types
SELECT typname FROM pg_type WHERE typtype = 'e';
```

---

## 3. CREATE MAIN TABLE: items

### Complete Query
```sql
CREATE TABLE items (
    -- Primary Key
    id BIGSERIAL PRIMARY KEY,
    
    -- Item Classification
    type item_type NOT NULL,
    
    -- Item Information
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    
    -- Photo Information
    photo_url VARCHAR(500),
    photo_path VARCHAR(500),
    
    -- Lost Item Information
    student_name VARCHAR(255),
    student_number VARCHAR(50),
    
    -- Found Item Information
    found_by VARCHAR(255),
    
    -- Status Tracking
    status item_status NOT NULL,
    
    -- Date Information
    date_reported TIMESTAMP NOT NULL,
    date_found TIMESTAMP,
    
    -- Item Matching
    matched_with BIGINT,
    
    -- Audit Information
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Foreign Key Constraint
    CONSTRAINT fk_matched_item FOREIGN KEY (matched_with) 
        REFERENCES items(id) ON DELETE SET NULL
);
```

### Column Reference

| Column | Type | Constraints | Purpose |
|--------|------|-------------|---------|
| `id` | BIGSERIAL | PRIMARY KEY | Unique identifier |
| `type` | item_type | NOT NULL | LOST or FOUND |
| `item_name` | VARCHAR(255) | NOT NULL | Name of the item |
| `description` | TEXT | NULLABLE | Detailed description |
| `location` | VARCHAR(255) | NOT NULL | Where lost/found |
| `photo_url` | VARCHAR(500) | NULLABLE | Photo URL link |
| `photo_path` | VARCHAR(500) | NULLABLE | Server file path |
| `student_name` | VARCHAR(255) | NULLABLE | For lost items |
| `student_number` | VARCHAR(50) | NULLABLE | Student ID for lost items |
| `found_by` | VARCHAR(255) | NULLABLE | Who found the item |
| `status` | item_status | NOT NULL | LOST/FOUND/CLAIMED/NOT_CLAIMED |
| `date_reported` | TIMESTAMP | NOT NULL | When reported |
| `date_found` | TIMESTAMP | NULLABLE | When item was found |
| `matched_with` | BIGINT | NULLABLE | ID of matched item (FK) |
| `created_at` | TIMESTAMP | NOT NULL, DEFAULT NOW | Record creation time |
| `updated_at` | TIMESTAMP | DEFAULT NOW | Last update time |

### Verify
```sql
-- List all tables
\dt

-- View table structure
\d items

-- Count rows
SELECT COUNT(*) FROM items;
```

---

## 4. CREATE INDEXES

### Purpose
Indexes improve query performance by enabling faster data retrieval.

### Index on Item Type
```sql
CREATE INDEX idx_items_type ON items(type);
```
- Speeds up queries filtering by LOST/FOUND

### Index on Item Status
```sql
CREATE INDEX idx_items_status ON items(status);
```
- Speeds up queries filtering by status

### Composite Index: Type + Status
```sql
CREATE INDEX idx_items_type_status ON items(type, status);
```
- Optimizes queries filtering by both type and status
- Common pattern: `WHERE type = 'LOST' AND status = 'CLAIMED'`

### Index on Item Name (Search)
```sql
CREATE INDEX idx_items_item_name ON items(item_name);
```
- Speeds up search by item name

### Index on Location (Search)
```sql
CREATE INDEX idx_items_location ON items(location);
```
- Speeds up search by location

### Index on Student Name (Search)
```sql
CREATE INDEX idx_items_student_name ON items(student_name);
```
- Speeds up search by student name

### Index on Student Number (Search)
```sql
CREATE INDEX idx_items_student_number ON items(student_number);
```
- Speeds up search by student ID

### Index on Found By (Search)
```sql
CREATE INDEX idx_items_found_by ON items(found_by);
```
- Speeds up search by who found the item

### Index on Date Reported (Sorting)
```sql
CREATE INDEX idx_items_date_reported ON items(date_reported DESC);
```
- Speeds up sorting items by date
- DESC for newest first queries

### Index on Created At (Sorting)
```sql
CREATE INDEX idx_items_created_at ON items(created_at DESC);
```
- Speeds up sorting by creation date

### Conditional Indexes (Advanced)
```sql
-- Lost items only
CREATE INDEX idx_items_search_lost ON items(type, item_name, location, student_name) 
WHERE type = 'LOST';

-- Found items only
CREATE INDEX idx_items_search_found ON items(type, item_name, location, found_by) 
WHERE type = 'FOUND';
```

### Verify Indexes
```sql
-- List all indexes
SELECT indexname FROM pg_indexes WHERE tablename = 'items';

-- Get index details
\d items
```

---

## 5. CREATE TRIGGER FOR AUTO-UPDATE TIMESTAMP

### Function
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

### Trigger
```sql
CREATE TRIGGER trigger_update_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

### Explanation
- Automatically updates the `updated_at` timestamp whenever a record is modified
- Ensures accurate audit trail
- No manual intervention needed

### Verify
```sql
-- Update a record
UPDATE items SET description = 'Updated' WHERE id = 1;

-- Check updated_at was updated
SELECT id, updated_at FROM items WHERE id = 1;
```

---

## 6. ALTER TABLE QUERIES (For Future Changes)

### Add New Column
```sql
ALTER TABLE items ADD COLUMN notes TEXT;
```

### Modify Column Type
```sql
ALTER TABLE items ALTER COLUMN description SET NOT NULL;
```

### Add Constraint
```sql
ALTER TABLE items ADD CONSTRAINT check_valid_status 
CHECK (status IN ('LOST', 'FOUND', 'CLAIMED', 'NOT_CLAIMED'));
```

### Drop Column
```sql
ALTER TABLE items DROP COLUMN notes;
```

### Rename Column
```sql
ALTER TABLE items RENAME COLUMN found_by TO finder_name;
```

### Rename Table
```sql
ALTER TABLE items RENAME TO lost_found_items;
```

---

## 7. DROP QUERIES (For Cleanup/Reset)

### Drop Table (with data)
```sql
DROP TABLE IF EXISTS items CASCADE;
```

### Drop Enum Type
```sql
DROP TYPE IF EXISTS item_type CASCADE;
DROP TYPE IF EXISTS item_status CASCADE;
```

### Drop Specific Index
```sql
DROP INDEX IF EXISTS idx_items_type;
```

### Drop Database (Complete Reset)
```sql
DROP DATABASE IF EXISTS lostfound;
```

⚠️ **WARNING:** These queries delete data. Use with caution in production!

---

## 8. VIEW QUERIES (Optional)

### Create View: Unclaimed Lost Items
```sql
CREATE OR REPLACE VIEW view_lost_items_unclaimed AS
SELECT * FROM items
WHERE type = 'LOST' AND status = 'LOST'
ORDER BY date_reported DESC;
```

### Create View: Unclaimed Found Items
```sql
CREATE OR REPLACE VIEW view_found_items_unclaimed AS
SELECT * FROM items
WHERE type = 'FOUND' AND status = 'NOT_CLAIMED'
ORDER BY date_found DESC;
```

### Create View: Claimed Items
```sql
CREATE OR REPLACE VIEW view_items_claimed AS
SELECT * FROM items
WHERE status = 'CLAIMED'
ORDER BY updated_at DESC;
```

### Query a View
```sql
SELECT * FROM view_lost_items_unclaimed;
```

---

## 9. SEQUENCE MANAGEMENT

### View Current Sequence Value
```sql
SELECT last_value FROM items_id_seq;
```

### Reset Sequence (Start from 1)
```sql
ALTER SEQUENCE items_id_seq RESTART WITH 1;
```

### Set Sequence to Specific Value
```sql
SELECT setval('items_id_seq', 1000);
```

---

## 10. CONSTRAINT MANAGEMENT

### Add Primary Key (if missing)
```sql
ALTER TABLE items ADD CONSTRAINT pk_items PRIMARY KEY (id);
```

### Add Unique Constraint
```sql
ALTER TABLE items ADD CONSTRAINT uk_items_student_number UNIQUE (student_number);
```

### Add Check Constraint
```sql
ALTER TABLE items ADD CONSTRAINT check_dates 
CHECK (date_reported <= CURRENT_TIMESTAMP);
```

### Drop Constraint
```sql
ALTER TABLE items DROP CONSTRAINT fk_matched_item;
```

---

## 11. USEFUL QUERIES

### View Table Structure
```sql
-- Show columns and types
\d items

-- Show constraints
SELECT constraint_name, constraint_type 
FROM information_schema.table_constraints 
WHERE table_name = 'items';
```

### Get Table Size
```sql
SELECT pg_size_pretty(pg_total_relation_size('items'));
```

### Get Index Size
```sql
SELECT schemaname, tablename, indexname, pg_size_pretty(pg_relation_size(indexrelid))
FROM pg_stat_user_indexes
WHERE tablename = 'items';
```

### Analyze Table Statistics
```sql
ANALYZE items;
```

### Vacuum Table (Cleanup)
```sql
VACUUM items;
```

---

## 12. BACKUP & RESTORE

### Backup Database
```bash
pg_dump -U postgres -d lostfound > backup_lostfound.sql
```

### Backup with Compression
```bash
pg_dump -U postgres -d lostfound | gzip > backup_lostfound.sql.gz
```

### Restore from Backup
```bash
psql -U postgres -d lostfound < backup_lostfound.sql
```

### Restore from Compressed Backup
```bash
gunzip -c backup_lostfound.sql.gz | psql -U postgres -d lostfound
```

---

## SQL Files Provided

| File | Purpose | When to Use |
|------|---------|------------|
| **SQL_DDL_COMPLETE.sql** | Full DDL with comments | Detailed reference, learning |
| **SQL_DDL_QUICK.sql** | Essential DDL only | Quick setup, copy-paste |
| **This file** | DDL Reference Guide | Understanding each query |

---

## Usage Examples

### Complete Setup (Copy & Paste)
```bash
# Connect to PostgreSQL
psql -U postgres

# Run the quick DDL script
\i /path/to/SQL_DDL_QUICK.sql

# Verify
\d items
SELECT COUNT(*) FROM items;
```

### Automated Setup
```bash
# Run SQL file directly
psql -U postgres -f SQL_DDL_QUICK.sql
```

### Using DBeaver
1. Open DBeaver
2. Right-click connection → SQL Editor → New SQL Script
3. Copy-paste queries from SQL_DDL_QUICK.sql
4. Execute with Ctrl + Enter

---

## Best Practices

✅ **Do:**
- Run DDL in development/testing first
- Keep backups before major DDL changes
- Test queries before production deployment
- Use transactions for multiple related changes
- Document all custom changes

❌ **Don't:**
- Run DROP statements without backup
- Modify schema during application runtime
- Use generic column names
- Skip constraints for "flexibility"
- Ignore performance with large datasets

---

**Last Updated:** March 14, 2026
**Version:** 1.0
**Status:** Complete

