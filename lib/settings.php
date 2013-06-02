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
    $sql = "SELECT id, bd_id, login, '***' as pasw, `read` as s_read, `write` as s_write, analiz as s_analiz, setting as s_setting, oper_date FROM users WHERE bd_id = ?";
    return $this->db->select($sql, intval($db_id) );
  }

  public function addDB($name) {
    $this->db->start_tran();
    $this->db->exec("INSERT INTO db(name) VALUES(?)", $name);
    $id = $this->db->last_id();
    $this->db->commit();
    return $id;
  }

  public function delDB($id) {
    $cnt = $this->db->element("SELECT COUNT(id) cnt from cashes WHERE bd_id = ? AND visible = 1", $id);
    if(intval($cnt) > 0) {
      return "Невозможно удалить БД. Активных записей ". $cnt;
    }
    $cnt = $this->db->element("SELECT COUNT(id) cnt from users WHERE bd_id = ?", $id);
    if(intval($cnt) > 0) {
      return "Невозможно удалить БД. Активных пользователей ". $cnt;
    }


    $this->db->start_tran();
    $this->db->exec("DELETE FROM db WHERE id = ?", $id);
    $id = $this->db->affect();
    $this->db->commit();
    return intval($id);
  }

  public function saveUsr($data) {
    if(intval($data['bd_id']) < 1) return "Укажите БД";
    if(empty($data['login'])) return "Укажите Логин";
    if(empty($data['pasw'])) return "Укажите Пароль";

    $id = intval($data['id']);

    $this->db->start_tran();
    if($id == 0) {
      //insert

      $this->db->exec("INSERT INTO `users` (id, bd_id, login, pasw, `read`, `write`, analiz, setting, oper_date)
		      VALUES( NULL, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)", intval($data['bd_id']),
		      $data['login'], $data['pasw'], intval($data['s_read'] == "true"), intval($data['s_write'] == "true"), intval($data['s_analiz'] == "true"), intval($data['s_setting'] == "true"));
      $id = $this->db->last_id();
    } else {
      //update
      if($data['pasw'] != "***") {
	$this->db->exec("UPDATE `users`
		      SET login = ?, pasw = ?, `read` = ?, `write` = ?, analiz = ?, setting = ?, oper_date = CURRENT_TIMESTAMP
		      WHERE id = ? ",
		      $data['login'], $data['pasw'], intval($data['s_read'] == "true"), intval($data['s_write'] == "true"), intval($data['s_analiz'] == "true"), intval($data['s_setting'] == "true"), $id);
      } else {
	$this->db->exec("UPDATE `users`
		      SET login = ?, `read` = ?, `write` = ?, analiz = ?, setting = ?, oper_date = CURRENT_TIMESTAMP
		      WHERE id = ? ",
		      $data['login'], intval($data['s_read'] == "true"), intval($data['s_write'] == "true"), intval($data['s_analiz'] == "true"), intval($data['s_setting'] == "true"), $id);
      }
      $id = intval( $this->db->affect() );
    }

    $this->db->commit();
    return $id;
  }

  public function delUsr($id) {
    $cnt = $this->db->element("SELECT COUNT(id) cnt from cashes WHERE uid = ? AND visible = 1", $id);
    if(intval($cnt) > 0) {
      return "Невозможно удалить Пользователя. Активных записей ". $cnt;
    }

    $this->db->start_tran();
    $this->db->exec("DELETE FROM `users` WHERE id = ?", $id);
    $id = $this->db->affect();
    $this->db->commit();
    return intval($id);
  }
}
?>

