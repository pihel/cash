<?
require_once('error.php');

class OCR_Helper {
  private $dir;
  private $ext_type = array('gif','jpg','jpe','jpeg','png', 'tif', 'tiff', 'bmp');
  
  private $login = '';
  private $passw = '';
  
  public function __construct() {
    $this->dir = __DIR__."/../files/ocr";
  }
  
  function recognize($file) {
    $ext = pathinfo($file['cash_list_edit_btn_add_check-inputEl']['name'], PATHINFO_EXTENSION);
    if(!in_array($ext, $this->ext_type)) {
      return array('failure'=>true, 'msg'=> 'Разрешены чеки в форматах: '.implode(", ", $this->ext_type));
    }

    $hash = crc32(time().$file['cash_list_edit_btn_add_check-inputEl']['name']);
    $hash = intval($hash);
    
    if( !file_exists( $this->dir ) ) {
      if( !mkdir( $this->dir, 0777, true) ) {
        return array('failure'=>true, 'msg'=> 'Невозможно создать временную дирректорию.');
      }
    }
    $fname = $this->dir.'/'.$hash.".".$ext;
    if(!move_uploaded_file($file['cash_list_edit_btn_add_check-inputEl']['tmp_name'], $fname)) {
      return array('failure'=>true, 'msg'=> 'Ошибка загрузки файла');
    }
    
    //OCR
    $text = '';
    try  {
      $ocr = new ABBYY($fname, $this->login, $this->passw);
      $text = $ocr->recognize();
    }
    catch(Exception $e) {
      return array('failure'=>true, 'msg'=> 'Ошибка распознания чека: '.$e->getMessage());
    }  
    file_put_contents($this->dir.'/'.$hash.".ocr");
    //copy($this->dir."/ok.txt", $this->dir.'/'.$hash.".ocr"); //debug
    
    return array('success'=>true, 'msg'=> $hash );
  } //recognize

  function parse($hash, $type) {
    $hash = intval($hash);
    $text = file_get_contents($this->dir."/".$hash.".ocr");
    $prs = new Parser($text);
    $data = $prs->parse();
    if($type == 'head') {
      unset($data->lines);
      return $data;
    } else {
      return $data->lines;
    }
  } //parse

} //OCR_Helper

abstract class OCR {
  protected $src_file;
  
  public function __construct($file) {
    $this->src_file = $file;
  }
  
  abstract function recognize();
}//OCR

class CashLine {
    //public $id;
    public $name;
    public $qnt;
    public $price;
    public $gr_id;
    public $gr_name;
    
    public function __construct($name, $qnt, $price, $gr_id) {
        $this->name = $name;
        $this->qnt = $qnt;
        $this->price = $price;
        $this->gr_id = $gr_id;
        
        global $db;
        $this->gr_name = $db->element("SELECT name FROM cashes_group WHERE id = ?", $gr_id);
    }
}
class CashDoc {
    public $org;
    //public $org_id;
    //public $cur_id;
    //public $cash_id;
    public $date;
    
    public $lines;
    
    public function __construct($org, $date) {
        $this->org = $org;
        if(empty($date)) $date = date("d.m.Y");
        $this->date = $date;
        $this->lines = array();
    }
    
    public function addLine($name, $qnt, $price, $gr_id) {
        $price = abs(floatval($price));
        $qnt = abs(floatval($qnt));
        if(empty($name)) return;
        if($qnt == 0 || $price == 0) return;
        $this->lines[] = new CashLine($name, $qnt, $price, $gr_id);
    }
}

class Parser {
  private $text;
  private $cd;
  
  public function __construct($_text) {
    $this->text = trim($_text);
    $this->data = array();
  }
  
  protected function clear($text) {
    $data = trim( str_replace(array(" ", "\t", "\n", "*", "=", "»"), " ", $text) );
    $data = trim( str_replace("  ", " ", $data) );
    return $data;
  }
  
  protected function parseFloat($text) {
    $data = floatval($this->clear($text));
    if(0 == $data) $data = 1;
    return $data;
  }
  
