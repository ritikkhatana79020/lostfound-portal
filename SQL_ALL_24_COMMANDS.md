# 🎯 SQL Commands - Quick Reference Card

## 24 SQL Commands for Lost & Found Portal - All Listed Below

---

### **COMMAND 1: DATABASE**
```sql
CREATE DATABASE lostfound;
```

---

### **COMMAND 2: ENUM TYPE 1**
```sql
CREATE TYPE item_type AS ENUM ('LOST', 'FOUND');
```

---

### **COMMAND 3: ENUM TYPE 2**
```sql
CREATE TYPE item_status AS ENUM ('LOST', 'FOUND', 'CLAIMED', 'NOT_CLAIMED');
```

---

### **COMMAND 4: TABLE**
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

### **COMMAND 5: INDEX - Type**
```sql
CREATE INDEX idx_items_type ON items(type);
```

---

### **COMMAND 6: INDEX - Status**
```sql
CREATE INDEX idx_items_status ON items(status);
```

---

### **COMMAND 7: INDEX - Type + Status**
```sql
CREATE INDEX idx_items_type_status ON items(type, status);
```

---

### **COMMAND 8: INDEX - Item Name**
```sql
CREATE INDEX idx_items_item_name ON items(item_name);
```

---

### **COMMAND 9: INDEX - Location**
```sql
CREATE INDEX idx_items_location ON items(location);
```

---

### **COMMAND 10: INDEX - Student Name**
```sql
CREATE INDEX idx_items_student_name ON items(student_name);
```

---

### **COMMAND 11: INDEX - Student Number**
```sql
CREATE INDEX idx_items_student_number ON items(student_number);
```

---

### **COMMAND 12: INDEX - Found By**
```sql
CREATE INDEX idx_items_found_by ON items(found_by);
```

---

### **COMMAND 13: INDEX - Date Reported DESC**
```sql
CREATE INDEX idx_items_date_reported ON items(date_reported DESC);
```

---

### **COMMAND 14: INDEX - Created At DESC**
```sql
CREATE INDEX idx_items_created_at ON items(created_at DESC);
```

---

### **COMMAND 15: INDEX - Lost Items Search**
```sql
CREATE INDEX idx_items_search_lost ON items(type, item_name, location, student_name) WHERE type = 'LOST';
```

---

### **COMMAND 16: INDEX - Found Items Search**
```sql
CREATE INDEX idx_items_search_found ON items(type, item_name, location, found_by) WHERE type = 'FOUND';
```

---

### **COMMAND 17: FUNCTION - Auto Update**
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;
```

---

### **COMMAND 18: TRIGGER - Auto Update Timestamp**
```sql
CREATE TRIGGER trigger_update_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
```

---

### **COMMAND 19: VIEW - Lost Items Unclaimed**
```sql
CREATE OR REPLACE VIEW view_lost_items_unclaimed AS
SELECT * FROM items
WHERE type = 'LOST' AND status = 'LOST'
ORDER BY date_reported DESC;
```

---

### **COMMAND 20: VIEW - Found Items Unclaimed**
```sql
CREATE OR REPLACE VIEW view_found_items_unclaimed AS
SELECT * FROM items
WHERE type = 'FOUND' AND status = 'NOT_CLAIMED'
ORDER BY date_found DESC;
```

---

### **COMMAND 21: VIEW - Claimed Items**
```sql
CREATE OR REPLACE VIEW view_items_claimed AS
SELECT * FROM items
WHERE status = 'CLAIMED'
ORDER BY updated_at DESC;
```

---

### **COMMAND 22: VIEW - Matched Items**
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

### **COMMAND 23: INSERT - Lost Items**
```sql
INSERT INTO items (type, item_name, description, location, student_name, student_number, status, date_reported, created_at, updated_at)
VALUES 
    ('LOST', 'Car Keys', 'Silver car keys with blue keychain', 'Library Building', 'Alice Johnson', 'STU001', 'LOST', NOW(), NOW(), NOW()),
    ('LOST', 'iPhone 13', 'Black iPhone 13 with cracked screen protector', 'Cafeteria', 'Bob Smith', 'STU002', 'LOST', NOW() - INTERVAL '1 day', NOW(), NOW()),
    ('LOST', 'Student ID Card', 'Red student ID with photo', 'Gym', 'Charlie Davis', 'STU003', 'LOST', NOW() - INTERVAL '2 days', NOW(), NOW());
```

---

### **COMMAND 24: INSERT - Found Items**
```sql
INSERT INTO items (type, item_name, description, location, found_by, status, date_found, created_at, updated_at)
VALUES 
    ('FOUND', 'Wallet', 'Brown leather wallet with multiple cards', 'Lost and Found Desk', 'Security', 'NOT_CLAIMED', NOW() - INTERVAL '3 days', NOW(), NOW()),
    ('FOUND', 'Laptop', 'Dell Inspiron 15 laptop, serial no. 123456', 'Classroom 201', 'Maintenance Staff', 'NOT_CLAIMED', NOW() - INTERVAL '2 days', NOW(), NOW()),
    ('FOUND', 'Water Bottle', 'Blue metal water bottle with stickers', 'Sports Complex', 'Cleaning Staff', 'CLAIMED', NOW() - INTERVAL '1 day', NOW(), NOW());
```

---

## 📊 Summary

✅ **Total Commands:** 24  
✅ **Database:** 1  
✅ **Enums:** 2  
✅ **Tables:** 1  
✅ **Indexes:** 12  
✅ **Functions:** 1  
✅ **Triggers:** 1  
✅ **Views:** 4  
✅ **Inserts:** 2  

**Execution Time:** ~2 minutes  
**Result:** Full database setup ✅

---

## 🚀 Copy All Commands

Save above as `commands.sql` and run:

```bash
psql -U postgres -f commands.sql
```

Or copy-paste all into DBeaver and execute with **Ctrl + Enter**

---

**All 24 SQL Commands Listed Above! ⬆️**

