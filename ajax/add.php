<?
require_once("../lib/init.php");
/*$_POST = array(
    'cash_item_date' => '2013-05-11',
    'cash_item_nmcl_cb' => "bla-bla-bla",
    'cash_item_prod_type_cb' => 11,
    'cash_item_price' => 34,
    'cash_item_currency_cb' => 1,
    'cash_item_ctype_cb' => 1,
    'cash_item_qnt' => 1,
    'cash_item_org_cb' => 168,
    'cash_item_toper_cb' => 0,
    'cash_item_note' => 'test'
);*/

$id = intval( $_POST['cash_item_edit_id'] );
$ret = "";
if($id > 0) {
  $ret = $ch->edit($_POST, $_FILES);
} else {
  $ret = $ch->add($_POST, $_FILES);
}
echo json_encode( $ret );