  protected function strip($text, $tstart, $tend, $dif_st = 0, $dif_end = 0, $fr_end = 0) {
    $st = stripos($text, $tstart);
    if($st === false) return;
    $text = trim( substr($text, $st + strlen($tstart) + $dif_st) );
    $end = false;
    if($fr_end) {
        $end = strripos($text, $tend);//find from end
    } else {
        $end = stripos($text, $tend);//find after substr
    }
    if($end === false) return;
    $text = substr($text, 0, $end - $dif_end );

    return trim($text);
  } //strip
  
  protected function strip_arr($text, $arr_start, $arr_end, $dif_st = 0, $dif_end = 0, $fr_end = 0, $near = 0) {
    $tstart = "";
    $tend = "";
    
    $pstart = 999;
    $pend = -1;
    foreach($arr_start as $s) {
        if($near) {
            $pstart_ = stripos($text, $s);
            if($pstart_ !== false && $pstart_ < $pstart ) {
                $tstart = $s;
                $pstart = $pstart_;
            }
        } else {
            if(stripos($text, $s) !== false) {
                $tstart = $s;
                break;
            }
        }
    }
    foreach($arr_end as $s) {
        if($near) {
            $pend_ = strripos($text, $s);
            if($pend_ !== false && $pend_ > $pend) {
                $tend = $s;
                $pend = $pend_;
            }
        } else {
            if(stripos($text, $s) !== false) {
                $tend = $s;
                break;
            }
        }
    }
    if( empty($tstart) || empty($tend) ) return;
    return $this->strip($text, $tstart, $tend, $dif_st, $dif_end, $fr_end);
  } //strip_arr
  
  protected function parseTDate($tdate) {
    $tdate = str_replace(array("-"," ", "/"), ".", $tdate);
    if(empty($tdate)) $tdate = date("d.m.Y");
    $adate = explode(".", $tdate);
    if(strlen($adate[2]) == 2) $tdate = $adate[0].'.'.$adate[1].'.20'.$adate[2];
    return $tdate;
  }
  
  protected function parseDate($text, $arr_start, $arr_end, $dif_st = 0, $dif_end = 0) {
    $tdate = $this->strip_arr($this->text, $arr_start, $arr_end, $dif_st, $dif_end);
    return $this->parseTDate($tdate);
  }
  
  
  //парсинг чека из макдональдса
  protected function macdonalds() {
    $tlines = $this->strip_arr($this->text, array('КАССОВЫЙ ЧЕК'), array('ИТОГ'), 2, 0); 
    $lines = explode("\n", $tlines);
    if(count($lines) == 0) return;
    $tdate = $this->parseDate($this->text, array('ДАТА '), array(' ВРЕМЯ'), 0, 0); 
    
    $this->cd = new CashDoc('Макдоналдс', $tdate);
    
    foreach($lines as $k=>$line) {
      $lines[$k] = explode("\t", $line);
      $qp = explode(" а ", $lines[$k][1]);
      $this->cd->addLine($lines[$k][0], $qp[0], $qp[1], 1);
    } 
  } //macdonalds
  
  
  //парсинг чека из бургеркинга
  protected function burgking() {
    $tlines = $this->strip_arr($this->text, array('ПРОДАЖА', 'ПРОПИЛ'), array('Наличные'), 0, 0);
    $tlines = str_replace(array("E", "=", "Е", "_Д", "_A", "_А", "_Я", ".Д", "0Л"), "", $tlines);
    $lines = explode("\n", $tlines);
    if(count($lines) == 0) return;
    $tdate = $this->parseDate($this->text, array('ККМ'), array('ПРОДАЖА', 'ПРОПИЛ'), 9, 8);
    
    $this->cd = new CashDoc('Burger King', $tdate);
    
    $name = "";
    foreach($lines as $k=>$line) {
        if($k%2 == 0) {
            $name = $line;
        } else {
            $this->cd->addLine($name, 1, $line, 1);
        }
    }
  } //burgking
  
