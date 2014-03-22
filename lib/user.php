<?
class User {
  private $ip;

  public $id, $login, $db_id;

  public $rghts;


  function __construct($_db) {
    $this->ip = $_SERVER["REMOTE_ADDR"];
    $this->db = $_db;
    $this->id = 0;
    $this->db_id = 0;
  }


  function auth($data = "") {
    if(empty($data)) {
      session_start();
      $_SESSION['last_activity'] = time();
      $this->id = intval($_SESSION['id']);
      $this->db_id = intval( $_SESSION['db'] );
      $this->login = $_SESSION['login'];
      session_write_close();
    } else {
      session_start();
      $line = $this->db->line("SELECT MAX(u.id) as uid, MAX(u.bd_id) as db_id, MAX(u.login) as login
			       FROM `users` u
			       WHERE u.bd_id = ? AND u.id = ? AND u.pasw = ? ",
			intval($data['login_db_name_list_cb']), intval($data['login_usr_name_list_cb']),
			$this->hash_pasw($data['password']) );
      $this->id = intval( $line['uid'] );
      $this->db_id = intval( $line['db_id'] );
      $this->login = $line['login'];

      $_SESSION['id'] = $this->id;
      $_SESSION['db'] = $this->db_id;
      $_SESSION['login'] = $this->login;
      $_SESSION['last_activity'] = time();
      session_write_close();

      //last auth
      $this->db->start_tran();
      $this->db->exec("UPDATE `users` SET oper_date = datetime(CURRENT_TIMESTAMP, 'localtime') WHERE bd_id = ? AND id = ? ", $this->db_id, $this->id);
      $this->db->commit();
    }
    if(intval( $this->id ) == 0) return array('success'=>false, 'msg'=> lang(175) );

    //rights
    $this->rghts = $this->getRights();

    return array('success'=>true, 'msg'=> $this->id);
  }

  public function hash_pasw($pasw, $salt = "cash") {
    return md5($salt.$pasw);
  }

  public function getRights() {
     return $this->db->line("SELECT `read`, `write`, analiz, setting, bd_id FROM `users` WHERE id = ? AND bd_id = ?", $this->id, $this->db_id);
  }

  public function canRead() {
    return intval($this->rghts['read']) == 1;
  }

  public function canWrite() {
    return intval($this->rghts['write']) == 1;
  }

  public function canAnaliz() {
    return intval($this->rghts['analiz']) == 1;
  }

  public function canSetting() {
    return intval($this->rghts['setting']) == 1;
  }
}

?>