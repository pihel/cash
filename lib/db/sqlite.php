<?
class SQLITE_DB extends DB {

  function __construct($srv) {
    parent::__construct("SQLITE", $srv, NULL, NULL, NULL);
  }

  public function try_connect($srv, $login, $pasw, $db) {
    return new SQLite3($srv);
  }

  public static function upper_utf($s) {
    return mb_strtoupper($s, 'UTF-8');
  }

  public function after_connect() {
    $this->_con->createFunction($this->getUpperFnc(), array('SQLITE_DB', 'upper_utf'), 1);
  }

  public function raiseError() {
    if(!$this->_con) return;
    $code = intval($this->_con->lastErrorCode());
    if($code < 1) return;

    $error_msg = "[".$code."] ".$this->_con->lastErrorMsg();
    //$this->_con->close();
    throw new CashError($error_msg);
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

  public function escape($s) {
    return $this->_con->escapeString($s);
  }

  protected function _exec($sql, $args) {
    $this->_stmt = $this->_con->prepare($sql);
    
    if(!$this->_stmt) $this->raiseError();
    if(is_array(@$args[1])) $args = $args[1];
    
    foreach($args as $k=>$v) {      
      $type = SQLITE3_TEXT;
      if(is_float($v)) {
        $type = SQLITE3_FLOAT;
      } elseif(is_int($v)) {
        $type = SQLITE3_INTEGER;
      }
      $this->_stmt->bindValue($k, $v, $type);
    }

    $ret = array();

    $result = $this->_stmt->execute();
    
    if(!$result) {
      $this->_stmt->close();
      $this->raiseError();
    }

    if($result && $result->numColumns() > 0) {
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
        $rsql = preg_replace('/\?/', $v, $rsql, 1); 
      }
    }

    return $rsql;
  }
  
  public function getUpperFnc() {
    return "UPPER_UTF8";
  }
  
  public function getDateFnc() {
    return "datetime(CURRENT_TIMESTAMP, 'localtime')";
  }
  
  public function getDateFormatFnc($format, $col) {
    return "strftime('".$format."', ".$col.")";
  }
  
  public function getDateAddFnc($col, $interval) {
    return "DATETIME(".$col.", '".interval. "')";
  }

  function __destruct() {
    if(is_resource($this->_con)) $this->_con->close();
  }
}
?>