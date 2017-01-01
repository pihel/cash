<?
abstract class FileCacheDB extends DB {
  protected $cache_dir;

  public function setCacheDir($dir) {
    $this->cache_dir = $dir;
  }

  protected function _createCacheByData($to, &$data) {
    $ser_data = serialize($data);
    file_put_contents($to, $ser_data);
  }

  public function getCacheBySql($sql, $args) {
    $real_sql = $this->getRealSql($sql, $args);
    $crc = crc32($real_sql);
    $file = $this->cache_dir."/".$crc.".ch";
    if(file_exists($file)) {
      //кэш для запроса существует
      $file_time = filemtime($file);
      if($file_time < time() - $this->cache_ttl) {
        //время существования кэша истекло, нужна перевалидация
        return $this->createCacheBySql($file, $sql, $args);
      } else {
        //кэш есть и валидный
        $ser_data = file_get_contents($file);
        $data = unserialize($ser_data);
        return $data;
      }
    } else {
      //создаем кэш
      return $this->createCacheBySql($file, $sql, $args);
    }
    return array();
  }

  function resetOldCache() {
    $arr = array();
    foreach (glob($this->cache_dir."/*.ch") as $file) {
        $file_time = filemtime($file);
        if($file_time < time() - $this->cache_ttl) {
          $arr[$file] = date('Y-m-d H:i:s', $file_time);
          unlink($file);
        }
    }
    return $arr;
  }
}
?>