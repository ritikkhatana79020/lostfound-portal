# 📋 COMPLETE SQL COMMANDS LISTING - LINE BY LINE

## All 24 SQL Commands for Lost & Found Portal Database

---

## 🔢 COMMAND 1
```sql
CREATE DATABASE lostfound;
```
**Creates:** Main database  
**Executes once:** Yes  

---

## 🔢 COMMAND 2
```sql
CREATE TYPE item_type AS ENUM ('LOST', 'FOUND');
```
**Creates:** Enum type for item classification  
**Values:** LOST or FOUND  

---

## 🔢 COMMAND 3
```sql
CREATE TYPE item_status AS ENUM ('LOST', 'FOUND', 'CLAIMED', 'NOT_CLAIMED');
```
**Creates:** Enum type for item status  
**Values:** LOST, FOUND, CLAIMED, or NOT_CLAIMED  

---

## 🔢 COMMAND 4
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
**Creates:** Main items table  
**Columns:** 15  
**Constraints:** Foreign key for matching  

---

## 🔢 COMMAND 5
```sql
CREATE INDEX idx_items_type ON items(type);
```
**Creates:** Index on type column  
**Purpose:** Speeds up filtering by LOST/FOUND  

---

## 🔢 COMMAND 6
```sql
CREATE INDEX idx_items_status ON items(status);
```
**Creates:** Index on status column  
**Purpose:** Speeds up filtering by status  

---

## 🔢 COMMAND 7
```sql
CREATE INDEX idx_items_type_status ON items(type, status);
```
**Creates:** Composite index  
**Purpose:** Speeds up filtering by both type and status  

---

## 🔢 COMMAND 8
```sql
CREATE INDEX idx_items_item_name ON items(item_name);
```
**Creates:** Index on item name  
**Purpose:** Speeds up search by item name  

---

## 🔢 COMMAND 9
```sql
CREATE INDEX idx_items_location ON items(location);
```
**Creates:** Index on location  
**Purpose:** Speeds up search by location  

---

## 🔢 COMMAND 10
```sql
CREATE INDEX idx_items_student_name ON items(student_name);
```
**Creates:** Index on student name  
**Purpose:** Speeds up search by student name  

---

## 🔢 COMMAND 11
```sql
CREATE INDEX idx_items_student_number ON items(student_number);
```
**Creates:** Index on student number  
**Purpose:** Speeds up search by student ID  

---

## 🔢 COMMAND 12
```sql
CREATE INDEX idx_items_found_by ON items(found_by);
```
**Creates:** Index on found_by  
**Purpose:** Speeds up search by finder name  

---

## 🔢 COMMAND 13
```sql
CREATE INDEX idx_items_date_reported ON items(date_reported DESC);
```
**Creates:** Index on date_reported (descending)  
**Purpose:** Speeds up sorting by date (newest first)  

---

## 🔢 COMMAND 14
```sql
CREATE INDEX idx_items_created_at ON items(created_at DESC);
```
**Creates:** Index on created_at (descending)  
**Purpose:** Speeds up sorting by creation date  

---

## 🔢 COMMAND 15
```sql
CREATE INDEX idx_items_search_lost ON items(type, item_name, location, student_name) WHERE type = 'LOST';
```
**Creates:** Conditional composite index  
**Purpose:** Optimized search for lost items only  
**Covers:** Lost items that match search terms  

---

## 🔢 COMMAND 16
```sql
CREATE INDEX idx_items_search_found ON items(type, item_name, location, found_by) WHERE type = 'FOUND';
```
**Creates:** Conditional composite index  
**Purpose:** Optimized search for found items only  
**Covers:** Found items that match search terms  

---

