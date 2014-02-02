<?
//exit; //закомментить, чтобы запустить
require_once("lib/init.php");

$db->start_tran();

//удалим лишнее
$db->exec("DELETE FROM cashes WHERE id IN(3272, 3322)");
$db->exec("UPDATE cashes SET uid = 2 WHERE uid = 3");
$db->exec("UPDATE cashes SET note = ''");
$db->exec("DELETE FROM users WHERE id = 3");

//скинем пароль
$db->exec("UPDATE users SET pasw = '".$usr->hash_pasw("admin")."', login = 'admin' WHERE id = 1");

//поменяем настройки
$db->exec("UPDATE cashes_setting SET value = 0 WHERE name = 'round'");
$db->exec("UPDATE cashes_setting SET value = 'http://extjs-public.googlecode.com/svn/tags/extjs-4.2.1/release' WHERE name = 'extjs'");
$db->exec("UPDATE cashes_setting SET value = 'Домашняя бухгалтерия (Демо)' WHERE name = 'site_name'");
$db->exec("UPDATE cashes_setting SET value = '" .'<!-- Yandex.Metrika counter --><script type="text/javascript">(function (d, w, c) { (w[c] = w[c] || []).push(function() { try { w.yaCounter23408101 = new Ya.Metrika({id:23408101, webvisor:true, clickmap:true, trackLinks:true, accurateTrackBounce:true, trackHash:true}); } catch(e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks");</script><noscript><div><img src="//mc.yandex.ru/watch/23408101" style="position:absolute; left:-9999px;" alt="" /></div></noscript><!-- /Yandex.Metrika counter -->' ."' WHERE name = 'add'");
$db->commit();

//проанализируем
$ch->analize();

echo "OK";
?>