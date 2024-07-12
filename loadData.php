<?php
// Database 
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'pokemon_data');
define('DB_HOST', 'localhost');

// Connect to the database
$conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD, DB_NAME);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Fetch Pokémon data
$sql = "SELECT * FROM pokemonData";
$result = $conn->query($sql);

$pokemons = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $pokemons[] = $row;
    }
}

$conn->close();

// Return data 
header('Content-Type: application/json');
echo json_encode($pokemons);
?>
