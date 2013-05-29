<?
class CashSett {
  private $db;
  private $usr;

  public function __construct($_db, $_usr) {
    $this->db = $_db;
    $this->usr = $_usr;
  }

  public function getDbs() {
    $sql = "SELECT id, name FROM db";
    return $this->db->select($sql);
  }

  public function getUsrs($db_id = 0 ) {
    $sql = "SELECT id, bd_id, login, '***' as pasw, `read` as s_read, `write` as s_write, analiz as s_analiz, setting, oper_date FROM users WHERE bd_id = ?";
    return $this->db->select($sql, intval($db_id) );
  }

  public function addDB($name) {
    $this->db->start_tran();
    $this->db->exec("INSERT INTO db(name) VALUES(?)", $name);
    $id = $this->db->last_id();
    $this->db->commit();
    return $id;
  }
}
?>

