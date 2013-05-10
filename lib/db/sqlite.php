<?
class SQLITE_DB extends DB {

  public function try_connect($srv, $login, $pasw, $db) {
    return new SQLite3($srv);
  }

  public function after_connect() {
    //??
  }

  public function raiseError() {
    if(!$this->_con) return;
    $code = intval($this->_con->lastErrorCode());
    if($code < 1) return;

    $error_msg = "[".$code."] ".$this->_con->lastErrorMsg();
    $this->_con->close();
    throw new Error($error_msg);
  }

  public function start_tran() {
    $this->_con->exec('BEGIN;');
  }

  public function commit() {
    $this->_con->exec("commit;");
  }

  public function rollback() {
    $this->_con->exec("rollback;");
  }

  public function last_id() {
    return $this->_con->lastInsertRowID();
  }

  public function affect() {
    return $this->_con->changes();
  }

  protected function _exec($sql, $args) {
    $this->_stmt = $this->_con->prepare($sql);
    foreach($args as $k=>$v) {
      //echo $k."=>".$v."<br>";
      $this->_stmt->bindValue($k, $v);
    }

    $ret = array();

    $result = $this->_stmt->execute();

    if($result) {
      while($res = $result->fetchArray(SQLITE3_ASSOC)){
	$ret[] = $res;
      }
    }

    $this->_stmt->close();

    return $ret;
  }

  public function getRealSql($sql, $args) {
    $rsql = $sql;
    foreach($args as $k=>$v) {
      if(is_array($v)) {
	foreach($v as $kk=>$vv) {
	  $rsql = str_replace($kk, $vv, $rsql);
	}
      } else {
	$rsql = str_replace($k, $v, $rsql);
      }
    }

    return $rsql;
  }

  function __destruct() {
    if(is_resource($this->_con)) $this->_con->close();
  }
}
?>