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
    $.getJSON(url, function (data){
        var pages = data.pages;
        if(data.current == 1){
            var current = 1;
            var firstDisabled = 'disabled';
        }else{
            var current = (100 * (data.current - 1 ) +1);
        }
        if(data.last == false){
            var entryEnd = data.current * 100;
        }
        if(data.last){
            var entryEnd = data.num;
            var lastDisabled = 'disabled';
        }
        var paginateString = '<div class="all page-info">' + current + ' - ' + entryEnd + ' of '+ data.num +' entries</div>';
        var pagesArr = [];
        $.each(pages, function(key,value){
            if(value['current'] == true){
                var current = 'current';
            }else {
                var current = '';
            }
            pagesArr.push('<div class="paginate-empty">'+ value['empty'] +'</div><div class="paginate-link '+ current +'">' +
                '<span class="page page-'+ value['num'] +' " data-num="'+value['num']+'" data-url='+ value['url'] +'>' + value['num'] +'</span>' +
                '</div>');
        });
        $('#pagination').empty();
        $('#pagination').append('<div class="page-link prev-page '+ firstDisabled +'" title="Previous Page"></div>')
        $('#pagination').append(pagesArr);
        $('#pagination').append('<div class="page-link next-page '+ lastDisabled +'" title="Next Page"></div>');
        $('#pagination').append(paginateString);
        if(data.current == 1){
            $('#pagination .prev-page').addClass('disabled');
        }
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
    $('#pagination').click(function (e){
        e.preventDefault();
        let target = $(e.target);
        if(target.is('.next-page')){
            var numObj = $('#pagination .current .page').get(0);
            var num = $(numObj).data('num');
            var urlObj = $('#pagination .page-'+ (num + 1 )).get(0);
            var url = $(urlObj).data('url');
            window.location.href = url;
        }
        if(target.is('.prev-page')){
            var numObj = $('#pagination .current .page').get(0);
            var num = $(numObj).data('num');
            var urlObj = $('#pagination .page-'+ (num - 1 )).get(0);
            var url = $(urlObj).data('url');
            window.location.href = url;
        }
    });
    $('#pagination').click(function (e){
        e.preventDefault();
        let target = $(e.target);
        if (target.is('.page')){
            var ajax = $(this).data('ajax');
            if(ajax == 0){
                var url = $(target).data('url');
                window.location.href = url;
            }
            if(ajax == 1) {
                var init = Craft.BaseElementIndexView;
                console.log(init);
            }
        }
    });