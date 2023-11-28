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


if(empty($data['name'])) {
	die("name darf nicht leer sein");
  }
if(strlen($data['name']) > 8) {
	die("der name ist zu lang");
  }
if (0 > ($data['score']) ||($data['score']) > 500) {
    $error = 'mehr als 500 schafst du nicht';
}


// sort array by score
usort($data_arr, function ($a, $b) {
	return json_decode($b, true)["score"] - json_decode($a, true)["score"];
});


?>

<!DOCTYPE html>
<html lang="en">

<head>
	<meta charset="UTF-8" />
	<meta name="viewport" content="width=device-width, initial-scale=1.0" />
	<meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';" />


	<title>Highscores</title>
</head>

<body>

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