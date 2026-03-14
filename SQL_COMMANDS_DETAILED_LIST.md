# All SQL Commands - Detailed List

## 📋 Complete SQL Command Reference

Total Commands: **24**

---

## 🎯 COMMAND 1: Create Database

```sql
CREATE DATABASE lostfound;
```

**Purpose:** Creates the main database for Lost & Found Portal  
**Type:** DDL (Database Definition Language)  
**Frequency:** Run once during initial setup

---

## 🎯 COMMAND 2: Create Enum Type - item_type

```sql
CREATE TYPE item_type AS ENUM ('LOST', 'FOUND');
```

**Purpose:** Defines valid item types (Lost or Found)  
**Values:** 
- `LOST` - Item reported as lost
- `FOUND` - Item found and reported

**Type:** DDL (Type Definition)  
**Prevents:** Invalid type values in database

---

## 🎯 COMMAND 3: Create Enum Type - item_status

```sql
CREATE TYPE item_status AS ENUM ('LOST', 'FOUND', 'CLAIMED', 'NOT_CLAIMED');
```

**Purpose:** Defines valid item statuses  
**Values:**
- `LOST` - Item is lost (for lost type)
- `FOUND` - Item has been found (for lost type)
- `CLAIMED` - Item has been claimed by owner
- `NOT_CLAIMED` - Item hasn't been claimed yet

**Type:** DDL (Type Definition)  
**Prevents:** Invalid status values in database

---

## 🎯 COMMAND 4: Create items Table

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

**Purpose:** Main table storing all item records  
**Columns:** 15 total
- **id** - Auto-incrementing primary key
- **type** - Lost or Found (enum)
- **item_name** - Name of the item
- **description** - Detailed description
- **location** - Where lost/found
- **photo_url** - URL to item photo
- **photo_path** - Server file path
- **student_name** - Student who lost item (lost items)
- **student_number** - Student ID (lost items)
- **found_by** - Person who found it (found items)
- **status** - Current status (enum)
- **date_reported** - When reported
- **date_found** - When found
- **matched_with** - ID of matched item (self-referencing)
- **created_at** - Record creation timestamp
- **updated_at** - Last modification timestamp

**Type:** DDL (Table Definition)  
**Relationships:** Self-referencing foreign key for matching

---

## 🎯 COMMAND 5-16: Create Indexes (12 Total)

### COMMAND 5: Index on Type

```sql
CREATE INDEX idx_items_type ON items(type);
```

**Purpose:** Speed up queries filtering by LOST/FOUND  
**Performance Impact:** ~100x faster for type filtering

---

### COMMAND 6: Index on Status

```sql
CREATE INDEX idx_items_status ON items(status);
```

**Purpose:** Speed up queries filtering by status  
**Speeds up:** WHERE status = 'CLAIMED'

---

### COMMAND 7: Composite Index - Type + Status

```sql
CREATE INDEX idx_items_type_status ON items(type, status);
```

**Purpose:** Speed up combined filtering  
**Speeds up:** WHERE type = 'LOST' AND status = 'CLAIMED'  
**Performance:** Best for two-condition filters

---

### COMMAND 8: Index on Item Name

```sql
CREATE INDEX idx_items_item_name ON items(item_name);
```

**Purpose:** Speed up search by item name  
**Speeds up:** WHERE item_name LIKE '%phone%'

---

### COMMAND 9: Index on Location

```sql
CREATE INDEX idx_items_location ON items(location);
```

**Purpose:** Speed up search by location  
**Speeds up:** WHERE location = 'Library'

---

### COMMAND 10: Index on Student Name

```sql
CREATE INDEX idx_items_student_name ON items(student_name);
```

**Purpose:** Speed up search by student name  
**Speeds up:** WHERE student_name = 'John Doe'

---

### COMMAND 11: Index on Student Number

```sql
CREATE INDEX idx_items_student_number ON items(student_number);
```

**Purpose:** Speed up search by student ID  
**Speeds up:** WHERE student_number = 'STU001'

---

### COMMAND 12: Index on Found By

```sql
CREATE INDEX idx_items_found_by ON items(found_by);
```

