<?php
 header("Content-Security-Policy: script-src 'self'");
  
$post = file_get_contents("php://input");
$data = json_decode($post, true);
if(!empty($post)){
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
			
                                                
			display: flex;
            justify-content: center;
            align-items: center;
            
			top: 60%;
            
        }
		img {
      position: absolute;
      top: 0;
      left: 50%;
      transform: translateX(-50%);
	  width: 30%;
    }
		th{
			font-size: 90px;
			
		}
		th, td {
		font-family: 'Commodore 64 Pixelized', sans-serif;
		padding: 8px;
       
		
		}
		td{
			font-size: 40px;
			
		}
		.table {
			margin-top: 20px;
			display: table;
			width: 300px;
			position: absolute;
  			bottom: 0;
  			width: 10%;
			height: 200px;
			top: 40%;
      		left: 50%;
      		transform: translate(-40%, -50%);
			border-collapse: collapse;
		}
		.table-row {
   			display: table-row;
		}
		.table-cell {
   			display: table-cell;
		}

		
		
    </style>

</head>

<body>
<img src="JEK_2023_kampagne_game_highscore_002.png" alt="HTML-Seminar">
 <link rel="stylesheet" href="path/to/font.css"><div class="table">
	<table style=“text-align: center“>
	
   
   
  <div class="table-row">
		<tr>
		<th class="table-cell thead"></th></div>
		<th class="table-cell thead"></th>
		</tr>
		</div>
		<?php foreach ($data_arr as $value) {
		?>
			<tr>
			<td class="table-cell"><?php echo json_decode($value, true)["name"]; ?></td>
			<td class="table-cell"><?php echo json_decode($value, true)["score"]; ?></td>
			</tr>
		<?php
		} ?>
		<tr>
		</tr>
	</table> 
	</div>
	
	
</body>

</html>