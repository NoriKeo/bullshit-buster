<?php

$name_exists = isset($_POST['name']);
$score_exists = isset($_POST['score']);

if ($score_exists == true && $name_exists == true)
    echo 'Die Score für ' . $_POST['name'] . ' ist ' . $_POST['score'];
else
    echo 'Keine Score oder Name angegeben!';