## 🔢 COMMAND 17
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```
**Creates:** PostgreSQL function  
**Purpose:** Updates timestamp when record is modified  
**Called by:** Trigger (command 18)  

---

## 🔢 COMMAND 18
```sql
CREATE TRIGGER trigger_update_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```
**Creates:** Trigger  
**Purpose:** Fires function before any UPDATE  
**Result:** Automatically updates updated_at timestamp  

---

## 🔢 COMMAND 19
```sql
CREATE OR REPLACE VIEW view_lost_items_unclaimed AS
SELECT * FROM items
WHERE type = 'LOST' AND status = 'LOST'
ORDER BY date_reported DESC;
```
**Creates:** View  
**Purpose:** Shows unclaimed lost items  
**Sorted:** Most recent first  

---

## 🔢 COMMAND 20
```sql
CREATE OR REPLACE VIEW view_found_items_unclaimed AS
SELECT * FROM items
WHERE type = 'FOUND' AND status = 'NOT_CLAIMED'
ORDER BY date_found DESC;
```
**Creates:** View  
**Purpose:** Shows unclaimed found items  
**Sorted:** Most recent first  

---

## 🔢 COMMAND 21
```sql
CREATE OR REPLACE VIEW view_items_claimed AS
SELECT * FROM items
WHERE status = 'CLAIMED'
ORDER BY updated_at DESC;
```
**Creates:** View  
**Purpose:** Shows all claimed items  
**Sorted:** Most recently updated first  

---

## 🔢 COMMAND 22
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
**Creates:** View  
**Purpose:** Shows lost items matched with found items  
**Join:** Connects related lost and found items  

---

## 🔢 COMMAND 23
```sql
INSERT INTO items (type, item_name, description, location, student_name, student_number, status, date_reported, created_at, updated_at)
VALUES 
    ('LOST', 'Car Keys', 'Silver car keys with blue keychain', 'Library Building', 'Alice Johnson', 'STU001', 'LOST', NOW(), NOW(), NOW()),
    ('LOST', 'iPhone 13', 'Black iPhone 13 with cracked screen protector', 'Cafeteria', 'Bob Smith', 'STU002', 'LOST', NOW() - INTERVAL '1 day', NOW(), NOW()),
    ('LOST', 'Student ID Card', 'Red student ID with photo', 'Gym', 'Charlie Davis', 'STU003', 'LOST', NOW() - INTERVAL '2 days', NOW(), NOW());
```
**Inserts:** 3 lost items  
**Items:**
1. Car Keys - Lost at Library by Alice Johnson
2. iPhone 13 - Lost at Cafeteria by Bob Smith (1 day ago)
3. Student ID - Lost at Gym by Charlie Davis (2 days ago)

---

## 🔢 COMMAND 24
```sql
INSERT INTO items (type, item_name, description, location, found_by, status, date_found, created_at, updated_at)
VALUES 
    ('FOUND', 'Wallet', 'Brown leather wallet with multiple cards', 'Lost and Found Desk', 'Security', 'NOT_CLAIMED', NOW() - INTERVAL '3 days', NOW(), NOW()),
    ('FOUND', 'Laptop', 'Dell Inspiron 15 laptop, serial no. 123456', 'Classroom 201', 'Maintenance Staff', 'NOT_CLAIMED', NOW() - INTERVAL '2 days', NOW(), NOW()),
    ('FOUND', 'Water Bottle', 'Blue metal water bottle with stickers', 'Sports Complex', 'Cleaning Staff', 'CLAIMED', NOW() - INTERVAL '1 day', NOW(), NOW());
```
**Inserts:** 3 found items  
**Items:**
1. Wallet - Found at Lost & Found Desk (Not claimed)
2. Laptop - Found in Classroom 201 (Not claimed)
3. Water Bottle - Found at Sports Complex (Already claimed)

---

## 📊 Summary

| Category | Count |
|----------|-------|
| Total Commands | 24 |
| Database | 1 |
| Enum Types | 2 |
| Tables | 1 |
| Indexes | 12 |
| Functions | 1 |
| Triggers | 1 |
| Views | 4 |
| Insert Statements | 2 |

---

## ✅ All 24 SQL Commands Complete!

**See:** SQL_ALL_COMMANDS_CLEAN.sql for copy-paste version

