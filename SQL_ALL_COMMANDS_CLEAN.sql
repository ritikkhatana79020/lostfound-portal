-- ALL SQL COMMANDS FOR LOST & FOUND PORTAL
-- Copy and paste directly into DBeaver or psql

-- Command 1: Create Database
CREATE DATABASE lostfound;

-- Command 2: Create Enum Type - Item Type
CREATE TYPE item_type AS ENUM ('LOST', 'FOUND');

-- Command 3: Create Enum Type - Item Status
CREATE TYPE item_status AS ENUM ('LOST', 'FOUND', 'CLAIMED', 'NOT_CLAIMED');

-- Command 4: Create Items Table
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

-- Command 5: Create Index on Type
CREATE INDEX idx_items_type ON items(type);

-- Command 6: Create Index on Status
CREATE INDEX idx_items_status ON items(status);

-- Command 7: Create Composite Index on Type and Status
CREATE INDEX idx_items_type_status ON items(type, status);

-- Command 8: Create Index on Item Name
CREATE INDEX idx_items_item_name ON items(item_name);

-- Command 9: Create Index on Location
CREATE INDEX idx_items_location ON items(location);

-- Command 10: Create Index on Student Name
CREATE INDEX idx_items_student_name ON items(student_name);

-- Command 11: Create Index on Student Number
CREATE INDEX idx_items_student_number ON items(student_number);

-- Command 12: Create Index on Found By
CREATE INDEX idx_items_found_by ON items(found_by);

-- Command 13: Create Index on Date Reported (Descending)
CREATE INDEX idx_items_date_reported ON items(date_reported DESC);

-- Command 14: Create Index on Created At (Descending)
CREATE INDEX idx_items_created_at ON items(created_at DESC);

-- Command 15: Create Conditional Index for Lost Items Search
CREATE INDEX idx_items_search_lost ON items(type, item_name, location, student_name) WHERE type = 'LOST';

-- Command 16: Create Conditional Index for Found Items Search
CREATE INDEX idx_items_search_found ON items(type, item_name, location, found_by) WHERE type = 'FOUND';

-- Command 17: Create Function for Auto-updating Timestamps
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Command 18: Create Trigger for Auto-updating Timestamps
CREATE TRIGGER trigger_update_items_updated_at
BEFORE UPDATE ON items
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();

-- Command 19: Create View - Unclaimed Lost Items
CREATE OR REPLACE VIEW view_lost_items_unclaimed AS
SELECT * FROM items
WHERE type = 'LOST' AND status = 'LOST'
ORDER BY date_reported DESC;

-- Command 20: Create View - Unclaimed Found Items
CREATE OR REPLACE VIEW view_found_items_unclaimed AS
SELECT * FROM items
WHERE type = 'FOUND' AND status = 'NOT_CLAIMED'
ORDER BY date_found DESC;

-- Command 21: Create View - Claimed Items
CREATE OR REPLACE VIEW view_items_claimed AS
SELECT * FROM items
WHERE status = 'CLAIMED'
ORDER BY updated_at DESC;

-- Command 22: Create View - Matched Items
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

-- Command 23: Insert Sample Lost Items
INSERT INTO items (type, item_name, description, location, student_name, student_number, status, date_reported, created_at, updated_at)
VALUES
    ('LOST', 'Car Keys', 'Silver car keys with blue keychain', 'Library Building', 'Alice Johnson', 'STU001', 'LOST', NOW(), NOW(), NOW()),
    ('LOST', 'iPhone 13', 'Black iPhone 13 with cracked screen protector', 'Cafeteria', 'Bob Smith', 'STU002', 'LOST', NOW() - INTERVAL '1 day', NOW(), NOW()),
    ('LOST', 'Student ID Card', 'Red student ID with photo', 'Gym', 'Charlie Davis', 'STU003', 'LOST', NOW() - INTERVAL '2 days', NOW(), NOW());

-- Command 24: Insert Sample Found Items
INSERT INTO items (type, item_name, description, location, found_by, status, date_found, created_at, updated_at)
VALUES
    ('FOUND', 'Wallet', 'Brown leather wallet with multiple cards', 'Lost and Found Desk', 'Security', 'NOT_CLAIMED', NOW() - INTERVAL '3 days', NOW(), NOW()),
    ('FOUND', 'Laptop', 'Dell Inspiron 15 laptop, serial no. 123456', 'Classroom 201', 'Maintenance Staff', 'NOT_CLAIMED', NOW() - INTERVAL '2 days', NOW(), NOW()),
    ('FOUND', 'Water Bottle', 'Blue metal water bottle with stickers', 'Sports Complex', 'Cleaning Staff', 'CLAIMED', NOW() - INTERVAL '1 day', NOW(), NOW());

