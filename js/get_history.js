function getSummonerInfo(method, data){
    whenFindNewSummoner();
    let AfterURL = "https://kr.api.riotgames.com/lol/summoner/v4/summoners/";
	if(data=="") {
		swal("소환사를 입력해주세요.");
		location.href(-1);
	}
    switch(method){
        case "name":
            AfterURL += "by-name/"+data;
            break;
        case "puuid":
            AfterURL += "by-puuid/"+data;
            break;
        default:
            return;
    }

    $.ajax({
        url: AfterURL,
        type: "GET",
        dataType: "json",
        data: {
            "api_key": key,
        },
        success: function(res){
            //Point
			count_start=0;
			userInfo_next = res;
			userInfo_Tab = res;
			puuid=res.puuid;
            loadSummonerGeneralInfo(res);
            getSummonerLeagueInfoBySummonerID(res.id);
            getSummonerRecentGameHistoryBySummonerPuuid(res);
            getCurrentMatchBySummonerID(res.id);
            //getSummonerMasteryInfoBySummonerID(res.id);
        },
        error: function(req, stat, err){
            console.log(err);
            if(err == "Forbidden") swal("API_KEY 만료됨");
            else swal("존재하지 않는 소환사입니다.");
        },
    });
}

function getSummonerMasteryInfoBySummonerID(id){
    $.ajax({
        url: "https://kr.api.riotgames.com/lol/champion-mastery/v4/champion-masteries/by-summoner/"+id,
        type: "GET",
        dataType: "json",
        data: {
            "api_key": key,
        },
        success: function(res){
            loadSummonerMasteryList(res)
        },
        error: function(req, stat, err){
            console.log(err);
        },
    });
}

function getSummonerRecentGameHistoryBySummonerPuuid(userInfo){
    $.ajax({
        url: "https://asia.api.riotgames.com/lol/match/v5/matches/by-puuid/"+userInfo.puuid+"/ids",
        type: "GET",
        dataType: "json",
        data: {
            "api_key": key,
            "start": count_start,
            "count": count_end,
        },
		
        success: function(res){
            // console.log("Success to get Summoner's Match Data List");
            loadSummonerMatchHistory(userInfo, res);
        },
        error: function(req, stat, err){
            console.log(err);
        },
    });
}

function getSummonerLeagueInfoBySummonerID(id){
    $.ajax({
        url: "https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/"+id,
        type: "GET",
        dataType: "json",
        data: {
            "api_key": key,
        },
        success: function(res){
            //console.log("Success to get Summoner's League Data");
            loadSummonerLeagueInfo(res);
        },
        error: function(req, stat, err){
            console.log(err);
            if(err == "Service Unavailable") swal('현재 API 서버 사용 불가능함');
        },
    });
}

function getCurrentMatchBySummonerID(id){
    $.ajax({
        url: "https://kr.api.riotgames.com/lol/spectator/v4/active-games/by-summoner/"+id,
        type: "GET",
        dataType: "json",
        data: {
            "api_key": key,
        },
        success: function(res){
            // 게임 중
            loadCurremtMatchInfo(res);
			console.log("게임중입니다.")
        },
        error: function(req, stat, err){
			
			$('#current_game_info_content_wrapper').css("display", "none");
            $('#not_playing_now_container').css("display", "inline-block");
            $('#current_game_info_tab').css("box-shadow", "none");
			$('.not-playing-title').test("gadsfdsa")
				
            console.log("게임 중이 아님");
			
            //if(err == "Not Found") 
            
            //else console.log(err);
        },
    });
}