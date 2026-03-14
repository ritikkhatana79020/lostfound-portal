-- =====================================================
-- Lost & Found Portal - Complete DDL Script
-- Database: lostfound
-- Created: March 14, 2026
-- =====================================================

-- =====================================================
-- 1. CREATE DATABASE
-- =====================================================

CREATE DATABASE IF NOT EXISTS lostfound;

-- Switch to the database (in PostgreSQL)
-- psql -U postgres -d lostfound

-- =====================================================
-- 2. CREATE ENUM TYPES (PostgreSQL specific)
-- =====================================================

-- Item Type Enum: LOST or FOUND
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_type') THEN
        CREATE TYPE item_type AS ENUM ('LOST', 'FOUND');
    END IF;
END$$;

-- Item Status Enum: LOST, FOUND, CLAIMED, NOT_CLAIMED
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'item_status') THEN
        CREATE TYPE item_status AS ENUM ('LOST', 'FOUND', 'CLAIMED', 'NOT_CLAIMED');
    END IF;
END$$;

-- =====================================================
-- 3. CREATE MAIN TABLE: items
-- =====================================================

CREATE TABLE IF NOT EXISTS items (
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

    -- Foreign Key Constraint (for matched items)
    CONSTRAINT fk_matched_item FOREIGN KEY (matched_with) REFERENCES items(id) ON DELETE SET NULL
);

-- =====================================================
-- 4. CREATE INDEXES FOR PERFORMANCE
-- =====================================================

-- Index on item type (frequently filtered)
CREATE INDEX IF NOT EXISTS idx_items_type ON items(type);

-- Index on status (used in filtering)
CREATE INDEX IF NOT EXISTS idx_items_status ON items(status);

-- Index on combined type and status (common query pattern)
CREATE INDEX IF NOT EXISTS idx_items_type_status ON items(type, status);

-- Index on item name (for search)
CREATE INDEX IF NOT EXISTS idx_items_item_name ON items(item_name);

-- Index on location (for search and filtering)
CREATE INDEX IF NOT EXISTS idx_items_location ON items(location);

-- Index on student name (for search)
CREATE INDEX IF NOT EXISTS idx_items_student_name ON items(student_name);

-- Index on student number (for search)
CREATE INDEX IF NOT EXISTS idx_items_student_number ON items(student_number);

-- Index on found_by (for search)
CREATE INDEX IF NOT EXISTS idx_items_found_by ON items(found_by);

-- Index on date_reported (for sorting)
CREATE INDEX IF NOT EXISTS idx_items_date_reported ON items(date_reported DESC);

-- Index on matched_with (for tracking matched items)
CREATE INDEX IF NOT EXISTS idx_items_matched_with ON items(matched_with);

-- Index on created_at (for sorting)
CREATE INDEX IF NOT EXISTS idx_items_created_at ON items(created_at DESC);

-- Composite index for common search pattern
CREATE INDEX IF NOT EXISTS idx_items_search_lost ON items(type, item_name, location, student_name)
WHERE type = 'LOST';

-- Composite index for found items
CREATE INDEX IF NOT EXISTS idx_items_search_found ON items(type, item_name, location, found_by)
WHERE type = 'FOUND';

-- =====================================================
-- 5. CREATE VIEWS (Optional but useful)
-- =====================================================

-- View: All Lost Items (not claimed)
CREATE OR REPLACE VIEW view_lost_items_unclaimed AS
SELECT * FROM items
WHERE type = 'LOST' AND status = 'LOST'
ORDER BY date_reported DESC;

-- View: All Found Items (not claimed)
CREATE OR REPLACE VIEW view_found_items_unclaimed AS
SELECT * FROM items
WHERE type = 'FOUND' AND status = 'NOT_CLAIMED'
ORDER BY date_found DESC;

-- View: Claimed Items
CREATE OR REPLACE VIEW view_items_claimed AS
SELECT * FROM items
WHERE status = 'CLAIMED'
ORDER BY updated_at DESC;

-- View: Matched Items (lost with found)
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
-- 6. CREATE SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Uncomment below to insert sample data

