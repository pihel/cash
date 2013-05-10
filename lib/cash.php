<?
class Cash {
  private $db;
  private $usr;

  public function __construct($_db, $_usr) {
    $this->db = $_db;
    $this->usr = $_usr;
  }

  public function getList($from, $to) {
    $filter = "";

    if(empty($from)) $from = date("Y-m-d");
    if(empty($to)) $to = date("Y-m-d");

    $sql =
    " SELECT
      c.id, c.nmcl_id, cn.name as nom, c.`group`, cg.name gname, c.price, c.qnt, c.date as oper_date, c.date_edit,
      c.org_id, co.name as oname, c.type, c.note, c.file, c.uid, cr.rate, cr.sign, c.cash_type_id, ct.name as cash_type,
      CASE WHEN c.type = 0 THEN -1 ELSE 1 END * c.price * c.qnt * cr.rate as amount
     FROM cashes c
     INNER JOIN currency cr
      ON(c.cur_id = cr.id)
     INNER JOIN cashes_nom cn
      ON(c.nmcl_id = cn.id)
     INNER JOIN cashes_org co
      ON(c.org_id = co.id)
     INNER JOIN cashes_type ct
      ON(c.cash_type_id = ct.id)
     LEFT JOIN cashes_group cg
      ON(cg.id = c.`group`)
     WHERE
      c.date BETWEEN ? AND ?
      AND c.uid = ?
      AND c.visible = ?
      ". $filter ."
     ORDER BY
      c.date, c.date_edit";

     return $this->db->select($sql, $from, $to, 1, 1);
  }

  public function nmcl_list() {
    $sql =
    "SELECT
	DISTINCT cn.id, cn.name
      FROM
	cashes c, cashes_nom cn
      WHERE
	cn.id = c.nmcl_id
      GROUP BY
	cn.id, cn.name
      ORDER BY
	COUNT(1) DESC, cn.id";
    return $this->db->select($sql);
  }

  public function nmcl_param($name) {
    $sql =
    "SELECT
	cn.id, cn.name, MAX(c.`group`) grp,
	(
	  SELECT
	    co.id
	  FROM
	    cashes_org co, cashes c1
	  WHERE
	    c1.nmcl_id = c.nmcl_id AND co.id = c1.org_id
	  GROUP BY co.name
	  ORDER BY count(1) DESC
	  limit 1
	) as org
      FROM
	cashes c, cashes_nom cn
      WHERE
	cn.id = c.nmcl_id
	AND UPPER( co.name ) LIKE UPPER(%?%)
      GROUP BY
	cn.name
      ORDER BY
	COUNT(1) DESC, LENGTH(cn.name)";
    return $this->db->select($sql, $name);
  }

  public function prod_type_list() {
    $sql =
    "SELECT id,name FROM cashes_group";
    return $this->db->select($sql);
  }

  public function currency_list() {
    $sql =
    "SELECT id,name FROM currency";
    return $this->db->select($sql);
  }

  public function cashes_type_list() {
    $sql =
    "SELECT id,name FROM cashes_type";
    return $this->db->select($sql);
  }

  public function org_list() {
    $sql =
    "SELECT
      co.id, co.name
    FROM
      cashes c, cashes_org co
    WHERE
      co.id = c.org_id
    GROUP BY
      co.id, co.name
    ORDER BY
      COUNT( 1 )  DESC, co.id";
    return $this->db->select($sql);
  }
}
?>
