<?
class CashAnaliz {
  private $db;
  private $usr;
  private $lng;

  private $def_cur = "р.";

  public function __construct($_db, $_usr, $_lng) {
    $this->db = $_db;
    $this->usr = $_usr;
    $this->lng = $_lng;
    global $settings;
    $this->def_cur = $settings['sign'];
  }
  
  protected function reduce($arr, $col_amnt, $col_name) {
    global $settings;
    $proc = floatval( $settings['proc_analiz'] ) / 100;
    $ret = array();
    $sum = 0;
    foreach($arr as $k=>$v) {
        $sum += $v[$col_amnt];
    }
    if($sum == 0) return $arr;
    
    $stop_k = 0;
    foreach($arr as $k=>$v) {
        //if($k < $cnt) {
        if( ($v[$col_amnt] / $sum) >= $proc ) {
          $ret[] = $v;
          $stop_k = $k;
        } else {
            $v[$col_name] = $this->lng->get(228);
            $v[$col_amnt] += $ret[$stop_k+1][$col_amnt];
            $ret[$stop_k+1] = $v;
        }
    }
    return $ret;
  } //reduce

  public function getCommon($from, $to, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();
    

    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");
    $uid = intval($uid);

    $sql =
    " SELECT
        CASE WHEN c.type = 1 THEN '".$this->lng->get(55)."' ELSE '".$this->lng->get(54)."' END as tname,
        SUM(price*qnt*cr.rate) data
      FROM `cashes` c
      INNER JOIN currency cr
        ON ( c.cur_id = cr.id )
      WHERE
        c.visible = 1 AND c.bd_id = ?
        AND c.date BETWEEN ? AND ?
        AND ( c.uid = ? OR 0 = ? )
      GROUP BY
        c.type
      ORDER BY
        c.type ";
        
     $this->db->escape_res = true;
     return $this->db->select($sql, $this->usr->db_id, $from, $to, $uid, $uid);
  }

  public function getDynamic($from, $to, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    //--нарастающий итог - жаль что нет аналитической функции

    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");
    $uid = intval($uid);

    $sql =
    "SELECT
      c.date as tdate,
      IFNULL(SUM(CASE WHEN type = 0 THEN -1*price*qnt*cr.rate END),0) as out_data,
      IFNULL(SUM(CASE WHEN type = 1 THEN price*qnt*cr.rate END),0) as in_data,
      IFNULL((
          SELECT
            SUM(CASE WHEN c1.type = 0 THEN -1 ELSE 1 END  * c1.price*c1.qnt*cr1.rate)
          FROM
            `cashes` c1, currency cr1
          WHERE
            c1.visible = c.visible AND c1.bd_id = c.bd_id
            AND cr1.id = c1.cur_id
            AND c1.date BETWEEN ? AND c.date
      ),0) as dif_data
    FROM
      `cashes` c
    INNER JOIN currency cr
      ON ( cr.id = c.cur_id )
    WHERE
      c.visible = 1 AND c.bd_id = ?
      AND c.date BETWEEN ? AND ?
      AND ( c.uid = ? OR 0 = ? )
    GROUP BY c.date
    ORDER BY c.date";

    $this->db->escape_res = true;
    return $this->db->select($sql, $from, $this->usr->db_id, $from, $to, $uid, $uid);
  }

  public function getGroups($from, $to, $in = 0, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");
    $uid = intval($uid);

    $sql =
    "SELECT
      g.name as tname,
      SUM( c.price * c.qnt * cr.rate ) out_amount
    FROM
      `cashes` c
    INNER JOIN cashes_group g
      ON( g.id = c.`group` )
    INNER JOIN currency cr
      ON( c.cur_id = cr.id )
    WHERE
      c.visible = 1 AND c.bd_id = ? AND c.type = ?
      AND c.date BETWEEN ? AND ?
      AND ( c.uid = ? OR 0 = ? )
    GROUP BY
      g.name
    ORDER BY
      out_amount DESC";

    $this->db->escape_res = true;
    //return $this->db->select($sql, $this->usr->db_id, intval($in), $from, $to, $uid, $uid);
    return $this->reduce( $this->db->select($sql, $this->usr->db_id, intval($in), $from, $to, $uid, $uid), "out_amount", "tname" );
  }
  
