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
      WHERE c.visible = 1 AND c.uid = ?
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
			  c1.visible = c.visible AND c1.uid = c.uid
			  AND cr1.id = c1.cur_id
			  AND c1.date BETWEEN ? AND c.date
	      ),0) as dif_data
      FROM
	      `cashes` c, currency cr
      WHERE
	      c.visible = 1 AND c.uid = ?
	      AND cr.id = c.cur_id
	      AND c.date BETWEEN ? AND ?
      GROUP BY c.date
      ORDER BY c.date";

      return $this->db->select($sql, $from, 1, $from, $to);
  }
}
?>

