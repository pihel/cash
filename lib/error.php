<?
require_once("config.php");

class Error extends Exception {
  public $message;

  function __construct($msg, $code = 0) {
    parent::__construct($msg, $code);
    $this->saveLog();
  }

  private function sendMail($str) {
    global $mail;
    if(!empty($mail)) {
      $str = htmlspecialchars($str, ENT_QUOTES);
      mail($mail, "Ошибка на сайте ".$_SERVER['SERVER_NAME'], $str);
    }
  }

  private function saveLog() {
    $file_name = __DIR__."/../files/log/".date('Y_m_d').".log";
    
    $log_str = "%s; ip: %s; file: %s; line: %s; msg: %s; stack: %s\n";
    $log_str = sprintf($log_str, date('Y-m-d H:i:s'), $_SERVER["REMOTE_ADDR"], $this->file, $this->line, $this->message, $this->getTraceAsString());

    $this->sendMail($log_str);

    file_put_contents($file_name, $log_str, FILE_APPEND);
  }

  function __toString() {
    //TODO?
    return parent::__toString();
  }
}
?>