/**
 * Entries Pagination plugin for Craft CMS
 *
 * Entries Pagination JS
 *
 * @author    Ye. Sokolov
 * @copyright Copyright (c) 2021 Ye. Sokolov
 * @link      http://site.url
 * @package   EntriesPagination
 * @since     1.0.0
 */
function getPagination(url){
    fetch(url,{method: 'get'}).then(function (response){
       return response.text(); 
    }).then(function (data){
        document.getElementById('pagination').innerHTML = data;
    }).catch(function (err){
        console.warn('Error:', err);
    });
}
// window.onload = function() {
//     var menu = document.getElementById('sidebar');
//     menu.onclick = function (){
//         setTimeout();
//         var ajaxUrl = '';
//         var section = getAllUrlParams(window.location.href);
//         ajaxUrl = '/admin/pagination-ajax/' + section;
//         getPagination(ajaxUrl);
//         console.log(ajaxUrl);
//     }
// }
    $('#sidebar a').click(function(){
        var handle = $(this).data('handle');
        var key = $(this).data('key');
        if(handle == undefined){
            var ajaxUrl = '';
            ajaxUrl = '/admin/pagination-ajax/' + key;
            getPagination(ajaxUrl);
        }else{
            var ajaxUrl = '';
            ajaxUrl = '/admin/pagination-ajax/' + handle;
            getPagination(ajaxUrl);
        }
    });