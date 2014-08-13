<?
class DbUpdate {
  private $db, $lng, $usr;
  
  function __construct($_db, $_lng, $_usr) {
    $this->db = $_db;
    $this->lng = $_lng;
    $this->usr = $_usr;
  }

  public function exec($sql) {
    try {
      return $this->db->exec($sql);
    }
    catch(Exception $e) {
      return false;
    }
    return false;
  }
  
  public function select($sql) {
    try {
      return $this->db->element($sql);
    }
    catch(Exception $e) {
      return false;
    }
    return false;
  }
  
  public function createData($pasw) {  
    $login = "admin";
    if(empty($pasw)) $pasw = $login;
  
    $this->db->start_tran();
    
    $this->db->exec("INSERT INTO db(name) VALUES(?)", $this->lng->get(203) );
    $db_id = $this->db->last_id();
    
    $this->db->exec(
          "INSERT INTO `users` (id, bd_id, login, pasw, `read`, `write`, analiz, setting, oper_date)
		      VALUES( NULL, ?, ?, ?, ?, ?, ?, ?, datetime(CURRENT_TIMESTAMP, 'localtime') )", 
          $db_id , $login, $this->usr->hash_pasw($pasw), 1, 1, 1, 1);
    $usr_id = $this->db->last_id();
    
    $this->db->exec("INSERT INTO cashes_type(name) VALUES(?)", $this->lng->get(204));
    $this->db->exec("INSERT INTO cashes_type(name) VALUES(?)", $this->lng->get(205));
    $this->db->exec("INSERT INTO cashes_type(name) VALUES(?)", $this->lng->get(206));
    
    $this->db->exec("INSERT INTO cashes_setting(name, descr, value) VALUES(?, ?, ?)", "site_name",  $this->lng->get(207), $this->lng->get(208));
    $this->db->exec("INSERT INTO cashes_setting(name, descr, value) VALUES(?, ?, ?)", "mail",       $this->lng->get(209), "");    
    
    $this->db->exec("INSERT INTO cashes_group(name) VALUES(?)", $this->lng->get(210)); 
    $this->db->exec("INSERT INTO cashes_group(name) VALUES(?)", $this->lng->get(211));
    $this->db->exec("INSERT INTO cashes_group(name) VALUES(?)", $this->lng->get(212));
    
    foreach($this->lng->getCurrencys() as $cs ) {
      $this->db->exec("INSERT INTO currency(name,rate,sign,short_name) VALUES(?,?,?,?)", $cs[0], $cs[1], $cs[2], $cs[3] );
    }
    
    $this->db->commit();
  } //createData
  
  public function clean() {
    $this->db->start_tran();
    $this->db->exec('delete from cashes');
    $this->db->exec('delete from cashes_nom');
    $this->db->exec('delete from cashes_group_plan');
    $this->db->exec('delete from cashes_group');
    $this->db->exec('delete from cashes_org');
    $this->db->exec('delete from cashes_setting');
    $this->db->exec('delete from cashes_type');
    $this->db->exec('delete from currency');
    $this->db->exec('delete from users');
    $this->db->exec('delete from db');
    $this->db->commit();
  } //clean
  
} //DbUpdate


class Update {
  private $db, $lng, $usr;
  
  private $db_upd;

  function __construct($_db, $_lng, $_usr) {
    $this->db = $_db;
    $this->lng = $_lng;
    $this->usr = $_usr;
  }
  
  public function setup($pasw) {
    $dupd = new DbUpdate($this->db, $this->lng, $this->usr);
    $dupd->createData($pasw);
    return true;
  }
  
  public function needSetup() {
    $exst = $this->db->element("SELECT 1 as exst FROM db");
    return ( 0 == intval($exst) );
  } //needSetup
  
  public function needUpdate() {
    global $version;//хранить гдето версию бд??
    return false;
  } //needUpdate
  
  
} //Update