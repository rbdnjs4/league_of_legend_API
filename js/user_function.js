function whenFindNewSummoner(){
    //새로운 소환사 검색 시 호출
    if(currentGameTimer != null){
        clearInterval(currentGameTimer);
    }
}

function getQueueTypeInfo(type){
    switch(type){
        case 450:
            MapType = "howling-abyss";
            MapLabel = "무작위 총력전";
            MapName = "일반(칼바람 나락)";
            break;
        case 420:
            MapLabel = "솔로 랭크";
            MapType = "summoners-rift";
            MapName = "솔로 랭크";
            break;
        case 430:
            MapLabel = "일반";
            MapType = "summoners-rift";
            MapName = "일반(소환사의 협곡)";
            break;
        case 440:
            MapLabel = "자유 랭크";
            MapType = "summoners-rift";
            MapName = "자유 랭크";
            break;
        case 830:
            MapLabel = "입문 봇전";
            MapType = "summoners-rift";
            MapName = "입문 봇전(소환사의 협곡)";
            break;
        case 840:
            MapLabel = "초보 봇전";
            MapType = "summoners-rift";
            MapName = "초보 봇전(소환사의 협곡)";
            break;
        case 850:
            MapLabel = "중급 봇전";
            MapType = "summoners-rift";
            MapName = "중급 봇전(소환사의 협곡)";
            break;
        case 1900:
            MapLabel = "U.R.F";
            MapType = "summoners-rift";
            MapName = "우르프";
            break;
        case 920:
            MapLabel = "포로왕";
            MapType = "howling-abyss";
            MapName = "포로왕(칼바람 나락)";
            break;
        default:
            MapLabel = "qType "+type;
            MapName = "QueueType "+type;
            break;
    }
    return {MapType: MapType, MapLabel: MapLabel};
}

function findNewSummoner(username){
    console.log(username);
    getSummonerInfo("name", username);
}

function getWinRateInfo(matchList, userInfo, partyInfoBundle){
    let winSum = 0;
    for(let i=0;i<matchList.length;i++){
        let partyInfo = partyInfoBundle[i];
        let userIndex = getUserIndexFromMatchInfo(userInfo, partyInfo.participantIdentities);
        const curUserInfo = partyInfo.participants[userIndex];
        let isWin = curUserInfo.stats.win;
        if(isWin) winSum+=1;
    }
    let winRate = winSum*100/matchList.length;
    return {
        winRate: winRate,
        winNum: winSum,
        loseNum: matchList.length - winSum,
    };
}

function getColorFromKDA(kda){
    if(kda<1.5) return "rgba(161, 0, 0, 0.941)";
    if(kda<3) return "rgba(115, 140, 0, 0.941)";
    if(kda<4.5) return "rgba(0, 138, 120, 0.941)";
    if(kda<10) return "rgba(9, 124, 255, 0.941)";
    return "rgba(145, 86, 255, 0.941)";
}

function refineCS(cs){
    return cs.toFixed(3);
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

function elapsedTimeFormatter(ctime){
    let stime = parseInt(ctime/1000);
    const year = parseInt(86400*(365.25));
    const month = parseInt(86400*30.4375);
    const day = 86400;
    const hour = 3600;
    const min = 60;

    if(stime >= year) return parseInt(stime/year) + "년 전";
    if(stime >= month) return parseInt(stime/month) + "달 전";
    if(stime >= day) return parseInt(stime/day) + "일 전";
    if(stime >= hour) return parseInt(stime/hour) + "시간 전";
    return parseInt(stime/min) + "분 전";
}

function ccTimeFormatter(cc){
    let mt = parseInt(cc / 60);
    let st = parseInt(cc % 60);
    return String(mt) + ":"+String(st);
}

function itemPriceComparator(a, b){
    let ag = a.gold.total;
    let bg = b.gold.total;
    return bg - ag;
}

function sortItemListWithPrice(list){
    list.sort(itemPriceComparator);
    return list;
}

function getRightPathOfDetailPerkImage(original){
    let slash_index = getPosition(original, "/", 4);
    let remain = original.substring(slash_index+1);
    return remain;
}

function getPosition(string, subString, index) {
    return string.split(subString, index).join(subString).length;
 }

function refineKDA(kda){
    switch(kda){
        case Infinity: return "∞";
    }
    if(isNaN(kda)) return "-";
    
    return kda.toFixed(2);
}

function getDetailPerkInfoFromKey(keyIn){
    return detailPerkKeyDict[keyIn];
}

function getPerkInfoFromKey(keyIn){
    return perkKeyDict[keyIn];
}

function getSpellInfoFromKey(keyIn){
    let keyword = spellKeyDict[keyIn];
    return spellData[keyword];
}

function getChampionInfoFromKey(keyIn){
    let keyword = championKeyDict[keyIn];
    if(keyword == undefined) keyword = "Unknown";
    let refined = keyword.replace(" ","");
    return championData[refined];
}

function getUserIndexFromMatchInfo(userInfo, res){
    for(let i=0;i<res.metadata.participants.length;i++){
        if(res.metadata.participants[i] == userInfo.puuid){
            return i;
        }
    }
    return -1;
}

function getConvertedLeagueType(type){
    switch(type){
        case "RANKED_FLEX_SR": return {
            type: "Flex",
            level: 2,
        };
        case "RANKED_SOLO_5x5": return {
            type: "Solo",
            level: 3,
        };
        default: return {
            type: type,
            level: 1,
        };;
    }
}

function getConvertedLeagueTier(tier){
    switch(tier){
        case "IRON": return {
            name: "아이언",
            level: 0,
            color: "#999",
        };
        case "BRONZE": return {
            name: "브론즈",
            level: 1,
            color: "#F99",
        };
        case "SILVER": return {
            name: "실버",
            level: 2,
            color: "#CCC",
        };
        case "GOLD": return {
            name: "골드",
            level: 3,
            color: "#FFD700",
        };
        case "PLATINUM": return {
            name: "플레티넘",
            level: 4,
            color: "#7BB",
        };
        case "DIAMOND": return {
            name: "다이아몬드",
            level: 5,
            color: "#67D",
        };
        case "MASTER": return {
            name: "마스터",
            level: 6,
            color: "#B7D",
            color2: "#AAA"
        };
        case "GRANDMASTER": return {
            name: "그랜드마스터",
            level: 7,
            color: "#F44",
            color2: "#777",
        };
        case "CHALLENGER": return {
            name: "챌린저",
            level: 8,
            color: "#69F",
            color2: "#DE8",
        };
        default: return tier;
    }
}

function getLatestDataDragonURL(){
    return "https://ddragon.leagueoflegends.com/cdn/"+latestDataDragonVer;
}