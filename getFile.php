<?php
// Match file in directory 
$file_path = 'pokemon_data.xlsx';
if (file_exists($file_path)) {
    header('Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    header('Content-Disposition: attachment; filename="pokemon_data.xlsx"');
    // Read from file
    readfile($file_path);
    exit;
} else {
    // No file error 
    http_response_code(404);
    echo "File not found.";
}
?>
