var settings = {
	drawTime: 5,
	videoEffects: true,
	confettiEffects: true,
	confettiTimeout: 5,
};
var resultArray;
var kilit = false;
$(document).ready(function(){
	printLog("Çekiliş sistemi çalışıyor.");
});
function printLog(log)
{
	var now = new Date();
    var time = now.toLocaleTimeString();
	var log_old = $('#logInput').html();
	var date = "["+time+"] ";
	$('#logInput').html(log_old+date+log+"<br />");
}
function closeResult(item)
{
	if($('#deleteMode').is(':checked') == true)
	{
		resultArray = resultArray.filter(v => v !== item); 
		setTimeout(function(){
			$('#message').val(resultArray.join('\n'));
			fixCounts(resultArray);
			animateCSS('#message', 'flash');
			animateCSS('.info', 'flash');
		}, 2000);
	}
	winnerClose();
	if(settings.confettiEffects) confetti.stop();  
	if(settings.videoEffects) $('.element-with-video-bg').remove();
}
function clearDuplicates(buton)
{
	$(buton).blur();
	var text = $('#message').val();
	var splitted = text.split('\n');
	var sayim = 0; var totalCount = 0;
	var array = [];
	splitted = splitted.filter(v => v !== ''); 
	splitted = splitted.filter(function(entry) { return entry.trim() != ''; });
	splitted.forEach(function(item, index){
		if(array.indexOf(item) == -1)
		{
			sayim++;
			array.push(item);
		}
		totalCount++;
		if(totalCount == splitted.length)
		{
			$('#message').val(array.join('\n'));
			countInfo();
		}
	});
}
function Draw(buton)
{	
	kilit = true;
	$(buton).blur();
	$('#message').blur();
	$('#toBeDrawn').blur();
	var text = $('#message').val();
	var splitted = text.split('\n');
	var sayim = 0;
	var array = [];
	splitted.forEach(function(item, index){
		if(array.indexOf(item) == -1)
		{
			sayim++;
			array.push(item);
		}
	});
	if(sayim < 2)
	{
		alert("HATA! Listeye en az 2 kişi yazmalısınız.");
		return;
	}
	$('#clearDup').attr('disabled', true);
	$('#import').attr('disabled', true);
	$('#message').attr('disabled', true);
	var temp_array = $('#message').val().split('\n');
	temp_array = temp_array.filter(v => v !== ''); 
	temp_array = temp_array.filter(function(entry) { return entry.trim() != ''; });
	$('#message').val(temp_array.join('\n'));
	if(settings.videoEffects)
	{
		var videoStartTime = 10 - settings.drawTime;
		var videos = ['video.mp4'];
		var video = videos[Math.floor(Math.random() * videos.length)];
		$('body').prepend(`
	<div class="element-with-video-bg jquery-background-video-wrapper">
				<video class="my-background-video jquery-background-video" autoplay muted playsinline poster="">
					<source src="media/`+video+`#t=`+videoStartTime+`" type="video/mp4">
				</video>
			</div>
		`);
		$('.my-background-video').bgVideo();
	}
	animateCSS('#loading', 'fadeInDown');
	var text_ = "CEKILIYOR";
	var prizeName = $('#toBeDrawn').val().turkishtoEnglish().toUpperCase();
	loaderShow(text_);
	var count = settings.drawTime + 1;
	var sayac = setInterval(function(){
		count--;
		animateCSS('#loading_p', 'flash', 'fast');
		var text_ = "CEKILIYOR<br>"+count;
		var prizeName = $('#toBeDrawn').val().turkishtoEnglish().toUpperCase();
		if(prizeName.length > 0) text_ = prizeName + " "+text_;
		loaderShow(text_);
		if(count == -1)
		{
			clearInterval(sayac);
			var text = $('#message').val();
			var splitted = text.split('\n');
			var item = splitted[Math.floor(Math.random() * splitted.length)].turkishtoEnglish();	
			resultArray = splitted;
			loaderHide();
			winnerShow(item);
			var temp_arr = splitted;
			temp_arr = temp_arr.filter(v => v === item); 
			var katilim_sayi = "[Katılım Sayısı: "+temp_arr.length+"]";
			var odulisim = $('#toBeDrawn').val();
			if(odulisim.length > 0) printLog(item + ", "+ $('#toBeDrawn').val() + " adlı ödülü kazandı. "+katilim_sayi);
			else printLog(item + ", çekilişi kazandı. "+katilim_sayi);
			if(settings.confettiEffects) { 
				confetti.start();
				if(settings.confettiTimeout > 0) setTimeout(function(){confetti.stop();}, settings.confettiTimeout*1000);
			}
		}
	}, 1000);
}
function fileInput(element)
{
	if(kilit == true)
	{
		alert("Çekiliş çekilmeye başladığı için yeni veri ekleyemezsiniz. Sayfayı yenileyin");
		return;
	}
	if ( ! window.FileReader ) {
		return alert( 'Tarayıcınız bu işlevi desteklemiyor.' );
	}
	$('#import').blur();
	$('#import').attr('disabled', true);
	var $i = $( element ), 
	input = $i[0];
	if ( input.files && input.files[0] ) {
		file = input.files[0];
		fr = new FileReader(); 
		fr.onload = function () {
			var array_now = $('#message').val().split('\n');
			array_now = array_now.filter(v => v !== ''); 		
			var result_array = fr.result.toString().split('\n');
			result_array = result_array.filter(v => v !== ''); 
			result_array = result_array.filter(function(entry) { return entry.trim() != ''; });
			var counta = 0;
			result_array.forEach(function(item){
				if(item.length > 0)
					array_now.push(item.trim());
				counta++;
				if(result_array.length == counta) {
					$('#message').val(array_now.join('\n'));
					fixCounts(array_now);
					$('#import').attr('disabled', false);
					$(element).val('');
				}
			});
		};
		fr.readAsText( file );
	} else {
		$('#import').attr('disabled', false);
	}
}
function fixCounts(splitted)
{
	var say = 0, kisi_sayi = 0;
	var array = [];
	splitted.forEach(function (item) {
		if(item.length > 0)
		{
			if(array.indexOf(item) == -1)
			{
				array.push(item);
				kisi_sayi++;
			}
			say++;
		}
	});
	$('#katilim').html(say);
	$('#katilimci').html(kisi_sayi);
	$('#karakter').html(splitted.join('\n').length);
}
function countInfo()
{
	var array = [];
	var text = $('#message').val();
	var splitted = text.split('\n');
	var say = 0, kisi_sayi = 0;
	splitted.forEach(function (item) {
		if(item.length > 0)
		{
			if(array.indexOf(item) == -1)
			{
				array.push(item);
				kisi_sayi++;
			}
			say++;
		}
	});
	$('#katilim').html(say);
	$('#katilimci').html(kisi_sayi);
	$('#karakter').html(text.length);
}
function loaderHide()
{
	$('#loading').hide();
}
function loaderShow(text)
{
	$('#loading').children('p').html(text);
	$('#loading').show();
}
function winnerShow(kazanan)
{
	var winnerText = "KAZANAN";
	var prizeName = $('#toBeDrawn').val().turkishtoEnglish().toUpperCase();
	if(prizeName.length > 0) winnerText = prizeName+" "+winnerText;
	$('#resultTop').children('b').html(winnerText);
	$('#resultTop').children('p').html(kazanan);
	$('#resultTop').show();
	$('#resultClose').attr('onclick', "closeResult('"+kazanan+"');");
	$('#resultClose').show();
	animateCSS('#resultTop', 'slideInDown');
	var efc = 0;
	var ifc = setInterval(function(){
		animateCSS('#sonuc_isim', 'flip');
		efc++;
		if(efc == 3) clearInterval(ifc);
	}, 1500);
}
function winnerClose()
{
	animateCSS('#resultTop', 'zoomOutLeft');
	setTimeout(function(){$('#resultTop').hide();},1000);
	$('#resultClose').hide();
}

