// function for trimming words or limiter_word
function trim_words(theString, numWords) {
  expString = theString.split(/\s+/,numWords);
  theNewString=expString.join(" ");
  return theNewString;
}

// function for converting thousand to k (char)
function kFormatter(num) {
  return num > 999 ? (num/1000).toFixed(1) + 'k' : num
}


$(function(){

  var width_window = $(window).width();

  // initial Masonry style, use for display gallery
  var container = $('#masonry-container');
  container.imagesLoaded(function(){
    container.masonry({
      itemSelector: '.grid-masonry article',
      columnWidth: 30,
      isAnimated: !Modernizr.csstransitions,
      isFitWidth: true
    });
  });

  // function for calling ajax for getting detail Instagram User
  function callUserInstagram(){
    var ajax_url = base_url+'/insta/getUser';
    $.ajax({
      url: ajax_url,
      cache: false
    })
    .done(function( data ) {
      if(data.meta.code != 200 ) return;
      var user = data.data;
      $('.brand-image').attr('src',user.profile_picture);
      $('.intro').text('Hello, I am /'+user.full_name);
      $('.instagram-icon').attr('href', 'https://instagram.com/'+user.username);
      //console.log($('.author'));
      $('.author').text(user.full_name);
    }); 
  }

  // function for calling ajax for getting current Media of Instagram
  function callMediaInstagram(){
    $('.preloading').show();
    var ajax_url = ($('.next-max-id').text()) ? base_url+'/insta/getMedia?next_max_id='+$('.next-max-id').text() : base_url+'/insta/getMedia';
    $.ajax({
      url: ajax_url,
      cache: false
    })
    .done(function( data ) {
      if(data.meta.code != 200 ) $('.no-data').text('There is problem when Fetching Photo from Instagram, Please try again');
      //$('#masonry-container').masonry('reload');
      var media = data.data, pagination = data.pagination;
      var html = '', caption = '', full_caption = '', class_caption = 'show', share = '', image = '', love = '', gallery_info = '', i = 0;
      var display = ['hideout' , 'show'];
      for (;media[i];) {
        //console.log(media[i]);
        image = media[i].images.low_resolution.url;
        if(width_window >= 992)
          class_caption = ((media[i].caption === null) ? "hidden" :  display[Math.floor(Math.random()*display.length)]);
        caption = ((media[i].caption === null) ? " " :  trim_words(media[i].caption.text, 25)+ '..');
        full_caption = ((media[i].caption === null) ? " " :  media[i].caption.text);
        love = kFormatter(media[i].likes.count);
        //share = 'https://www.facebook.com/dialog/feed?app_id=1405547613083499&display=popup&caption='+encodeURI("Share My Instagram Photo")+'&description='+encodeURI("Share My Instagram Photo")+'&link='+encodeURIComponent(base_url+"/page/index/"+media[i].id)+'&picture='+media[i].images.standard_resolution.url+'&redirect_uri='+encodeURIComponent(base_url+"/page");
        share = 'https://www.facebook.com/dialog/feed?app_id=1405547613083499&display=popup&caption='+escape("Share My Instagram Photo")+'&description='+escape(full_caption)+'&link='+encodeURIComponent(base_url+"/page/index/"+media[i].id)+'&picture='+media[i].images.standard_resolution.url+'&redirect_uri='+encodeURIComponent(base_url+"/page");
        gallery_info = '<span class="detail-image">'+ image +'</span><span class="detail-caption">'+ full_caption +'</span><span class="detail-love">'+ love +'</span><span class="detail-facebook">'+ share +'</span>';

        html += '<article class="invisible"> <div class="gallery-wrapper">';
        html += '<img src="'+ image +'" class="gallery-main-image" />';
        html += '<div class="caption ' + class_caption + '" >';
        html += '<p>'+ caption +'</p>';
        html += '<div class="action"><a class="love-icon"><i>'+ love +'</i></a><a class="facebook-icon" alt="share to facebook" title="share to facebook" href="'+ share +'"></a><a class="pull-right detail-icon" alt="click for detail" title="click for detail"></a><div class="hidden gallery-info">'+ gallery_info +'</div></div>';
        html += '</div> </div></article>';
        i++;
      } 
      $('.insta-info .next-url').html('').html(pagination.next_url); 
      $('.insta-info .next-max-id').html('').html(pagination.next_max_id); 
      $('.preloading').hide();
      container.append(html).imagesLoaded(function(){
        container.masonry('reload');
        $('article.invisible').removeClass('invisible').addClass('visible');
      });
      $('.detail-icon').click(function(e){
        e.preventDefault();
        var gallery_info = $(this).parent();
        $('.gallery-detail-image').attr('src', '').attr('src', gallery_info.find('.detail-image').text());
        $('.gallery-detail-caption').text(gallery_info.find('.detail-caption').text());
        $('.gallery-modal .love-icon').html('<i>'+gallery_info.find('.detail-love').text()+'</i>');
        $('.gallery-modal .facebook-icon').attr('href', '').attr('href', gallery_info.find('.detail-facebook').text());
        $('.gallery-modal').modal();
        return false;
      });
      $('.scroll-top').show();
    }); 
  }

  // action load earlier button action as pagination to call next recent media 
  $('.load-more').click(function(e){
    e.preventDefault();
    callMediaInstagram();
    return false;
  });

  // action to scroll to top
  $('.scroll-top').click(function(){
    $("html, body").animate({
      scrollTop: 0
    }, 600);
    return false;
  });

  // function for calling detail photo of selected url from facebook share
  if($('.detail-id').text()){
    var media_id = $('.detail-id').text();
    var ajax_url = base_url+'/insta/getMediaDetail/'+media_id;
    $.ajax({
      url: ajax_url,
      cache: false
    })
    .done(function( data ) {
      if(data.meta.code != 200 ) return;
      var detail = data.data;
      var full_caption = ((detail.caption === null) ? " " :  detail.caption.text);
      var share = 'https://www.facebook.com/dialog/feed?app_id=1405547613083499&display=popup&caption='+escape("Share My Instagram Photo")+'&description='+escape(full_caption)+'&link='+encodeURIComponent(base_url+"/page/index/"+media_id)+'&picture='+detail.images.standard_resolution.url+'&redirect_uri='+encodeURIComponent(base_url+"/page");
      $('.gallery-detail-image').attr('src', '').attr('src', detail.images.standard_resolution.url);
      $('.gallery-detail-caption').text(detail.caption.text);
      $('.gallery-modal .love-icon').html('<i>'+kFormatter(detail.likes.count)+'</i>');
      $('.gallery-modal .facebook-icon').attr('href', '').attr('href', share);
      $('.gallery-modal').modal();
      
    });  
  }

  // function for initial run
  function init(){
    callUserInstagram();
    callMediaInstagram();
  }

  // action to init
  init();

});