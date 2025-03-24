CREATE TABLE IF NOT EXISTS favorite (
    user_id INT NOT NULL,
    advertisement_id INT NOT NULL,
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, advertisement_id),
    FOREIGN KEY (user_id) REFERENCES user(id) ON DELETE CASCADE,
    FOREIGN KEY (advertisement_id) REFERENCES advertisement(id) ON DELETE CASCADE
);