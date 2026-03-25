<?php
/**
 * admin/upload.php
 * Riceve immagine + dati dall'admin e li salva su disco e MySQL.
 */
require_once __DIR__ . '/../db_config.php';

header('Content-Type: application/json');

// Controlla password admin (stessa dell'HTML)
define('ADMIN_PASSWORD', 'hermes2024'); // ← CAMBIA QUESTA

$headers = getallheaders();
$auth    = $headers['X-Admin-Password'] ?? '';
if ($auth !== ADMIN_PASSWORD) {
    http_response_code(401);
    echo json_encode(['error' => 'Non autorizzato']);
    exit;
}

$action = $_POST['action'] ?? $_GET['action'] ?? '';

// ── CARICA NUOVA OPERA ──
if ($action === 'upload') {
    $title = trim($_POST['title'] ?? '');
    $notes = trim($_POST['notes'] ?? '');

    if (!$title) {
        http_response_code(400);
        echo json_encode(['error' => 'Titolo obbligatorio']);
        exit;
    }

    if (empty($_FILES['image'])) {
        http_response_code(400);
        echo json_encode(['error' => 'Immagine obbligatoria']);
        exit;
    }

    $file     = $_FILES['image'];
    $allowed  = ['image/jpeg','image/png','image/gif','image/webp'];
    $maxBytes = 10 * 1024 * 1024; // 10 MB

    if (!in_array($file['type'], $allowed)) {
        http_response_code(400);
        echo json_encode(['error' => 'Formato non supportato']);
        exit;
    }
    if ($file['size'] > $maxBytes) {
        http_response_code(400);
        echo json_encode(['error' => 'Immagine troppo grande (max 10MB)']);
        exit;
    }

    $ext      = pathinfo($file['name'], PATHINFO_EXTENSION);
    $filename = uniqid('art_', true) . '.' . strtolower($ext);
    $dest     = UPLOADS_DIR . $filename;

    if (!move_uploaded_file($file['tmp_name'], $dest)) {
        http_response_code(500);
        echo json_encode(['error' => 'Errore nel salvataggio del file']);
        exit;
    }

    $pdo  = db_connect();
    $stmt = $pdo->prepare(
        'INSERT INTO artworks (title, notes, image_path, sort_order)
         VALUES (:title, :notes, :image_path,
                 (SELECT COALESCE(MAX(sort_order),0)+1 FROM artworks a2))'
    );
    $stmt->execute([
        ':title'      => $title,
        ':notes'      => $notes ?: null,
        ':image_path' => UPLOADS_URL . $filename,
    ]);

    echo json_encode(['ok' => true, 'id' => $pdo->lastInsertId()]);
}

// ── MODIFICA TITOLO / NOTE ──
elseif ($action === 'edit') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id    = (int)($data['id']    ?? 0);
    $title = trim($data['title']  ?? '');
    $notes = trim($data['notes']  ?? '');

    if (!$id || !$title) {
        http_response_code(400);
        echo json_encode(['error' => 'Dati mancanti']);
        exit;
    }

    $pdo  = db_connect();
    $stmt = $pdo->prepare(
        'UPDATE artworks SET title=:title, notes=:notes WHERE id=:id'
    );
    $stmt->execute([':title'=>$title, ':notes'=>$notes?:null, ':id'=>$id]);
    echo json_encode(['ok' => true]);
}

// ── ELIMINA OPERA ──
elseif ($action === 'delete') {
    $data = json_decode(file_get_contents('php://input'), true);
    $id   = (int)($data['id'] ?? 0);

    if (!$id) {
        http_response_code(400);
        echo json_encode(['error' => 'ID mancante']);
        exit;
    }

    $pdo  = db_connect();
    $stmt = $pdo->prepare('SELECT image_path FROM artworks WHERE id=:id');
    $stmt->execute([':id' => $id]);
    $row  = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        // Cancella file fisico
        $file = __DIR__ . '/../' . ltrim($row['image_path'], '/');
        if (file_exists($file)) unlink($file);

        $pdo->prepare('DELETE FROM artworks WHERE id=:id')->execute([':id'=>$id]);
    }
    echo json_encode(['ok' => true]);
}

// ── RIORDINA ──
elseif ($action === 'reorder') {
    $data  = json_decode(file_get_contents('php://input'), true);
    $order = $data['order'] ?? []; // array di id in ordine nuovo

    $pdo  = db_connect();
    $stmt = $pdo->prepare('UPDATE artworks SET sort_order=:o WHERE id=:id');
    foreach ($order as $pos => $id) {
        $stmt->execute([':o' => $pos, ':id' => (int)$id]);
    }
    echo json_encode(['ok' => true]);
}

else {
    http_response_code(400);
    echo json_encode(['error' => 'Azione non riconosciuta']);
}