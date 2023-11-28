<?php
header("Content-Security-Policy: script-src 'self'");
$post = file_get_contents("php://input");
$data = json_decode($post, true);




// get data from post request
if (isset($data['name']) && isset($data['score'])) {
	file_put_contents("scoreDatabase.txt", $post . "\n", FILE_APPEND);
}

// read data from file into array
$data_arr = file("scoreDatabase.txt");

if (ctype_alpha($data['name'])) {
    echo ("The string consists only of letters.\n");
} else {
    die("The string does not consist only of letters.\n");
}

if (empty($data['name'])) {
    die("Name cannot be empty.\n");
}

if (strlen($data['name']) > 8) {
    die("The name is too long.\n");
}

if ($data['score'] < 0 || $data['score'] > 500) {
    die("You can't score more than 500.\n");
}


// sort array by score
usort($data_arr, function ($a, $b) {
	return json_decode($b, true)["score"] - json_decode($a, true)["score"];
});

//fabe schwarz 
// c46 schrift 
// schrift weiß
?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';" />


	<title>Highscores</title>
</head>

<body style="background-color:#000000">

	<table style=“text-align: center“>
		
		<tr>
			<th>Username</th>
			<th>Score</th>
		</tr>
		<?php foreach ($data_arr as $value) {
		?>
			<tr>
				<td><?php echo json_decode($value, true)["name"]; ?></td>
				<td><?php echo json_decode($value, true)["score"]; ?></td>
			</tr>
		<?php
		} ?>
		<tr>
		</tr>
	</table>
	
	

</body>

</html>