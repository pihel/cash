<?
class ODBC extends FileCacheDB {
  private $_dsn;

  function __construct($drvr, $srv, $db, $login, $pwd) {
     parent::__construct($drvr, $srv, $db, $login, $pwd);
     $this->setDsn($drvr, $usr, $pwd, $db, $dsn);
  }

  public function setDsn($drvr, $usr, $pwd, $db, $dsn = "") {
    if(!empty($_dsn)) {
      $this->_dsn = $dsn;
    } else {
      $this->_dsn = sprintf("Driver={%s};UID=%s;PWD=%s;DBQ=%s", $drvr, $usr, $pwd, $db);
    }
  }

  public function try_connect($login, $pasw, $db_name = NULL) {
    if($db_name == NULL || empty($db_name)) $db_name = $this->db;

    $try_dsn = sprintf("Driver={%s};UID=%s;PWD=%s;DBQ=%s", $this->drvr, $login, $pasw, $db_name);

    return odbc_connect($try_dsn, NULL, NULL);
  }

  public function raiseError($sql = NULL, $prms = array()) {
    $error_id = odbc_error($this->_con);
    if(strlen($error_id) == 5) {
      $error_msg = "[".$error_id."] ".odbc_errormsg($this->_con);
      //odbc_close($this->_con);
      if(!empty($sql)) {
        $error_msg = $error_msg."-------------------------\nSQL trace: ".$sql.", \n-------------------------\nParams: ".print_r($prms,1);
      }
      throw new CashError($error_msg);
    }
  }

  public function after_connect() {
    odbc_autocommit($this->_con, false);
  }

  public function commit() {
    odbc_commit($this->_con);
  }

  public function rollback() {
    odbc_rollback($this->_con);
  }

  public function last_id() {
    return $this->_con->insert_id;
  }

  public function affect() {
    return $this->_con->affected_rows;
  }

  protected function _exec($sql, $params = array()) {
    $this->_stmt = odbc_prepare($this->_con, $sql);
    if($this->_stmt === false) $this->raiseError($this->_stmt, $params);
    $res = odbc_execute($this->_stmt, $params);
    if($res === false) $this->raiseError($sql, $params);

    return $res;
  }

  public function select($sql) {
    $start_time = microtime(true);

    //получим параметры
    $args = func_get_args();
    //сам sql запрос не параметр
    unset($args[0]);

    $sql = getRealSql($sql, $args);

    if($this->try_cache) {
      $rows = $this->getCacheBySql($sql);
      $this->try_cache = false;
      if(!empty($rows)) {
        $this->stat = array('mcr_time'=> (microtime(true) - $start_time), 'cache'=> true);

        if($this->debug) {
          echo "<pre>".$sql."\n----------\n+From cache!\n+query time: ".$this->stat['mcr_time']." sec.</pre>";
        }

        return $rows;
      }
    }

    //запрос
    //echo "<pre>".$sql."</pre>";
    $res = odbc_exec($sql);

    //формируем массив данных
    $fld_count = odbc_num_fields($res);

    //получим наименования столбцов (чтобы 500 раз это не делать)
    $cols = array();
    for($i = 1; $i <= $fld_count; $i++) {
      $cols[$i] = odbc_field_name($res, $i);
    }

    //сформируем ассоциативный массив
    $rows = array();
    while(odbc_fetch_row($res)) {
      $row = array();
      for($i = 1; $i <= $fld_count; $i++) {
        $value = odbc_result($res, $i);
        $row[$cols[$i]] = $value;
      }
      $rows[] = $row;
    }
    odbc_free_result($res);

    $this->stat = array('mcr_time'=> (microtime(true) - $start_time), 'cache'=> false);

    if($this->debug) {
      echo "<pre>".$sql."\n----------\n+query time: ".$this->stat['mcr_time']." sec.</pre>";
    }

    return $rows;
  }

  public function getRealSql($sql, $args) {
    if(count($args) > 0) {
      $sql = vsprintf($sql, $args);
    }
    return $sql;
  }

  function __destruct() {
    odbc_close($this->_con);
  }
}
?>