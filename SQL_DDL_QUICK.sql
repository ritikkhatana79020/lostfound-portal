-- =====================================================
-- Lost & Found Portal - Essential DDL Queries
-- Quick Reference
-- =====================================================

-- 1. CREATE DATABASE
CREATE DATABASE lostfound;

-- 2. CREATE ENUM TYPES (PostgreSQL)
CREATE TYPE item_type AS ENUM ('LOST', 'FOUND');
CREATE TYPE item_status AS ENUM ('LOST', 'FOUND', 'CLAIMED', 'NOT_CLAIMED');

-- 3. CREATE ITEMS TABLE
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

-- 4. CREATE INDEXES
CREATE INDEX idx_items_type ON items(type);
CREATE INDEX idx_items_status ON items(status);
CREATE INDEX idx_items_type_status ON items(type, status);
CREATE INDEX idx_items_item_name ON items(item_name);
CREATE INDEX idx_items_location ON items(location);
CREATE INDEX idx_items_student_name ON items(student_name);
CREATE INDEX idx_items_date_reported ON items(date_reported DESC);
CREATE INDEX idx_items_created_at ON items(created_at DESC);

-- 5. CREATE TRIGGER FOR AUTO-UPDATE TIMESTAMP
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- 6. INSERT SAMPLE DATA (Optional)
INSERT INTO items (type, item_name, description, location, student_name, student_number, status, date_reported, created_at, updated_at)
VALUES
    ('LOST', 'Car Keys', 'Silver car keys with blue keychain', 'Library Building', 'Alice Johnson', 'STU001', 'LOST', NOW(), NOW(), NOW()),
    ('LOST', 'iPhone 13', 'Black iPhone 13 with cracked screen protector', 'Cafeteria', 'Bob Smith', 'STU002', 'LOST', NOW() - INTERVAL '1 day', NOW(), NOW()),
    ('LOST', 'Student ID Card', 'Red student ID with photo', 'Gym', 'Charlie Davis', 'STU003', 'LOST', NOW() - INTERVAL '2 days', NOW(), NOW()),
    ('FOUND', 'Wallet', 'Brown leather wallet with multiple cards', 'Lost and Found Desk', 'Security', 'NOT_CLAIMED', NOW() - INTERVAL '3 days', NOW(), NOW()),
    ('FOUND', 'Laptop', 'Dell Inspiron 15 laptop, serial no. 123456', 'Classroom 201', 'Maintenance Staff', 'NOT_CLAIMED', NOW() - INTERVAL '2 days', NOW(), NOW()),
    ('FOUND', 'Water Bottle', 'Blue metal water bottle with stickers', 'Sports Complex', 'Cleaning Staff', 'CLAIMED', NOW() - INTERVAL '1 day', NOW(), NOW());

