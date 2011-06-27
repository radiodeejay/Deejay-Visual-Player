/**
*
* Version: 	1.00
* Author:	Radio Deejay area web (http://www.deejay.it/D5/contest/humans.txt)
* Contact: 	webmaster@deejay.it
* Website:	http://www.radiodeejay.it
* Twitter:	@radiodeejay
*
* Copyright (c) 2011 Radio Deejay
* 
* Permission is hereby granted, free of charge, to any person
* obtaining a copy of this software and associated documentation
* files (the "Software"), to deal in the Software without
* restriction, including without limitation the rights to use,
* copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the
* Software is furnished to do so, subject to the following
* conditions:
* 
* The above copyright notice and this permission notice shall be
* included in all copies or substantial portions of the Software.
* 
* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
* EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES
* OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
* NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT
* HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
* WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
* FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
* OTHER DEALINGS IN THE SOFTWARE.
**/

//animation vars
var addDistance = 0;
var offsetLeft = null;
var offsetTop = null;
//logic vars
var photogalleryskunkanansieReady = false;
var photogallerytakethatReady = false;
var photogalleryduranduranReady = false;
var firstPage = true;
var fv = null;
var ival = null;
var audio = null;
var firstTimeHome = false;
var firstOnPage = false;
var firstTimeVideo = false;
var firstTimeLyrics = false;
var ForkOnStage = false;
var ForkOnStageArray = new Array;
//lyrics variables
var container;
var camera, scene, renderer, group, particle;
var mouseX = 0,
    mouseY = 0;
var currArtist = '';
var windowHalfX = window.innerWidth / 2;
var windowHalfY = window.innerHeight / 2;
//preloader
$('img,script').load(function () {

    // center preloader
    $('#preloader').height($(window).height());
    $(window).stop(false, true).resize(function () {
        $('#preloader').height($(window).height());
    });

});
$(document).ready(function () {
    //removeing preloader
    $('#preloader').fadeOut().remove();
    //resize content with window resize event
    $('#bgContent,#overlayTexture,#mainHeader,#fork,.photogallery,#video,#lyrics,#startImages div,#theEnd').height($(window).height());
    $(window).resize(function () {
        $('#bgContent,#overlayTexture,#mainHeader,#fork,.photogallery,#video,#lyrics,#startImages div,#theEnd').height($(window).height());
    })

    //init application
    //reading hash
    changingHash(location.hash)
    $(window).hashchange(function () {
        changingHash(location.hash);
    })
});

