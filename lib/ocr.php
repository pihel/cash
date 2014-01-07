<?
require_once('error.php');

abstract class OCR {
  protected $src_file;
  
  public function __construct($file) {
    $this->src_file = $file;
  }
  
  abstract function recognize();
}//OCR

class Cash_OCR {
  private $data;
  private $text;
  
  public function __construct($_text) {
    $this->text = trim($_text);
    $this->data = array();
  }
  
  protected function strip($text, $tstart, $tend, $dif_st = 0, $dif_end = 0) {
    $st = stripos($text, $tstart);
    if($st === false) return;
    $end = stripos($text, $tend);
    if($end === false) return;
    $text = substr($text, $st + strlen($tstart) + $dif_st, $end - $st - strlen($tstart) - $dif_end );

    return trim($text);
  }
  
  public function macdonalds() {    
    $tlines = $this->strip($this->text, 'КАССОВЫЙ ЧЕК', 'ИТОГ', 5, 6); 
    $lines = explode("\n", $tlines);
    if(count($lines) == 0) return;
    
    foreach($lines as $k=>$line) {
      $lines[$k] = explode("\t", $line);
      $qp = explode(" а ", $lines[$k][1]);
      $lines[$k][1] = floatval($qp[0]);
      $lines[$k][2] = floatval($qp[1]);
    }
    
    $tdate = $this->strip($this->text, 'ДАТА ', ' ВРЕМЯ', 0, 0); 
    
    $this->data = array( 'Макдоналдс' => array( 'date' => $tdate, 'lines' => $lines ) );
  }
  
  public function recognize() {
    if( stripos( $this->text, 'МАКДОНАЛДС' ) !== false ) {
      $this->macdonalds();
    }
    return $this->data;
  }
} //Cash_OCR

class ABBYY extends OCR {
  private $text = "";
  
  private $applicationId = 'applicationId';
  private $password = 'password';
  
  private $lang = "english,russian";
  private $format = "txt";
  private $url_processImage = 'http://cloud.ocrsdk.com/processImage?language=%s&exportFormat=%s&profile=textExtraction';
  
  private $taskid;
  private $url_getTaskStatus = 'http://cloud.ocrsdk.com/getTaskStatus?taskid=%s';
  
  private $url_result;
  
  public function __construct($file) {
    parent::__construct($file);
    $this->url_processImage = sprintf($this->url_processImage, $this->lang, $this->format);
  }
  
  protected function send() {
    $curlHandle = curl_init();
    curl_setopt($curlHandle, CURLOPT_URL, $this->url_processImage);
    curl_setopt($curlHandle, CURLOPT_RETURNTRANSFER, 1);
    curl_setopt($curlHandle, CURLOPT_USERPWD, $this->applicationId.":".$this->password);
    curl_setopt($curlHandle, CURLOPT_POST, 1);
    curl_setopt($curlHandle, CURLOPT_USERAGENT, "PHP Cloud OCR SDK Sample");
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
      curl_setopt($curlHandle, CURLOPT_USERAGENT, "PHP Cloud OCR SDK Sample");
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
    $this->send();
    $this->wait();
    $this->read();
    return $this->text;
  } //recognize
  
} //ABBYY
?>