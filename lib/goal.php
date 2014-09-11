<?php
/*
CREATE TABLE "cashes_goal" (
    "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    "nmcl_id" INTEGER NOT NULL,
    "db_id" INTEGER NOT NULL,
    "usr_id" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "plan" REAL
);
CREATE UNIQUE INDEX "XPK_CASHES_GOAL" on cashes_goal (id ASC);
CREATE UNIQUE INDEX "XIF_CASHES_GOAL_NDU" on cashes_goal (nmcl_id ASC, db_id ASC, usr_id ASC);
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

  public function getList($uid = 0) {
    if(!$this->usr->canRead()) return array();
    
    $sql =
    "SELECT
	    cg.id, cg.db_id, cg.usr_id, cg.nmcl_id, cn.name, cg.`date`, cg.plan
    FROM
      cashes_goal cg
    INNER JOIN
      cashes_nom cn
    ON( cn.id = cg.nmcl_id )
    WHERE 
      cg.db_id = ?
      AND ( cg.usr_id = ? OR ? = 0 ) ";

    $this->db->escape_res = true;
    return $this->db->select($sql, $this->usr->db_id, $uid, $uid); 
  } //getList
  
  public function saveGoal($data) {
    if(!$this->usr->canWrite()) return $this->lng->get(159);

    if(intval($data['nmcl_id']) < 1) return $this->lng->get(189);
    if(floatval($data['goal']) <= 0) return $this->lng->get(190);
    if(!empty($data['date'])) return $this->lng->get(190);
    $id = intval($data['id']);

    $this->db->start_tran();
    if($id == 0) {
      //insert

      $this->db->exec("INSERT INTO cashes_goal(id, nmcl_id, db_id, usr_id, `date`, plan)
		      VALUES(NULL, ?, ?, ?, ?, ?)",
		      intval($data['grp_id']), $this->usr->db_id, $this->usr->id, floatval($data['plan']) );
      $id = $this->db->last_id();
    } else {
      //update
      $this->db->exec("UPDATE cashes_goal
		      SET plan = ?, `date` = ?
		      WHERE id = ? ",
		      floatval($data['plan']), $data['date'], $id );
      $id = intval( $this->db->affect() );
    }

    $this->db->commit();
    return $id;
  } //saveGoal
  
} //Goal