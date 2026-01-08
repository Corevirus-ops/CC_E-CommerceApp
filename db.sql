
CREATE TABLE users (
user_id int PRIMARY KEY,
user_name varchar(100) NOT NULL,
user_email varchar(100) NOT NULL
);

CREATE TABLE pass (
    pass_id int PRIMARY KEY,
    user_id int REFERENCES users (user_id)
    pass varchar(200) NOT NULL
);

CREATE TABLE products (
product_id int PRIMARY KEY,
product_name varchar(50) NOT NULL,
product_cost float NOT NULL
);

CREATE TABLE stock (
stock_id int PRIMARY KEY,
product_id int REFERENCES products (product_id),
stock_amount int NOT NULL
);

CREATE TABLE orders (
    order_id int PRIMARY KEY,
    order_date date NOT NULL,
    order_time time NOT NULL,
    product_id int REFERENCES products (product_id),
    order_amount int NOT NULL
);