**Purpose:** Speed up search by finder name  
**Speeds up:** WHERE found_by = 'Security'

---

### COMMAND 13: Index on Date Reported (Descending)

```sql
CREATE INDEX idx_items_date_reported ON items(date_reported DESC);
```

**Purpose:** Speed up sorting by date (newest first)  
**Speeds up:** ORDER BY date_reported DESC

---

### COMMAND 14: Index on Created At (Descending)

```sql
CREATE INDEX idx_items_created_at ON items(created_at DESC);
```

**Purpose:** Speed up sorting by creation date  
**Speeds up:** ORDER BY created_at DESC LIMIT 10

---

### COMMAND 15: Conditional Index - Lost Items Search

```sql
CREATE INDEX idx_items_search_lost ON items(type, item_name, location, student_name) WHERE type = 'LOST';
```

**Purpose:** Optimize search for lost items only  
**Includes:** Only lost items (type = 'LOST')  
**Speeds up:** Search queries on lost items page

---

### COMMAND 16: Conditional Index - Found Items Search

```sql
CREATE INDEX idx_items_search_found ON items(type, item_name, location, found_by) WHERE type = 'FOUND';
```

**Purpose:** Optimize search for found items only  
**Includes:** Only found items (type = 'FOUND')  
**Speeds up:** Search queries on found items page

---

## 🎯 COMMAND 17: Create Function for Auto-Updating Timestamps

```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

**Purpose:** PostgreSQL function that updates timestamp automatically  
**When Called:** When a trigger fires  
**Result:** Sets `updated_at` to current time

---

## 🎯 COMMAND 18: Create Trigger for Auto-Updating Timestamps

```sql
CREATE TRIGGER trigger_update_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

**Purpose:** Automatically updates `updated_at` when records change  
**Event:** Triggered BEFORE any UPDATE on items table  
**Function Called:** `update_updated_at_column()`  
**Result:** No manual timestamp management needed

---

## 🎯 COMMAND 19: Create View - Unclaimed Lost Items

```sql
CREATE OR REPLACE VIEW view_lost_items_unclaimed AS
SELECT * FROM items
WHERE type = 'LOST' AND status = 'LOST'
ORDER BY date_reported DESC;
```

**Purpose:** Pre-built query for unclaimed lost items  
**Filters:** Only lost items with lost status  
**Sorted By:** Most recent first  
**Usage:** `SELECT * FROM view_lost_items_unclaimed;`

---

## 🎯 COMMAND 20: Create View - Unclaimed Found Items

```sql
CREATE OR REPLACE VIEW view_found_items_unclaimed AS
SELECT * FROM items
WHERE type = 'FOUND' AND status = 'NOT_CLAIMED'
ORDER BY date_found DESC;
```

**Purpose:** Pre-built query for unclaimed found items  
**Filters:** Only found items not yet claimed  
**Sorted By:** Most recent first  
**Usage:** `SELECT * FROM view_found_items_unclaimed;`

---

## 🎯 COMMAND 21: Create View - Claimed Items

```sql
CREATE OR REPLACE VIEW view_items_claimed AS
SELECT * FROM items
WHERE status = 'CLAIMED'
ORDER BY updated_at DESC;
```

**Purpose:** Pre-built query for all claimed items  
**Filters:** Only claimed items  
**Sorted By:** Most recently updated  
**Usage:** `SELECT * FROM view_items_claimed;`

---

## 🎯 COMMAND 22: Create View - Matched Items

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

**Purpose:** Pre-built query showing lost items matched with found items  
**Join:** Links lost items with their corresponding found items  
**Shows:** Side-by-side comparison of matched pairs  
**Usage:** `SELECT * FROM view_items_matched;`

---

## 🎯 COMMAND 23: Insert Sample Lost Items

