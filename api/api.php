<?php
	require_once("rest.inc.php");
	require_once('config.php');
	
	class API extends REST {
	
		public $data = "";

		private $mysqli = NULL;

		public function __construct() {
			parent::__construct();
			$this->connect();
		}
		
		private function connect() {
			$this->mysqli = new mysqli(DB_SERVER, DB_USER, DB_PASSWORD, DB_NAME);
		}
		
		public function processApi(){
			$func = strtolower(trim(str_replace("/", "", $_REQUEST['x'])));

			if ((int)method_exists($this, $func) > 0)
				$this->$func();
			else
				$this->response('', 404);
		}
			
		private function hello() {
			echo "Hi there.";
		}

		private function test() {
			if ($this->get_request_method() != "GET") {
				$this->response('', 405); // Method not allowed
			}

			$param = (string)$this->_request['var'];
			$this->response($this->json($param), 200);
		}

		private function games() {	
			if ($this->get_request_method() != "GET") {
				$this->response('', 405); // Method not allowed
			}

			$query = "
			SELECT DISTINCT * 
			FROM games_view
			ORDER BY game_id DESC";
			$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

			if ($r->num_rows > 0) {
				$result = array();

				while ($row = $r->fetch_assoc()) {
					$result[] = $row;
				}

				$this->response($this->json($result), 200);
			}

			$this->response('', 204);
		}

		private function game() {
			if ($this->get_request_method() != "GET") {
				$this->response('', 405); // Method not allowed
			}

			$id = (int)$this->_request['id'];
				
			if ($id > 0) {	
				$query = "
				SELECT DISTINCT * 
				FROM games
				WHERE game_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);

				if ($r->num_rows > 0) {
					$result = $r->fetch_assoc();	
					$this->response($this->json($result), 200);
				}
			}

			$this->response('', 204);
		}

		private function insertGame() {
			if ($this->get_request_method() != "POST") {
				$this->response('', 405); // Method not allowed
			}

			$data = json_decode(file_get_contents("php://input"), true);
			$game = $data['game'];
			$column_names = array(
				'title', 
				'release_date', 
				'platform', 
				'genre', 
				'game_status_id', 
				'interest_level_id'
				);
			$keys = array_keys($game);
			$columns = '';
			$values = '';

			foreach ($column_names as $desired_key) {
				if (!in_array($desired_key, $keys)) {
			   		$$desired_key = '';
				} else {
					$$desired_key = $game[$desired_key];
				}

				$columns = $columns.$desired_key.',';
				$values = $values."'".$$desired_key."',";
			}

			$query = "
			INSERT INTO games 
			(".trim($columns, ',').") 
			VALUES (".trim($values, ',').")";
			
			if (!empty($data)) {
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => 'Success', 'msg' => 'Game inserted successfully.', 'data' => $data);
				$this->response($this->json($success), 200);
			} else {
				$this->response('', 204);
			}
		}

		private function updateGame() {
			if ($this->get_request_method() != "POST") {
				$this->response('', 405); // Method not allowed
			}

			$data = json_decode(file_get_contents("php://input"), true);
			$id = (int)$data['id'];
			$game = $data['game'];
			$column_names = array(
				'title', 
				'release_date', 
				'platform', 
				'genre', 
				'game_status_id', 
				'interest_level_id'
				);
			$keys = array_keys($game);
			$columns = '';
			$values = '';

			foreach ($column_names as $desired_key) {
				if (!in_array($desired_key, $keys)) {
					$$desired_key = '';
				} else {
					$$desired_key = $game[$desired_key];
				}
				$columns = $columns.$desired_key."='".$$desired_key."',";
			}

			$query = "
			UPDATE games 
			SET ".trim($columns, ',')." 
			WHERE game_id = $id";
			
			if (!empty($data)) {
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => 'Success', 'msg' => 'Game '.$id.' updated successfully.', 'data' => $data);
				$this->response($this->json($success), 200);
			} else {
				$this->response('', 204);
			}
		}

		private function deleteGame() {
			if ($this->get_request_method() != "DELETE") {
				$this->response('', 405); // Method not allowed
			}

			$id = (int)$this->_request['id'];

			if ($id > 0) {				
				$query="
				DELETE FROM games 
				WHERE game_id = $id";
				$r = $this->mysqli->query($query) or die($this->mysqli->error.__LINE__);
				$success = array('status' => 'Success', 'msg' => 'Game '.$id.' deleted successfully.');
				$this->response($this->json($success), 200);
			} else {
				$this->response('', 204);
			}
		}

		private function json($data) {
			return json_encode($data);
		}
	}
	
	// Initiate Library
	$api = new API;
	$api->processApi();
?>