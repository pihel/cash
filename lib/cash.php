<?
class Cash {
  private $db;
  private $usr;
  private $lng;
  
  private $from = "-2 month";

  public function __construct($_db, $_usr, $_lng) {
    $this->db = $_db;
    $this->usr = $_usr;
    $this->lng = $_lng;
  }

  protected function makeFilter($name, $name_str, $val, $is_int, $not) {
    $f = "";
    if(empty($val) || $val == "null" || $val == "undefined") return $f;

    $no = "";
    $nos = "";
    if($not) {
      $nos = "NOT";
      $no = "!";
    }
    if($is_int) {
      $f = " AND ".$name." ".$no."= ". $val;
    } else {
      $f = " AND UPPER_UTF8(".$name_str.") ".$nos." like UPPER_UTF8('%". $this->db->escape($val)."%')";
    }
    return $f;
  }

  public function getExFilter($f) {
    $ret = "";

    if(intval($f['exfilter']) == 0) return $ret;

    $ret .= $this->makeFilter("c.nmcl_id", "cn.name", $f['nmcl_id'], intval($f['nmcl_id']), $f['nmcl_id_no'] );
    $ret .= $this->makeFilter("c.`group`", "cg.name", $f['pt_id'], intval($f['pt_id']), $f['pt_id_no'] );
    if( floatval($f['price_from']) != 0 ) $ret .= " AND c.price >= ".floatval($f['price_from']);
    if( floatval($f['price_to']) != 0 ) $ret .= " AND c.price <= ".floatval($f['price_to']);
    $ret .= $this->makeFilter("c.cash_type_id", "ct.name", $f['ctype_id'], intval($f['ctype_id']), 0 );
    $ret .= $this->makeFilter("c.cur_id", "cr.name", $f['cur_id'], intval($f['cur_id']), 0 );
    if($f['oper_id'] === "0") $ret .= " AND c.type = 0";
    if($f['oper_id'] === "1") $ret .= " AND c.type = 1";
    //$ret .= $this->makeFilter("c.type", "", $f['oper_id'], 1, 0 );
    $ret .= $this->makeFilter("c.org_id", "co.name", $f['org_id'], intval($f['org_id']), $f['org_id_no'] );
    if( intval($f['uid']) > 0 ) {
      $ret .= $this->makeFilter("c.uid", "", $f['uid'], intval($f['uid']), 0 );
    }
    
    $ret .= $this->makeFilter("", "c.note", $f['note'], 0, $f['note_no'] );
    if( intval($f['del']) == 1 ) {
      $ret .= " AND c.visible = 0 ";
    } else {
      $ret .= " AND c.visible = 1 ";
    }
    if( intval($f['file']) == 1 ) {
      $ret .= " AND c.file <> '' "; //IS NOT NULL ???
    }

    //echo $ret;
    return $ret;
  }
  
  public function getList($from, $to, $exfltr, $short = false) {
    if(!$this->usr->canRead()) return array();

    $filter = "";

    if(empty($from)) $from = date("Y-m-d");
    if(empty($to)) $to = date("Y-m-d");

    $filter = $this->getExFilter($exfltr);
    if(empty($filter)) $filter = " AND c.visible = 1 ";

    $this->db->escape_res = true;
    $desc = "ASC";
    $select = 
      "c.id, c.nmcl_id, cn.name as nom, c.`group`, cg.name gname, c.price, c.qnt, c.date as oper_date, datetime(c.date_edit, 'localtime') date_edit,
        c.org_id, co.name as oname, c.type, c.note, c.file, c.uid, u.login, cr.rate, cr.sign, c.cash_type_id, ct.name as cash_type,
        CASE WHEN c.type = 0 THEN -1 ELSE 1 END * c.price * c.qnt * cr.rate as amount";
    if($short) {
      global $settings;
      if( $settings['round'] ) $round = "ROUND";
      $select = "c.id, cn.name as nom, c.date as dt, co.name as oname, u.login, cr.sign, 
            CASE WHEN c.type = 0 THEN -1 ELSE 1 END * ".$round."(c.price * c.qnt * cr.rate) as amount ";
      $desc = "DESC";
    }
    $sql =
    " SELECT
      ".$select."
     FROM cashes c
     INNER JOIN currency cr
      ON(c.cur_id = cr.id)
     INNER JOIN cashes_nom cn
      ON(c.nmcl_id = cn.id)
     INNER JOIN cashes_org co
      ON(c.org_id = co.id)
     INNER JOIN cashes_type ct
      ON(c.cash_type_id = ct.id)
     INNER JOIN cashes_group cg
      ON(cg.id = c.`group`)
     INNER JOIN users u
      ON(u.id = c.`uid`)
     WHERE
      c.date BETWEEN ? AND ?
      AND c.bd_id = ?
      ". $filter ."
     ORDER BY
      c.date ".$desc.", c.date_edit ".$desc;

     return $this->db->select($sql, $from, $to, $this->usr->db_id);
  }