  //парсинг чека с АЗС ШЕЛЛ
  protected function shell() {
    $tlines = $this->strip_arr($this->text, array('Чек'), array('ПОДИТОГ'), 10, 0);
    $lines = explode("\n", $tlines);
    if(count($lines) == 0) return;
    
    $tdate = $this->parseDate($this->text, array('®'), array(" ", "\t"), 0, 0) ;
    $this->cd = new CashDoc('ШЕЛЛ', $tdate);
    
    $name = "";
    foreach($lines as $k=>$line) {
        if($k%2 == 0) {
            $name = $line;
        } else {
            $pr = floatval( $this->strip_arr($line, array("*"), array("\t", " ")) );
            
            $q_ex = stripos($line, " X ");
            if($q_ex !== false) {
                $qnt1 = floatval( substr($line, 0, $q_ex) );
                $qnt2 = floatval( $this->strip_arr($line, array(" X "), array("\t", " ")) );
                $this->cd->addLine($name, $qnt1 * $qnt2, $pr, 2);
            } else {
                $this->cd->addLine($name, 1, $pr, 2);
            }
        }
    }
  } //shell
  
  //парсинг чека из АШАН
  protected function ashan() {
    $tlines = $this->strip_arr($this->text, array('Номер транзакции', 'Отдел'), array('ИТОГ'), 0, 0);
    $tlines = trim( substr($tlines, stripos($tlines, "\n")) );
    $lines = explode("\n", $tlines);
    if(count($lines) == 0) return;
    
    $tdate = $this->parseDate($this->text, array(), array(), 0, 0); //не захватил эту область (перефоткать пример)
    
    $this->cd = new CashDoc('АШАН', $tdate);
    
    $names = array();
    $prices = array();
    foreach($lines as $line) {
        if(preg_match('/[А-Яа-яЁё]/u', $line)) $names[] = $line;
        if(stripos($line, "*")) $prices[] = str_replace(" ", "", $line);
    }
    foreach($names as $k=>$name) {
        $qp = explode("*", $prices[$k]);
        $this->cd->addLine($name, $qp[1], $qp[0], 1);
    }
  } //ashan
  
  //парсинг чека из ОКЕИ
  protected function okey() { //фотография неудволетворительного качества - переделать!!
    $tlines = $this->strip_arr($this->text, array('Док'), array('СУММА ПО ЧЕКУ'), 0, 0);
    $lines = explode("\n", $tlines);
    if(count($lines) == 0) return;
    
    //date
    $td_end = stripos($this->text, "\r\nДок");
    $tdate = substr($this->text, 0, $td_end);
    $td_end = strripos($tdate, " ");
    $tdate = substr($tdate, 0, $td_end);
    $tdate = trim(strrchr($tdate, "\n"));
    $tdate = substr($tdate , strlen($tdate)-10 );
    $tdate = $this->parseTDate($tdate); 
    
    $this->cd = new CashDoc('ОКЕЙ', $tdate);
    
    foreach($lines as $k=>$line) {
        if(stripos($line, "*") == false) {
            unset($lines[$k]);
            continue;
        }
        $lines[$k] = $this->strip_arr($line, array("\t", " "), array("\t", " "), 0, 0, 1, 1);
        $mul = strrpos($lines[$k], "*");
        $name = $this->clear( substr($lines[$k], 0, $mul) );
        $pprice = strrpos($name, " ");
        $price = $this->parseFloat( substr($name, $pprice) );
        $name = substr($name, 0, $pprice);
        $qnt = $this->parseFloat( substr($lines[$k], $mul) );
        $this->cd->addLine($name, $qnt, $price, 1);
    }
  } //okey
  
  public function parse() {
    if( stripos( $this->text, 'МАКДОНАЛДС' ) !== false ) {
      $this->macdonalds();
    } elseif( stripos( $this->text, 'Buraer King' ) !== false || stripos( $this->text, 'Burger King' ) !== false ) {
      $this->burgking();
    } elseif( stripos( $this->text, 'ШЕЛЛ' ) !== false ) {
      $this->shell();
    } elseif( stripos( $this->text, 'АШАН' ) !== false ) {
      $this->ashan();
    } elseif( stripos( $this->text, 'ОКЕИ') !== false || stripos( $this->text, 'ОКЕЙ' ) !== false  || stripos( $this->text, "Док\r\n1.U") !== false ) {
      $this->okey();
    } else {
      $this->okey();
    }
    return $this->cd;
  } //parse
} //Parser

class ABBYY extends OCR {
  private $text = "";
  
  private $applicationId = '';
  private $password = '';
  
