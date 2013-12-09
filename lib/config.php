<?
/* Путь до файла базы данных */
$sqlite_path = __DIR__."/../data/cash.sqlite";

/* Заголовок окна */
$site_name = 'Домашняя бухгалтерия';

/* Допустимое время бездействия */
$life_time = 1800;

/* Дополнительная строка вконец файла */ 
$add = '';

/* Путь до ExtJS */
$extjs = 'extjs';

/* Путь до статичных файлов */
$static = 'static';


if(strpos($_SERVER['HTTP_HOST'], 'localhost') === false) {
  $add = '<!-- Yandex.Metrika counter --><script type="text/javascript">(function (d, w, c) { (w[c] = w[c] || []).push(function() { try { w.yaCounter15673252 = new Ya.Metrika({id:15673252, accurateTrackBounce:true, trackHash:true, ut:"noindex"}); } catch(e) { } }); var n = d.getElementsByTagName("script")[0], s = d.createElement("script"), f = function () { n.parentNode.insertBefore(s, n); }; s.type = "text/javascript"; s.async = true; s.src = (d.location.protocol == "https:" ? "https:" : "http:") + "//mc.yandex.ru/metrika/watch.js"; if (w.opera == "[object Opera]") { d.addEventListener("DOMContentLoaded", f, false); } else { f(); } })(document, window, "yandex_metrika_callbacks");</script><noscript><div><img src="//mc.yandex.ru/watch/15673252?ut=noindex" style="position:absolute; left:-9999px;" alt="" /></div></noscript><!-- /Yandex.Metrika counter -->';
  
  $extjs = 'http://extjs-public.googlecode.com/svn/tags/extjs-4.2.1/release';
}
?>