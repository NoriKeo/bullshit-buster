<?php
header("Content-Security-Policy: script-src 'self'");

$post = file_get_contents("php://input");
$data = json_decode($post, true);
if (!empty($post)) {
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

	if ($data['score'] < 0 || $data['score'] > 1000) {
		die("You can't score more than 1000.\n");
	}

	if (isset($data['name']) && isset($data['score'])) {
		file_put_contents("scoreDatabase.txt", $post . "\n", FILE_APPEND);
	}
}



// get data from post request

// read data from file into array
$data_arr = file("scoreDatabase.txt");




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
	<!-- <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';" />

 -->
	<title>Highscores</title>
	<style>
		@import url('https://fonts.cdnfonts.com/css/commodore-64-pixelized');

		body {
			background-color: #483AAA;
			color: white;
		}


		th {
			font-size: 90px;

		}

		table {
			border-collapse: collapse;
		}

		th,
		td {
			font-family: 'Commodore 64 Pixelized', sans-serif;
			padding: 8px;
			text-align: center;



			border-style: ;



		}

		td {
			font-size: 40px;
			/* border without gap */
			border-collapse: collapse;
			width: 20rem;


		}

		.table {
			display: flex;
			justify-content: start;
			align-items: center;
			flex-direction: column;
			/* border without gap */





			margin-top: 20px;

		}

		.table>img {
			width: 60rem;
			height: auto;
			margin-bottom: 20px;
		}
	</style>

</head>

<body>
	<link rel="stylesheet" href="path/to/font.css">
	<div class="table">
		<img src="JEK_2023_kampagne_game_highscore_002.png" alt="HTML-Seminar">
		<table style=“text-align: center“>
			<?php foreach ($data_arr as $value) { ?>
				<tr>
					<td>
						<?php echo htmlspecialchars(json_decode($value, true)["name"]); ?>
					</td>
	</div>

	<td><?php echo htmlspecialchars(json_decode($value, true)["score"]); ?></td>
	</div>
	</tr>
<?php
			} ?>
<tr>
</tr>
</table>
</div>


</body>

</html>