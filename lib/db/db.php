<?
abstract class DB {
  protected $_srv, $_drvr, $_usr, $_pwd, $_db;

  //кэшировать (на один запрос)
  public $try_cache = false;

  //статистика запроса: время в микро секундах, признак взятия из кеша
  public $stat = array();

  //время жизни кэша, потом принудительно сбрасываем его (сек.)
  public $cache_ttl = 86400; //1 день

  protected $_con, $_stmt;

  //режим отладки
  public $debug = false;

  //кодировка бд
  public $encode = 'UTF8';
  
  //автокоммит
  public $autocommit = false;
  
  //экранировать результат запроса (на один запрос)
  public $escape_res = false;

  protected $start_time;
  protected $stop_time;

  function __construct($drvr, $srv, $db, $login, $pwd) {
    $this->_con  = false;
    $this->_srv  = $srv;
    $this->_drvr = $drvr;
    $this->_usr  = $login;
    $this->_pwd  = $pwd;
    $this->_db   = $db;
  }

  public function connect() {
    $this->_con = $this->try_connect($this->_srv, $this->_usr, $this->_pwd, $this->_db);
    if($this->_con === false) throw new Error("Error connect to DB");

    $this->after_connect();
  }

  public function try_connect($srv, $login, $pasw, $db) {
    //virtual
  }

  public function after_connect() {
    //virtual
  }

  public function raiseError() {
    //virtual
  }

  public function commit() {
    //virtual
  }

  public function rollback() {
    //virtual
  }

  public function last_id() {
    //virtual
  }

  public function affect() {
    //virtual
  }

  public function exec($sql) {
    $this->start_time = microtime(true);

    $args = func_get_args();
    unset($args[0]);
    $res = $this->_exec($sql, $args);

    //stat
    $this->stop_time = microtime(true);
    if($this->debug) {
      echo "<pre>".$this->getRealSql($sql,$args)."\n----------\n+quert time: ".($this->stop_time - $this->start_time)." sec.</pre>";
    }

    if($res === false) $this->raiseError();
    return $res;
  }

  protected function _exec($sql, $args) {
    //virtual
  }

  protected function _createCacheByData($to, &$data) {
    //virtual
  }

  protected function createCacheBySql($to, $sql, $args) {
    //сбросим флаг кеширования
    $this->try_cache = false;
    //данные
    $data = $this->_exec($sql, $args);

    $this->_createCacheByData($to, $data);
    return $data;
  }

  public function getCacheBySql($sql, $args) {
    //virtual
  }

  public function getRealSql($sql, $args) {
    //virtual
  }
  
  public function escape_result(&$value) {
    if(is_string($value)) {
      $value = htmlspecialchars($value, ENT_QUOTES);
    }
  }

  protected function _select($sql, $args, $type) {
    //сам sql запрос не параметр
    unset($args[0]);
    
    $rows = array();

    if($this->try_cache) {
      $start_time = microtime(true);

      $rows = $this->getCacheBySql($sql, $args);
      $this->try_cache = false;
      if(!empty($rows)) {
        $this->stat = array('mcr_time'=> (microtime(true) - $start_time), 'cache'=> true);

        if($this->debug) {
          echo "<pre>".$this->getRealSql($sql, $args)."\n----------\n+From cache!\n+query time: ".$this->stat['mcr_time']." sec.</pre>";
        }

        return $rows;
      }
    }

    //запрос
    $rows = $this->_exec($sql, $args);
    
    //экранируем
    if($this->escape_res) {
      array_walk_recursive($rows, array($this, "escape_result") );
      $this->escape_res = false;
    }

    //формируем массив данных
    if($type == 2) {
      //строка
      $rows = $rows[0];
    } else if($type == 3) {
      //первый элемент
      $rows = @array_shift($rows[0]);
    }

    $this->stat = array('mcr_time'=> ($this->stop_time - $this->start_time), 'cache'=> false);

    return $rows;
  }

  public function select($sql) {
    $args = func_get_args();
    return $this->_select($sql, $args, 1);
  }

  public function line($sql) {
    $args = func_get_args();
    return $this->_select($sql, $args, 2);
  }

  public function element($sql) {
    $args = func_get_args();
    return $this->_select($sql, $args, 3);
  }

  function __destruct() {
    //virtual
  }

  function resetOldCache() {
    //virtual
  }
}
?>