function changingHash(hash) {
    addDistance = 0;
    var nu_hash = hash.substring(1, hash.length);
    var splitHash = nu_hash.split('/');
    //get the artist 
    var artist = splitHash[0];
    //get the artist content to show by default
    var section = splitHash[1];

    //if hash is null i show menu items
    if (hash == '' || !hash || hash == '#') {
        firstPage = true
        //hide share link
        $('#shareLink:visible,#shareLink aside:visible').fadeOut();
        //stop and hideing photogallery video and lyrics
        stopPlayContent()

        //showing start image
        $('div#startImages').fadeIn();
        $('div#startImages div:visible').css({
            display: 'none'
        });
        //hiding the fork overlay
        $('#fork:visible').fadeOut(function () {
            $('#fork ul li').css({
                display: 'none',
                opacity: 0
            })
        });
        //hideing artist navigation
        $('#main section:visible').css({
            width: 0
        }).hide();
        //positioning logo
        $('#logo').delay(1000).animate({
            marginTop: ($(window).height() / 2) - 289,
            marginLeft: ($(window).width() / 2) - 30,
            opacity: 1
        }, 1000).dequeue();

        //showing navigation menu items
        $('#mainHeader').show();

        $('#mainHeader nav ul li').each(function () {
            offsetTop = ($(window).height() * 2) - Math.random() * (3 * $(window).height());
            offsetLeft = ($(window).width() * 2) - Math.random() * (3 * $(window).width());
            $(this).css({
                display: 'block',
                top: offsetTop,
                left: offsetLeft,
                opacity: 0
            }).stop(false, true).delay(1000).animate({
                opacity: 1,
                top: ($(window).height() / 2) - ($(this).height() / 2),
                left: (($(window).width() / 2) - 460) + addDistance
            }, {
                duration: 2000,
                easing: 'easeInOutCirc',
                complete: function () {
                    //set the mouse over event on menu items
                    $('#mainHeader nav ul li').hover(function () {
                        var linkItem = $(this).find('a').attr('href');
                        var PicIdToSohow = linkItem.split('/');
                        $(PicIdToSohow[0] + 'Img').fadeIn();
                    }, function () {
                        $('#startImages div').css({
                            display: 'none'
                        });
                    })
                }
            })
            addDistance = addDistance + $(this).width() + 10;

        })
        if (firstTimeHome == false) {
            // on window resize we need to reposition the menu items
            $(window).stop(false, true).resize(function () {
                addDistance = 0;
                $('#mainHeader nav ul li').each(function () {
                    offsetTop = ($(window).height() / 2) - ($(this).height() / 2);
                    offsetLeft = (($(window).width() / 2) - 460) + addDistance;
                    $(this).stop().animate({
                        opacity: 1,
                        top: offsetTop,
                        left: offsetLeft
                    }, {
                        duration: 2000,
                        easing: 'easeOutElastic',
                        queque: false
                    })
                    addDistance = addDistance + $(this).width() + 10;
                });
                // logo's animation that work only if we are on initial status of the app
                if (firstPage == true) {
                    $('#logo').stop().animate({
                        marginTop: ($(window).height() / 2) - 289,
                        marginLeft: ($(window).width() / 2) - 30,
                        opacity: 1
                    }, {
                        duration: 1000,
                        queque: false
                    })
                }
            })
            //if i click on menù items the menu will disappear
            $('#mainHeader nav ul li a').click(function () {
                $('#mainHeader').fadeOut('slow');
            });
        }
        firstTimeHome = true;
        //#main section
    } else {


        $('#logo:hidden').fadeIn();
        $('#shareLink:hidden').fadeIn();


        //show Share links
        $('#shareLink,#shareLink aside').fadeIn('slow');
        //hide all sections 
        $('#main section:not(#' + artist + ')').hide();
        firstPage = false;
        //hiding the fork overlay
        $('#fork:visible').fadeOut();
        //hiding the main menu
        $('#mainHeader').fadeOut('slow');
        //positioning logo
        $('#logo').stop(false, true).animate({
            marginTop: $(window).height() - 125,
            marginLeft: 30,
            opacity: 1
        }, {
            duration: 500,
            easing: 'easeInOutCirc',
            queque: false
        });
        //show artist's bottom menu 
        $('#' + artist).css({
            display: 'block',
            opacity: 0,
            marginTop: $(window).height() - 110,
        }).delay(500).animate({
            width: 680,
            opacity: 1
        }, {
            duration: 1000,
            easing: 'easeInOutCirc',
            queque: false
        });

        //set the position of the bottom menu on window resize
        $(window).stop(false, true).resize(function () {
            //hideing and showing shatre links
            if ($(this).width() < 960) {
                $('#shareLink:visible,#shareLink aside:visible').fadeOut();
            } else {
                $('#shareLink:hidden,#shareLink aside:hidden').fadeIn();
            }
            $('#' + artist).stop(false, true).animate({
                marginTop: $(window).height() - 110
            }, {
                duration: 500,
                easing: 'easeInOutCirc',
                queque: false
            });
            if (firstPage == false) {
                $('#logo').stop(false, true).animate({
                    marginTop: $(window).height() - 125,
                    marginLeft: 30,
                    opacity: 1
                }, {
                    duration: 500,
                    easing: 'easeInOutCirc',
                    queque: false
                })
            }
        })

        if (section) {
            switch (section) {
            case 'photogallery':
                stopPlayContent()
                //adding class Active to section on show
                $('#' + artist + ' nav ul li:eq(0)').addClass('active');
                //hideing starting bg images
                $('#startImages').fadeOut();
                showPhotogallery(artist, section);
                break;
            case 'video':
                stopPlayContent()
                //adding class Active to section on show
                $('#' + artist + ' nav ul li.videoLink').addClass('active');
                //hideing starting bg images
                $('#startImages').fadeOut();
                playVideo(artist, section)
                break;
            case 'lyrics':
                stopPlayContent()
                //adding class Active to section on show
                $('#' + artist + ' nav ul li.last').addClass('active');
                //hideing starting bg images
                $('#startImages').fadeOut();
                startLyrics(artist, section)
                break;
            }

        }
    }
}

