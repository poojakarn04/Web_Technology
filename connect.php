<?php
// database connection code
if(isset($_POST['name'])) {
    // $con = mysqli_connect('localhost', 'database_user', 'database_password','database');
    $con = mysqli_connect('localhost', 'root', '', 'webproj');

    // get the post records
    $name = $_POST['name'];
    $gender = $_POST['gender'];
    $email = $_POST['email'];
    $course = $_POST['course'];
    $soln = $_POST['soln'];

    // database insert SQL code
    $sql = "INSERT INTO webproj.form(Name, Gender, Email, Course, Solution) VALUES ('$name', '$gender', '$email', '$course', '$soln')";

    // insert in database
    $rs = mysqli_query($con, $sql);
    if($rs) {
        // Redirect based on the value of $soln
        switch($soln) {
            case 'FCFS':
                header("Location: fcfs_cal.html");
                exit();
            case 'SJF':
                header("Location: sjf_calc.html");
                exit();
            case 'SRTF':
                header("Location: srtf_calc.html");
                exit();
            default:
                echo "Invalid solution type.";
                exit();
        }
    }
} else {
    echo "Are you a genuine visitor?";
}
?>
