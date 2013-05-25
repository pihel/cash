<?
class CashAnaliz {
  private $db;
  private $usr;

  public function __construct($_db, $_usr) {
    $this->db = $_db;
    $this->usr = $_usr;
  }

  public function getCommon($from, $to) {
    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");

    $sql =
    " SELECT CASE WHEN c.type = 1 THEN 'Приход' ELSE 'Расход' END || ' ('||SUM(price*qnt*cr.rate)||'р.)' as tname, SUM(price*qnt*cr.rate) data
      FROM `cashes` c, currency cr
      WHERE c.visible = 1 AND c.bd_id = ?
      AND c.cur_id = cr.id
      AND c.date BETWEEN ? AND ?
      group by c.type order by c.type ";

     return $this->db->select($sql,1, $from, $to);
  }

  public function getDynamic($from, $to) {
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
			  SUM(CASE WHEN c1.type = 0 THEN -1 ELSE 1 END  *c1.price*c1.qnt*cr1.rate)
		  FROM
			  `cashes` c1, currency cr1
		  WHERE
			  c1.visible = c.visible AND c1.bd_id = c.bd_id
			  AND cr1.id = c1.cur_id
			  AND c1.date BETWEEN ? AND c.date
	      ),0) as dif_data
      FROM
	      `cashes` c, currency cr
      WHERE
	      c.visible = 1 AND c.bd_id = ?
	      AND cr.id = c.cur_id
	      AND c.date BETWEEN ? AND ?
      GROUP BY c.date
      ORDER BY c.date";

      return $this->db->select($sql, $from, 1, $from, $to);
  }

  public function getGroups($from, $to, $in = 0) {
    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");

    $sql =
    "SELECT g.name|| ' ('||SUM(c.price*c.qnt*cr.rate)||'р.)' as tname,
	SUM( c.price * c.qnt * cr.rate ) out_amount
    FROM `cashes` c, cashes_group g, currency cr
    WHERE
    c.visible = 1 AND c.bd_id = ? AND c.type = ?
    AND g.id = c.`group`
    AND c.cur_id = cr.id
    AND c.date BETWEEN ? AND ?
    group by g.name
    order by out_amount DESC";

    return $this->db->select($sql, 1, intval($in), $from, $to);
  }

  public function getOrgs($from, $to) {
    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");

    $sql =
    "SELECT o.name|| ' ('||SUM(c.price*c.qnt*cr.rate)||'р.)' as tname,
	SUM( c.price * c.qnt * cr.rate ) out_amount
    FROM `cashes` c, cashes_org o, currency cr
    WHERE
    c.visible = 1 AND c.bd_id = ? AND c.type = 0
    AND o.id = c.org_id
    AND c.cur_id = cr.id
    AND c.date BETWEEN ? AND ?
    group by o.name
    order by out_amount DESC";

    return $this->db->select($sql, 1, $from, $to);
  }

  public function getPurs($from, $to, $in = 0) {
    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");

    $sql =
    "SELECT t.name|| ' ('||SUM(c.price*c.qnt*cr.rate)||'р.)' as tname,
	SUM( c.price * c.qnt * cr.rate ) out_amount
    FROM `cashes` c, cashes_type t, currency cr
    WHERE
    c.visible = 1 AND c.bd_id = ? AND c.type = ?
    AND t.id = c.cash_type_id
    AND c.cur_id = cr.id
    AND c.date BETWEEN ? AND ?
    group by t.name
    order by out_amount";

    return $this->db->select($sql, 1, intval($in), $from, $to);
  }

  public function getStorage() {
    $sql =
    "SELECT 'Достигнуто ' || SUM( CASE WHEN c.type = 1 THEN 1 ELSE -1 END * c.price * c.qnt * cr.rate ) ||'р.' as tname, SUM( CASE WHEN c.type = 1 THEN 1 ELSE -1 END * c.price * c.qnt * cr.rate ) out_amount
    FROM `cashes` c, currency cr
    WHERE
    c.visible =1 AND c.bd_id = ?
    AND c.cur_id = cr.id ";
    $r = $this->db->select($sql, 1);

    $r[1]['out_amount'] = 500000 - $r[0]['out_amount'];
    $r[1]['tname'] = 'Осталось '.$r[1]['out_amount']."р.";

    return $r;
  }

  public function getMothDyn($from, $to) {
    if(empty($from)) $from = date("Y-01-01");
    if(empty($to)) $to = date("Y-m-d");

    $sql =
    "SELECT
	    strftime('%Y-%m', c.date) as tname,
	    IFNULL(SUM( CASE WHEN c.type = 1 THEN c.price * c.qnt * cr.rate END ),0) in_amount,
	    IFNULL(SUM( CASE WHEN c.type = 0 THEN  c.price * c.qnt * cr.rate END ),0) out_amount
    FROM `cashes` c, currency cr
    WHERE
	    c.visible = 1 AND c.bd_id = ?
	    AND c.cur_id = cr.id
	    AND c.date BETWEEN ? AND  ?
    GROUP BY  strftime('%Y-%m', c.date)
    ORDER BY tname";

    return $this->db->select($sql, 1, $from, $to);
  }

  public function getCurAmount($from, $to, $in = 0) {
    if(empty($from)) $from = date("Y-m-01");
    if(empty($to)) $to = date("Y-m-d");

    $sql =
    "SELECT
	    cr.name||', '||SUM( c.price * c.qnt * cr.rate )||'р.' as tname,
	    SUM( c.price * c.qnt * cr.rate ) amount
    FROM `cashes` c, currency cr
    WHERE
	c.visible =1 AND c.bd_id = ? AND c.type = ?
	AND c.cur_id = cr.id
	AND c.date BETWEEN ? AND ?
    GROUP BY cr.name";

    return $this->db->select($sql, 1, $in, $from, $to);
  }
}
?>

