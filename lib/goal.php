<?php
/*
CREATE TABLE "cashes_goal" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "nmcl_id" INTEGER NOT NULL,
    "db_id" INTEGER NOT NULL,
    "usr_id" INTEGER NOT NULL,
    "plan_date" DATE,
    "order_id" INTEGER,
    "plan" REAL,
    "qnt" REAL
)
CREATE UNIQUE INDEX "XPK_CASHES_GOAL" on cashes_goal (id ASC)
CREATE INDEX "XIF_CASHES_GOAL_DU" on cashes_goal (db_id ASC, usr_id ASC)
*/

class Goal {
  private $db;
  private $usr;
  private $lng;

  public function __construct($_db, $_usr, $_lng) {
    $this->db = $_db;
    $this->usr = $_usr;
    $this->lng = $_lng;
  }

  public function getList($uid = -1) {
    if(!$this->usr->canRead()) return array();
    
    $sql =
    "SELECT
	    cg.id, cg.db_id, cg.usr_id, cg.nmcl_id, cn.name as gname, cg.plan_date, cg.plan, cg.qnt, cg.order_id as iord
    FROM
      cashes_goal cg
    INNER JOIN
      cashes_nom cn
    ON( cn.id = cg.nmcl_id )
    WHERE 
      cg.db_id = ?
      AND ( cg.usr_id = ? OR ? = 0 ) 
    ORDER BY cg.order_id, cg.plan_date ";

    $this->db->escape_res = true;
    if($uid == -1) $uid = 0;
    return $this->db->select($sql, $this->usr->db_id, $uid, $uid); 
  } //getList
  
  public function delGoal($id) {
    if(!$this->usr->canWrite()) return $this->lng->get(159);
    if(intval($id) < 1) return $this->lng->get(189);
    $this->db->start_tran();
    $this->db->exec("DELETE FROM cashes_goal WHERE id = ? ", $id );
    $id = intval( $this->db->affect() );
    $this->db->commit();
    return $id;
  } //delGoal
  
  public function saveGoal($data, &$_ch) {
    if(!$this->usr->canWrite()) return $this->lng->get(159);

    $id = intval($data['id']);

    $this->db->start_tran();
    
    $nid = $_ch->add_refbook($data["gname"], "cashes_nom");
    if( $nid == 0) { $this->db->rollback(); return  $this->lng->get(164); }
    $data['plan_date'] = str_replace("T00:00:00", "", $data['plan_date']);//???
    
    if($id == 0) {
      //insert

      $this->db->exec("INSERT INTO cashes_goal(id, nmcl_id, db_id, usr_id, `plan_date`, plan, qnt, order_id)
		      VALUES(NULL, ?, ?, ?, ?, ?, ?, ?)",
		      $nid, $this->usr->db_id, $this->usr->id, $data['plan_date'], floatval($data['plan']), floatval($data['qnt']), intval($data['iord']) );
      $id = $this->db->last_id();
    } else {
      //update
      $this->db->exec("UPDATE cashes_goal
		      SET nmcl_id = ?, plan = ?, `plan_date` = ?, qnt = ?, order_id = ?
		      WHERE id = ? ",
		      $nid, floatval($data['plan']), $data['plan_date'], floatval($data['qnt']), intval($data['iord']), $id );
      $id = intval( $this->db->affect() );
    }

    $this->db->commit();
    return $id;
  } //saveGoal
  
} //Goal