<?php
/**
 * db_setup.php
 * Eseguire UNA SOLA VOLTA visitando NOMESito.com/admin/db_setup.php
 * Poi CANCELLA dal server per sicurezza.
 */
require_once __DIR__ . '/../db_config.php';

$pdo = db_connect();
$pdo->exec("
    CREATE TABLE IF NOT EXISTS artworks (
        id          INT AUTO_INCREMENT PRIMARY KEY,
        title       VARCHAR(255)  NOT NULL,
        notes       TEXT,
        image_path  VARCHAR(255)  NOT NULL,
        sort_order  INT           DEFAULT 0,
        created_at  TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;
");
echo 'Tabella creata correttamente. Ora cancella questo file dal server.';