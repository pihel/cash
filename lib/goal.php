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
    "qnt" REAL,
    "fact_date" DATE
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

  public function getList($uid = -1, $show_fact = 0) {
    if(!$this->usr->canRead()) return array();
    $show_fact = intval($show_fact);
    if($uid == -1) $uid = 0;
    
    $sql =
    "SELECT
	    cg.id, cg.db_id, cg.usr_id, u.login, cg.nmcl_id, cn.name as gname, cg.plan_date, cg.plan, cg.qnt, cg.order_id as iord, cg.fact_date
    FROM
      cashes_goal cg
    INNER JOIN
      cashes_nom cn
    ON( cn.id = cg.nmcl_id )
    INNER JOIN users u
      ON(u.id = cg.usr_id)
    WHERE 
      cg.db_id = ?
      AND ( cg.usr_id = ? OR ? = 0 ) 
      AND ( ( (cg.fact_date IS NULL OR cg.fact_date = '' ) AND ? = 0) OR ? = 1 )
    ORDER BY cg.order_id, cg.plan_date ";

    $this->db->escape_res = true;
    return $this->db->select($sql, $this->usr->db_id, $uid, $uid, $show_fact, $show_fact); 
  } //getList
  
  public function delGoal($id) {
    if(!$this->usr->canWrite()) return $this->lng->get(159);
    if(intval($id) < 1) return $this->lng->get(189);
    
    global $settings;
    if(intval($settings['secure_user']) == 1) {
      $uid = $this->db->element("SELECT usr_id from cashes_goal WHERE ID = ?", $id );
      if( intval($uid) != $this->usr->id ) {
        return $this->lng->get(159);
      }
    }
    
    $this->db->start_tran();
    $this->db->exec("DELETE FROM cashes_goal WHERE id = ? and db_id = ? ", $id, $this->usr->db_id );
    $id = intval( $this->db->affect() );
    $this->db->commit();
    return $id;
  } //delGoal
  
  public function finishGoal($id) {
    if(!$this->usr->canWrite()) return $this->lng->get(159);
    if(intval($id) < 1) return $this->lng->get(189);
    
    global $settings;
    if(intval($settings['secure_user']) == 1) {
      $uid = $this->db->element("SELECT usr_id from cashes_goal WHERE ID = ?", $id );
      if( intval($uid) != $this->usr->id ) {
        return $this->lng->get(159);
      }
    }
    
    $this->db->start_tran();
    $this->db->exec("UPDATE cashes_goal SET fact_date = date('now') WHERE id = ? and db_id = ? ", $id, $this->usr->db_id );
    $id = intval( $this->db->affect() );
    $this->db->commit();
    return $id;
  } //finishGoal
  
  public function saveGoal($data, &$_ch) {
    if(!$this->usr->canWrite()) return $this->lng->get(159);

    $id = intval($data['id']);

    $this->db->start_tran();
    
    $nid = $_ch->add_refbook($data["gname"], "cashes_nom");
    if( $nid == 0) { $this->db->rollback(); return  $this->lng->get(164); }
    $data['plan_date'] = str_replace("T00:00:00", "", $data['plan_date']);//???
    $data['fact_date'] = str_replace("T00:00:00", "", $data['fact_date']);//???
    
    if($id == 0) {
      //insert

      $this->db->exec("INSERT INTO cashes_goal(id, nmcl_id, db_id, usr_id, `plan_date`, plan, qnt, order_id, fact_date)
		      VALUES(NULL, ?, ?, ?, ?, ?, ?, ?, ?)",
		      $nid, $this->usr->db_id, $this->usr->id, $data['plan_date'], floatval($data['plan']), floatval($data['qnt']), intval($data['iord']), $data['fact_date'] );
      $id = $this->db->last_id();
    } else {
      global $settings;
      if(intval($settings['secure_user']) == 1) {
        $uid = $this->db->element("SELECT usr_id from cashes_goal WHERE ID = ?", $id );
        if( intval($uid) != $this->usr->id ) {
          return $this->lng->get(159);
        }
      }
      
      //update
      $this->db->exec("UPDATE cashes_goal
		      SET nmcl_id = ?, plan = ?, `plan_date` = ?, qnt = ?, order_id = ?, fact_date = ?
		      WHERE id = ? AND db_id = ? ",
		      $nid, floatval($data['plan']), $data['plan_date'], floatval($data['qnt']), intval($data['iord']), $data['fact_date'], $id, $this->usr->db_id );
      $id = intval( $this->db->affect() );
    }

    $this->db->commit();
    return $id;
  } //saveGoal
  
} //Goal