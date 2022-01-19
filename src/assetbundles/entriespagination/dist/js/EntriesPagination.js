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
/* set url without page reload */
function setLocation(curLoc){
    try {
        history.pushState(null, null, curLoc);
        return;
    } catch(e) {}
    location.hash = '#' + curLoc;
}
/* render pagination when switch pages by ajax */
function getPagination(url,order,sort){
    var sel = $('#sidebar li .sel');
    var sortData =$(sel).data('default-sort').split(':');
    var orderDefault = sortData[0];
    var sortDefault = sortData[1];
    var sort = sort == undefined ? sortDefault: sort;
    var order = order == undefined ? orderDefault: order;
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
                '<span class="page page-'+ value['num'] +' " data-num="'+value['num']+'" data-url='+ value['url'] +' data-order='+ order +' data-sort="'+ sort +'">' + value['num'] +'</span>' +
                '</div>');
        });
        // render pagination
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
function getEntries(num,count,source,location,order,sort){
    // console.log('num:' + num + ' count:' + count + ' source:'
    //     + source + ' location: ' + location + ' order: ' + order +  ' sort:' + sort );

    //standart orderable field
    var sel = $('#sidebar li .sel');
    var sortData =$(sel).data('default-sort').split(':');
    var orderDefault = sortData[0];
    var sortDefault = sortData[1];
    let orderable = ['title', 'slug','dateCreated','dateUpdated','uri','postDate','expiryDate','id'];
    var order = order == undefined ? orderDefault : order;
    //get custom orderable fields from section data-attribute
    var orderData = $('#sidebar ul li .sel').data('sort-options');
    if(orderable.includes(order)|| orderData.includes(order)){
        var order = order;
    }else{
        var order = orderDefault;
    }
    var sort = sort == undefined ?  sortDefault : sort;
    var offset = num * count - 100;
    var response = {
        "context": "index",
        "elementType": "craft\\elements\\Entry",
        "source": source,
        "criteria": {
            "siteId": 1,
            "search": null,
            "offset": offset,
            "limit": count,
            "drafts": null,
            "savedDraftsOnly": true,
            "draftOf": false,
            "status": null
        },
        "disabledElementIds": [],
        "viewState": {
            "mode": "table",
            "order": order,
            "sort": sort
        },
        "paginated": 1
    }
    // get entries by ajax
    $.ajax({
        type: 'post',
        url: '/admin/actions/element-indexes/get-elements',
        dataType: 'json',
        data: JSON.stringify(response),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (data){
            var success = true;
            var handle = $('#sidebar ul li .sel').data('key');
            // update entries from ajax
            $('.elements').empty();
            $('.elements').append(data.html);
            var url = '/admin/pagination-ajax/' + handle + '/' + num ;
            setLocation(location);
            // update sort and order classes
            var th = $('.main .elements .tableview thead tr th');
            var orderData = $('#sidebar ul li .sel').data('sort-options');
            let orderData1 = [];
            Object.entries(orderData).forEach(function ( item,i,orderData){
                item.forEach(function (item2, i2, item){
                    orderData1[i]  = item2[1];
                });
            });
            Object.entries(th).forEach(function (item,i,th){
                var orderableItem = $($(item).get(1)).data('attribute');
                if(orderable.includes(orderableItem) || orderData1.includes(orderableItem)){
                    if(orderableItem.includes(order) || orderData1.includes(orderableItem)){
                        var orderItem = $($(item).get(1)).get(0);
                        $(orderItem).removeClass('orderable');
                        $(orderItem).addClass('ordered ' + sort);
                    }else{
                        $($(item).get(1)).addClass('orderable');
                    }

                }
            });
            getPagination(url,order,sort);
        }
    });

}

function getMoreEntries(num,count,source,location,order,sort){
    // console.log('num:' + num + ' count:' + count + ' source:'
    //     + source + ' location: ' + location + ' order: ' + order +  ' sort:' + sort );

    //standart orderable field
    var sel = $('#sidebar li .sel');
    var sortData =$(sel).data('default-sort').split(':');
    var orderDefault = sortData[0];
    var sortDefault = sortData[1];
    let orderable = ['title', 'slug','dateCreated','dateUpdated','uri','postDate','expiryDate','id'];
    var order = order == undefined ? orderDefault : order;
    //get custom orderable fields from section data-attribute
    var orderData = $('#sidebar ul li .sel').data('sort-options');
    if(orderable.includes(order)|| orderData.includes(order)){
        var order = order;
    }else{
        var order = orderDefault;
    }
    var sort = sort == undefined ?  sortDefault : sort;
    var offset = num * count - 100;
    var response = {
        "context": null,
        "elementType": "craft\\elements\\Entry",
        "source": source,
        "criteria": {
            "siteId": 1,
            "search": null,
            "offset": offset,
            "limit": count,
            "drafts": null,
            "savedDraftsOnly": true,
            "draftOf": false,
            "status": null
        },
        "disabledElementIds": [],
        "viewState": {
            "mode": null,
            "order": order,
            "sort": sort
        },
        "paginated": 1
    }
    // get entries by ajax
    $.ajax({
        type: 'post',
        url: '/admin/actions/element-indexes/get-more-elements',
        dataType: 'json',
        data: JSON.stringify(response),
        contentType: "application/json; charset=utf-8",
        traditional: true,
        success: function (data){
            var success = true;
            var handle = $('#sidebar ul li .sel').data('key');
            // update entries from ajax
            $('.elements').empty();
            $('.elements').append(data.html);
            var url = '/admin/pagination-ajax/' + handle + '/' + num ;
            setLocation(location);
            // update sort and order classes
            var th = $('.main .elements .tableview thead tr th');
            var orderData = $('#sidebar ul li .sel').data('sort-options');
            let orderData1 = [];
            Object.entries(orderData).forEach(function ( item,i,orderData){
                item.forEach(function (item2, i2, item){
                    orderData1[i]  = item2[1];
                });
            });
            Object.entries(th).forEach(function (item,i,th){
                var orderableItem = $($(item).get(1)).data('attribute');
                if(orderable.includes(orderableItem) || orderData1.includes(orderableItem)){
                    if(orderableItem.includes(order) || orderData1.includes(orderableItem)){
                        var orderItem = $($(item).get(1)).get(0);
                        $(orderItem).removeClass('orderable');
                        $(orderItem).addClass('ordered ' + sort);
                    }else{
                        $($(item).get(1)).addClass('orderable');
                    }

                }
            });
            getPagination(url,order,sort);
        }
    });

}