  public function getItem($id) {
    if(!$this->usr->canRead()) return array();

    $sql =
    " SELECT
      c.nmcl_id, c.`group`, c.price, c.qnt, c.date as oper_date, c.cur_id,
      c.org_id, c.type, c.note, c.file, c.uid, c.cash_type_id, c.type
     FROM cashes c
     WHERE
      c.id = ?
      AND c.bd_id = ?";

     return $this->db->line($sql, $id, $this->usr->db_id);
  }
  
  public function getSettings_flat() {
    if(!$this->usr->canRead()) return array();
    $sql = "SELECT name, descr, value FROM cashes_setting";
    //$this->db->escape_res = true;
    return $this->db->select($sql);
  }

  public function getSettings() {
    //if(!$this->usr->canRead()) return array();
    
    /*$this->db->exec('CREATE TABLE cashes_setting (
        "name" VARCHAR(50) PRIMARY KEY NOT NULL,
        "descr" VARCHAR(250),
        "value" VARCHAR(250))');
        
    $this->db->exec('CREATE UNIQUE INDEX "XPK_CASHES_SETTING" on cashes_setting (name ASC)');*/
    
    $sql = "SELECT name, value FROM cashes_setting
            UNION 
            SELECT 'sign', c.sign FROM currency c WHERE id = 1"; //(SELECT value FROM cashes_setting WHERE name = 'currency')
    $set = $this->db->select($sql);
    
    $sk = array();
    foreach($set as $s) {
      $sk[$s['name']] = $s['value'];
    }

    return $sk;
  }

  public function nmcl_list($query, $id, $limit = 0) {
    $id = intval($id);
    //if(empty($query) && $id == 0) return array();
    if(!$this->usr->canRead()) return array();
    $limit = intval($limit);
    if($limit == 0) $limit = 50;

    if( !empty($query) && $id > 0 ) {
      $filter = " AND ( UPPER_UTF8(cn.name) like UPPER_UTF8('%". $this->db->escape($query) ."%') OR c.id = ". $id ." )";
    } else if($id > 0) {
      $filter = " AND c.id = ". $id;
    } else if(!empty($query)) {
      $filter = " AND UPPER_UTF8(cn.name) like UPPER_UTF8('%". $this->db->escape($query) ."%') ";
    }

    $sql =
    "SELECT
      DISTINCT cn.id, cn.name
    FROM cashes c
    INNER JOIN cashes_nom cn
      ON(cn.id = c.nmcl_id)
    WHERE
      c.bd_id = ? AND c.visible = 1
      " . $filter . "
    GROUP BY
      cn.id, cn.name
    ORDER BY
      SUM(CASE WHEN c.uid = ? THEN 100 ELSE 1 END) DESC, COUNT(1) DESC, cn.id
    LIMIT " . $limit;
    //1 к 100 кол-во чужих записей
    
    return $this->db->select($sql, $this->usr->db_id, $this->usr->id);
  }

  public function nmcl_list_flat() {
    if(!$this->usr->canRead()) return array();
    $sql =
    "SELECT
      cn.id, cn.name
    FROM cashes_nom cn ";
    
    return $this->db->select($sql);
  }

