$(document).ready(function(){
    $('.article-link').click(function(){
        $('i.fa',this).removeClass('fa-square-o').addClass('fa-check-square-o');
        console.log('click');
    });
});