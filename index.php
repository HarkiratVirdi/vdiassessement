<?php

//connect To Database
$servername = "localhost";
$username = "root";
$password = "test1234";
$dbname = "vdi";

$conn = new mysqli($servername, $username, $password, $dbname);

if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

//variables to store response or errors
$result = array('error' => false);
$action = '';
$categoryNum;

//if id is available then run functions
if (isset($_GET['id'])) {
    $categoryNum = $_GET['id'];
    getDocumentsOfCategory();
} else {
    getCategories();
}

//if action is available then run functions
if (isset($_GET['action'])) {
    $action = $_GET['action'];
    crudFunction();
}

//get all categories for the Dropdown options
function getCategories()
{
    $sql = $GLOBALS['conn']->query("SELECT id, category, created_at, updated_at FROM categories");
    $categories = array();
    while ($row = $sql->fetch_assoc()) {
        array_push($categories, $row);
    }
    $GLOBALS['result']['categories'] = $categories;
}

//get all documents of single category
function getDocumentsOfCategory()
{
    $sql = $GLOBALS['conn']->query("SELECT id, category_id, name, created_at, updated_at FROM documents WHERE category_id='$GLOBALS[categoryNum]'");
    $documents = array();
    while ($row = $sql->fetch_assoc()) {
        array_push($documents, $row);
    }
    $GLOBALS['result']['documents'] = $documents;
}

//edit, update, delete a document in a category
function crudFunction()
{

    switch ($GLOBALS['action']) {
        case 'create':
            //if action === create then run this function
            createData();
            break;
        case 'delete':
            //if action === delete then run this function
            deleteData();
            break;
        case 'update':
            //if action === update then run this function
            updateData();
            break;

        default:
            break;
    }
}

//adds a new Document into a category
function createData()
{
    //get the name and category from formData
    $name = $_POST['name'];
    $category = $_POST['category'];

    //sql query
    $sql = $GLOBALS['conn']->query("INSERT INTO documents (category_id, name) VALUES('$category', '$name')");

    //if query is successful
    if ($sql) {
        $GLOBALS['result']['message'] = "Document added Successfully!";
    } else {
        $GLOBALS['result']['error'] = "true";
        $GLOBALS['result']['message'] = "Failed to add document";
    }
}

//deletes a  Document from a category

function deleteData()
{
    //get the id from formData

    $id = $_POST['id'];

    //sql query
    $sql = $GLOBALS['conn']->query("DELETE FROM documents WHERE id='$id'");

    //if successful
    if ($sql) {
        $GLOBALS['result']['message'] = "Document deleted Successfully!";
    } else {
        $GLOBALS['result']['error'] = "true";
        $GLOBALS['result']['message'] = "Failed to delete document";
    }

}

//update document

function updateData()
{
    //get id, name, category from formdata
    $id = $_POST['id'];
    $name = $_POST['name'];
    $category = $_POST['category'];

    //sql query
    $sql = $GLOBALS['conn']->query("UPDATE documents SET name='$name', category_id='$category' WHERE id='$id'");

    //if successful
    if ($sql) {
        $GLOBALS['result']['message'] = "Document updated Successfully!";
    } else {
        $GLOBALS['result']['error'] = "true";
        $GLOBALS['result']['message'] = "Failed to update document";
    }
}

//close the connection
$conn->close();

//return the response for certain route
echo json_encode($GLOBALS['result']);