function stopPlayContent() {
    $(window).unbind('resize.centerFork');
    $('#fork ul').css({
        display: 'none',
        opacity: 0
    });
    //removeing all active status to the section
    $('#main ul li').removeClass('active');
    //removeing photogallery from the stage and stopping image rotation
    if ($('.Gallerynav').length) {
        $('.Gallerynav').css({
            display: 'none'
        });
    }
    $('#bgContent section').fadeOut().each(function () {
        $(this).cycle('pause')
    })
    //removeing video elements from the stage
    if ($("#video .flareVideo").length) {
        fv.pause();
        fv.remove();
        //fv.unbind('onended');
        $(".videoControls").fadeOut().remove();
        $("#video").fadeOut();


    }
    //stop audio and removeing canvas
    if ($('canvas').length) {
        $('canvas').css({
            display: 'none'
        });
    }
    if ($('#audio').length) {
        clearInterval(ival);
        audio.pause();
        //removeing lyrics
        $('.srt').remove();
        $('#audio').remove();
        $('#lyrics').fadeOut();
    }
    if ($('#theEnd').length) {
        $('#theEnd').fadeOut();
    }

}

function showPhotogallery(artistID, sectionID) {
    $('.Gallerynav').css({
        display: 'block'
    });
    //showing photogallery of related artist
    $('#' + artistID + 'photogallery').css({
        display: 'block'
    }).animate({
        opacity: 1
    }, 1000);
    // if photogallery is alrready created i jump this step
    if (eval('photogallery' + artistID + 'Ready') == false) {
        $('#' + artistID + 'photogallery').cycle({
            fx: 'fade',
            speed: 'slow',
            timeout: 4000,
            pager: '#' + artistID + 'photogallerynav',
            slideExpr: 'li img',
            autostop: 1,
            slideResize: 0,
            height: $(window).height(),
            before: function () {
                eval('photogallery' + artistID + 'Ready=' + true);
            },

            after: function () {
                if ($('#' + artistID + 'photogallerynav li:last').hasClass('activeSlide')) {

                    eval('setTimeout("fork(\'' + artistID + '\',\'' + sectionID + '\')",2000)');
                }
            },
            pagerAnchorBuilder: function (idx, slide, artistID) {
                return '<li><a href="#' + artistID + '/photogallery"></a></li>';
            },
            end: function () {
                fork(artistID, sectionID);
            }

        });


    } else {
        //resume photogallery fading
        $('#' + artistID + 'photogallery').cycle('resume', true);
        $('.Gallerynav').css({
            display: 'block'
        });
    };
}

function playVideo(videoId, sectionId) {
    var videoFileNameArray = ['http://flv.kataweb.it/deejay/video/tropicalpizza/you_save_me.mp4', 'http://flv.kataweb.it/deejay/video/collezione/take1_crop.mp4', 'http://flv.kataweb.it/deejay/video/collezione/duranduran_edit.mp4'];
    var videoFileNameArrayOGV = ['http://download.deejay.it/contest/you_save_me.ogv', 'http://download.deejay.it/contest/take1_crop.ogv', 'http://download.deejay.it/contest/duranduran_edit.ogv'];
    var VideoFilePath = null;
    var VideoFilePathOGV = null;

    switch (videoId) {
    case 'skunkanansie':
        VideoFilePath = videoFileNameArray[0];
        VideoFilePathOGV = videoFileNameArrayOGV[0];
        break;
    case 'takethat':
        VideoFilePath = videoFileNameArray[1];
        VideoFilePathOGV = videoFileNameArrayOGV[1];
        break;
    case 'duranduran':
        VideoFilePath = videoFileNameArray[2];
        VideoFilePathOGV = videoFileNameArrayOGV[2];
        break;
    }

    //hideing starting bg images
    $('#startImages').fadeOut();


    $('#' + videoId + ' nav ul li.videoLink').append('<div class="videoControls"></div>')
    fv = $("#video").fadeIn().flareVideo({
        autobuffer: true,
        preload: true,
        autoplay: true
    });

    $('.flareVideo').css({
        display: 'none'
    });
    fv.load([{
        src: VideoFilePath,
        type: 'video/mp4'
    }, {
        src: VideoFilePathOGV,
        type: null
    }]);
    fv.onplay(function () {
        $('.videoControls').fadeIn();
        $("#video").fadeIn();
        $('.flareVideo').fadeIn();
        //on video ending we show the fork
        fv.onended(function () {
            fork(videoId, sectionId);
        });
    })




}
// now we can work with songs and lyrics
// now we can work with songs and lyrics


