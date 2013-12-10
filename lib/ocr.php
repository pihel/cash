<?
require_once('error.php');

class OCR {
  private $src_file;
  private $dst_file;
  private $text = "";
  
  public function __construct($file) {
    $this->src_file = $file;
    $this->dst_file = $this->src_file.".gif";
  }
  
  protected function gray() {
    $ext = pathinfo($this->src_file, PATHINFO_EXTENSION);
    $im = NULL;
    
    if($ext == "png") {
      $im = imagecreatefrompng($this->src_file);
    } elseif($ext == "jpg" || $ext == "jpeg") {
      $im = imagecreatefromjpeg($this->src_file);
    } elseif($ext == "gif") {
      $im = imagecreatefromgif($this->src_file);
    } else {
      throw new Error("Недопустимый тип файла");
    }
    if(!$im) {
      throw new Error("Невозможно обработать файл");
    }
    imagefilter($im, IMG_FILTER_GRAYSCALE);
    imagefilter($im, IMG_FILTER_CONTRAST, -10000);
    imagegif($im, $this->dst_file);
  } //gray
  
  public function recognize() {
    $this->gray();
    /*
    C:\Users\007>"C:\Program Files (x86)\Cognitive\CuneiForm\cuneiform" -l ruseng -f
 text --singlecolumn -o Z:\home\cash\www\files\tmp\result.txt Z:\home\cash\www\f
iles\tmp\test.jpg.gif
    */
    return $this->text;
  }
}

//$ocr = new OCR("files/tmp/test.jpg");
$ocr = new OCR("files/tmp/check.gif");
var_dump($ocr->recognize());
?>