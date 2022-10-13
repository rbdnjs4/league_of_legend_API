let key;
let puuid;
const DebugLevel = false;

let championData = undefined;
let spellData = undefined;
let perkData = undefined;
let detailPerkData = undefined;
let itemImageData = undefined;
let userInfo_next=undefined;
let userInfo_Tab=undefined;


let championKeyDict = {};
let spellKeyDict = {};
let perkKeyDict = {};
let detailPerkKeyDict = {};
let latestDataDragonVer = "";

let maxHistoryItemCall = DebugLevel?3:15;

let currentGameTimer = null;

let count_start = 0;
let count_end = 19;


$( document ).ready(function() {
    $.ajax({
        url: "credentials.json",
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function(res){
            console.log("credentials load complete!");;

            key = res.riot_api_key;
            puuid = res.my_account_puuid;
        },
        error: function(req, stat, err){
            console.log(err);
        },
    });
	
    let getLatestDataDragonVersionRequest = $.ajax({
        url: "https://ddragon.leagueoflegends.com/api/versions.json",
        type: "GET",
        dataType: "json",
        success: function(res){
            latestDataDragonVer = res[0];

            let loadInitialDataRequestCallback = [];
            let getItemJsonRequest = $.ajax({
                url: getLatestDataDragonURL() + "/data/ko_KR/item.json",
                type: "GET",
                dataType: "json",
                success: function(res){
                    itemImageData = res.data;
                }
            });
            let getPerkJsonRequest = $.ajax({
                url: "https://raw.communitydragon.org/latest/plugins/rcp-be-lol-game-data/global/default/v1/perks.json",
                type: "GET",
                dataType: "json",
                success: function(res){
                    for(let i=0;i<res.length;i++){
                        let val = res[i];
                        detailPerkKeyDict[val.id] = val;
                    }
					console.log(detailPerkKeyDict);
                }
            });
            let getRuneJsonRequest = $.ajax({
                url: getLatestDataDragonURL() + "/data/en_US/runesReforged.json",
                type: "GET",
                dataType: "json",
                success: function(res){
                    for(let i=0;i<res.length;i++){
                        let val = res[i];
                        perkKeyDict[val.id] = val;
                    }
                }
            });
            let getSummonerSpellJsonRequest = $.ajax({
                url:  getLatestDataDragonURL() + "/data/en_US/summoner.json",
                type: "GET",
                dataType: "json",
                success: function(res){
                    spellData = res.data;
                    for(let key in spellData){
                        let value = spellData[key];
                        spellKeyDict[value.key] = value.id;
                    }
                }
            });
            let getChampionJsonRequest = $.ajax({
                url: getLatestDataDragonURL() + "/data/ko_KR/champion.json",
                type: "GET",
                dataType: "json",
                success: function(res){
                    championData = res.data;
                    for(let key in championData){
                        let value = championData[key];
                        championKeyDict[value.key] = value.id;
                    }
                }
            });

            loadInitialDataRequestCallback.push(getItemJsonRequest);
            loadInitialDataRequestCallback.push(getPerkJsonRequest);
            loadInitialDataRequestCallback.push(getRuneJsonRequest);
            loadInitialDataRequestCallback.push(getSummonerSpellJsonRequest);
            loadInitialDataRequestCallback.push(getChampionJsonRequest);
            loadInitialDataRequestCallback.push(getLatestDataDragonVersionRequest);

            //Load
            $.when.apply(null, loadInitialDataRequestCallback).done(function(){
                getSummonerInfo("puuid", puuid);
            });
        },
    });

    const searcherInput = $('#search_summoner_input');
    searcherInput.on("keydown", function(e){
        if(e.key == "Enter") {
			clickedBtn();
            getSummonerInfo("name", searcherInput.val());
        }
    });
	
	$("#btn0").button().on("click", function(event) {
		getSummonerInfo("puuid",puuid);
	});
	
	$("#btn1").button().on("click", function(event) {        
		getSummonerInfo("name", searcherInput.val());
	});

    let totalItemWrapper = $('#game_history_item_wrapper');
    let innerItem = $('#game_history_item');
    let rolledTab = $('#game_history_item_desc');

    let rolledTabHeight = rolledTab.outerHeight();
    let originalTotalWrapperHeight = totalItemWrapper.height();
    let strechedTotalWrapperHeight = originalTotalWrapperHeight + rolledTabHeight;
    let rolledTopOffset = -rolledTabHeight;
    rolledTab.css("top", (originalTotalWrapperHeight)+"px");
    rolledTab.css("z-index", "9950");

    // 디버깅용 탭 상세 펼치기
    // let animationStyle = 'easeOutCirc';
    // let animationDelay = 500;

    // innerItem.on("click", function(){
    //     let isFolded = totalItemWrapper.hasClass('folded');
    //     if(isFolded){
    //         rolledTab.css("display", "inline-block");
    //         totalItemWrapper.animate({
    //             height: strechedTotalWrapperHeight
    //         }, animationDelay, animationStyle, function(){
    //             totalItemWrapper.removeClass('folded');
    //             totalItemWrapper.addClass('unfolded');
    //         });
    //     }
    //     else {
    //         totalItemWrapper.animate({
    //             height: originalTotalWrapperHeight
    //         }, animationDelay, animationStyle, function(){
    //             rolledTab.css("display", "none");
    //             totalItemWrapper.removeClass('unfolded');
    //             totalItemWrapper.addClass('folded');
    //         });
    //     }
    // });

    animationDelay = 100;
	animationDelay_DealInfo = 0;
    animationStyle = "easeOutQuad";

    const detailMenuListTabContainer = $('.detail-menu-list-tab');
    const generalMatchInfoTab = $('#general_match_info_tab');
    const dealAmountInfoTab = $('#deal_amount_info_tab');
    const pulledByDealInfo = $('.participant-info .pulled-deal-container');
    const pushedByDealInfo = $('.participant-info .pushed-deal-container');

    dealAmountInfoTab.on("click", function(){
        pulledByDealInfo.animate({
            left: '200px',
        }, animationDelay, animationStyle);
        pushedByDealInfo.animate({
            left: '280px',
        }, animationDelay, animationStyle);
        detailMenuListTabContainer.removeClass("focused");
        detailMenuListTabContainer.addClass("unfocused");
        $(this).removeClass("unfocused");
        $(this).addClass("focused");
    });

    generalMatchInfoTab.on("click", function(){
        pulledByDealInfo.animate({
            left: 0,
        }, animationDelay, animationStyle);
        pushedByDealInfo.animate({
            left: '480px',
        }, animationDelay, animationStyle);
        detailMenuListTabContainer.removeClass("focused");
        detailMenuListTabContainer.addClass("unfocused");
        $(this).removeClass("unfocused");
        $(this).addClass("focused");
    });

    //Point
    //currentGameInfoTab.click();
    // dealAmountInfoTab.click();
});