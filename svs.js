(function($){
    
    
    
    $.fn.svsgallery = function(options){
        $.fn.svsgallery.gallery = this;
        var opt = $.extend({},$.fn.svsgallery.defaults,options);
        $.fn.svsgallery.mainW = $.fn.svsgallery.gallery.width();
        $.fn.svsgallery.parentTop = $.fn.svsgallery.gallery.offset().top;
        $.fn.svsgallery.init(opt);
        
    };
    
    $.fn.svsgallery.defaults = {
        outerpadding:10,
        margin:50,
        row: 5 
    };
    
    
    $.fn.svsgallery.gallery,
    $.fn.svsgallery.mainW,
    $.fn.svsgallery.parentTop,
    $.fn.svsgallery.imgs= [],
    $.fn.svsgallery.imgArr= [],
    $.fn.svsgallery.lastImages= [],
    $.fn.svsgallery.winW= $(window).width(),
    $.fn.svsgallery.winH=$(window).height(),
    $.fn.svsgallery.imgWidth,
    $.fn.svsgallery.count= 0,
    $.fn.svsgallery.topPosArr= [],
    $.fn.svsgallery.reachedLast= false,
    $.fn.svsgallery.numberToLoad= 0,
    $.fn.svsgallery.clickedImageNum;
    
    //init function
    $.fn.svsgallery.init = function(setting){
        
        $.fn.svsgallery.imgWidth = Math.round((($.fn.svsgallery.mainW)/setting.row)-(setting.margin/2));
        
        $.getJSON('photo.json', function (data) {
            $.each(data,function(index,item){
                $.fn.svsgallery.imgs.push(item);    
            });

            $.fn.svsgallery.setFigure(setting);

            $('.gallery').delegate('a','click',function(e) {
                e.preventDefault();
                id = $(this).attr("id");
                for(var j=0;j<$.fn.svsgallery.imgs.length;j++){
                    if(id == $.fn.svsgallery.imgs[j].id){
                        $.fn.svsgallery.clickedImageNum = j;
                    }
                }

               $.fn.svsgallery.showPop($(this).attr("href"),id);

                $closeBut = $("#lightBox").find(".closeBut");
                $closeBut.click(function(){
                   $("#lightBox").remove();
                    $('body').removeClass('stop-scrolling');
                });

                $nextBut = $("#lightBox").find(".nextarrow");
                $prevBut = $("#lightBox").find(".prevarrow");
                $nextBut.click(function(){
                    if($.fn.svsgallery.clickedImageNum < $.fn.svsgallery.count){
                        $.fn.svsgallery.clickedImageNum++; $.fn.svsgallery.showPop($.fn.svsgallery.imgs[$.fn.svsgallery.clickedImageNum].source,$.fn.svsgallery.imgs[$.fn.svsgallery.clickedImageNum].id);
                    }else{
                        $.fn.svsgallery.reachedLast = true;
                        $.fn.svsgallery.count++;
                        $.fn.svsgallery.addImage(setting);

                    }
                });
                $prevBut.click(function(){
                    if($.fn.svsgallery.clickedImageNum > 0){
                        $.fn.svsgallery.clickedImageNum--; $.fn.svsgallery.showPop($.fn.svsgallery.imgs[$.fn.svsgallery.clickedImageNum].source,$.fn.svsgallery.imgs[$.fn.svsgallery.clickedImageNum].id);
                    }
                });
            });
        });
        
        $(window).scroll(function() {
            if($(document).height()-$(window).height() == $(window).scrollTop()){
                $.fn.svsgallery.reachedLast = true;
                $.fn.svsgallery.count++;
                $.fn.svsgallery.addImage(setting);
            }
        });
    }
    // init function
    
    // setfigure function start
    $.fn.svsgallery.setFigure = function(settings){
        for(var i=0;i<settings.row;i++){
            var topVal = 0;
            $.fn.svsgallery.topPosArr.push(topVal);
        };
        $.fn.svsgallery.addImage(settings);
    };
    // set figure function ends
    
    // add image function start
    $.fn.svsgallery.addImage = function(settings){
            if($.fn.svsgallery.count < $.fn.svsgallery.imgs.length){
                $imgEle = $('<a href="'+$.fn.svsgallery.imgs[$.fn.svsgallery.count].source+'" id="'+$.fn.svsgallery.imgs[$.fn.svsgallery.count].id+'" class="lightBox_trigger" ><img src="'+$.fn.svsgallery.imgs[$.fn.svsgallery.count].source+'" style="width:'+$.fn.svsgallery.imgWidth+'px;"></a>').appendTo(".gallery");

                $figure = $imgEle.find("img");
                $.fn.svsgallery.imgArr.push($figure);

                /*image load function*/
                $figure.load(function(){
                       
                        if($.fn.svsgallery.count < settings.row){
                            $figure.css({
                                left:$.fn.svsgallery.count*($.fn.svsgallery.imgWidth+(settings.margin/2)),
                                top:0,
                                padding:settings.outerpadding
                            });
                            $.fn.svsgallery.topPosArr[$.fn.svsgallery.count] = $figure.outerHeight();
                            $.fn.svsgallery.lastImages.push($figure);
                        }else{
                            var smallestVal = Math.min.apply(Math,$.fn.svsgallery.topPosArr);
                            smallestVal += (settings.margin/2);
                            var leftVal,
                                revisedLeftVal,
                                rowNumber,
                                tempArr = [],
                                smallestValyefromTempArr;

                            tempArr.splice(0,tempArr.length);
                                
                            for(var i=0;i<$.fn.svsgallery.lastImages.length;i++){
                                var offset = $.fn.svsgallery.lastImages[i].offset();
                                var getHeight = offset.top+$.fn.svsgallery.lastImages[i].outerHeight()-$.fn.svsgallery.parentTop;
                                getHeight += (settings.margin/2);
                                if(smallestVal == getHeight){
                                   tempArr.push(i);
                                   rowNumber = Math.min.apply(Math,tempArr);
                                }
                            }

                            revisedLeftVal = $.fn.svsgallery.imgArr[rowNumber].offset().left-8;
                            
                            $figure.css({
                                left:revisedLeftVal,
                                top:smallestVal,
                                padding:settings.outerpadding
                            });

                            $.fn.svsgallery.topPosArr[rowNumber] = smallestVal+$figure.outerHeight();
                            $.fn.svsgallery.lastImages[rowNumber] = $figure;
                        }

                        if($.fn.svsgallery.reachedLast == false){
                            if(Math.max.apply(Math,$.fn.svsgallery.topPosArr) < $.fn.svsgallery.winH){
                                $.fn.svsgallery.count++;
                                $.fn.svsgallery.addImage(settings);
                            }
                        }else{
                            if($.fn.svsgallery.numberToLoad<10){
                                $.fn.svsgallery.count++;
                                $.fn.svsgallery.addImage(settings);
                                $.fn.svsgallery.numberToLoad++;
                            }else{
                                $.fn.svsgallery.reachedLast = false;
                                $.fn.svsgallery.numberToLoad = 0;
                            }
                        }

                });
            }
        };
    // add image function ends
    
    // popup function start
    $.fn.svsgallery.showPop = function(img,id){

        $('body').addClass('stop-scrolling');

        if($("#lightBox").length > 0){
            $("#lightBox .content").html('<img src="'+img+'"/>');
        }else{
            var lightBox = '<div id="lightBox"><div class="content"><img src="'+img+'"class="imglink" style="position:absolute;"/></div><img src="icons/close.png" class="closeBut"/><img src="icons/prevarrow.png" class="prevarrow"/><img src="icons/nextarrow.png" class="nextarrow"/></div>';
            $('body').append(lightBox);
        }

        $lbimg = $("#lightBox .content").find("img");
        $lbimg.load(function(){
            var leftPos = (($.fn.svsgallery.winW/2)-($(this).outerWidth()/2)),
                topPos = ($.fn.svsgallery.winH/2)-($(this).outerHeight()/2);
           $(this).css({
               left:leftPos, 
               top:topPos
           });
        });
    }
    // pop function ends here
    
    
})(jQuery);