<?
class CashAnaliz {
  private $db;
  private $usr;

  private $def_cur = "р.";

  public function __construct($_db, $_usr) {
    $this->db = $_db;
    $this->usr = $_usr;

    //ID=1 - default currency, rate - count money per 1 default
    $this->def_cur = $this->db->element("SELECT c.sign FROM currency c WHERE id = ?", 1 );
  }

  public function getCommon($from, $to, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");

    $sql =
    " SELECT
        CASE WHEN c.type = 1 THEN 'Приход' ELSE 'Расход' END || ' ('||SUM(price*qnt*cr.rate)||'".$this->def_cur.")' as tname,
        SUM(price*qnt*cr.rate) data
      FROM `cashes` c
      INNER JOIN currency cr
        ON ( c.cur_id = cr.id )
      WHERE
        c.visible = 1 AND c.bd_id = ?
        AND c.date BETWEEN ? AND ?
      GROUP BY
        c.type
      ORDER BY
        c.type ";

     return $this->db->select($sql, $this->usr->db_id, $from, $to);
  }

  public function getDynamic($from, $to, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    //--нарастающий итог - жаль что нет аналитической функции

    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");

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
    GROUP BY c.date
    ORDER BY c.date";

      return $this->db->select($sql, $from, $this->usr->db_id, $from, $to);
  }

  public function getGroups($from, $to, $in = 0, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");

    $sql =
    "SELECT
      g.name|| ' ('||SUM(c.price*c.qnt*cr.rate)||'".$this->def_cur.")' as tname,
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
    GROUP BY
      g.name
    ORDER BY
      out_amount DESC";

    return $this->db->select($sql, $this->usr->db_id, intval($in), $from, $to);
  }
  
  public function getGroupsDyn($from, $to, $gr = 0, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    if(empty($from)) $from = date("Y-01-01");
    if(empty($to)) $to = date("Y-m-d");
    
    $sql =
      "SELECT
        replace(g.name, '.', '&#46;') name
      FROM
        `cashes_group` g
      WHERE
        EXISTS( SELECT 
                  1 
                FROM 
                  `cashes` c 
                WHERE 
                  g.id = c.`group`
                  AND c.visible = 1 AND c.bd_id = ? AND c.type = 0
                  AND c.date BETWEEN ? AND ? ) ";
    $grps = $this->db->select($sql, $this->usr->db_id, $from, $to);
    
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
      replace(g.name, '.', '&#46;') as tname,
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
    GROUP BY
      strftime('%Y-%m', c.date), g.name
    ORDER BY
      mname, g.name";

    $ret = array();
    $m = '';
    $i = -1;
    $data = $this->db->select($sql, $this->usr->db_id, $from, $to);
    foreach($data as $d) {
      if(empty($d['mname'])) continue;
      if($m <> $d['mname']) {
        $m = $d['mname'];
        $i++;
        $ret[$i] = $grps_key; //чтобы были все группы, даже если там 0
        $ret[$i]['name'] = $m;
        
      }
      $ret[$i][$d['tname']] = $d['out_amount'];
    } //foreach
    
    return $ret;
  }

  public function getOrgs($from, $to, $gr = 0, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");
    $gr = intval($gr);
    
    $gr_filter = "";
    if($gr > 0) {
      $gr_filter = "AND c.`group` = ? ";
    }

    $sql =
    "SELECT
      o.name|| ' ('||SUM(c.price*c.qnt*cr.rate)||'".$this->def_cur.")' as tname,
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
	  ". $gr_filter ."
    GROUP BY
      o.name
    ORDER BY
      out_amount DESC";

    return $this->db->select($sql, $this->usr->db_id, $from, $to, $gr);
  }

  public function getPurs($from, $to, $in = 0, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");

    $sql =
    "SELECT
      t.name|| ' ('||SUM(c.price*c.qnt*cr.rate)||'".$this->def_cur.")' as tname,
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
    GROUP BY
      t.name
    ORDER BY
      out_amount";

    return $this->db->select($sql, $this->usr->db_id, intval($in), $from, $to);
  }

