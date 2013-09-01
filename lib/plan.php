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

  public function __construct($_db, $_usr) {
    $this->db = $_db;
    $this->usr = $_usr;
  }

  public function getList() {
    if(!$this->usr->canRead()) return array();

    $sql =
    "SELECT
	    cgp.id, ? as db_id, ? as usr_id, cg.id as grp_id, cg.name, cgp.plan
    FROM  cashes_group cg
    LEFT JOIN  cashes_group_plan cgp
	    ON( cgp.grp_id = cg.id
		    AND cgp.db_id = ?
		    AND cgp.usr_id = ?)";

    return $this->db->select($sql, $this->usr->db_id, $this->usr->id, $this->usr->db_id, $this->usr->id);
  }
}
?>
