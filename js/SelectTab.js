$( document ).ready(function() {
	//Content Containers
    const recentGameInfoContent = $('#recent_game_info_container');
    const masteryInfo = $('#mastery_info_container');
    const currentGameInfo = $('#current_game_info_container');
    const mainInfoContainers = $('.main-info-tab');
	const searchBtn = $('#btn1');
    //Selector Tab
    const recentGameHistoryInfoTab = $('#recent_game_history_info_tab');
    const currentGameInfoTab = $('#current_game_info_tab');
    const masteryInfoTab = $('#mastery_info_tab');
    const InfoTabBundle = $('.info-tab');

    const bodyContent = $('#body_content');
	
	//Contents
	
	
    animationDelay = 0;
	animationDelay_DealInfo = 0;
    animationStyle = "easeOutQuad";

	const EraseMasteryList = $('.erase_mastery_list');
    
	
    const originHeight = 242;
	
	//메뉴 클릭 구간
	searchBtn.on("click", function(){
		const EraseMasteryList = $('.erase_mastery_list');
		EraseMasteryList.remove();
        recentGameInfoContent.animate({
            left: 0,
        }, animationDelay, animationStyle);
        masteryInfo.animate({
            left: '100%',
        }, animationDelay, animationStyle);
        currentGameInfo.animate({
            left: '200%',
        }, animationDelay, animationStyle);

        InfoTabBundle.css("background-color", "#444");
        recentGameHistoryInfoTab.css("background-color", "#222");
    });
	
    recentGameHistoryInfoTab.on("click", function(){
		const EraseMasteryList = $('.erase_mastery_list');
		EraseMasteryList.remove();
        recentGameInfoContent.animate({
            left: 0,
        }, animationDelay, animationStyle);
        masteryInfo.animate({
            left: '100%',
        }, animationDelay, animationStyle);
        currentGameInfo.animate({
            left: '200%',
        }, animationDelay, animationStyle);

        InfoTabBundle.css("background-color", "#444");
        $(this).css("background-color", "#222");
    });
	
    masteryInfoTab.on("click", function(){
		getSummonerMasteryInfoBySummonerID(userInfo_Tab.id);
		const EraseMasteryList = $('.erase_mastery_list');
		EraseMasteryList.remove();
        recentGameInfoContent.animate({
            left: '-100%',
        }, animationDelay, animationStyle);
        masteryInfo.animate({
            left: 0,
        }, animationDelay, animationStyle);
        currentGameInfo.animate({
            left: '100%',
        }, animationDelay, animationStyle);

        InfoTabBundle.css("background-color", "#444");
        $(this).css("background-color", "#222");
		
    });
	
    currentGameInfoTab.on("click", function(){
		const EraseMasteryList = $('.erase_mastery_list');
		EraseMasteryList.remove();
        recentGameInfoContent.animate({
            left: '-200%',
        }, animationDelay, animationStyle);
        masteryInfo.animate({
            left: '-100%',
        }, animationDelay, animationStyle);
        currentGameInfo.animate({
            left: 0,
        }, animationDelay, animationStyle);

        InfoTabBundle.css("background-color", "#444");
        $(this).css("background-color", "#222");
    });
});
