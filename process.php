<?php
$servername = "localhost";
$username = "root";
$password = "test1234";
$dbname = "vdi";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$result = array('error' => false);
$action = '';
$categoryNum;

if (isset($_GET['id'])) {
    $categoryNum = $_GET['id'];
    getDocumentsOfCategory();
} else {
    getCategories();
}

if (isset($_GET['action'])) {
    $action = $_GET['action'];
}

function getCategories()
{
    $sql = $GLOBALS['conn']->query("SELECT id, category, created_at, updated_at FROM categories");
    $categories = array();
    while ($row = $sql->fetch_assoc()) {
        array_push($categories, $row);
    }
    $GLOBALS['result']['categories'] = $categories;
}

function getDocumentsOfCategory()
{
    $sql = $GLOBALS['conn']->query("SELECT id, category_id, name, created_at, updated_at FROM documents WHERE category_id='$GLOBALS[categoryNum]'");
    $documents = array();
    while ($row = $sql->fetch_assoc()) {
        array_push($documents, $row);
    }
    $GLOBALS['result']['documents'] = $documents;
}

// switch ($action) {
//     case 'read':
//         readData();
//         break;
//     case 'create':
//         createData();
//         break;
//     case 'delete':
//         deleteData();
//         break;
//     case 'update':
//         updateData();
//         break;

//     default:
//         # code...
//         break;
// }

// function readData()
// {
//     $sql = $GLOBALS['conn']->query("SELECT id, category, created_at, updated_at FROM categories");
//     $categories = array();
//     while ($row = $sql->fetch_assoc()) {
//         array_push($categories, $row);
//     }
//     $GLOBALS['result']['categories'] = $categories;
// }

function createData()
{
    $name = $_POST['name'];
    $category = $_POST['category'];

    $sql = $GLOBALS['conn']->query("INSERT INTO documents (category_id, name) VALUES('$category', '$name')");

    if ($sql) {
        $GLOBALS['result']['message'] = "Document added Successfully!";
    } else {
        $GLOBALS['result']['error'] = "true";
        $GLOBALS['result']['message'] = "Failed to add document";
    }
}

function deleteData()
{
    $id = $_POST['id'];
    $sql = $GLOBALS['conn']->query("DELETE FROM documents WHERE id='$id'");

    if ($sql) {
        $GLOBALS['result']['message'] = "Document deleted Successfully!";
    } else {
        $GLOBALS['result']['error'] = "true";
        $GLOBALS['result']['message'] = "Failed to delete document";
    }

}

function updateData()
{
    $id = $_POST['id'];
    $name = $_POST['name'];
    $category = $_POST['category'];

    $sql = $GLOBALS['conn']->query("UPDATE documents SET name='$name', category='$category' WHERE id='$id'");

    if ($sql) {
        $GLOBALS['result']['message'] = "Document updated Successfully!";
    } else {
        $GLOBALS['result']['error'] = "true";
        $GLOBALS['result']['message'] = "Failed to update document";
    }
}

$conn->close();
echo json_encode($GLOBALS['result']);