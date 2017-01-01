CREATE TABLE `cashes` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT  NOT NULL,
    `nmcl_id` INT(10) NOT NULL,
    `group` INT(11) NOT NULL,
    `cash_type_id` INT(10) NOT NULL,
    `price` DECIMAL(10,2) NOT NULL,
    `cur_id` INT(10) NOT NULL DEFAULT 1,
    `qnt` INT(11) NOT NULL DEFAULT 1,
    `date` DATE NOT NULL,
    `org_id` INT(10) NOT NULL,
    `file` VARCHAR(250) NOT NULL,
    `bd_id` INT(10) NOT NULL DEFAULT 1,
    `uid` INT(10) NOT NULL DEFAULT 1,
    `type` TINYINT(4) NOT NULL DEFAULT 0,
    `note` TEXT NOT NULL,
    `date_edit` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `visible` TINYINT(4) NOT NULL DEFAULT 1, 
    `geo_pos` VARCHAR(64)
);

CREATE TABLE `cashes_goal` (
        `id` INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
        `nmcl_id` INTEGER NOT NULL,
        `db_id` INTEGER NOT NULL,
        `usr_id` INTEGER NOT NULL,
        `plan_date` DATE,
        `order_id` INTEGER,
        `plan` REAL,
        `qnt` REAL,
        `fact_date` DATE
    );

CREATE TABLE cashes_group (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `pid` INT(10) DEFAULT NULL
);

CREATE TABLE `cashes_group_plan` (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `grp_id` INTEGER NOT NULL,
    `db_id` INTEGER NOT NULL,
    `usr_id` INTEGER NOT NULL,
    `plan` REAL
);

CREATE TABLE cashes_nom (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(250) NOT NULL
);

CREATE TABLE cashes_org (
    `id` INTEGER PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `pid` INT(10) DEFAULT NULL,
    `name` VARCHAR(250) NOT NULL,
    `city` VARCHAR(250)
);

CREATE TABLE cashes_setting (
        `name` VARCHAR(50) PRIMARY KEY NOT NULL,
        `descr` VARCHAR(250),
        `value` VARCHAR(250));

CREATE TABLE cashes_type (
    `id` INTEGER  PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `pid` INTEGER DEFAULT NULL,
    `name` VARCHAR(250) NOT NULL
);

CREATE TABLE currency (
    `id` INTEGER  PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(250) NOT NULL,
    `rate` DECIMAL(10,2) NOT NULL,
    `sign` VARCHAR(4) NOT NULL,
    `short_name` VARCHAR(10) NOT NULL
);

CREATE TABLE db (
    `id` INTEGER  PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `name` VARCHAR(250) NOT NULL
);

CREATE TABLE users (
    `id` INTEGER  PRIMARY KEY AUTO_INCREMENT NOT NULL,
    `bd_id` INTEGER NOT NULL,
    `login` VARCHAR(250) NOT NULL,
    `pasw` VARCHAR(250) NOT NULL,
    `read` INTEGER,
    `write` INTEGER,
    `analiz` INTEGER,
    `setting` INTEGER,
    `oper_date` DATE
);

CREATE INDEX `XIF_CASHES_NMCL` on cashes (nmcl_id ASC);

CREATE INDEX `XIF_CASHES_GRP` on cashes (`group` ASC);

CREATE INDEX `XIF_CASHES_CTP` on cashes (cash_type_id ASC);

CREATE INDEX `XIF_CASHES_CUR` on cashes (cur_id ASC);

CREATE INDEX `XIF_CASHES_BD` on cashes (bd_id ASC);

CREATE INDEX `XIF_CASHES_USR` on cashes (uid ASC);

CREATE INDEX `XIF_CASHES_DBV` on cashes (bd_id ASC, visible ASC, date DESC);

CREATE UNIQUE INDEX `XPK_CASHES_ID` on cashes (id DESC);

CREATE UNIQUE INDEX `XPK_CASHES_GOAL` on cashes_goal (id ASC);

CREATE INDEX `XIF_CASHES_GOAL_DU` on cashes_goal (db_id ASC, usr_id ASC);

CREATE UNIQUE INDEX `XPK_CASHES_GROUP_ID` on cashes_group (id ASC);

CREATE UNIQUE INDEX `XPK_CASHES_GROUP_PLAN` on cashes_group_plan (id ASC);

CREATE UNIQUE INDEX `XIF_CASHES_GROUP_PLAN_GDU` on cashes_group_plan (grp_id ASC, db_id ASC, usr_id ASC);

CREATE UNIQUE INDEX `XPK_CASHES_NOM_ID` on cashes_nom (id ASC);

CREATE UNIQUE INDEX `XPK_CASHES_ORG_ID` on cashes_org (id ASC);

CREATE UNIQUE INDEX `XPK_CASHES_SETTING` on cashes_setting (name ASC);

CREATE UNIQUE INDEX `XPK_CASHES_TYPE_ID` on cashes_type (id ASC);

CREATE UNIQUE INDEX `XPK_CURRENCY_ID` on currency (id ASC);

CREATE UNIQUE INDEX `XPK_DB_ID` on db (id ASC);

CREATE INDEX `XIF_USERS_BD` on users (bd_id ASC);

CREATE UNIQUE INDEX `XPK_USERS_ID` on users (id ASC);