function mixList(buton)
{
	$(buton).blur();
	$(buton).attr('disabled', true);
	var text = $('#message').val();
	var splitted = text.split('\n');
	splitted = splitted.filter(v => v !== ''); 
	splitted = splitted.filter(function(entry) { return entry.trim() != ''; });
	shuffle(splitted);
	$('#message').val(splitted.join('\n'));
	$(buton).attr('disabled', false);	
}
function shuffle(a) {
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
function animateCSS(element, animationName, speedName, callback) {
    const node = document.querySelector(element)
    node.classList.add('animated', animationName)
	if(typeof speedName !== 'undefined') node.classList.add(speedName)

    function handleAnimationEnd() {
        node.classList.remove('animated', animationName)
        node.removeEventListener('animationend', handleAnimationEnd)
		if(typeof speedName !== 'undefined') node.classList.remove(speedName)

        if (typeof callback === 'function') callback()
    }
    node.addEventListener('animationend', handleAnimationEnd)
}
String.prototype.turkishtoEnglish = function () {
    return this.replace('Ğ','g')
        .replace('Ü','u')
        .replace('Ş','s')
        .replace('I','i')
        .replace('İ','i')
        .replace('Ö','o')
        .replace('Ç','c')
        .replace('ğ','g')
 		.replace('ü','u')
        .replace('ş','s')
        .replace('ı','i')
        .replace('ö','o')
        .replace('ç','c');
};