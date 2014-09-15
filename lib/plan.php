<?
/*
CREATE TABLE "cashes_group_plan" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "grp_id" INTEGER NOT NULL,
    "db_id" INTEGER NOT NULL,
    "usr_id" INTEGER NOT NULL,
    "plan" REAL
)

CREATE UNIQUE INDEX "XPK_CASHES_GROUP_PLAN" on cashes_group_plan (id ASC)
CREATE UNIQUE INDEX "XIF_CASHES_GROUP_PLAN_GDU" on cashes_group_plan (grp_id ASC, db_id ASC, usr_id ASC)
*/

class Plan {
  private $db;
  private $usr;
  private $lng;

  public function __construct($_db, $_usr, $_lng) {
    $this->db = $_db;
    $this->usr = $_usr;
    $this->lng = $_lng;
  }

  public function getList($uid = 0) {
    if(!$this->usr->canRead()) return array();

    $sql =
    "SELECT
	    cgp.id, cgp.db_id as db_id, cgp.usr_id as usr_id, cg.id as grp_id, cg.name, cgp.plan
    FROM
      cashes_group cg
    LEFT JOIN
      cashes_group_plan cgp
    ON( cgp.grp_id = cg.id
        AND cgp.db_id = ?
        AND ( cgp.usr_id = ? OR ? = 0 ) )";

    $this->db->escape_res = true;
    return $this->db->select($sql, $this->usr->db_id, $uid, $uid);
  }

  public function getAvgAmount($from, $to, $uid = 0) {
    if(!$this->usr->canRead()) return array();

    if( empty($from) ) $from = date("Y-m-01");
    if( empty($to) ) $to = date("Y-m-d");

    $sql =
    "SELECT
	    v.`group`, v.name,
	    IFNULL(ROUND( AVG(v.amount)),0) as avg_amount
    FROM
    (
	    select
		    c.`group`, cg.name,
		    SUM(c.qnt*c.price*cr.rate) as amount
	    FROM  cashes c
	    INNER JOIN  currency cr
		    ON( cr.id = c.cur_id)
	    INNER JOIN  cashes_group cg
		    ON( cg.id = c.`group`)
	    WHERE
		    c.type = 0
		    AND c.visible = 1
		    AND c.bd_id = ?
		    AND ( c.uid = ? OR ? = 0 )
		    AND c.`date` BETWEEN ? AND ?
	    GROUP BY
		    c.`group`, cg.name, strftime('%Y-%m', c.date)
    ) v
    GROUP BY
	    v.`group`, v.name";

    $this->db->escape_res = true;
    return $this->db->select($sql, $this->usr->db_id, $uid, $uid, $from, $to);
  }
  
  public function getSumAmount($from, $to, $uid = 0) {
    if(!$this->usr->canRead()) return array();

    if( empty($from) ) $from = date("Y-m-01");
    if( empty($to) ) $to = date("Y-m-d");

    $sql =
    "select
		    c.`group`, cg.name,
		    SUM(c.qnt*c.price*cr.rate) as amount
	    FROM  cashes c
	    INNER JOIN  currency cr
		    ON( cr.id = c.cur_id)
	    INNER JOIN  cashes_group cg
		    ON( cg.id = c.`group`)
	    WHERE
		    c.type = 0
		    AND c.visible = 1
		    AND c.bd_id = ?
		    AND ( c.uid = ? OR ? = 0 )
		    AND c.`date` BETWEEN ? AND ?
	    GROUP BY
		    c.`group`, cg.name";

    $this->db->escape_res = true;
    return $this->db->select($sql, $this->usr->db_id, $uid, $uid, $from, $to);
  }

  public function getAvgAmountPerPlan($from, $to) {
    if(!$this->usr->canRead()) return array();

    //можно заменить на FULL OUTER JOIN , когда будет реалзован в SQLITE

    //$amounts = $this->getAvgAmount($from, $to);
    $amounts = $this->getSumAmount($from, $to);
    $plans = $this->getList();
    $mb = months_between($from, $to);

    $ret = array();

    $sum_plan = 0;
    $sum_fact = 0;

    foreach($plans as $plan) {
      $sum = 0;
      foreach($amounts as $amount) {
        if($amount['group'] == $plan["grp_id"]) {
          $sum = $amount["amount"];
          break;
        }
      }

      if(floatval($plan["plan"]) == 0 && $sum == 0) continue;
      
      //months between
      $plan["plan"] = round( $plan["plan"] * $mb, 2);

      $sum_plan += floatval($plan["plan"]);
      $sum_fact += $sum;

      $ret[] = array('id' => $plan["grp_id"],
		     'tname' => $plan["name"],
		     'plan' => floatval($plan["plan"]),
		     'fact' => $sum);
    }

    $ret[] = array('id' => -1,
		   'tname' => "Итог",
		   'plan' => $sum_plan,
		   'fact' => $sum_fact);

    return $ret;
  }

  public function savePlan($data) {
    if(!$this->usr->canWrite()) return $this->lng->get(159);

    if(intval($data['grp_id']) < 1) return $this->lng->get(189);
    if(floatval($data['plan']) < 0) return $this->lng->get(190);
    $id = intval($data['id']);

    $this->db->start_tran();
    if($id == 0) {
      //insert

      $this->db->exec("INSERT INTO cashes_group_plan(id, grp_id, db_id, usr_id, plan)
		      VALUES(NULL, ?, ?, ?, ?)",
		      intval($data['grp_id']), $this->usr->db_id, $this->usr->id, floatval($data['plan']) );
      $id = $this->db->last_id();
    } else {
      //update
      $this->db->exec("UPDATE cashes_group_plan
		      SET plan = ?
		      WHERE id = ? ",
		      floatval($data['plan']), $id );
      $id = intval( $this->db->affect() );
    }

    $this->db->commit();
    return $id;
  }
}
?>