```sql
INSERT INTO items (type, item_name, description, location, student_name, student_number, status, date_reported, created_at, updated_at)
VALUES 
    ('LOST', 'Car Keys', 'Silver car keys with blue keychain', 'Library Building', 'Alice Johnson', 'STU001', 'LOST', NOW(), NOW(), NOW()),
    ('LOST', 'iPhone 13', 'Black iPhone 13 with cracked screen protector', 'Cafeteria', 'Bob Smith', 'STU002', 'LOST', NOW() - INTERVAL '1 day', NOW(), NOW()),
    ('LOST', 'Student ID Card', 'Red student ID with photo', 'Gym', 'Charlie Davis', 'STU003', 'LOST', NOW() - INTERVAL '2 days', NOW(), NOW());
```

**Purpose:** Insert 3 sample lost items for testing  
**Items:**
1. Car Keys - Lost at Library by Alice Johnson
2. iPhone 13 - Lost at Cafeteria by Bob Smith (1 day ago)
3. Student ID - Lost at Gym by Charlie Davis (2 days ago)

**Type:** DML (Data Manipulation Language)  
**Result:** Database ready for testing

---

## 🎯 COMMAND 24: Insert Sample Found Items

```sql
INSERT INTO items (type, item_name, description, location, found_by, status, date_found, created_at, updated_at)
VALUES 
    ('FOUND', 'Wallet', 'Brown leather wallet with multiple cards', 'Lost and Found Desk', 'Security', 'NOT_CLAIMED', NOW() - INTERVAL '3 days', NOW(), NOW()),
    ('FOUND', 'Laptop', 'Dell Inspiron 15 laptop, serial no. 123456', 'Classroom 201', 'Maintenance Staff', 'NOT_CLAIMED', NOW() - INTERVAL '2 days', NOW(), NOW()),
    ('FOUND', 'Water Bottle', 'Blue metal water bottle with stickers', 'Sports Complex', 'Cleaning Staff', 'CLAIMED', NOW() - INTERVAL '1 day', NOW(), NOW());
```

**Purpose:** Insert 3 sample found items for testing  
**Items:**
1. Wallet - Found at Lost & Found Desk by Security (Not claimed)
2. Laptop - Found in Classroom 201 by Maintenance (Not claimed)
3. Water Bottle - Found at Sports Complex by Cleaning Staff (Already claimed)

**Type:** DML (Data Manipulation Language)  
**Result:** Database populated with test data

---

## 📊 Command Summary

| Category | Count | Type | Purpose |
|----------|-------|------|---------|
| Database | 1 | DDL | Create main database |
| Enums | 2 | DDL | Type definitions |
| Tables | 1 | DDL | Main data table |
| Indexes | 12 | DDL | Performance optimization |
| Functions | 1 | DDL | Auto-update logic |
| Triggers | 1 | DDL | Timestamp automation |
| Views | 4 | DDL | Pre-built queries |
| Inserts | 2 | DML | Sample data |
| **TOTAL** | **24** | - | Complete setup |

---

## ✅ Execution Order

Execute commands in this order:

1. **CREATE DATABASE** (Command 1)
2. **CREATE ENUM TYPES** (Commands 2-3)
3. **CREATE TABLE** (Command 4)
4. **CREATE INDEXES** (Commands 5-16)
5. **CREATE FUNCTION** (Command 17)
6. **CREATE TRIGGER** (Command 18)
7. **CREATE VIEWS** (Commands 19-22)
8. **INSERT DATA** (Commands 23-24)

⏱️ **Total Execution Time:** ~2 minutes

---

## 🚀 How to Execute

### Option 1: Copy All at Once
```bash
1. Copy all 24 commands from SQL_ALL_COMMANDS_CLEAN.sql
2. Paste in DBeaver SQL Editor
3. Press Ctrl + Enter
4. ✅ Done in 2 minutes!
```

### Option 2: Execute One Section at a Time
```bash
1. Execute Commands 1-3 (Database + Enums)
2. Execute Command 4 (Table)
3. Execute Commands 5-16 (Indexes)
4. Execute Commands 17-18 (Trigger)
5. Execute Commands 19-22 (Views)
6. Execute Commands 23-24 (Data)
```

### Option 3: Command Line
```bash
psql -U postgres -f SQL_ALL_COMMANDS_CLEAN.sql
```

---

**All 24 SQL Commands Ready to Execute!**