  public function getGroupsDyn($from, $to, $gr = 0, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    if(empty($from)) $from = date("Y-01-01");
    if(empty($to)) $to = date("Y-m-d");
    $uid = intval($uid);
    
    //отсечем малозначащие группы
    $grps = array();
    $grps_v = array();
    $grps_ = $this->getGroups($from, $to, 0, $uid);
    foreach($grps_ as $g) {
      $grps[]['name'] = $g['tname'];
      $grps_v[] = $g['tname'];
    }
    
    $grps_key = $grps;
    if($gr == 1) {
      return $grps;
    } else {
      $grps_key = array();
      foreach($grps as $g) {
        $grps_key[$g['name']] = 0;
      }
    }

    $sql =
    "SELECT
      replace(g.name, '.', ' ') as tname,
      strftime('%Y-%m', c.date) as mname,
      SUM( c.price * c.qnt * cr.rate ) out_amount
    FROM
      `cashes_group` g
    LEFT JOIN `cashes` c
      ON( g.id = c.`group` )
    LEFT JOIN currency cr
      ON( c.cur_id = cr.id )
    WHERE
      c.visible = 1 AND c.bd_id = ? AND c.type = 0
      AND c.date BETWEEN ? AND ?
      AND ( c.uid = ? OR 0 = ? )
    GROUP BY
      strftime('%Y-%m', c.date), g.name
    ORDER BY
      mname, g.name";

    $ret = array();
    $m = '';
    $i = -1;
    $this->db->escape_res = true;
    $data = $this->db->select($sql, $this->usr->db_id, $from, $to, $uid, $uid);
    
    $other = $this->lng->get(228);
    foreach($data as $d) {
      if(empty($d['mname'])) continue;
      if($m <> $d['mname']) {
        $m = $d['mname'];
        $i++;
        $ret[$i] = $grps_key; //чтобы были все группы, даже если там 0
        $ret[$i]['name'] = $m;
        
      }
      if(in_array($d['tname'], $grps_v)) {
        $ret[$i][$d['tname']] += $d['out_amount'];
      } else {
        $ret[$i][$other] += $d['out_amount'];        
      }
    } //foreach
    
    
    return $ret;
  }

  public function getOrgs($from, $to, $gr = 0, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");
    $gr = intval($gr);
    $uid = intval($uid);
    
    $gr_filter = "";
    if($gr > 0) {
      $gr_filter = "AND c.`group` = ? ";
    }

    $sql =
    "SELECT
      o.name as tname,
      SUM( c.price * c.qnt * cr.rate ) out_amount
    FROM
      `cashes` c
    INNER JOIN cashes_org o
      ON( o.id = c.org_id )
    INNER JOIN currency cr
      ON( c.cur_id = cr.id )
    WHERE
      c.visible = 1 AND c.bd_id = ? AND c.type = 0
      AND c.date BETWEEN ? AND ?
      AND ( c.uid = ? OR 0 = ? )
	  ". $gr_filter ."
    GROUP BY
      o.name
    ORDER BY
      out_amount DESC";

    $this->db->escape_res = true;
    return $this->reduce( $this->db->select($sql, $this->usr->db_id, $from, $to, $uid, $uid, $gr), "out_amount", "tname" );
  }

  public function getPurs($from, $to, $in = 0, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");
    $uid = intval($uid);

    $sql =
    "SELECT
      t.name as tname,
      SUM( c.price * c.qnt * cr.rate ) out_amount
    FROM
      `cashes` c
    INNER JOIN cashes_type t
      ON( t.id = c.cash_type_id )
    INNER JOIN currency cr
      ON( c.cur_id = cr.id )
    WHERE
      c.visible = 1 AND c.bd_id = ? AND c.type = ?
      AND c.date BETWEEN ? AND ?
      AND ( c.uid = ? OR 0 = ? )
    GROUP BY
      t.name
    ORDER BY
      out_amount";

    $this->db->escape_res = true;
    return $this->db->select($sql, $this->usr->db_id, intval($in), $from, $to, $uid, $uid);
  }

  public function getStorage($amount, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();
    $uid = intval($uid);

    $sql =
    "SELECT
      '".$this->lng->get(191)."' as tname,
      SUM( CASE WHEN c.type = 1 THEN 1 ELSE -1 END * c.price * c.qnt * cr.rate ) out_amount
    FROM
      `cashes` c
    INNER JOIN currency cr
      ON( c.cur_id = cr.id )
    WHERE
    c.visible = 1 AND c.bd_id = ? 
    AND ( c.uid = ? OR 0 = ? ) ";
    $this->db->escape_res = true;
    $r = $this->db->select($sql, $this->usr->db_id, $uid, $uid);

    $amount = intval($amount);
    if($amount == 0) $amount = 1000000;

    $r[1]['out_amount'] = $amount - $r[0]['out_amount'];
    $r[1]['tname'] = $this->lng->get(192);

    return $r;
  }

