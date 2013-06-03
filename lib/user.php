<?
class User {
  private $ip;

  public $id, $login;


  function __construct($_db) {
    $this->ip = $_SERVER["REMOTE_ADDR"];
    $this->db = $_db;
  }


  function auth($data = "") {
    if(empty($data)) {
      session_start();
      $this->id = intval($_SESSION['id']);
      session_write_close();
    } else {
      session_start();
      $this->id = $this->db->element("SELECT MAX(u.id) FROM `users` u
				      WHERE u.id = ? AND u.bd_id = ? AND u.pasw = ? ",
				    intval($data['login_db_name_list_cb']), intval($data['login_usr_name_list_cb']),
				    $this->hash_pasw($data['password']) );
      $_SESSION['id'] = $this->id;
      session_write_close();
    }
    if(intval( $this->id ) == 0) return array('success'=>false, 'msg'=> "Ошибка авторизации");
    return array('success'=>true, 'msg'=> $this->id);
  }

  public function hash_pasw($pasw, $salt = "cash") {
    return md5($salt.$pasw);
  }
}

?>