  public function getStorage($amount, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    $sql =
    "SELECT
      'Достигнуто ' || SUM( CASE WHEN c.type = 1 THEN 1 ELSE -1 END * c.price * c.qnt * cr.rate ) ||'".$this->def_cur."' as tname,
      SUM( CASE WHEN c.type = 1 THEN 1 ELSE -1 END * c.price * c.qnt * cr.rate ) out_amount
    FROM
      `cashes` c
    INNER JOIN currency cr
      ON( c.cur_id = cr.id )
    WHERE
    c.visible =1 AND c.bd_id = ? ";
    $r = $this->db->select($sql, $this->usr->db_id);

    $amount = intval($amount);
    if($amount == 0) $amount = 1000000;

    $r[1]['out_amount'] = $amount - $r[0]['out_amount'];
    $r[1]['tname'] = 'Осталось '.$r[1]['out_amount'].$this->def_cur;

    return $r;
  }

  public function getMothDyn($from, $to, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    if(empty($from)) $from = date("Y-01-01");
    if(empty($to)) $to = date("Y-m-d");

    $sql =
    "SELECT
      strftime('%Y-%m', c.date) as tname,
      IFNULL(SUM( CASE WHEN c.type = 1 THEN c.price * c.qnt * cr.rate END ),0) in_amount,
      IFNULL(SUM( CASE WHEN c.type = 0 THEN  c.price * c.qnt * cr.rate END ),0) out_amount
    FROM
      `cashes` c
    INNER JOIN currency cr
      ON( c.cur_id = cr.id )
    WHERE
      c.visible = 1 AND c.bd_id = ?
      AND c.date BETWEEN ? AND  ?
    GROUP BY
      strftime('%Y-%m', c.date)
    ORDER BY
      tname";

    return $this->db->select($sql, $this->usr->db_id, $from, $to);
  }

  public function getCurAmount($from, $to, $in = 0, $uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");

    $sql =
    "SELECT
      cr.name||', '||SUM( c.price * c.qnt * cr.rate )||'".$this->def_cur."' as tname,
      SUM( c.price * c.qnt * cr.rate ) amount
    FROM
      `cashes` c
    INNER JOIN currency cr
      ON( c.cur_id = cr.id )
    WHERE
      c.visible = 1 AND c.bd_id = ? AND c.type = ?
      AND c.date BETWEEN ? AND ?
    GROUP BY
      cr.name";

    return $this->db->select($sql, $this->usr->db_id, $in, $from, $to);
  }

  public function getAvgInOut($uid = 0) {
    if(!$this->usr->canAnaliz()) return array();

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
		    c.`date` >= DATETIME('now', '-11 month', 'start of month')
		    AND c.bd_id = ?
		    AND c.visible = 1
	    GROUP BY
		    c.type,
		    strftime('%Y-%m', c.date)
    )
    GROUP BY type
    ORDER BY type";

    $amnt = $this->getStorage(0);
    $amnt = round($amnt[0]['out_amount']);
    if($amnt < 0) $amnt = 0;

    $ret = array(
	    $amnt,
	    $this->db->select($sql, $this->usr->db_id)
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

    $secr = array();
    $cnt = 0;
    while($cnt < 24 && $amnt >= 0) {
      //получаем процент с баланса (предполагается капитализация раз в месяц)
      $amnt = $amnt * ( 1+$pin/100 );

      //арифметическая прогрессия для расхода
      $out = $out * ( 1+$pout/100 );

      $amnt = $amnt + $in - $out;
      $secr[] = array('tname'=> date("Y-m", strtotime("+".$cnt." months")) , 'amount'=>$amnt);

      $cnt++;
    }

    return $secr;
  }
}
?>

