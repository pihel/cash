<?
class User {
  private $ip;

  public $id, $login, $fio;

  public $session_auth;

  function __construct($_db) {
    $this->getIp();
    $this->db = $_db;
  }

  function getIp() {
    $this->ip = $_SERVER["REMOTE_ADDR"];
    /*if(!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
      $this->ip = $_SERVER["HTTP_X_FORWARDED_FOR"];
    }*/
  }


  function auth() {
    //
  }

  function get() {
    //
  }

  function set(array $data) {
  }

  function l() {
    //
  }

  function add(array $data) {
    //
  }
}

?>