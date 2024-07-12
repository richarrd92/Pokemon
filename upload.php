<?php
// Database configuration
define('DB_USERNAME', 'root');
define('DB_PASSWORD', '');
define('DB_NAME', 'pokemon_data');
define('DB_HOST', 'localhost');

// Connect to the database server
$conn = new mysqli(DB_HOST, DB_USERNAME, DB_PASSWORD);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// Create the database if it doesn't exist
$dbCreationQuery = "CREATE DATABASE IF NOT EXISTS " . DB_NAME;
if ($conn->query($dbCreationQuery) === FALSE) {
    die("Error creating database: " . $conn->error);
}

// Select the database
$conn->select_db(DB_NAME);

// Create the table if it doesn't exist
$tableCreationQuery = "
CREATE TABLE IF NOT EXISTS pokemonData (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255),
    type1 VARCHAR(255),
    type2 VARCHAR(255),
    total INT,
    hp INT,
    attack INT,
    defense INT,
    sp_atk INT,
    sp_def INT,
    speed INT,
    generation INT,
    legendary INT
)";
if ($conn->query($tableCreationQuery) === FALSE) {
    die("Error creating table: " . $conn->error);
}

// Create a table to track data insertion
$flagTableCreationQuery = "
CREATE TABLE IF NOT EXISTS dataInsertionFlag (
    id INT AUTO_INCREMENT PRIMARY KEY,
    inserted BOOLEAN NOT NULL DEFAULT FALSE
)";

if ($conn->query($flagTableCreationQuery) === FALSE) {
    die("Error creating flag table: " . $conn->error);
}

// Check if the data has already been inserted
$checkFlagQuery = "SELECT inserted FROM dataInsertionFlag WHERE id = 1";
$result = $conn->query($checkFlagQuery);

if ($result->num_rows > 0) {
    $row = $result->fetch_assoc();
    if ($row['inserted']) {
        die("Data has already been inserted.");
    }
} else {
    // Insert the initial flag if it doesn't exist
    $conn->query("INSERT INTO dataInsertionFlag (inserted) VALUES (FALSE)");
}

// Get the JSON data
$jsonData = json_decode($_POST['data'], true);

// Prepare an SQL statement for inserting data
$stmt = $conn->prepare("
INSERT INTO pokemonData (name, type1, type2, total, hp, attack, defense, sp_atk, sp_def, speed, generation, legendary) 
VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
");

// Bind parameters
$stmt->bind_param(
    'sssiiiiiiiii',
    $name, $type1, $type2, $total, $hp, $attack, $defense, $sp_atk, $sp_def, $speed, $generation, $legendary
);

// Skip the header row
foreach ($jsonData as $rowIndex => $rowData) {
    if ($rowIndex == 0) continue;

    list($num, $name, $type1, $type2, $total, $hp, $attack, $defense, $sp_atk, $sp_def, $speed, $generation, $legendary) = $rowData;

    // Execute the prepared statement
    $stmt->execute();
}

// Update the flag after data insertion
$conn->query("UPDATE dataInsertionFlag SET inserted = TRUE WHERE id = 1");

// Close the statement and the connection
$stmt->close();
$conn->close();

echo "Data inserted in table successfully.";
?>
