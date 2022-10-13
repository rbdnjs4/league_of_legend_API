function clickedBtn(){
		// 로딩 표시
		
		showLoading();
		// 로딩 숨기기(2초 후)
		setTimeout("hideLoading()", 2000);
    }

function showLoading(){
    //화면의 높이와 너비를 구합니다.
		var maskHeight = $(document).height();
		var maskWidth  = window.document.body.clientWidth;

		//화면에 출력할 마스크를 설정해줍니다.
		var mask ="<div id='mask' style='opacity:0.5; position:absolute; z-index:19999; background-color:#8C8C8C; left:0; top:0;'></div>";

		//화면에 레이어 추가
		$('body').append(mask)

		//마스크의 높이와 너비를 화면 것으로 만들어 전체 화면을 채웁니다.
		$('#mask').css({
			'width' : maskWidth
			,'height': maskHeight
		});

		$(".loader").show();
}
function hideLoading(){
		$("#mask").remove();
		$(".loader").hide();
}
	
$(window).on("load",function() {
	$('.loader').fadeOut();
})