  public function nmcl_param($nmcl_id, $nmcl_name) {
    if(!$this->usr->canRead()) return array();

    //cn.id, cn.name,
    $sql =
    "SELECT
      c.`group` grp,
      c.org_id,
      co.name as org_name,
      cg.name as gr_name
    FROM
      cashes c
    INNER JOIN cashes_org co
      ON(co.id = c.org_id)
    INNER JOIN cashes_group cg
      ON(cg.id = c.`group`)
    WHERE
      ( c.nmcl_id = ? OR (c.nmcl_id IN(SELECT n.id FROM cashes_nom n 
                                 WHERE UPPER_UTF8(n.name) like UPPER_UTF8('%". $this->db->escape($nmcl_name)."%')) AND ? = 0) 
      )
      AND c.bd_id = ? AND c.visible = 1
      AND c.date > ( SELECT 
                        DATETIME(MAX(c1.date), '".$this->from. "') 
                     FROM 
                        cashes c1 
                     WHERE 
                        c1.nmcl_id = c.nmcl_id
                        AND c1.bd_id = c.bd_id
                        AND c1.visible = c.visible
                    )
    GROUP BY c.`group`, c.org_id
    ORDER BY
      SUM(CASE WHEN c.uid = ? THEN 100 ELSE 1 END) DESC, COUNT(1) DESC
    LIMIT 1  ";
    return $this->db->line($sql, $nmcl_id, $nmcl_id, $this->usr->db_id, $this->usr->id);
  }

  public function prod_type_list() {
    if(!$this->usr->canRead()) return array();

    $sql =
    "SELECT id,name,pid FROM cashes_group";
    return $this->db->select($sql);
  }

  public function currency_list() {
    if(!$this->usr->canRead()) return array();

    $sql =
    "SELECT id,name,rate,sign,short_name FROM currency";
    return $this->db->select($sql);
  }

  public function cashes_type_list() {
    if(!$this->usr->canRead()) return array();

    $sql =
    "SELECT id,name,pid FROM cashes_type";
    return $this->db->select($sql);
  }

  public function org_list_flat() {
    if(!$this->usr->canRead()) return array();
    $sql =
    "SELECT
      co.id, co.pid, co.name, co.city
    FROM cashes_org co ";
    return $this->db->select($sql);
  }

  public function org_list($query, $id) {
    $id = intval($id);
    //if(empty($query) && $id == 0) return array();
    if(!$this->usr->canRead()) return array();

    if( !empty($query) && $id > 0 ) {
      $filter = " AND ( UPPER_UTF8(co.name) like UPPER_UTF8('%". $this->db->escape($query) ."%') OR c.id = ". $id ." )";
    } else if($id > 0) {
      $filter = " AND c.id = ". $id;
    } else if(!empty($query)) {
      $filter = " AND UPPER_UTF8(co.name) like UPPER_UTF8('%". $this->db->escape($query) ."%') ";
    }

    $sql =
    "SELECT
      co.id, co.name
    FROM
      cashes c
    INNER JOIN cashes_org co
      ON(co.id = c.org_id)
    WHERE
      c.bd_id = ? AND c.visible = 1
      " . $filter . "
    GROUP BY
      co.id, co.name
    ORDER BY
      SUM(CASE WHEN c.uid = ? THEN 100 ELSE 1 END) DESC, COUNT( 1 )  DESC, co.id
    LIMIT 50 ";
    return $this->db->select($sql, $this->usr->db_id, $this->usr->id);
  }

  public function del($id) {
    if(!$this->usr->canWrite()) return $this->lng->get(159);

    $this->db->start_tran();
    $fl = $this->getFile($id);
    if(!empty($fl)) {
      @unlink(__DIR__."/".$fl);
    }
    $this->db->exec("UPDATE cashes SET visible = 0 WHERE id = ? AND bd_id = ?", $id, $this->usr->db_id );
    $cnt = intval( $this->db->affect() );
    $this->db->commit();
    return $cnt;
  }

