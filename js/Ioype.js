/*********************************************************************
*  #### Twitter Post Fetcher v16.0.3 ####
*  Coded by Jason Mayes 2015. A present to all the developers out there.
*  www.jasonmayes.com
*  Please keep this disclaimer with my code if you use it. Thanks. :-)
*  Got feedback or questions, ask here:
*  http://www.jasonmayes.com/projects/twitterApi/
*  Github: https://github.com/jasonmayes/Twitter-Post-Fetcher
*  Updates will be posted to this site.
*********************************************************************/
(function(root,factory){if(typeof define==='function'&&define.amd){define([],factory)}else if(typeof exports==='object'){module.exports=factory()}else{factory()}}(this,function(){var domNode='';var maxTweets=20;var parseLinks=!0;var queue=[];var inProgress=!1;var printTime=!0;var printUser=!0;var formatterFunction=null;var supportsClassName=!0;var showRts=!0;var customCallbackFunction=null;var showInteractionLinks=!0;var showImages=!1;var targetBlank=!0;var lang='en';var permalinks=!0;var dataOnly=!1;var script=null;function handleTweets(tweets){if(customCallbackFunction===null){var x=tweets.length;var n=0;var element=document.getElementById(domNode);var html='<ul>';while(n<x){html+='<li>'+tweets[n]+'</li>';n++}
html+='</ul>';element.innerHTML=html}else{customCallbackFunction(tweets)}}
function strip(data){return data.replace(/<b[^>]*>(.*?)<\/b>/gi,function(a,s){return s}).replace(/class="(?!(tco-hidden|tco-display|tco-ellipsis))+.*?"|data-query-source=".*?"|dir=".*?"|rel=".*?"/gi,'')}
function targetLinksToNewWindow(el){var links=el.getElementsByTagName('a');for(var i=links.length-1;i>=0;i--){links[i].setAttribute('target','_blank')}}
function getElementsByClassName(node,classname){var a=[];var regex=new RegExp('(^| )'+classname+'( |$)');var elems=node.getElementsByTagName('*');for(var i=0,j=elems.length;i<j;i++){if(regex.test(elems[i].className)){a.push(elems[i])}}
return a}
function extractImageUrl(image_data){if(image_data!==undefined&&image_data.innerHTML.indexOf('data-srcset')>=0){var data_src=image_data.innerHTML.match(/data-srcset="([A-z0-9%_\\.\-]+)/i)[0];return decodeURIComponent(data_src).split('"')[1]}}
var twitterFetcher={fetch:function(config){if(config.maxTweets===undefined){config.maxTweets=20}
if(config.enableLinks===undefined){config.enableLinks=!0}
if(config.showUser===undefined){config.showUser=!0}
if(config.showTime===undefined){config.showTime=!0}
if(config.dateFunction===undefined){config.dateFunction='default'}
if(config.showRetweet===undefined){config.showRetweet=!0}
if(config.customCallback===undefined){config.customCallback=null}
if(config.showInteraction===undefined){config.showInteraction=!0}
if(config.showImages===undefined){config.showImages=!1}
if(config.linksInNewWindow===undefined){config.linksInNewWindow=!0}
if(config.showPermalinks===undefined){config.showPermalinks=!0}
if(config.dataOnly===undefined){config.dataOnly=!1}
if(inProgress){queue.push(config)}else{inProgress=!0;domNode=config.domId;maxTweets=config.maxTweets;parseLinks=config.enableLinks;printUser=config.showUser;printTime=config.showTime;showRts=config.showRetweet;formatterFunction=config.dateFunction;customCallbackFunction=config.customCallback;showInteractionLinks=config.showInteraction;showImages=config.showImages;targetBlank=config.linksInNewWindow;permalinks=config.showPermalinks;dataOnly=config.dataOnly;var head=document.getElementsByTagName('head')[0];if(script!==null){head.removeChild(script)}
script=document.createElement('script');script.type='text/javascript';if(config.list!==undefined){script.src='https://syndication.twitter.com/timeline/list?'+'callback=twitterFetcher.callback&dnt=false&list_slug='+config.list.listSlug+'&screen_name='+config.list.screenName+'&suppress_response_codes=true&lang='+(config.lang||lang)+'&rnd='+Math.random()}else if(config.profile!==undefined){script.src='https://syndication.twitter.com/timeline/profile?'+'callback=twitterFetcher.callback&dnt=false'+'&screen_name='+config.profile.screenName+'&suppress_response_codes=true&lang='+(config.lang||lang)+'&rnd='+Math.random()}else if(config.likes!==undefined){script.src='https://syndication.twitter.com/timeline/likes?'+'callback=twitterFetcher.callback&dnt=false'+'&screen_name='+config.likes.screenName+'&suppress_response_codes=true&lang='+(config.lang||lang)+'&rnd='+Math.random()}else{script.src='https://cdn.syndication.twimg.com/widgets/timelines/'+config.id+'?&lang='+(config.lang||lang)+'&callback=twitterFetcher.callback&'+'suppress_response_codes=true&rnd='+Math.random()}
head.appendChild(script)}},callback:function(data){if(data===undefined||data.body===undefined){inProgress=!1;if(queue.length>0){twitterFetcher.fetch(queue[0]);queue.splice(0,1)}
return}
data.body=data.body.replace(/(<img[^c]*class="Emoji[^>]*>)|(<img[^c]*class="u-block[^>]*>)/g,'');if(!showImages){data.body=data.body.replace(/(<img[^c]*class="NaturalImage-image[^>]*>|(<img[^c]*class="CroppedImage-image[^>]*>))/g,'')}
if(!printUser){data.body=data.body.replace(/(<img[^c]*class="Avatar"[^>]*>)/g,'')}
var div=document.createElement('div');div.innerHTML=data.body;if(typeof(div.getElementsByClassName)==='undefined'){supportsClassName=!1}
function swapDataSrc(element){var avatarImg=element.getElementsByTagName('img')[0];avatarImg.src=avatarImg.getAttribute('data-src-2x');return element}
var tweets=[];var authors=[];var times=[];var images=[];var rts=[];var tids=[];var permalinksURL=[];var x=0;if(supportsClassName){var tmp=div.getElementsByClassName('timeline-Tweet');while(x<tmp.length){if(tmp[x].getElementsByClassName('timeline-Tweet-retweetCredit').length>0){rts.push(!0)}else{rts.push(!1)}
if(!rts[x]||rts[x]&&showRts){tweets.push(tmp[x].getElementsByClassName('timeline-Tweet-text')[0]);tids.push(tmp[x].getAttribute('data-tweet-id'));if(printUser){authors.push(swapDataSrc(tmp[x].getElementsByClassName('timeline-Tweet-author')[0]))}
times.push(tmp[x].getElementsByClassName('dt-updated')[0]);permalinksURL.push(tmp[x].getElementsByClassName('timeline-Tweet-timestamp')[0]);if(tmp[x].getElementsByClassName('timeline-Tweet-media')[0]!==undefined){images.push(tmp[x].getElementsByClassName('timeline-Tweet-media')[0])}else{images.push(undefined)}}
x++}}else{var tmp=getElementsByClassName(div,'timeline-Tweet');while(x<tmp.length){if(getElementsByClassName(tmp[x],'timeline-Tweet-retweetCredit').length>0){rts.push(!0)}else{rts.push(!1)}
if(!rts[x]||rts[x]&&showRts){tweets.push(getElementsByClassName(tmp[x],'timeline-Tweet-text')[0]);tids.push(tmp[x].getAttribute('data-tweet-id'));if(printUser){authors.push(swapDataSrc(getElementsByClassName(tmp[x],'timeline-Tweet-author')[0]))}
times.push(getElementsByClassName(tmp[x],'dt-updated')[0]);permalinksURL.push(getElementsByClassName(tmp[x],'timeline-Tweet-timestamp')[0]);if(getElementsByClassName(tmp[x],'timeline-Tweet-media')[0]!==undefined){images.push(getElementsByClassName(tmp[x],'timeline-Tweet-media')[0])}else{images.push(undefined)}}
x++}}
if(tweets.length>maxTweets){tweets.splice(maxTweets,(tweets.length-maxTweets));authors.splice(maxTweets,(authors.length-maxTweets));times.splice(maxTweets,(times.length-maxTweets));rts.splice(maxTweets,(rts.length-maxTweets));images.splice(maxTweets,(images.length-maxTweets));permalinksURL.splice(maxTweets,(permalinksURL.length-maxTweets))}
var arrayTweets=[];var x=tweets.length;var n=0;if(dataOnly){while(n<x){arrayTweets.push({tweet:tweets[n].innerHTML,author:authors[n]?authors[n].innerHTML:'Unknown Author',time:times[n].textContent,timestamp:times[n].getAttribute('datetime').replace('+0000','Z').replace(/([\+\-])(\d\d)(\d\d)/,'$1$2:$3'),image:extractImageUrl(images[n]),rt:rts[n],tid:tids[n],permalinkURL:(permalinksURL[n]===undefined)?'':permalinksURL[n].href});n++}}else{while(n<x){if(typeof(formatterFunction)!=='string'){var datetimeText=times[n].getAttribute('datetime');var newDate=new Date(times[n].getAttribute('datetime').replace(/-/g,'/').replace('T',' ').split('+')[0]);var dateString=formatterFunction(newDate,datetimeText);times[n].setAttribute('aria-label',dateString);if(tweets[n].textContent){if(supportsClassName){times[n].textContent=dateString}else{var h=document.createElement('p');var t=document.createTextNode(dateString);h.appendChild(t);h.setAttribute('aria-label',dateString);times[n]=h}}else{times[n].textContent=dateString}}
var op='';if(parseLinks){if(targetBlank){targetLinksToNewWindow(tweets[n]);if(printUser){targetLinksToNewWindow(authors[n])}}
if(printUser){op+='<div class="user">'+strip(authors[n].innerHTML)+'</div>'}
op+='<p class="tweet">'+strip(tweets[n].innerHTML)+'</p>';if(printTime){if(permalinks){op+='<p class="timePosted"><a href="'+permalinksURL[n]+'">'+times[n].getAttribute('aria-label')+'</a></p>'}else{op+='<p class="timePosted">'+times[n].getAttribute('aria-label')+'</p>'}}}else{if(tweets[n].textContent){if(printUser){op+='<p class="user">'+authors[n].textContent+'</p>'}
op+='<p class="tweet">'+tweets[n].textContent+'</p>';if(printTime){op+='<p class="timePosted">'+times[n].textContent+'</p>'}}else{if(printUser){op+='<p class="user">'+authors[n].textContent+'</p>'}
op+='<p class="tweet">'+tweets[n].textContent+'</p>';if(printTime){op+='<p class="timePosted">'+times[n].textContent+'</p>'}}}
if(showInteractionLinks){op+='<p class="interact"><a href="https://twitter.com/intent/'+'tweet?in_reply_to='+tids[n]+'" class="twitter_reply_icon"'+(targetBlank?' target="_blank">':'>')+'Reply</a><a href="https://twitter.com/intent/retweet?'+'tweet_id='+tids[n]+'" class="twitter_retweet_icon"'+(targetBlank?' target="_blank">':'>')+'Retweet</a>'+'<a href="https://twitter.com/intent/favorite?tweet_id='+tids[n]+'" class="twitter_fav_icon"'+(targetBlank?' target="_blank">':'>')+'Favorite</a></p>'}
if(showImages&&images[n]!==undefined&&extractImageUrl(images[n])!==undefined){op+='<div class="media">'+'<img src="'+extractImageUrl(images[n])+'" alt="Image from tweet" />'+'</div>'}
if(showImages){arrayTweets.push(op)}else if(!showImages&&tweets[n].textContent.length){arrayTweets.push(op)}
n++}}
handleTweets(arrayTweets);inProgress=!1;if(queue.length>0){twitterFetcher.fetch(queue[0]);queue.splice(0,1)}}};window.twitterFetcher=twitterFetcher;return twitterFetcher}))



/**
 * ### HOW TO CREATE A VALID ID TO USE: ###
 * Go to www.twitter.com and sign in as normal, go to your settings page.
 * Go to "Widgets" on the left hand side.
 * Create a new widget for what you need eg "user time line" or "search" etc.
 * Feel free to check "exclude replies" if you don't want replies in results.
 * Now go back to settings page, and then go back to widgets page and
 * you should see the widget you just created. Click edit.
 * Look at the URL in your web browser, you will see a long number like this:
 * 345735908357048478
 * Use this as your ID below instead!
 */

/**
 * How to use TwitterFetcher's fetch function:
 * 
 * @function fetch(object) Fetches the Twitter content according to
 *     the parameters specified in object.
 * 
 * @param object {Object} An object containing case sensitive key-value pairs
 *     of properties below.
 * 
 * You may specify at minimum the following two required properties:
 * 
 * @param object.id {string} The ID of the Twitter widget you wish
 *     to grab data from (see above for how to generate this number).
 * @param object.domId {string} The ID of the DOM element you want
 *     to write results to.
 *
 * You may also specify one or more of the following optional properties
 *     if you desire:
 *
 * @param object.maxTweets [int] The maximum number of tweets you want
 *     to return. Must be a number between 1 and 20. Default value is 20.
 * @param object.enableLinks [boolean] Set false if you don't want
 *     urls and hashtags to be hyperlinked.
 * @param object.showUser [boolean] Set false if you don't want user
 *     photo / name for tweet to show.
 * @param object.showTime [boolean] Set false if you don't want time of tweet
 *     to show.
 * @param object.dateFunction [function] A function you can specify
 *     to format date/time of tweet however you like. This function takes
 *     a JavaScript date as a parameter and returns a String representation
 *     of that date.
 * @param object.showRetweet [boolean] Set false if you don't want retweets
 *     to show.
 * @param object.customCallback [function] A function you can specify
 *     to call when data are ready. It also passes data to this function
 *     to manipulate them yourself before outputting. If you specify
 *     this parameter you must output data yourself!
 * @param object.showInteraction [boolean] Set false if you don't want links
 *     for reply, retweet and favourite to show.
 * @param object.showImages [boolean] Set true if you want images from tweet
 *     to show.
 * @param object.lang [string] The abbreviation of the language you want to use
 *     for Twitter phrases like "posted on" or "time ago". Default value
 *     is "en" (English).
 */


