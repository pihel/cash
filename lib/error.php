<?
require_once("config.php");

class Error extends Exception {
  public $message;

  function __construct($msg, $code = 0) {
    parent::__construct($msg, $code);
    $this->saveLog();
  }

  private function sendMail($str) {
    //не настроено smtp на сервере
    global $site;
    $str = htmlspecialchars($str, ENT_QUOTES);
    mail($site['MAIL'], "Ошибка на сайте ".$site['URL'], $str);
  }

  private function saveLog() {
    $file_name = "log/".date('Y_m_d').".log";

    $log_str = "%s; ip: %s; file: %s; line: %s; msg: %s; stack: %s\n";
    $log_str = sprintf($log_str, date('Y-m-d H:i:s'), $_SERVER["REMOTE_ADDR"], $this->file, $this->line, $this->message, $this->getTraceAsString());

    $this->sendMail($log_str);

    if(file_exists($file_name)) {
      $res = fopen($file_name, "a");
      fwrite($res , $log_str);
      fclose($res);
    } else {
      file_put_contents($file_name, $log_str);
    }
  }

  function __toString() {
    //TODO?
    return parent::__toString();
  }
}
?>