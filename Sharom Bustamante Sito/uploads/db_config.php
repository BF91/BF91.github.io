<?php
/**
 * db_config.php
 * Modifica questi valori con quelli che trovi in cPanel > Database MySQL
 */
define('DB_HOST', 'localhost');
define('DB_NAME', 'il_tuo_database');   // es. tuoaccount_hermes
define('DB_USER', 'il_tuo_utente');     // es. tuoaccount_user
define('DB_PASS', 'la_tua_password');

// Cartella dove vengono salvate le immagini (percorso relativo alla root del sito)
define('UPLOADS_DIR', __DIR__ . '/../uploads/');
define('UPLOADS_URL', '/uploads/');

function db_connect() {
    $pdo = new PDO(
        'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
        DB_USER,
        DB_PASS,
        [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
    );
    return $pdo;
}