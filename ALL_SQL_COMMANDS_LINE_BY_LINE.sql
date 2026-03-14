-- =====================================================
-- LOST & FOUND PORTAL - ALL SQL COMMANDS
-- Line by Line Reference
-- =====================================================

-- 1. CREATE DATABASE
CREATE DATABASE lostfound;

-- 2. CREATE ENUM: Item Type
CREATE TYPE item_type AS ENUM ('LOST', 'FOUND');

-- 3. CREATE ENUM: Item Status
CREATE TYPE item_status AS ENUM ('LOST', 'FOUND', 'CLAIMED', 'NOT_CLAIMED');

-- 4. CREATE TABLE: items
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

-- =====================================================
-- INDEXES - 12 Total
-- =====================================================

-- 5. INDEX: Type (for filtering by LOST/FOUND)
CREATE INDEX idx_items_type ON items(type);

-- 6. INDEX: Status (for filtering by status)
CREATE INDEX idx_items_status ON items(status);

-- 7. INDEX: Type + Status (composite for combined filtering)
CREATE INDEX idx_items_type_status ON items(type, status);

-- 8. INDEX: Item Name (for searching by item name)
CREATE INDEX idx_items_item_name ON items(item_name);

-- 9. INDEX: Location (for searching by location)
CREATE INDEX idx_items_location ON items(location);

-- 10. INDEX: Student Name (for searching by student name)
CREATE INDEX idx_items_student_name ON items(student_name);

-- 11. INDEX: Student Number (for searching by student ID)
CREATE INDEX idx_items_student_number ON items(student_number);

-- 12. INDEX: Found By (for searching by finder)
CREATE INDEX idx_items_found_by ON items(found_by);

-- 13. INDEX: Date Reported (for sorting by date, newest first)
CREATE INDEX idx_items_date_reported ON items(date_reported DESC);

-- 14. INDEX: Created At (for sorting by creation date)
CREATE INDEX idx_items_created_at ON items(created_at DESC);

-- 15. INDEX: Conditional - Lost Items Search
CREATE INDEX idx_items_search_lost ON items(type, item_name, location, student_name) WHERE type = 'LOST';

-- 16. INDEX: Conditional - Found Items Search
CREATE INDEX idx_items_search_found ON items(type, item_name, location, found_by) WHERE type = 'FOUND';

-- =====================================================
-- TRIGGER FUNCTION - Auto-update timestamp
-- =====================================================

-- 17. CREATE FUNCTION: Update timestamp on modification
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- 18. CREATE TRIGGER: Auto-update on record modification
CREATE TRIGGER trigger_update_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VIEWS - 4 Total
-- =====================================================

-- 19. VIEW: Unclaimed Lost Items
CREATE OR REPLACE VIEW view_lost_items_unclaimed AS
SELECT * FROM items
WHERE type = 'LOST' AND status = 'LOST'
ORDER BY date_reported DESC;

-- 20. VIEW: Unclaimed Found Items
CREATE OR REPLACE VIEW view_found_items_unclaimed AS
SELECT * FROM items
WHERE type = 'FOUND' AND status = 'NOT_CLAIMED'
ORDER BY date_found DESC;

-- 21. VIEW: Claimed Items
CREATE OR REPLACE VIEW view_items_claimed AS
SELECT * FROM items
WHERE status = 'CLAIMED'
ORDER BY updated_at DESC;

-- 22. VIEW: Matched Items (Lost with Found)
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

-- =====================================================
-- SAMPLE DATA - Insert Test Records
-- =====================================================

-- 23. INSERT: 3 Lost Items
INSERT INTO items (type, item_name, description, location, student_name, student_number, status, date_reported, created_at, updated_at)
VALUES
    ('LOST', 'Car Keys', 'Silver car keys with blue keychain', 'Library Building', 'Alice Johnson', 'STU001', 'LOST', NOW(), NOW(), NOW()),
    ('LOST', 'iPhone 13', 'Black iPhone 13 with cracked screen protector', 'Cafeteria', 'Bob Smith', 'STU002', 'LOST', NOW() - INTERVAL '1 day', NOW(), NOW()),
    ('LOST', 'Student ID Card', 'Red student ID with photo', 'Gym', 'Charlie Davis', 'STU003', 'LOST', NOW() - INTERVAL '2 days', NOW(), NOW());

-- 24. INSERT: 3 Found Items
INSERT INTO items (type, item_name, description, location, found_by, status, date_found, created_at, updated_at)
VALUES
    ('FOUND', 'Wallet', 'Brown leather wallet with multiple cards', 'Lost and Found Desk', 'Security', 'NOT_CLAIMED', NOW() - INTERVAL '3 days', NOW(), NOW()),
    ('FOUND', 'Laptop', 'Dell Inspiron 15 laptop, serial no. 123456', 'Classroom 201', 'Maintenance Staff', 'NOT_CLAIMED', NOW() - INTERVAL '2 days', NOW(), NOW()),
    ('FOUND', 'Water Bottle', 'Blue metal water bottle with stickers', 'Sports Complex', 'Cleaning Staff', 'CLAIMED', NOW() - INTERVAL '1 day', NOW(), NOW());

-- =====================================================
-- END OF ALL SQL COMMANDS (24 Total)
-- =====================================================

-- COMMAND STATISTICS:
-- Database Creation: 1
-- Enum Types: 2
-- Table Creation: 1
-- Indexes: 12
-- Functions: 1
-- Triggers: 1
-- Views: 4
-- Insert Statements: 2
-- TOTAL: 24 SQL COMMANDS

