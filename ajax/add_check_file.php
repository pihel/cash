<?
require_once("../lib/init.php");
require('../lib/external/XLSXReader.php');

//$loaded_file = trim( load_xlsx($_FILES['cash_check_file']) );
$loaded_file='../201907310.xlsx';

$ret_array = array();
$orgs_cache = array();
$orgs = getXLSXData($loaded_file) ;

foreach($orgs as $k=>$v) {
	if(!array_key_exists($v["org"], $orgs_cache)) {
		$orgs_cache[$v["org"]] = $ch->nmcl_param_byorg($v["org"]);
	}
	if(empty($orgs_cache[$v["org"]])) $orgs_cache[$v["org"]] = array("grp_id" => 1, "nmcl_id" => 0, "org_id" => 0, "nm_name" => "Покупка в ".$v["org"], "gr_name" => "Еда");
	$orgs[$k] = array_merge( $orgs[$k], $orgs_cache[$v["org"]] );
	
	//$ret_array[] = $orgs[$k];
	$ret_array[] = array($orgs[$k]['nmcl_id'], $orgs[$k]['nm_name'], $orgs[$k]['grp_id'], $orgs[$k]['gr_name'], $orgs[$k]['org_id'], $orgs[$k]['org'], $orgs[$k]['oper_date'], $orgs[$k]['amount']);
}

$ret = json_encode( array('success'=>true, 'data'=> $ret_array ) );
if(empty($orgs)) $ret = json_encode( array('failure'=>true, 'msg'=> $lng->get(197)) );

@unlink($loaded_file);

echo $ret;
?>