  protected function add_refbook($name, $ref) {
    if(!$this->usr->canWrite()) return NULL;
    
    $ref_id = 0;
    $name = trim($name);
    if(empty($name)) return 0;
    
    if(is_numeric($name) && intval($name) > 0) {
      //число или название?
      $ref_id = $this->db->element("SELECT MAX(id) id from ".$ref." WHERE ID = ?", $name );
    } else {
      //название
      $ref_id = $this->db->element("SELECT MAX(id) id from ".$ref." WHERE UPPER_UTF8(name) = UPPER_UTF8(?)", $name );
    }
    $ref_id = intval($ref_id);

    if($ref_id == 0) {
      $this->db->exec("INSERT INTO ".$ref."(name) VALUES(?)",  $name);
      $ref_id = $this->db->last_id();
    }
    return intval( $ref_id );
  }

  protected function refbook_check($data, $files = array() ) {

    $ret = array();

    if(empty($data) || !$this->usr->canWrite()) return array('failure'=>true, 'msg'=> $this->lng->get(160));

    $ret['file'] = '';
    if(is_array($files['cash_item_file'])) {
      global $settings;
      if($settings['demo'] == 1 && !empty($files['cash_item_file']['name'])) { 
        $this->db->rollback();
        return array('failure'=>true, 'msg'=> $this->lng->get(162));
      }
      
      global $max_file_size;
      if( ( $files['cash_item_file']['size'] > $max_file_size && intval($max_file_size) > 0 ) || $files['cash_item_file']['error'] == 1 ) {
        return array('failure'=>true, 'msg'=> $this->lng->get(222, array(round($max_file_size/1024/1024,2))) );
      }
      
      $ext = pathinfo($files['cash_item_file']['name'], PATHINFO_EXTENSION);
      $name = crc32(time().$files['cash_item_file']['name']);
      $dir = 'files/'.$_SERVER['HTTP_HOST'];
      if(!is_dir("../".$dir)) mkdir("../".$dir);
      $fname = $dir."/".$name.".".$ext;
      if(move_uploaded_file($files['cash_item_file']['tmp_name'], "../".$fname)) {
        $ret['file'] = $fname;
      }
    }

    $ret['cash_item_date'] = $data['cash_item_date'];
    if(empty($ret['cash_item_date'])) 		        { $this->db->rollback(); return array('failure'=>true, 'msg'=> $this->lng->get(163)); }

    $ret['cash_item_nmcl_cb']                     = $this->add_refbook($data["cash_item_nmcl_cb"], "cashes_nom");
    if( $ret['cash_item_nmcl_cb'] == 0) 	        { $this->db->rollback(); return array('failure'=>true, 'msg'=> $this->lng->get(164)); }

    $ret['cash_item_prod_type_cb']                = $this->add_refbook($data["cash_item_prod_type_cb"], "cashes_group");
    if($ret['cash_item_prod_type_cb'] == 0) 	    { $this->db->rollback(); return array('failure'=>true, 'msg'=> $this->lng->get(165)); }

    $data['cash_item_price']                      = str_replace(",", ".", $data['cash_item_price']);
    $ret['cash_item_price']                       = floatval( $data['cash_item_price'] );
    if($ret['cash_item_price'] == 0)   	          { $this->db->rollback(); return array('failure'=>true, 'msg'=> $this->lng->get(166)); }

    $ret['cash_item_currency_cb']                 = $this->add_refbook($data["cash_item_currency_cb"], "currency");
    if($ret['cash_item_currency_cb'] == 0) 	      { $this->db->rollback(); return array('failure'=>true, 'msg'=> $this->lng->get(167)); }

    $ret['cash_item_ctype_cb']                    = $this->add_refbook($data["cash_item_ctype_cb"], "cashes_type");
    if($ret['cash_item_ctype_cb'] == 0) 	        { $this->db->rollback(); return array('failure'=>true, 'msg'=> $this->lng->get(168)); }

    $data['cash_item_qnt']                        = str_replace(",", ".", $data['cash_item_qnt']);
    $ret['cash_item_qnt']                         = floatval( $data['cash_item_qnt'] );
    if($ret['cash_item_qnt'] == 0)   		          { $this->db->rollback(); return array('failure'=>true, 'msg'=> $this->lng->get(169)); }

    $ret['cash_item_org_cb']                      = $this->add_refbook($data["cash_item_org_cb"], "cashes_org");
    if($ret['cash_item_org_cb'] == 0) 		        { $this->db->rollback(); return array('failure'=>true, 'msg'=> $this->lng->get(170)); }

    $ret['cash_item_toper_cb']                    = intval($data['cash_item_toper_cb']);
    if( !in_array($ret['cash_item_toper_cb'], array(0,1)) )	{ $this->db->rollback(); return array('failure'=>true, 'msg'=> $this->lng->get(171)); }

    $ret['cash_item_note']                        = $data['cash_item_note'];
    $ret['cash_item_geo']                         = $data['cash_item_geo'];
    
    return $ret;
  }