  public function getMothDyn($from, $to, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    if(empty($from)) $from = date("Y-01-01");
    if(empty($to)) $to = date("Y-m-d");
    $uid = intval($uid);

    $sql =
    "SELECT
      strftime('%Y-%m', c.date) as tname,
      IFNULL(SUM( CASE WHEN c.type = 1 THEN c.price * c.qnt * cr.rate END ),0) in_amount,
      IFNULL(SUM( CASE WHEN c.type = 0 THEN c.price * c.qnt * cr.rate END ),0) out_amount
    FROM
      `cashes` c
    INNER JOIN currency cr
      ON( c.cur_id = cr.id )
    WHERE
      c.visible = 1 AND c.bd_id = ?
      AND c.date BETWEEN ? AND  ?
      AND ( c.uid = ? OR 0 = ? )
    GROUP BY
      strftime('%Y-%m', c.date)
    ORDER BY
      tname";

    $this->db->escape_res = true;
    return $this->db->select($sql, $this->usr->db_id, $from, $to, $uid, $uid);
  }

  public function getCurAmount($from, $to, $in = 0, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");
    $uid = intval($uid);

    $sql =
    "SELECT
      cr.name as tname,
      SUM( c.price * c.qnt * cr.rate ) amount
    FROM
      `cashes` c
    INNER JOIN currency cr
      ON( c.cur_id = cr.id )
    WHERE
      c.visible = 1 AND c.bd_id = ? AND c.type = ?
      AND c.date BETWEEN ? AND ?
      AND ( c.uid = ? OR 0 = ? )
    GROUP BY
      cr.name";

    $this->db->escape_res = true;
    return $this->db->select($sql, $this->usr->db_id, $in, $from, $to, $uid, $uid);
  } //getCurAmount
  
  public function getGeoMap($from, $to, $in = 0, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");
    $uid = intval($uid);

    $sql =
    "SELECT
      c.geo_pos, cn.name, c.date,
      SUM( c.price * c.qnt * cr.rate ) amount
    FROM
      `cashes` c
    INNER JOIN currency cr
      ON( c.cur_id = cr.id )
    INNER JOIN cashes_nom cn
      ON( c.nmcl_id = cn.id )
    WHERE
      c.geo_pos is not null AND c.geo_pos <> '0;0'
      AND c.visible = 1 AND c.bd_id = ? AND c.type = ?
      AND c.date BETWEEN ? AND ?
      AND ( c.uid = ? OR 0 = ? )
    GROUP BY
      c.geo_pos, cn.name, c.date";

    $this->db->escape_res = true;
    return $this->db->select($sql, $this->usr->db_id, $in, $from, $to, $uid, $uid);
  } //getGeoMap

  public function getAvgInOut($uid = 0) {
    if(!$this->usr->canAnaliz()) return array();
    $uid = intval($uid);

    $sql =
    "SELECT
	    type, IFNULL(ROUND(AVG(amount)),0) as avg_amount
    FROM
    (
	    SELECT
		    strftime('%Y-%m', c.date) as mnth,
		    c.type,
		    SUM(c.price * c.qnt) as amount
	    FROM cashes c
	    WHERE
		    c.`date` >= DATETIME('now', '-6 month', 'start of month')
		    AND c.bd_id = ?
		    AND c.visible = 1
        AND ( c.uid = ? OR 0 = ? )
	    GROUP BY
		    c.type,
		    strftime('%Y-%m', c.date)
    )
    GROUP BY type
    ORDER BY type";

    $amnt = $this->getStorage(0);
    $amnt = round($amnt[0]['out_amount']);
    if($amnt < 0) $amnt = 0;

    $this->db->escape_res = true;
    $ret = array(
	    $amnt,
	    $this->db->select($sql, $this->usr->db_id, $uid, $uid)
	  );

    return $ret;
  }

  public function getSecr($amnt, $in, $out, $pin, $pout, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    $in = intval($in);
    $out = intval($out);
    $amnt = intval($amnt);
    $pin = floatval($pin)/12;
    $pout = floatval($pout)/12;
    $uid = intval($uid);

    $secr = array();
    $cnt = 0;
    $base = strtotime(date('Y-m',time()) . '-01 00:00:01');
    while($cnt < 24 && $amnt >= 0) {
      //получаем процент с баланса (предполагается капитализация раз в месяц)
      $amnt = $amnt * ( 1+$pin/100 );

      //арифметическая прогрессия для расхода
      $out = $out * ( 1+$pout/100 );

      $amnt = $amnt + $in - $out;
      $secr[] = array('tname'=> date("Y-m", strtotime("+".$cnt." months", $base)) , 'amount'=>$amnt);

      $cnt++;
    }

    return $secr;
  }
}
?>