/*
-- Sample Lost Items
INSERT INTO items (type, item_name, description, location, student_name, student_number, status, date_reported, created_at, updated_at)
VALUES
    ('LOST', 'Car Keys', 'Silver car keys with blue keychain', 'Library Building', 'Alice Johnson', 'STU001', 'LOST', NOW(), NOW(), NOW()),
    ('LOST', 'iPhone 13', 'Black iPhone 13 with cracked screen protector', 'Cafeteria', 'Bob Smith', 'STU002', 'LOST', NOW() - INTERVAL '1 day', NOW(), NOW()),
    ('LOST', 'Student ID Card', 'Red student ID with photo', 'Gym', 'Charlie Davis', 'STU003', 'LOST', NOW() - INTERVAL '2 days', NOW(), NOW());

-- Sample Found Items
INSERT INTO items (type, item_name, description, location, found_by, status, date_found, created_at, updated_at)
VALUES
    ('FOUND', 'Wallet', 'Brown leather wallet with multiple cards', 'Lost and Found Desk', 'Security', 'NOT_CLAIMED', NOW() - INTERVAL '3 days', NOW(), NOW()),
    ('FOUND', 'Laptop', 'Dell Inspiron 15 laptop, serial no. 123456', 'Classroom 201', 'Maintenance Staff', 'NOT_CLAIMED', NOW() - INTERVAL '2 days', NOW(), NOW()),
    ('FOUND', 'Water Bottle', 'Blue metal water bottle with stickers', 'Sports Complex', 'Cleaning Staff', 'CLAIMED', NOW() - INTERVAL '1 day', NOW(), NOW());

-- Sample Matched Items (uncomment after creating items)
-- UPDATE items SET matched_with = 2 WHERE id = 1;
-- UPDATE items SET matched_with = 1 WHERE id = 2;
*/

-- =====================================================
-- 7. AUDIT AND MAINTENANCE PROCEDURES
-- =====================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to automatically update updated_at
DROP TRIGGER IF EXISTS trigger_update_items_updated_at ON items;
CREATE TRIGGER trigger_update_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- 8. USEFUL QUERIES FOR REFERENCE
-- =====================================================

-- Get Statistics
-- SELECT
--     COUNT(*) as total_items,
--     SUM(CASE WHEN type = 'LOST' THEN 1 ELSE 0 END) as lost_items,
--     SUM(CASE WHEN type = 'FOUND' THEN 1 ELSE 0 END) as found_items,
--     SUM(CASE WHEN status = 'CLAIMED' THEN 1 ELSE 0 END) as claimed_items
-- FROM items;

-- Find Recently Added Items
-- SELECT id, item_name, type, status, created_at
-- FROM items
-- ORDER BY created_at DESC
-- LIMIT 10;

-- Search Items by Keyword
-- SELECT * FROM items
-- WHERE item_name ILIKE '%phone%'
--    OR description ILIKE '%phone%'
--    OR location ILIKE '%phone%'
-- ORDER BY created_at DESC;

-- Find Unmatched Lost Items
-- SELECT * FROM items
-- WHERE type = 'LOST' AND matched_with IS NULL AND status != 'CLAIMED'
-- ORDER BY date_reported DESC;

-- Find Unmatched Found Items
-- SELECT * FROM items
-- WHERE type = 'FOUND' AND matched_with IS NULL AND status = 'NOT_CLAIMED'
-- ORDER BY date_found DESC;

-- =====================================================
-- 9. BACKUP AND RESTORE COMMANDS
-- =====================================================

-- Backup the database:
-- pg_dump -U postgres -d lostfound > backup_lostfound.sql

-- Backup with compression:
-- pg_dump -U postgres -d lostfound | gzip > backup_lostfound.sql.gz

-- Restore from backup:
-- psql -U postgres -d lostfound < backup_lostfound.sql

-- Restore from compressed backup:
-- gunzip -c backup_lostfound.sql.gz | psql -U postgres -d lostfound

-- =====================================================
-- 10. SCHEMA INFORMATION QUERIES
-- =====================================================

-- View all tables
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';

-- View all columns in items table
-- SELECT column_name, data_type, is_nullable FROM information_schema.columns WHERE table_name = 'items';

-- View all indexes
-- SELECT indexname FROM pg_indexes WHERE tablename = 'items';

-- View all views
-- SELECT table_name FROM information_schema.views WHERE table_schema = 'public';

-- =====================================================
-- END OF DDL SCRIPT
-- =====================================================