  public function getFile($id, $short = false) {
    if($id == -1) {      
      if(!$this->usr->canSetting()) return "";
      global $sqlite_path;
      return $sqlite_path;
    }
    if(!$this->usr->canRead()) return "";
    $file = $this->db->element("SELECT `file` FROM `cashes` WHERE id = ? AND bd_id = ?", $id, $this->usr->db_id);
    
    if($short) {
      return $file;
    } 
    return __DIR__."/../".$file;
  }

  public function edit($data, $files) {
    if(!$this->usr->canWrite()) return array('failure'=>true, 'msg'=> $this->lng->get(159) );
    global $settings;
    if(intval($settings['secure_user']) == 1) {
      $uid = $this->db->element("SELECT uid from cashes WHERE ID = ?", $data['cash_item_edit_id'] );
      if( intval($uid) != $this->usr->id ) {
        return array('failure'=>true, 'msg'=> $this->lng->get(159) );
      }
    }

    $this->db->start_tran();

    $fl = $this->getFile($data['cash_item_edit_id'], true);
    
    if(intval($data['cash_item_file_del']) == 1 ) {
      if(!empty($fl)) {
        @unlink(__DIR__."/../".$fl);
        $fl = "";
      }
    }

    $refb = $this->refbook_check($data, $files);
    if( empty($refb['file']) && !empty($fl) ) $refb['file'] = $fl;

    if($refb['failure']) return $refb;

    $sql =
    "UPDATE `cashes`
      SET nmcl_id = ?,
          `group` = ?,
          price = ?,
          cash_type_id = ?,
          qnt = ?,
          `date` = ?,
          org_id = ?,
          `file` = ?,
          `type` = ?,
          note = ?,
          cur_id = ?,
          date_edit = datetime(CURRENT_TIMESTAMP, 'localtime')
     WHERE id = ? ";

    $this->db->exec($sql,
      $refb['cash_item_nmcl_cb'],
      $refb['cash_item_prod_type_cb'],
      $refb['cash_item_price'],
      $refb['cash_item_ctype_cb'],
      $refb['cash_item_qnt'],
      $refb['cash_item_date'],
      $refb['cash_item_org_cb'],
      $refb['file'],
      $refb['cash_item_toper_cb'],
      $refb['cash_item_note'],
      $refb['cash_item_currency_cb'],
      intval($data['cash_item_edit_id'])
    );

    $cnt = intval( $this->db->affect() );
    if($cnt == 0) { $this->db->rollback(); return array('failure'=>true, 'msg'=> $this->lng->get(172)); }

    $this->db->commit();

    //1% to check db
    if(rand(1,100) == 50) $this->analize();

    return array('success'=>true, 'msg'=> $cnt );
  }
  
  public function add_check($data) {
    if(!$this->usr->canWrite()) return $this->lng->get(159);
    
    $this->db->start_tran();
    $cnt = 0;
    
    $lines = array();
    if(is_array($data['cash_check_grid_hdn'])) {
      $lines = $data['cash_check_grid_hdn'];
    } else {
      $lines = json_decode( $data['cash_check_grid_hdn'] );
    }
    foreach($lines as $line) {
      $line = (array)$line;
      $item = array(
          'cash_item_date'          => $data['cash_check_date'],
          'cash_item_nmcl_cb'       => $line['name'],
          'cash_item_prod_type_cb'  => $line['gr_name'],
          'cash_item_price'         => $line['price'],
          'cash_item_currency_cb'   => $data['cash_check_currency_cb'],
          'cash_item_ctype_cb'      => $data['cash_check_ctype_cb'],
          'cash_item_qnt'           => $line['qnt'],
          'cash_item_org_cb'        => $data['cash_check_org_cb'],
          'cash_item_toper_cb'      => 0,
          'cash_item_note'          => ''
      );
      $ret = $this->add($item, NULL, false);
      if($ret['failure'] === true ) {
        $this->db->rollback();
        $this->db->escape_result($line['name']);
        return array('failure'=>true, 'msg'=> $this->lng->get(173).": '".$line['name']."': ".$ret['msg']);
      }
      $cnt++;
    }
    $this->db->commit();
    return array('success'=>true, 'msg'=> $cnt );
  } //add_check

