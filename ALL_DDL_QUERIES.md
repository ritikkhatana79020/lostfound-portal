# All DDL Queries - Quick List

## 📋 All DDL Queries for Lost & Found Portal

---

## 1️⃣ CREATE DATABASE

```sql
CREATE DATABASE lostfound;
```

---

## 2️⃣ CREATE ENUMS

```sql
CREATE TYPE item_type AS ENUM ('LOST', 'FOUND');
CREATE TYPE item_status AS ENUM ('LOST', 'FOUND', 'CLAIMED', 'NOT_CLAIMED');
```

---

## 3️⃣ CREATE TABLE

```sql
CREATE TABLE items (
    id BIGSERIAL PRIMARY KEY,
    type item_type NOT NULL,
    item_name VARCHAR(255) NOT NULL,
    description TEXT,
    location VARCHAR(255) NOT NULL,
    photo_url VARCHAR(500),
    photo_path VARCHAR(500),
    student_name VARCHAR(255),
    student_number VARCHAR(50),
    found_by VARCHAR(255),
    status item_status NOT NULL,
    date_reported TIMESTAMP NOT NULL,
    date_found TIMESTAMP,
    matched_with BIGINT,
    created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_matched_item FOREIGN KEY (matched_with) REFERENCES items(id) ON DELETE SET NULL
);
```

---

## 4️⃣ CREATE INDEXES (9 Total)

### Basic Indexes
```sql
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_type_status ON items(type, status);
CREATE INDEX idx_items_item_name ON items(item_name);
CREATE INDEX idx_items_location ON items(location);
CREATE INDEX idx_items_student_name ON items(student_name);
CREATE INDEX idx_items_student_number ON items(student_number);
CREATE INDEX idx_items_found_by ON items(found_by);
CREATE INDEX idx_items_date_reported ON items(date_reported DESC);
CREATE INDEX idx_items_created_at ON items(created_at DESC);
```

### Conditional Indexes
```sql
CREATE INDEX idx_items_search_lost ON items(type, item_name, location, student_name) WHERE type = 'LOST';
CREATE INDEX idx_items_search_found ON items(type, item_name, location, found_by) WHERE type = 'FOUND';
```

---

## 5️⃣ CREATE TRIGGER

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

---

## 6️⃣ CREATE VIEWS (4 Total)

### View: Unclaimed Lost Items
```sql
CREATE OR REPLACE VIEW view_lost_items_unclaimed AS
SELECT * FROM items
WHERE type = 'LOST' AND status = 'LOST'
ORDER BY date_reported DESC;
```

### View: Unclaimed Found Items
```sql
CREATE OR REPLACE VIEW view_found_items_unclaimed AS
SELECT * FROM items
WHERE type = 'FOUND' AND status = 'NOT_CLAIMED'
ORDER BY date_found DESC;
```

### View: Claimed Items
```sql
CREATE OR REPLACE VIEW view_items_claimed AS
SELECT * FROM items
WHERE status = 'CLAIMED'
ORDER BY updated_at DESC;
```

### View: Matched Items
```sql
CREATE OR REPLACE VIEW view_items_matched AS
SELECT 
    l.id as lost_id,
    l.item_name as lost_item_name,
    l.location as lost_location,
    l.student_name as lost_by,
    f.id as found_id,
    f.item_name as found_item_name,
    f.location as found_location,
    f.found_by,
    l.matched_with,
    l.created_at
FROM items l
JOIN items f ON l.matched_with = f.id
WHERE l.type = 'LOST' AND f.type = 'FOUND' AND l.matched_with IS NOT NULL
ORDER BY l.created_at DESC;
```

---

## 7️⃣ INSERT SAMPLE DATA

```sql
INSERT INTO items (type, item_name, description, location, student_name, student_number, status, date_reported, created_at, updated_at)
VALUES 
    ('LOST', 'Car Keys', 'Silver car keys with blue keychain', 'Library Building', 'Alice Johnson', 'STU001', 'LOST', NOW(), NOW(), NOW()),
    ('LOST', 'iPhone 13', 'Black iPhone 13 with cracked screen protector', 'Cafeteria', 'Bob Smith', 'STU002', 'LOST', NOW() - INTERVAL '1 day', NOW(), NOW()),
    ('LOST', 'Student ID Card', 'Red student ID with photo', 'Gym', 'Charlie Davis', 'STU003', 'LOST', NOW() - INTERVAL '2 days', NOW(), NOW());

INSERT INTO items (type, item_name, description, location, found_by, status, date_found, created_at, updated_at)
VALUES 
    ('FOUND', 'Wallet', 'Brown leather wallet with multiple cards', 'Lost and Found Desk', 'Security', 'NOT_CLAIMED', NOW() - INTERVAL '3 days', NOW(), NOW()),
    ('FOUND', 'Laptop', 'Dell Inspiron 15 laptop, serial no. 123456', 'Classroom 201', 'Maintenance Staff', 'NOT_CLAIMED', NOW() - INTERVAL '2 days', NOW(), NOW()),
    ('FOUND', 'Water Bottle', 'Blue metal water bottle with stickers', 'Sports Complex', 'Cleaning Staff', 'CLAIMED', NOW() - INTERVAL '1 day', NOW(), NOW());
```

---

## 📊 DDL QUERY COUNT

| Category | Count | Type |
|----------|-------|------|
| Database | 1 | CREATE |
| Enums | 2 | CREATE |
| Tables | 1 | CREATE |
| Indexes | 12 | CREATE |
| Functions | 1 | CREATE |
| Triggers | 1 | CREATE |
| Views | 4 | CREATE |
| Insert Statements | 2 | INSERT |
| **TOTAL** | **24** | - |

---

## 📁 Files with DDL

1. **SQL_DDL_COMPLETE.sql** - Full DDL with detailed comments
2. **SQL_DDL_QUICK.sql** - Minimal DDL for quick setup
3. **DDL_QUERIES_REFERENCE.md** - Complete reference guide with explanations

---

## 🚀 Quick Setup

```bash
# Option 1: Using quick SQL file
psql -U postgres -f SQL_DDL_QUICK.sql

# Option 2: Manual copy-paste
psql -U postgres
CREATE DATABASE lostfound;
\c lostfound
-- Copy and paste SQL queries above
```

---

## ✅ Verification Queries

```sql
-- Check database exists
\l

-- Connect to database
\c lostfound

-- View table structure
\d items

-- List all indexes
\di items*

-- List all views
\dv

-- Count data
SELECT COUNT(*) FROM items;
```

---

## 📝 Summary

**Total DDL Objects:**
- ✅ 1 Database
- ✅ 2 Enums
- ✅ 1 Table (items)
- ✅ 12 Indexes
- ✅ 1 Trigger Function
- ✅ 1 Trigger
- ✅ 4 Views
- ✅ Sample data (6 rows)

**Key Features:**
- ✅ Auto-updating timestamps
- ✅ Optimized indexes for searching/filtering
- ✅ Foreign key for matching items
- ✅ Type-safe enums
- ✅ Useful views for common queries
- ✅ Sample data for testing

---

**For detailed explanations, see:** [DDL_QUERIES_REFERENCE.md](./DDL_QUERIES_REFERENCE.md)

**For complete DDL with comments, see:** [SQL_DDL_COMPLETE.sql](./SQL_DDL_COMPLETE.sql)

**For quick setup, use:** [SQL_DDL_QUICK.sql](./SQL_DDL_QUICK.sql)

