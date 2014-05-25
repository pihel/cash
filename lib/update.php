<?
class DbUpdate {
  private $db, $lng;
  
  function __construct($_db) {
    $this->db = $_db;
    $this->lng = $_lng;
  }

  public function exec($sql) {
    try {
      return $this->db->exec($sql);
    }
    catch(Exception $e) {
      return false;
    }
    return false;
  }
  
  public function createTables() {
   $this->exec(
      'CREATE TABLE db (
          "id" INTEGER  PRIMARY KEY NOT NULL,
          "name" VARCHAR(250) NOT NULL
      )');
    $this->exec(
      'CREATE TABLE currency (
          "id" INTEGER  PRIMARY KEY NOT NULL,
          "name" VARCHAR(250) NOT NULL,
          "rate" DECIMAL(10,2) NOT NULL,
          "sign" VARCHAR(4) NOT NULL,
          "short_name" VARCHAR(10) NOT NULL
      )');
    $this->exec(
      'CREATE TABLE cashes_type (
          "id" INTEGER  PRIMARY KEY NOT NULL,
          "pid" INTEGER DEFAULT (\'NULL\'),
          "name" VARCHAR(250) NOT NULL
      )');
    $this->exec(
      'CREATE TABLE cashes_setting (
        "name" VARCHAR(50) PRIMARY KEY NOT NULL,
        "descr" VARCHAR(250),
        "value" VARCHAR(250))');
    $this->exec(
      'CREATE TABLE users (
          "id" INTEGER  PRIMARY KEY NOT NULL,
          "bd_id" INTEGER NOT NULL,
          "login" VARCHAR(250) NOT NULL,
          "pasw" VARCHAR(250) NOT NULL,
          "read" INTEGER,
          "write" INTEGER,
          "analiz" INTEGER,
          "setting" INTEGER,
          "oper_date" DATE
      )');
    $this->exec(
      'CREATE TABLE cashes_org (
          "id" INTEGER PRIMARY KEY NOT NULL NOT NULL,
          "pid" INT(10) DEFAULT (\'NULL\'),
          "name" VARCHAR(250) NOT NULL,
          "city" VARCHAR(250)
      )');
    $this->exec(
      'CREATE TABLE cashes_nom (
          "id" INTEGER PRIMARY KEY NOT NULL,
          "name" VARCHAR(250) NOT NULL
      )');
    $this->exec(
      'CREATE TABLE "cashes_group_plan" (
          "id" INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
          "grp_id" INTEGER NOT NULL,
          "db_id" INTEGER NOT NULL,
          "usr_id" INTEGER NOT NULL,
          "plan" REAL
      )');
    $this->exec(
      'CREATE TABLE cashes_group (
          "id" INTEGER PRIMARY KEY NOT NULL,
          "name" VARCHAR(255) NOT NULL,
          "pid" INT(10) DEFAULT (\'NULL\')
      )');
    $this->exec(
      'CREATE TABLE "cashes" (
          "id" INTEGER PRIMARY KEY  NOT NULL,
          "nmcl_id" INT(10) NOT NULL,
          "group" INT(11) NOT NULL,
          "cash_type_id" INT(10) NOT NULL,
          "price" DECIMAL(10,2) NOT NULL,
          "cur_id" INT(10) NOT NULL DEFAULT (\'1\'),
          "qnt" INT(11) NOT NULL DEFAULT (\'1\'),
          "date" DATE NOT NULL,
          "org_id" INT(10) NOT NULL,
          "file" VARCHAR(250) NOT NULL,
          "bd_id" INT(10) NOT NULL DEFAULT (\'1\'),
          "uid" INT(10) NOT NULL DEFAULT (\'1\'),
          "type" TINYINT(4) NOT NULL DEFAULT (\'0\'),
          "note" TEXT NOT NULL,
          "date_edit" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "visible" TINYINT(4) NOT NULL DEFAULT (\'1\')
      )');
  } //createTables
  
  public function createIndexes() {
    $this->exec('CREATE INDEX "XIF_CASHES_BD" on cashes (bd_id ASC)');
    $this->exec('CREATE INDEX "XIF_CASHES_CTP" on cashes (cash_type_id ASC)');
    $this->exec('CREATE INDEX "XIF_CASHES_CUR" on cashes (cur_id ASC)');
    $this->exec('CREATE INDEX "XIF_CASHES_DBV" on cashes (bd_id ASC, visible ASC, date DESC)');
    $this->exec('CREATE UNIQUE INDEX "XIF_CASHES_GROUP_PLAN_GDU" on cashes_group_plan (grp_id ASC, db_id ASC, usr_id ASC)');
    $this->exec('CREATE INDEX "XIF_CASHES_GRP" on cashes (`group` ASC)');
    $this->exec('CREATE INDEX "XIF_CASHES_NMCL" on cashes (nmcl_id ASC)');
    $this->exec('CREATE INDEX "XIF_CASHES_USR" on cashes (uid ASC)');
    $this->exec('CREATE INDEX "XIF_USERS_BD" on users (bd_id ASC)');
    $this->exec('CREATE UNIQUE INDEX "XPK_CASHES_GROUP_ID" on cashes_group (id ASC)');
    $this->exec('CREATE UNIQUE INDEX "XPK_CASHES_GROUP_PLAN" on cashes_group_plan (id ASC)');
    $this->exec('CREATE UNIQUE INDEX "XPK_CASHES_ID" on cashes (id DESC)');
    $this->exec('CREATE UNIQUE INDEX "XPK_CASHES_NOM_ID" on cashes_nom (id ASC)');
    $this->exec('CREATE UNIQUE INDEX "XPK_CASHES_ORG_ID" on cashes_org (id ASC)');
    $this->exec('CREATE UNIQUE INDEX "XPK_CASHES_SETTING" on cashes_setting (name ASC)');
    $this->exec('CREATE UNIQUE INDEX "XPK_CASHES_TYPE_ID" on cashes_type (id ASC)');
    $this->exec('CREATE UNIQUE INDEX "XPK_CURRENCY_ID" on currency (id ASC)');
    $this->exec('CREATE UNIQUE INDEX "XPK_DB_ID" on db (id ASC)');
    $this->exec('CREATE UNIQUE INDEX "XPK_USERS_ID" on users (id ASC)'); 
  } //createIndexes
  
  public function createData() {
    $this->db->start_tran();
    
    $this->db->exec("INSERT INTO db(name) VALUES(?)", 'Main DB');
    $db_id = $this->db->last_id();
    
    $this->db->exec(
          "INSERT INTO `users` (id, bd_id, login, pasw, `read`, `write`, analiz, setting, oper_date)
		      VALUES( NULL, ?, ?, ?, ?, ?, ?, ?, datetime(CURRENT_TIMESTAMP, 'localtime') )", 
          $db_id , "admin", $this->usr->hash_pasw("admin"), 1, 1, 1, 1);
    $usr_id = $this->db->last_id();
    
    $this->db->exec("INSERT INTO cashes_type(name) VALUES(?)", "Наличные");
    $this->db->exec("INSERT INTO cashes_type(name) VALUES(?)", "Карточный счет");
    $this->db->exec("INSERT INTO cashes_type(name) VALUES(?)", "Электронные деньги");
    
    $this->db->exec("INSERT INTO cashes_setting(name, descr, value) VALUES(?, ?, ?)", "site_name",  "Имя бухгалтерии", "Домашняя бухгалтерия");
    $this->db->exec("INSERT INTO cashes_setting(name, descr, value) VALUES(?, ?, ?)", "mail",       "Почта для уведомлений", "");    
    
    $this->db->exec("INSERT INTO cashes_group(name) VALUES(?)", "Еда"); 
    $this->db->exec("INSERT INTO cashes_group(name) VALUES(?)", "Хозтовары");
    $this->db->exec("INSERT INTO cashes_group(name) VALUES(?)", "Прочее");
    
    $this->db->exec("INSERT INTO currency(name,rate,sign,short_name) VALUES(?,?,?,?)", "");
    
    $this->db->commit();
  } //createData
  
} //DbUpdate


class Update {
  private $db, $lng;

  private $file_path = "https://github.com/pihel/cash/archive/master.zip";

  function __construct($_db, $_lng) {
    $this->db = $_db;
    $this->lng = $_lng;
  }
  
}