  public function add($data, $files, $trans = true) {
    if(!$this->usr->canWrite()) return $this->lng->get(159);

    if($trans) {
      $this->db->start_tran();
    }

    $refb = $this->refbook_check($data, $files);

    if($refb['failure']) return $refb;

    $sql =
    "INSERT INTO `cashes` (nmcl_id, `group`, price, cash_type_id, qnt, `date`, org_id, bd_id, uid, `file`, `type` ,note, cur_id, geo_pos, visible, date_edit)
     VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 1, datetime(CURRENT_TIMESTAMP, 'localtime'))";

    $this->db->exec($sql,
      $refb['cash_item_nmcl_cb'],
      $refb['cash_item_prod_type_cb'],
      $refb['cash_item_price'],
      $refb['cash_item_ctype_cb'],
      $refb['cash_item_qnt'],
      $refb['cash_item_date'],
      $refb['cash_item_org_cb'],
      $this->usr->db_id,
      $this->usr->id,
      $refb['file'],
      $refb['cash_item_toper_cb'],
      $refb['cash_item_note'],
      $refb['cash_item_currency_cb'],
      $refb['cash_item_geo']
    );

    $id = intval( $this->db->last_id() );
    if($id == 0) { $this->db->rollback(); return array('failure'=>true, 'msg'=> $this->lng->get(174)); }

    if($trans) {
      $this->db->commit();
    }

    return array('success'=>true, 'msg'=> $id );
  } //add

  public function analize() {
    if(!$this->usr->canWrite()) return $this->lng->get(159);


    $sql = 
    "SELECT
      MAX(cn.id) as max_id,
      MIN(cn.id) as min_id
	  FROM
      cashes_nom cn
	  GROUP BY
      UPPER_UTF8(cn.name)
	  HAVING
      COUNT(*) > 1";
    $dbls = $this->db->select($sql);
    
    $sql = 
    "SELECT
      MAX(cn.id) as max_id,
      MIN(cn.id) as min_id
	  FROM
      cashes_org cn
	  GROUP BY
      UPPER_UTF8(cn.name)
	  HAVING
      COUNT(*) > 1";
    $orgs = $this->db->select($sql);

    $this->db->start_tran();
    foreach($dbls as $dbl) {
      $this->db->exec("UPDATE cashes SET nmcl_id = ? WHERE nmcl_id = ?", $dbl['min_id'], $dbl['max_id']);
    }
    foreach($orgs as $org) {
      $this->db->exec("UPDATE cashes SET org_id = ? WHERE nmcl_id = ?", $org['min_id'], $org['max_id']);
    }
    $this->db->exec("DELETE FROM cashes_nom   WHERE NOT EXISTS(SELECT 1 FROM cashes c WHERE c.nmcl_id = cashes_nom.id)");
    $this->db->exec("DELETE FROM cashes_org   WHERE NOT EXISTS(SELECT 1 FROM cashes c WHERE c.org_id  = cashes_org.id)");
    $this->db->exec("DELETE FROM cashes_group WHERE NOT EXISTS(SELECT 1 FROM cashes c WHERE c.`group` = cashes_group.id)");
    $this->db->commit();

    $this->db->exec("analyze cashes;");
    $this->db->exec("analyze cashes_group;");
    $this->db->exec("analyze cashes_group_plan;");
    $this->db->exec("analyze cashes_nom;");
    $this->db->exec("analyze cashes_org;");
    $this->db->exec("analyze cashes_type;");
    $this->db->exec("analyze currency;");
    $this->db->exec("analyze db;");
    $this->db->exec("analyze users;");
    $this->db->exec("vacuum;");

    return true;
  }
}
?>