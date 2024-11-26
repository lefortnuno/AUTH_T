
DROP TABLE IF EXISTS utilisateurs;

-- Création de la table utilisateurs
CREATE TABLE utilisateurs (
    im VARCHAR(6) PRIMARY KEY,
    nom VARCHAR(50) NOT NULL, 
    num VARCHAR(15),
    email VARCHAR(75),
    pwd VARCHAR(62) NOT NULL,
    "roleU" BOOLEAN DEFAULT FALSE,
    -- 0 = USAGER, 1 = ADMIN
    "validCompte" BOOLEAN DEFAULT FALSE, 
    pic VARCHAR(50) DEFAULT NULL, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Insertion d'utilisateurs administrateurs et usagers
INSERT INTO
    utilisateurs (
        nom, 
        im, 
        num,
        email,
        pwd
    )
VALUES
    (
        'LEFORT Nomenjanahary Nuno', 
        'LEFORT', 
        '0380994042',
        'lefort@gmail.com',
        '$2b$10$8zSCozIrTJsiAVYxBTAL7OkITjn3XwNnns.0.btbkV6e4PMvz/oqu') ;