//click on section in sidebar
$('#sidebar a').click(function(){
    var handle = $(this).data('key');
    var key = $(this).data('key');
    if(handle == undefined){
        var ajaxUrl = '';
        ajaxUrl = '/admin/pagination-ajax/' + key+ '/1';
        getPagination(ajaxUrl);
    }else{
        var ajaxUrl = '';
        ajaxUrl = '/admin/pagination-ajax/' + handle + '/1';
        getPagination(ajaxUrl);
    }
});

//click on pagination or click on sort options
$('#main').click(function (e){
    let target = $(e.target);
    if(target.is('.elements .tableview thead tr th')){
        var th = $(target).get(0);
        var order = $(th).data('attribute');
        var sort = $(th).attr('class');
        var orderData = $('#sidebar ul li .sel').data('sort-options');
        let orderData1 = [];
        Object.entries(orderData).forEach(function ( item,i,orderData){
            item.forEach(function (item2, i2, item){
                orderData1[i]  = item2[1];
            });
        });
        let orderable = ['title', 'slug','dateCreated','dateUpdated','uri','postDate','expiryDate','id'];
        if(orderable.includes(order) || orderData1.includes(order)){
            if(sort.includes('asc')){
                var sort = 'desc';
            }else{
                if(sort.includes('desc')){
                    var sort = 'asc';
                }else{
                    var sort = undefined;
                }
            }
            var source = $('#sidebar ul li .sel').data('key');
            var url = $('#pagination .page-1').data('url');
            getEntries(1, 100, source, url, order, sort);
        }
    }
    else if(target.is('#pagination .paginate-link .page')){
        // get plugin ajax option
        var ajax = $('#pagination').data('ajax');
        if(ajax == 0){
            var url = $(target).data('url');
            window.location.href = url;
        }
        if(ajax == 1) {
            var num = target.data('num');
            var source = $('#sidebar ul li .sel').data('key');
            var url = $(target).data('url');
            var order = $('.elements .tableview thead tr th.ordered').data('attribute');
            var sort = $('.elements .tableview thead tr th.ordered').attr('class');
            if (sort != undefined){
                var sort = sort.split(' ')[1];
            }
            getEntries(num, 100,source,url,order,sort);
        }
    }
    else if(target.is('#pagination .next-page')){
        var numObj = $('#pagination .current .page').get(0);
        var num = $(numObj).data('num');
        var urlObj = $('#pagination .page-'+ (num + 1 )).get(0);
        var url = $(urlObj).data('url');
        if(ajax == 1){
            var source = $('#sidebar ul li .sel').data('key');
            var order = $('.elements .tableview thead tr th.ordered').data('attribute');
            var sort = $('.elements .tableview thead tr th.ordered').attr('class').split(' ');
            // getEntries(num + 1, 100,source,url,order,sort[1]);
        }else{
            window.location.href = url;
        }
    }
    else if(target.is('#pagination .prev-page')){
        var numObj = $('#pagination .current .page').get(0);
        var num = $(numObj).data('num');
        var urlObj = $('#pagination .page-'+ (num - 1 )).get(0);
        var url = $(urlObj).data('url');
        if(ajax == 1){
            var source = $('#sidebar ul li .sel').data('key');
            var order = $('.elements .tableview thead tr th.ordered').data('attribute');
            var sort = $('.elements .tableview thead tr th.ordered').attr('class').split(' ');
            getEntries(num + 1, 100,source,url,order,sort[1]);
        }else{
            window.location.href = url;
        }
    }
});

// window.addEventListener('scroll', function() {
//     const windowHeight = window.innerHeight
//     const getBounds = (el) => el.getBoundingClientRect()
//     let element = document.querySelector("#footer")
//     if (getBounds(element).top < windowHeight + 300) {
//         console.log('scroll');
//     }
// })
document.addEventListener("DOMContentLoaded", function() {
    const getBounds = (el) => el.getBoundingClientRect()
    const windowHeight = window.innerHeight
    var element = document.querySelector('#footer')
    const observer = () => {
        if (getBounds(element).top < windowHeight + 300) {
            var source = $('#sidebar ul li .sel').data('key');
            // var url = $(target).data('url');
            var order = $('.elements .tableview thead tr th.ordered').data('attribute');
            var sort = $('.elements .tableview thead tr th.ordered').attr('class');
            if (sort != undefined){
                var sort = sort.split(' ')[1];
            }
            getMoreEntries(2,100,source,'/admin/entries/p2',order, sort);
            window.removeEventListener('scroll', observer)
        }
    }
    window.addEventListener('scroll', observer)
});

// //on type search query
// $('.search').on('input',function (){
//     var value = $('input').val();
//     console.log(value);
//    // getPagination();
// });
