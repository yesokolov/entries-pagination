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
    // fetch(url,{method: 'get'}).then(function (response){
    //    return response.text();
    // }).then(function (data){
    //     console.log(data);
    //     // document.getElementById('pagination').innerHTML = data;
    // }).catch(function (err){
    //     console.warn('Error:', err);
    // });
    // $.ajax({
    //     dataType:"json",
    //     url: url,
    //     data: data,
    //     success: success
    // });
    $.getJSON(url, function (data){
        var pages = data.pages;
        if(data.current == 1){
            var current = 1
        }else{
            var current = (100 * (data.current - 1 ) +1);
        }
        if(data.last == false){
            console.log(data.last);
            var entryEnd = data.current * 100;
        }else{
            var entryEnd = data.num;
        }
        var paginateString = '<div class="all">' + current + ' - ' + entryEnd + ' of '+ data.num +' entries</div>';
        var pagesArr = [];
        $.each(pages, function(key,value){
            if(value['current'] == true){
                var current = 'current';
            }else {
                var current = '';
            }
            pagesArr.push('<div class="paginate-link">' +
                '<span class="page '+ current +'" data-url='+ value['url'] +'>' + value['num'] +'</span>' +
                '</div>');
        });
        $('#pagination').empty();
        $('#pagination').append(pagesArr);
        $('#pagination').append(paginateString);
    });
}
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