  private $lang = "english,russian";
  private $format = "txt";
  private $url_processImage = 'http://cloud.ocrsdk.com/processImage?language=%s&exportFormat=%s&profile=textExtraction';
  
  private $taskid;
  private $url_getTaskStatus = 'http://cloud.ocrsdk.com/getTaskStatus?taskid=%s';
  
  private $url_result;
  
  private $uagent = "HomeBuh";
  
  public function __construct($file, $_applicationId, $_password) {
    parent::__construct($file);
    $this->url_processImage = sprintf($this->url_processImage, $this->lang, $this->format);
    $this->applicationId = $_applicationId;
    $this->password = $_password;
  }
  
  protected function send() {
    $curlHandle = curl_init();
    curl_setopt($curlHandle, CURLOPT_URL, $this->url_processImage);
    curl_setopt($curlHandle, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curlHandle, CURLOPT_USERPWD, $this->applicationId.":".$this->password);
    curl_setopt($curlHandle, CURLOPT_POST, 1);
    curl_setopt($curlHandle, CURLOPT_USERAGENT, $this->uagent);
    $post_array = array(
        "my_file"=>"@".$this->src_file
    );
    curl_setopt($curlHandle, CURLOPT_POSTFIELDS, $post_array); 
    $response = curl_exec($curlHandle);
    if($response == FALSE) {
      $errorText = curl_error($curlHandle);
      curl_close($curlHandle);
      throw new Error($errorText);
    }
    $httpCode = curl_getinfo($curlHandle, CURLINFO_HTTP_CODE);
    curl_close($curlHandle);

    // Parse xml response
    $xml = simplexml_load_string($response);
    if($httpCode != 200) {
      if(property_exists($xml, "message")) {
         throw new Error($xml->message);
      }
      throw new Error("unexpected response ".$response);
    }
    $arr = $xml->task[0]->attributes();
    $taskStatus = $arr["status"];
    if($taskStatus != "Queued") {
      throw new Error("Unexpected task status ".$taskStatus);
    }    
    // Task id
    $this->taskid = $arr["id"];    
  } //send
  
  protected function wait() {
    $this->url_getTaskStatus = sprintf($this->url_getTaskStatus, $this->taskid);
    while(true) {
      sleep(5);
      $curlHandle = curl_init();
      curl_setopt($curlHandle, CURLOPT_URL, $this->url_getTaskStatus);
      curl_setopt($curlHandle, CURLOPT_RETURNTRANSFER, 1);
      curl_setopt($curlHandle, CURLOPT_USERPWD, $this->applicationId.":".$this->password);
      curl_setopt($curlHandle, CURLOPT_USERAGENT, $this->uagent);
      $response = curl_exec($curlHandle);
      $httpCode = curl_getinfo($curlHandle, CURLINFO_HTTP_CODE);
      curl_close($curlHandle);
    
      // parse xml
      $xml = simplexml_load_string($response);
      if($httpCode != 200) {
        if(property_exists($xml, "message")) {
          throw new Error($xml->message);
        }
        throw new Error("Unexpected response ".$response);
      }
      $arr = $xml->task[0]->attributes();
      $taskStatus = $arr["status"];
      if($taskStatus == "Queued" || $taskStatus == "InProgress") {
        // continue waiting
        continue;
      }
      if($taskStatus == "Completed") {
        // exit this loop and proceed to handling the result
        break;
      }
      if($taskStatus == "ProcessingFailed") {
        throw new Error("Task processing failed: ".$arr["error"]);
      }
      throw new Error("Unexpected task status ".$taskStatus);
    }
    
    $this->url_result = $arr["resultUrl"];
  } //wait
  
  protected function read() {
    $curlHandle = curl_init();
    curl_setopt($curlHandle, CURLOPT_URL, $this->url_result);
    curl_setopt($curlHandle, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curlHandle, CURLOPT_SSL_VERIFYPEER, false);
    $this->text = curl_exec($curlHandle);
    curl_close($curlHandle);
  } //read
  
  
  public function recognize() {
    if(empty($this->applicationId) || empty($this->password)) {
      throw new Error("Задайте в настройках пароль и логин");
    }
    $this->send();
    $this->wait();
    $this->read();
    return $this->text;
  } //recognize
  
} //ABBYY
?>