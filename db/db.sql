




DROP TABLE IF EXISTS roles
CASCADE;
CREATE TABLE roles
(
    id BIGSERIAL PRIMARY KEY,
    name VARCHAR(180) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    route VARCHAR(255) NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);


DROP TABLE IF EXISTS users
CASCADE;
Create TABLE users
(
    id BIGSERIAL PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    phone VARCHAR(80) NOT NULL UNIQUE,
    image VARCHAR(255) NULL,
    password VARCHAR(255) NOT NULL,
    is_available BOOLEAN NULL,
    session_token VARCHAR(255) NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL
);

DROP TABLE IF EXISTS user_has_roles
CASCADE;
CREATE TABLE user_has_roles
(
    id_user BIGSERIAL NOT NULL,
    id_rol BIGSERIAL NOT NULL,
    created_at TIMESTAMP(0) NOT NULL,
    updated_at TIMESTAMP(0) NOT NULL,
    FOREIGN KEY(id_user) REFERENCES users(id) ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY(id_rol) REFERENCES roles(id) ON UPDATE CASCADE ON DELETE CASCADE,
    PRIMARY KEY(id_user, id_rol)
);


INSERT INTO roles
    (
    name,
    route,
    image,
    created_at,
    updated_at
    )
VALUES(
        'CLIENTE',
        'client/home',
        'https://www.citypng.com/public/uploads/preview/hd-man-user-illustration-icon-transparent-png-701751694974843ybexneueic.png',
        '2024-10-20',
        '2024-10-20'	
);

INSERT INTO roles
    (
    name,
    route,
    image,
    created_at,
    updated_at
    )
VALUES(
        'RESTAURENTE',
        'restaurent/home',
        'https://w7.pngwing.com/pngs/530/421/png-transparent-cafe-restaurant-computer-icons-hotel-chinese-cuisine-dining-food-text-cafe.png',
        '2024-10-20',
        '2024-10-20'	
);


INSERT INTO roles
    (
    name,
    route,
    image,
    created_at,
    updated_at
    )
VALUES(
        'REPARTIDOR',
        'delivery/home',
        'https://w7.pngwing.com/pngs/332/444/png-transparent-delivery-computer-icons-restaurant-home-delivery-miscellaneous-angle-text.png',
        '2024-10-20',
        '2024-10-20'	
);