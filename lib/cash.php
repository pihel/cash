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

  protected function add_refbook($name, $ref) {
    if(intval($name) > 0) return $name;

    $ref_id = 0;
    $ref_id = $this->db->element("SELECT MAX(id) id from ".$ref." WHERE name = ?", $name );
    $ref_id = intval($ref_id);

    if($ref_id == 0) {
      $this->db->exec("INSERT INTO ".$ref."(name) VALUES(?)",  $name);
      $ref_id = $this->db->last_id();
    }
    return intval( $ref_id );
  }

  public function add($data, $files) {
    $this->db->start_tran();

    /*
    BEGIN;
    INSERT INTO `cashes` (nmcl_id, `group`, price, cash_type_id, qnt, `date`, org_id, uid, `file`, `type` ,note, cur_id)
     VALUES(626, 2, 150, 1, 1, '2013-05-11', 4, 1, '', 0, 'test', 1);
   commit;
    */

    $file = '';
    /*if(is_array($_FILES)) {
    if(move_uploaded_file($_FILES['tmp_name'], $_SERVER['DOCUMENT_ROOT'].'/files/'.$_FILES['name'])) {
      $file = '/files/'.$_FILES['name'];
    }
    }*/

    $cash_item_date = $data['cash_item_date'];
    if(empty($cash_item_date)) 		{ $this->db->rollback(); return array('failure'=>true, 'msg'=> 'Заполните дату'); }

    $cash_item_nmcl_cb = $this->add_refbook($data["cash_item_nmcl_cb"], "cashes_nom");
    if($cash_item_nmcl_cb == 0) 	{ $this->db->rollback(); return array('failure'=>true, 'msg'=> 'Ошибка добавления товара'); }

    $cash_item_prod_type_cb = $this->add_refbook($data["cash_item_prod_type_cb"], "cashes_type");
    if($cash_item_prod_type_cb == 0) 	{ $this->db->rollback(); return array('failure'=>true, 'msg'=> 'Ошибка добавления группы товара'); }

    $cash_item_price = $data['cash_item_price'];
    if(empty($cash_item_price)) 	{ $this->db->rollback(); return array('failure'=>true, 'msg'=> 'Заполните цену'); }

    $cash_item_currency_cb = $this->add_refbook($data["cash_item_currency_cb"], "currency");
    if($cash_item_currency_cb == 0) 	{ $this->db->rollback(); return array('failure'=>true, 'msg'=> 'Ошибка добавления валюты'); }

    $cash_item_ctype_cb = $this->add_refbook($data["cash_item_ctype_cb"], "cashes_type");
    if($cash_item_ctype_cb == 0) 	{ $this->db->rollback(); return array('failure'=>true, 'msg'=> 'Ошибка добавления кошелька'); }

    $cash_item_qnt = $data['cash_item_qnt'];
    if(empty($cash_item_qnt)) 		{ $this->db->rollback(); return array('failure'=>true, 'msg'=> 'Заполните количество'); }

    $cash_item_org_cb = $this->add_refbook($data["cash_item_org_cb"], "cashes_org");
    if($cash_item_org_cb == 0) 		{ $this->db->rollback(); return array('failure'=>true, 'msg'=> 'Ошибка добавления организации'); }

    $cash_item_toper_cb = intval($data['cash_item_toper_cb']);
    if( !in_array($cash_item_toper_cb, array(0,1)) )	{ $this->db->rollback(); return array('failure'=>true, 'msg'=> 'Неверный тип операции'); }

    $cash_item_note = $data['cash_item_note'];

    $sql =
    "INSERT INTO `cashes` (nmcl_id, `group`, price, cash_type_id, qnt, `date`, org_id, uid, `file`, `type` ,note, cur_id)
     VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $this->db->exec($sql,
	$cash_item_nmcl_cb,
	$cash_item_prod_type_cb,
	$cash_item_price,
	$cash_item_ctype_cb,
	$cash_item_qnt,
	$cash_item_date,
	$cash_item_org_cb,
	1,
	$file,
	$cash_item_toper_cb,
	$cash_item_note,
	$cash_item_currency_cb
    );

    /*$this->db->exec("INSERT INTO `cashes` (nmcl_id, `group`, price, cash_type_id, qnt, `date`, org_id, uid, `file`, `type` ,note, cur_id)
     VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
	$data['cash_item_nmcl_cb'],
	$data['cash_item_prod_type_cb'],
	$data['cash_item_price'],
	$data['cash_item_ctype_cb'],
	$data['cash_item_qnt'],
	$data['cash_item_date'],
	$data['cash_item_org_cb'],
	1,
	'',
	$data['cash_item_toper_cb'],
	$data['cash_item_note'],
	$data['cash_item_currency_cb']
    );*/

    $id = intval( $this->db->last_id() );
    if($id == 0) { $this->db->rollback(); return array('failure'=>true, 'msg'=> 'Ошибка добавления операции'); }

    $this->db->commit();

    return array('success'=>true, 'msg'=> $id );
  } //add
}
?>
