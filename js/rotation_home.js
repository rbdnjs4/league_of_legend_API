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

let test = [];
let championKeyDictEngName = {};
let championKeyDictKorName = {};
let championKeyDict = {};
let spellKeyDict = {};
let perkKeyDict = {};
let detailPerkKeyDict = {};
let latestDataDragonVer = "";

let maxHistoryItemCall = DebugLevel?3:15;

let currentGameTimer = null;

let count_start = 0;
let count_end = 19;
let count_print = 1;
let con = 0;

$( document ).ready(function() {

    $.ajax({
        url: "credential/credentials.json",
        type: 'GET',
        dataType: 'json',
        async: false,
        success: function(res){
            //console.log("credentials load complete!");;

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
					//console.log(detailPerkKeyDict);
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
					console.log(res);
                    championData = res.data;
                    for(let key in championData){
                        let value = championData[key];
                        championKeyDict[value.key] = value.id;	//0~ id값으로 정렬된 데이터		
						championKeyDictEngName[con] = value.id; //0~ 이름 순으로 정렬된 데이터
						championKeyDictKorName[con] = value.name;
						if(con>80) test[con] = value.name;
						con++;
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
				$.ajax({
					url: "https://kr.api.riotgames.com/lol/platform/v3/champion-rotations",
					type: "GET",
					dataType: "json",
					data: {
						"api_key": key
					},
					async: false,
					success: function(res) {
						loadRotationChampion(res);
					},
					error: function(req, stat, err) {
						console.log(err);
					},
				});
            });
        },
    });
	
});