<?php
/**
 * api/artworks.php
 * Restituisce tutte le opere in JSON — usato dalla galleria pubblica.
 */
require_once __DIR__ . '/../db_config.php';

header('Content-Type: application/json');
header('Access-Control-Allow-Origin: *');

$pdo  = db_connect();
$rows = $pdo->query(
    'SELECT id, title, notes, image_path FROM artworks ORDER BY sort_order ASC, created_at DESC'
)->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($rows);