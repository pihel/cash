<?
require_once("../lib/init.php");

$data = array('cash_check_currency_cb'=>1, 'cash_check_ctype_cb'=>1, 'qnt'=>1, 'cash_check_geo'=>$_POST['cash_check_geo']);
$data['cash_check_grid_hdn'] = array();
$lines = json_decode( $_POST['cash_check_grid_hdn'] );
foreach($lines as $l) {
	$l =(array)$l;
	$data['cash_check_grid_hdn'][] = array('cash_check_date'=>substr($l['oper_date'],0,10), 'name'=>$l['nm_name'], 'gr_name'=>$l['gr_name'], 'price'=>$l['amount'], 'cash_check_org_cb'=>$l['org']);
}

$ret = "";
$ret = $ch->add_check($data);
echo json_encode( $ret );