function startLyrics(artistId, sectionId) {
    //stop everything
    $('#lyrics:hidden').fadeIn();


    var lyricsDiv = '<div class="srt" data-audio="audio" data-srt="http://www.deejay.it/D5/contest/media/' + artistId + '.srt" /></div>';
    var audioHtml = '<audio id="audio"><source src="http://www.deejay.it/D5/contest/media/' + artistId + '.mp3"><source src="media/' + artistId + '.ogg"></audio>'
    var lyricsHtml = lyricsDiv + audioHtml;
    //playng with lyrics
    $('#lyrics').prepend(lyricsHtml);
    getSubtitlesAndPlay('.srt');
    audio = document.getElementById('audio');
    audio.addEventListener('canplay', function () {
        if (firstTimeLyrics == false) {
            init();
            animate();
            firstTimeLyrics = true;
        } else {
            $('canvas').fadeIn();
        }
    }, false);
    audio.addEventListener('ended', function () {
        theEnd();
    }, false);

}
//this function tell to the user to do his chose to continue the app navigation


function fork(artistId, sectionId) {
    stopPlayContent();
    var forkAddDistance = 0;
    //hideing old fork


    var artistFork = '#' + artistId + sectionId + 'Fork';

    $(ForkOnStageArray).each(function (index, val) {
        $(val).css({
            display: 'none',
            opacity: 0
        });
        $(val + ' li').each(function () {
            $(this).css({
                display: 'none',
                opacity: 0
            })
        });
    });

    $('#fork ul').css({
        display: 'none',
        opacity: 0
    });
    $('#' + artistId + sectionId + 'Fork').css({
        display: 'block'
    }).animate({
        opacity: 1
    });

    $('#fork').fadeIn('slow', function () {
        $('#' + artistId + sectionId + 'Fork').css({
            display: 'block',
            opacity: 1
        });
        $('#' + artistId + sectionId + 'Fork li').each(function () {
            var forkOffsetTop = ($(window).height() / 2) - ($(this).height() / 2);
            var forkOffsetLeft = (($(window).width() / 2) - 480) + forkAddDistance;
            $(this).css({
                display: 'block'
            }).stop().animate({
                opacity: 1,
                top: forkOffsetTop,
                left: forkOffsetLeft
            }, {
                duration: 1000,
                easing: 'easeInOutCirc',
                queque: false
            })
            forkAddDistance = forkAddDistance + $(this).width() + 10;
        })

    });

    $(window).bind('resize.centerFork', function () {
        // on window resize we need to reposition the menu items
        forkAddDistance = 0;
        $('#' + artistId + sectionId + 'Fork li').each(function () {
            offsetTop = ($(window).height() / 2) - ($(this).height() / 2);
            offsetLeft = (($(window).width() / 2) - 480) + forkAddDistance;
            $(this).stop().animate({
                top: offsetTop,
                left: offsetLeft
            }, {
                duration: 2000,
                easing: 'easeOutElastic',
                queque: false
            })
            forkAddDistance = forkAddDistance + $(this).width() + 10;

        });

    });
    ForkOnStageArray.push(artistFork);
}

function theEnd() {
    stopPlayContent();
    $('#main section').fadeOut();
    $('#logo').fadeOut();
    $('#shareLink').fadeOut();
    $('#theEnd').fadeIn();
}