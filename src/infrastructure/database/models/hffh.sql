

CREATE TABLE flights (
    -- id VARCHAR(20) PRIMARY KEY,
    is_approved BIT DEFAULT 0,
    -- clientid VARCHAR(20) NOT NULL,
    -- booking_number VARCHAR(20) NOT NULL,
    -- booking_date VARCHAR(10) NOT NULL,
    category VARCHAR(50) NOT NULL,
    hotel_id INTEGER REFERENCES hotels(id),
    flight_type VARCHAR(50) NOT NULL,
    flight_degree VARCHAR(50) NOT NULL,
    seat VARCHAR(100),
    check_in VARCHAR(10),
    check_out VARCHAR(10),
 
    guests VARCHAR(100),
    rooms INTEGER,
    room_type VARCHAR(100),
    -- from_location VARCHAR(100),
    -- to_location VARCHAR(100),
    trip_time VARCHAR(50),
    luggage_per_person VARCHAR(100),
    meals_available VARCHAR(100),
    flight_duration VARCHAR(50),
    flight_number VARCHAR(50),
    -- number_of_parking_stations VARCHAR(10),
    portal VARCHAR(10),
    plane_type VARCHAR(100),
    seating_layout VARCHAR(10),
    distance_between_seats VARCHAR(50),
    entertainment_on_plane VARCHAR(100),
    ports_and_connections VARCHAR(100),
    FOREIGN KEY (clientid) REFERENCES customers(clientid)
);





-- Payment breakdown - base cost
CREATE TABLE payment_base_costs (
    payment_id VARCHAR(20) PRIMARY KEY,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(20) NOT NULL,
    details VARCHAR(100),
    FOREIGN KEY (payment_id) REFERENCES payments(reservation_id)
);



-- Add-ons table
CREATE TABLE add_ons (
    id SERIAL PRIMARY KEY,
    payment_id VARCHAR(20) NOT NULL,
    name VARCHAR(100) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(20) NOT NULL,
    FOREIGN KEY (payment_id) REFERENCES payments(reservation_id)
);

-- Additional services table
CREATE TABLE additional_services (
    id SERIAL PRIMARY KEY,
    reservation_id VARCHAR(20) NOT NULL,
    service_type VARCHAR(50) NOT NULL,
    name VARCHAR(100),
    seats VARCHAR(100),
    type VARCHAR(50),
    passengers INTEGER,
    package VARCHAR(100),
    extra_baggage VARCHAR(100),
    FOREIGN KEY (reservation_id) REFERENCES reservations(id)
);

-- Included meals table (for additional services)
CREATE TABLE included_meals (
    id SERIAL PRIMARY KEY,
    service_id INTEGER NOT NULL,
    meal VARCHAR(50) NOT NULL,
    FOREIGN KEY (service_id) REFERENCES additional_services(id)
);

