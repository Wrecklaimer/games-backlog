<?php
	require_once("rest.inc.php");
	
	class API extends REST {
	
		public $data = "";
		
		const DB_SERVER = "127.0.0.1";
		const DB_USER = "root";
		const DB_PASSWORD = "";
		const DB = "games_backlog";

		private $mysqli = NULL;

		public function __construct() {
			parent::__construct();
			$this->connect();
		}
		
		private function connect() {
			$this->mysqli = new mysqli(self::DB_SERVER, self::DB_USER, self::DB_PASSWORD, self::DB);
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
			FROM games
			ORDER BY game_id DESC
			";
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

		private function json($data) {
			return json_encode($data);
		}
	}
	
	// Initiate Library
	$api = new API;
	$api->processApi();
?>