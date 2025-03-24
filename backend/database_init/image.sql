CREATE TABLE IF NOT EXISTS image (
    id INT AUTO_INCREMENT PRIMARY KEY,
    advertisement_id INT NOT NULL,
    image_url VARCHAR(255) NOT NULL,
    FOREIGN KEY (advertisement_id) REFERENCES advertisement(id) ON DELETE CASCADE
);