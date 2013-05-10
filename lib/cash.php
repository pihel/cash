<?
/*добавить везде проверку пользователя */

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

  public function getItem($id) {
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
      c.id = ?
      AND c.uid = ?";

     return $this->db->line($sql, $id, 1);
  }

  public function nmcl_list() {
    $sql =
    "SELECT
	DISTINCT cn.id, cn.name
      FROM
	cashes c, cashes_nom cn
      WHERE
	cn.id = c.nmcl_id
	AND c.uid = ?
      GROUP BY
	cn.id, cn.name
      ORDER BY
	COUNT(1) DESC, cn.id";
    return $this->db->select($sql, 1);
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
	    c1.nmcl_id = c.nmcl_id
	    AND co.id = c1.org_id
	    AND c1.uid = ?
	  GROUP BY co.name
	  ORDER BY count(1) DESC
	  limit 1
	) as org
      FROM
	cashes c, cashes_nom cn
      WHERE
	cn.id = c.nmcl_id
	AND c.uid = ?
	AND UPPER( co.name ) LIKE UPPER(%?%)
      GROUP BY
	cn.name
      ORDER BY
	COUNT(1) DESC, LENGTH(cn.name)";
    return $this->db->select($sql, 1, 1, $name);
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
      AND c.uid = ?
    GROUP BY
      co.id, co.name
    ORDER BY
      COUNT( 1 )  DESC, co.id";
    return $this->db->select($sql, 1);
  }

  public function del($id) {
    $this->db->start_tran();
    $this->db->exec("UPDATE cashes SET visible = 0 WHERE id = ? AND uid = ?", $id, 1 );
    $this->db->commit();
  }

  public function add($data) {
    $ret = array('success'=>true, 'msg'=>1);
    //$ret = array('failure'=>true, 'msg'=>2);
    return $ret;

    /*$this->db->start_tran();

    $file = '';
    if(is_array($_FILES)) {
    if(move_uploaded_file($_FILES['tmp_name'], $_SERVER['DOCUMENT_ROOT'].'/files/'.$_FILES['name'])) {
      $file = '/files/'.$_FILES['name'];
    }
    }

    $data['org'] = mysql_real_escape_string($data['org']);
    $data['nom'] = mysql_real_escape_string($data['nom']);
    $nmcl = $data['nom'];
    $org = $data['org'];

    //определим номенклатуру
    $nmcl = select(sprintf("SELECT MAX(id) id from cashes_nom WHERE name = '%s' limit 1", $data['nom']));
    $nmcl = intval($nmcl[0]['id']);
    if($nmcl == 0) {
      query(sprintf("INSERT INTO cashes_nom(name) VALUES('%s')", $data['nom']) );
      $nmcl = mysql_insert_id();
    }

    //определим организацию
    $org = select(sprintf("SELECT MAX(id) id from cashes_org WHERE name = '%s' limit 1", $data['org']));
    $org = intval($org[0]['id']);
    if($org == 0) {
      query(sprintf("INSERT INTO cashes_org(name) VALUES('%s')", $data['org']) );
      $org = mysql_insert_id();
    }

    $sql = sprintf("INSERT INTO `cashes`(nmcl_id, `group`, price, cash_type_id, qnt, date, org_id, uid, `file`, type ,note,cur_id)
		    VALUES(%u, %u, %s, %u, %u, '%s', '%s', %u, '%s', %u, '%s',%u)",
      $nmcl,
      (int)$data['group'],
      (double)str_replace(",", ".", $data['price']),
      (int)$data['cash_type'],
      (int)$data['qnt'],
      mysql_real_escape_string($data['datepick']." ".date("H:i:s")),
      $org,
      (int)$_SESSION['uid'],
      mysql_real_escape_string($file),
      (int)$data['type'],
      mysql_real_escape_string($data['note']),
      (int)$data['curr']
    );

    $this->db->commit();

    return query($sql);*/
  } //add
}
?>
