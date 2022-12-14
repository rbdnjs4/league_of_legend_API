//현재 게임
let TIME_COUNT=0;
let SET_TIMER = undefined;

function loadCurremtMatchInfo(info){
	//$('#not_playing_now_container').remove();
    let queueTypeInfo = getQueueTypeInfo(info.gameQueueConfigId);
    console.log(new Date().getTime() - info.gameStartTime);
	$('#current_game_info_content_wrapper').css("display", "inline-block");
    $('#not_playing_now_container').css("display", "inline-block");
    $('#current_game_info_tab').css("box-shadow", "0 0 8px rgb(9, 255, 9)");
    $('#current_game_info_content_wrapper .current-game-map-type').text(queueTypeInfo.MapLabel);
	
    const startTime = info.gameStartTime;
    const elapsedTimeText = $('#current_game_elapsed_time');
    currentGameTimer = setInterval(function(){
        let current = new Date().getTime();
        let elapsed = parseInt((current - startTime)/1000);
        let min = parseInt(elapsed/60);
        let sec = elapsed%60;

        let timeText = min + "분 " + sec + "초";

        if(info.gameStartTime == 0) timeText = "오류 발생"
        elapsedTimeText.text(timeText);
    }, 1000);

    const blueTeam = $('.blue-team .team-info-container');
    const redTeam = $('.red-team .team-info-container');

    const originalItems = $('.teammate-info-item');
    originalItems.remove();

    let currentPlayersInfoBundle = info.participants;
    let segmentBundle = [];

    for(let i=0;i<currentPlayersInfoBundle.length;i++){
        let currentPlayerInfo = currentPlayersInfoBundle[i];
        let itemSegment = `
        <div class="teammate-info-item">
            <div class="teammate-info-champion-image" id="current_player_champion_image_${i}"></div>
            <div class="perk-rune-wrapper">
                <div class="spell-perk-container">
                    <div id="current_player_rune_img1_${i}"></div>
                    <div id="current_player_rune_img2_${i}"class="sec-spell-perk-img"></div>
                </div>
                <div class="spell-perk-container perk-container">
                    <div id="current_player_perk_img1_${i}"></div>
                    <div id="current_player_perk_img2_${i}" class="sec-spell-perk-img"></div>
                </div>
            </div>
            <div class="username-wrapper">
                <span class="username">${currentPlayerInfo.summonerName}</span>
            </div>
            <div class="current-season-rank-wrapper rank-position">
                <span class="current-season-rank">unknown</span>
            </div>
            <div class="previous-season-rank-wrapper rank-position">
                <span class="previos-season-rank">unknown</span>
            </div>
        </div>`;
        segmentBundle.push(itemSegment);
    }
    for(let i=0;i<5;i++){
        blueTeam.append(segmentBundle[i]);
    }
    for(let i=5;i<segmentBundle.length;i++){
        redTeam.append(segmentBundle[i]);
    }

    for(let i=0;i<currentPlayersInfoBundle.length;i++){
        let currentPlayerInfo = currentPlayersInfoBundle[i];
        let currentPlayerChampionImgDiv = $('#current_player_champion_image_'+i);
        let currentPlayerRune1Div = $('#current_player_rune_img1_'+i);
        let currentPlayerRune2Div = $('#current_player_rune_img2_'+i);
        let currentPlayerPerk1Div = $('#current_player_perk_img1_'+i);
        let currentPlayerPerk2Div = $('#current_player_perk_img2_'+i);

        let curChampionInfo = getChampionInfoFromKey(currentPlayerInfo.championId);
		
        let champion_img_url = getLatestDataDragonURL()+"/img/champion/"+curChampionInfo.id+".png";
        let spell1_url_def = getLatestDataDragonURL()+"/img/spell/"+getSpellInfoFromKey(currentPlayerInfo.spell1Id).id+".png";
        let spell2_url_def = getLatestDataDragonURL()+"/img/spell/"+getSpellInfoFromKey(currentPlayerInfo.spell2Id).id+".png";
        
        let perk1_info = getPerkInfoFromKey(currentPlayerInfo.perks.perkStyle);
        let perk2_info = getPerkInfoFromKey(currentPlayerInfo.perks.perkSubStyle);

        let perk1ImageURL = "https://ddragon.leagueoflegends.com/cdn/img/"+perk1_info.icon;
        let perk2ImageURL = "https://ddragon.leagueoflegends.com/cdn/img/"+perk2_info.icon;
		
        currentPlayerChampionImgDiv.css("background-image", `url(${champion_img_url})`);
        currentPlayerRune1Div.css("background-image", `url(${spell1_url_def})`);
        currentPlayerRune2Div.css("background-image", `url(${spell2_url_def})`);
        currentPlayerPerk1Div.css("background-image", `url(${perk1ImageURL})`);
        currentPlayerPerk2Div.css("background-image", `url(${perk2ImageURL})`);
    }
	console.log("real success!");
}

function loadSummonerMatchHistory(userInfo, info){
    let matchList = info;
    const gameHistoryListContainer = $('#game_history_list_container');
    const gameHistoryItemBundle = $('.game-history-item-wrapper');

    //Point 초기화
    gameHistoryItemBundle.remove();

    let nativeHistoryItemBundle = [];
    let loadHistoryItemCallback = [];
    let participantInfoBundle = [];
    nativeHistoryItemBundle.length = matchList.length;
    participantInfoBundle.length = matchList.length;

    
    for(let i=0;i<matchList.length;i++){
        let matchItemInfo = matchList[i];
        let request = $.ajax({
            url: "https://asia.api.riotgames.com/lol/match/v5/matches/"+matchItemInfo,
            type: "GET",
            dataType: "json",
            data: {
                "api_key": key,
            },
            success: function(res){
                let userIndex = getUserIndexFromMatchInfo(userInfo, res);
                if(userIndex === -1){
                    swal("citical Error!");
                    return;
                }
                const curUserInfo = res.info.participants[userIndex];
                let isWin = curUserInfo.win;
                let isWinLabel = isWin?"승리":"패배";
                let isWinType = isWin?"win":"lose";
                let MapType = "";
                let MapLabel = "";
                let curChampionInfo = getChampionInfoFromKey(curUserInfo.championId);
                let KDA = (curUserInfo.kills + curUserInfo.assists)/curUserInfo.deaths;
				//console.log(KDA);
                let curUserStat = curUserInfo;
                let team1WinInfoLabel = res.info.teams[0].win ? ["win", "승리"] : ["lose", "패배"];
                let team2WinInfoLabel = res.info.teams[1].win ? ["win", "승리"] : ["lose", "패배"];

                //http://static.developer.riotgames.com/docs/lol/queues.json 참고

                let queueTypeInfo = getQueueTypeInfo(res.info.queueId);
				
                let lastSecondContainer = queueTypeInfo.MapLabel==="무작위 총력전"?`
                <div class="cc-wrapper">
                    <span>CC</span>
                    <span>${curUserStat.totalTimeCCDealt}s</span>
                </div>
                `:`
                <div class="ward-wrapper">
                    <span>Ward</span>
                    <span class="normal-ward-num">${curUserStat.sightWardsBoughtInGame}</span><span
                    >/</span><span class="pink-ward-num">${curUserStat.visionWardsBoughtInGame}</span>
                </div>
                `
                let timeGap = new Date() - res.info.gameStartTimestamp;
				
                let historyHTMLdocSegment = (`
                <div class="game-history-item-wrapper ${queueTypeInfo.MapType} folded" id="game_history_item_wrapper_${i}">
                    <div class="game-history-item ${isWinType}-type" id="game_history_item_${i}">
                        <div class="item-wrapper">
                            <div class="item-detail-1">
                                <span class="map-type">${queueTypeInfo.MapLabel}</span>
                                <span class="win-or-lose">${isWinLabel}</span>
                                <span class="timelapse">${elapsedTimeFormatter(timeGap)}</span>
                            </div>
                            <div class="item-detail-2">
                                <div class="champ-wrapper">
                                    <div class="upper-div">
                                        <div class="main-champion-illust-wrapper" id="main_champion_illust_${i}">
                                            <div class="last-champion-level">${curUserStat.champLevel}</div>
                                        </div>
                                    </div>
                                    <div class="spell-wrapper">
                                        <div class="mid-container">
                                            <div class="spell-img" id="spell_img_${i}_1"></div>
                                            <div class="spell-img" id="spell_img_${i}_2"></div>
                                        </div>
                                    </div>
                                    <div class="spell-wrapper">
                                        <div class="mid-container">
                                            <div class="rune-img" id="rune_img_${i}_1"></div>
                                            <div class="rune-img" id="rune_img_${i}_2"></div>
                                        </div>                                
                                    </div>
                                    <div class="champion-name">
                                        <span>${curChampionInfo.name}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="item-detail-3">
                                <div class="KDA-wrapper">
                                    <div class="KDA-score" id="KDA_score_${i}">${refineKDA(KDA)}</div>
                                    <div class="KDA">
                                        <span class="kill">${curUserStat.kills}</span>
                                        <span class="slash">/</span>
                                        <span class="death">${curUserStat.deaths}</span>
                                        <span class="slash">/</span>
                                        <span class="assist">${curUserStat.assists}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="item-detail-5">
                                <div class="gold-wrapper">
                                    <span>${numberWithCommas(curUserStat.goldEarned)} G</span>
                                </div>
                            ${lastSecondContainer}
                                <div class="cs-wrapper">
                                    <span>CS</span>
                                    <span class="total-cs">${curUserStat.totalMinionsKilled}</span><span 
                                    class="average-cs">(8.5)</span>
                                </div>
                            </div>
                            <div class="item-detail-4">
                            <div class="item-wrapper">
                                <div class="item-item" id="item_item_img_${i}_0"></div>
                                <div class="item-item" id="item_item_img_${i}_1"></div>
                                <div class="item-item" id="item_item_img_${i}_2"></div>
                                <div class="item-item" id="item_item_img_${i}_deco"></div>
                                <div class="item-item" id="item_item_img_${i}_3"></div>
                                <div class="item-item" id="item_item_img_${i}_4"></div>
                                <div class="item-item" id="item_item_img_${i}_5"></div>
                                <!-- <div class="item-item"></div> -->
                            </div>
                        </div>
                        </div>
                    </div>
                    <div class="game-history-item-description-tab" id="game_history_item_desc_${i}">
                        <div class="item-detail-menu-list-tab">
                            <div class="detail-menu-list-tab general-info focused" style="grid-column: 1;" id="general_match_info_tab_${i}">
                                <span>일반 정보</span>
                            </div>
                            <div class="detail-menu-list-tab deal-amount-info unfocused" style="grid-column: 2;" id="deal_amount_info_tab_${i}">
                                <span>딜량 확인</span>
                            </div>
                        </div>
                        <div class="item-detail-desc-content-wrapper">
                            <div class="item-detail-desc-content">
                                <div class="team-desc-label-wrapper ${team1WinInfoLabel[0]}">
                                    <span class="team-desc-win-or-lose">${team1WinInfoLabel[1]}</span>
                                    <span class="team-label">블루 팀</span>
                                </div>
                                <div class="participant-info-container ${team1WinInfoLabel[0]}" id="participant_info_container_1_${i}">
                                </div>
                                <div class="team-desc-label-wrapper ${team2WinInfoLabel[0]}">
                                    <span class="team-desc-win-or-lose">${team2WinInfoLabel[1]}</span>
                                    <span class="team-label">레드 팀</span>
                                </div>
                                <div class="participant-info-container ${team2WinInfoLabel[0]}" id="participant_info_container_2_${i}">
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                `);
				
                let team1infoBundle = [];
                let team2infoBundle = [];

                for(let j=0; j<res.metadata.participants.length;j++){
                    let participantTeam = res.info.participants[j].teamId;
                    let participantIdentity = res.info.participants[j];
                    let participantStat = res.info.participants[j];
                    let pKDA = (participantStat.kills + participantStat.assists)/participantStat.deaths;
                    let historyItemDescriptionSegment = `
                    <div class="participant-info">
                        <div class="participant-detail-info-1">
                            <div class="participant-champion-img" id="participant_champion_image_${i}_${j}"></div>
                        </div>
                        <div class="participant-detail-info-2">
                            <div class="participant-summoner-spell-wrapper">
                                <div class="participant-spell" id="participant_spell1_${i}_${j}"></div>
                                <div class="participant-spell" id="participant_spell2_${i}_${j}"></div>
                            </div><div class="participant-summoner-perk-wrapper">
                                <div class="participant-perk" id="participant_perk1_${i}_${j}"></div>
                                <div class="participant-perk zoom-out" id="participant_perk2_${i}_${j}"></div>
                            </div>
                        </div>
                        <div class="participant-detail-info-3">
                            <div class="participant-info-wrapper">
                                <span class="participant-username">
                                    <a href="#" onclick="findNewSummoner('${participantIdentity.summonerName}');">${participantIdentity.summonerName}</a>
                                </span>
                                <span class="participant-tier-level" id="participant_tier_level_${i}_${j}">Unknown</span>
                            </div>
                        </div>
                        <div class="participant-detail-info-4">
                            <div class="participant-kda-wrapper">
                                <span class="participant-kda-score">${refineKDA(pKDA)}</span>
                                <span class="participant-kda">
                                    <span class="kill">${participantStat.kills}</span>
                                    <span class="slash">/</span>
                                    <span class="death">${participantStat.deaths}</span>
                                    <span class="slash">/</span>
                                    <span class="assist">${participantStat.assists}</span>
                                </span>
                            </div>
                        </div>
                        <div class="participant-detail-flexible-box">
                            <div class="participant-detail-info-5 pulled-deal-container">
                                <div class="participant-cs-wrapper">
                                    <span class="participant-gold">${numberWithCommas(participantStat.goldEarned)} G</span>
                                    <span class="participant-cs">CS ${participantStat.totalMinionsKilled}(15.6)</span>
                                </div>
                            </div>
                            <div class="participant-detail-info-6 pulled-deal-container">
                                <div class="participant-item-wrapper">
                                    <div class="participant-item" id="participant_item0_${i}_${j}"></div>
                                    <div class="participant-item" id="participant_item1_${i}_${j}"></div>
                                    <div class="participant-item" id="participant_item2_${i}_${j}"></div>
                                    <div class="participant-item" id="participant_item_deco_${i}_${j}"></div>
                                    <div class="participant-item" id="participant_item3_${i}_${j}"></div>
                                    <div class="participant-item" id="participant_item4_${i}_${j}"></div>
                                    <div class="participant-item" id="participant_item5_${i}_${j}"></div>
                                </div>
                            </div>
                            <div class="participant-detail-info-7 pushed-deal-container">
                                <div class="deal-amount-wrapper">
                                    <span class="total-dealt-amount">${participantStat.totalDamageDealtToChampions}</span> (
                                    <span class="physical-dealt-amount">${participantStat.physicalDamageDealtToChampions}</span> /
                                    <span class="magical-dealt-amount">${participantStat.magicDamageDealtToChampions}</span> /
                                    <span class="true-dealt-amount">${participantStat.trueDamageDealtToChampions}</span> )
                                </div>
                                <div class="max-dealt-bar" id="deal_damage_bar_${i}_${j}">
                                    <div class="physical-dealt-bar"></div><!--
                                    --><div class="magical-dealt-bar"></div><!--
                                    --><div class="true-dealt-bar"></div>
                                </div>
                            </div>
                        </div>
                    </div>
                    `;
					
                    if(participantTeam == 100){
                        team1infoBundle.push(historyItemDescriptionSegment);
                    }else{
                        team2infoBundle.push(historyItemDescriptionSegment);
                    }
                }
				

                nativeHistoryItemBundle[i] = {
                    segment: historyHTMLdocSegment,
                    curChampInfo: getChampionInfoFromKey(curUserInfo.championId),
                    curUserInfo: curUserInfo,
                    userKDA: KDA,
                    team1infoBundle: team1infoBundle,
                    team2infoBundle: team2infoBundle,
                };

                participantInfoBundle[i] = {
                    participantIdentities: res.info.participants,
                    participants: res.info.participants,
                }
            },
            error: function(req, stat, err){
                console.log(err);
				console.log("여기서 에러걸림");
				swal(err);
                if(err == "Too Many Requests") swal('요청이 너무 빠릅니다!');
            },
        });

        loadHistoryItemCallback.push(request);
    }

    $.when.apply(null, loadHistoryItemCallback).done(function(){
        for(let i=0;i<matchList.length;i++){
            nativeInfoSegment = nativeHistoryItemBundle[i];
            participantInfoSegment = participantInfoBundle[i];

            gameHistoryListContainer.append(nativeInfoSegment.segment);
            let curChampionInfo = nativeInfoSegment.curChampInfo;
            let curUserInfo = nativeInfoSegment.curUserInfo;
            let curUserKDA = nativeInfoSegment.userKDA;
            let curTeam1Info = nativeInfoSegment.team1infoBundle;
            let curTeam2Info = nativeInfoSegment.team2infoBundle;


            let participantIdentitiesInfo = participantInfoSegment.participantIdentities;
            let participantsInfo = participantInfoSegment.participants;
			//curUserInfo.summoner1Id
			//curUserInfo.summoner2Id
            let champion_img_url = getLatestDataDragonURL()+"/img/champion/"+curChampionInfo.id+".png";
            let spell1_url_def = getLatestDataDragonURL()+"/img/spell/"+getSpellInfoFromKey(curUserInfo.summoner1Id).id+".png";
            let spell2_url_def = getLatestDataDragonURL()+"/img/spell/"+getSpellInfoFromKey(curUserInfo.summoner2Id).id+".png";
            let perk1_info = getDetailPerkInfoFromKey(curUserInfo.perks.styles[0].selections[0].perk);
            let perk2_info = getPerkInfoFromKey(curUserInfo.perks.styles[1].style);

            let perk1_url_def = "https://ddragon.leagueoflegends.com/cdn/img/"+getRightPathOfDetailPerkImage(perk1_info.iconPath);
            let perk2_url_def = "https://ddragon.leagueoflegends.com/cdn/img/"+perk2_info.icon;
            $('#main_champion_illust_'+i).css("background-image", `url(${champion_img_url})`);
            $('#spell_img_'+i+"_1").css("background-image", `url(${spell1_url_def})`);
            $('#spell_img_'+i+"_2").css("background-image", `url(${spell2_url_def})`);

            const rune1 = $('#rune_img_'+i+"_1");
            const rune2 = $('#rune_img_'+i+"_2");
            rune1.css("background-image", `url(${perk1_url_def})`);
            rune1.css("background-size", "100%");
            rune2.css("background-image", `url(${perk2_url_def})`);
            rune2.css("background-size", "80%");
            $('.rune-img').css("background-color", "#111");
            
            $('#KDA_score_'+i).css("background-color", getColorFromKDA(curUserKDA));


            let itemList = [];
            for(let j=0; j<=5; j++) {
                let itemItem = curUserInfo['item'+j];
                let itemInfo = itemImageData[itemItem];
                if(itemItem != 0)
                    itemList.push(itemInfo);
            }
            let sorted = sortItemListWithPrice(itemList);
            for(let j=0; j<sorted.length; j++) {
                let itemImageName = sorted[j].image.full;
                let itemURL = getLatestDataDragonURL()+"/img/item/"+itemImageName;
                $('#item_item_img_'+i+'_'+j).css("background-image", `url(${itemURL})`);
            }

            //장신구는 따로 설정
            let decoItemCode = curUserInfo.item6;
            if(decoItemCode != 0){
                let decoItemURL = getLatestDataDragonURL()+"/img/item/"+itemImageData[decoItemCode].image.full;
                $('#item_item_img_'+i+'_deco').css("background-image", `url(${decoItemURL})`);
            }

            const team1Container = $('#participant_info_container_1_'+i);
            const team2Container = $('#participant_info_container_2_'+i);

            for(let j=0;j<curTeam1Info.length;j++){
                team1Container.append(curTeam1Info[j]);
            }
            for(let j=0;j<curTeam2Info.length;j++){
                team2Container.append(curTeam2Info[j]);
            }
			

            //팀 유저 정보
            let maxDealtFromTeam = -1;
            for(let j=0;j<participantsInfo.length;j++){
                let totalDealt = participantsInfo[j].totalDamageDealtToChampions;
                if(totalDealt > maxDealtFromTeam) maxDealtFromTeam = totalDealt;
            }

            if(maxDealtFromTeam === -1){
                console.log("Error getting max dealt damage from team!");
                maxDealtFromTeam = 200000;
            }

            for(let j=0;j<participantsInfo.length;j++){
                let participantChampionImageView = $('#participant_champion_image_'+i+"_"+j);
                let participantSpell1ImageView = $('#participant_spell1_'+i+"_"+j);
                let participantSpell2ImageView = $('#participant_spell2_'+i+"_"+j);
                let participantPerk1ImageView = $('#participant_perk1_'+i+"_"+j);
                let participantPerk2ImageView = $('#participant_perk2_'+i+"_"+j);
                let participantTierView = $('#participant_tier_level_'+i+"_"+j);

                let participantInfo = participantsInfo[j];
                let participantIdentityInfo = participantIdentitiesInfo[j];
                let participantStat = participantInfo;
                let participantChampInfo = getChampionInfoFromKey(participantInfo.championId);
                let perk1Info = getDetailPerkInfoFromKey(participantInfo.perks.styles[0].selections[0].perk);
                let perk2Info = getPerkInfoFromKey(participantInfo.perks.styles[1].style);

                let participantChampionImgURL = participantChampInfo == undefined?"unknown":getLatestDataDragonURL()+"/img/champion/"+participantChampInfo.id+".png";
                let spell1ImageURL = getLatestDataDragonURL()+"/img/spell/"+getSpellInfoFromKey(participantInfo.summoner1Id).id+".png";
                let spell2ImageURL = getLatestDataDragonURL()+"/img/spell/"+getSpellInfoFromKey(participantInfo.summoner2Id).id+".png";
                let perk1ImageURL = "https://ddragon.leagueoflegends.com/cdn/img/"+getRightPathOfDetailPerkImage(perk1Info.iconPath);
                let perk2ImageURL = "https://ddragon.leagueoflegends.com/cdn/img/"+perk2Info.icon;

                participantChampionImageView.css("background-image", `url(${participantChampionImgURL})`);
                participantSpell1ImageView.css("background-image", `url(${spell1ImageURL})`);
                participantSpell2ImageView.css("background-image", `url(${spell2ImageURL})`);
                participantPerk1ImageView.css("background-image", `url(${perk1ImageURL})`);
                participantPerk2ImageView.css("background-image", `url(${perk2ImageURL})`);
                participantPerk2ImageView.css("background-size", "80%");
				
				TIME_COUNT+=500;
				
                //전적 아이템마다 같이한 사람들 정보 로드 - request가 많으므로 Product 검사 끝나면 주석 처리 뺄 것
				/*SET_TIMER = setTimeout(async () => {
                	getAndLoadParticipantsLeagueInfoBySummonerID(participantTierView, participantIdentityInfo.summonerId);
					
					console.log(j);
				}, TIME_COUNT);*/
				
                let participantItemList = [];
                for(let k=0; k<=5; k++) {
                    let pitemCode = participantInfo['item'+k];
                    let pitemInfo = itemImageData[pitemCode];
                    if(pitemCode != 0)
                        participantItemList.push(pitemInfo);
                }
                let sorted = sortItemListWithPrice(participantItemList);
                for(let k=0; k<sorted.length; k++) {
                    let itemImageName = sorted[k].image.full;
                    let itemURL = getLatestDataDragonURL()+"/img/item/"+itemImageName;
                    $('#participant_item'+k+"_"+i+'_'+j).css("background-image", `url(${itemURL})`);
                }

                let pdecoItemCode = participantInfo.item6;
                if(pdecoItemCode != 0){
                    let pdecoItemURL = getLatestDataDragonURL()+"/img/item/"+itemImageData[pdecoItemCode].image.full;
                    $('#participant_item_deco'+"_"+i+'_'+j).css("background-image", `url(${pdecoItemURL})`);
                }

                let participantPhysicalDealtView = $(`#deal_damage_bar_${i}_${j} .physical-dealt-bar`);
                let participantMagicalDealtView = $(`#deal_damage_bar_${i}_${j} .magical-dealt-bar`);
                let participantTrueDealtView = $(`#deal_damage_bar_${i}_${j} .true-dealt-bar`);
				//let maxDealtView = $(`#deal_damage_bar_${i}_${j} .max-dealt-bar`);
				let maxDealtView = $("#hidden_content_width");
				let maxDealtViewWidth = maxDealtView.width();
				
                let physicalDealt = participantStat.physicalDamageDealtToChampions;
                let magicalDealt = participantStat.magicDamageDealtToChampions;
                let trueDealt = participantStat.trueDamageDealtToChampions;
                let totalDealt = participantStat.totalDamageDealtToChampions;
					
                let physicalDealtRate = physicalDealt/maxDealtFromTeam;
                let magicalDealtRate = magicalDealt/maxDealtFromTeam;
                let trueDealtRate = trueDealt/maxDealtFromTeam;
				
                let physicalDealtWidth = physicalDealtRate * maxDealtViewWidth;
                let magicalDealtWidth = magicalDealtRate * maxDealtViewWidth;
                let trueDealtWidth = trueDealtRate * maxDealtViewWidth;
                
				
                // let maxTrueDealtWidth = maxDealtViewWidth - physicalDealtWidth - magicalDealtWidth;
                
                participantPhysicalDealtView.css("width", physicalDealtWidth+"px");
                participantMagicalDealtView.css("width", magicalDealtWidth+"px");
                participantTrueDealtView.css("width", trueDealtWidth+"px");
            }
			
            //상세 설명 탭 확장 애니메이션
            let totalItemWrapper = $('#game_history_item_wrapper_'+i);
            let innerItem = $('#game_history_item_'+i);
            let rolledTab = $('#game_history_item_desc_'+i);
        
            let rolledTabHeight = rolledTab.outerHeight();
            let originalTotalWrapperHeight = totalItemWrapper.height();
            let strechedTotalWrapperHeight = originalTotalWrapperHeight + rolledTabHeight;
            let rolledTopOffset = -rolledTabHeight;
            rolledTab.css("top", (originalTotalWrapperHeight)+"px");
            rolledTab.css("z-index", (9900-i)+"");
        
            const animationStyle = 'easeOutQuint';
            const animationDelay = 500;
        
            innerItem.on("click", function(){
                let isFolded = totalItemWrapper.hasClass('folded');
                if(isFolded){
                    rolledTab.css("display", "inline-block");
                    totalItemWrapper.animate({
                        height: strechedTotalWrapperHeight
                    }, animationDelay, animationStyle, function(){
                        totalItemWrapper.removeClass('folded');
                        totalItemWrapper.addClass('unfolded');
                    });
					
                }
                else {
                    totalItemWrapper.animate({
                        height: originalTotalWrapperHeight
                    }, animationDelay, animationStyle, function(){
                        rolledTab.css("display", "none");
                        totalItemWrapper.removeClass('unfolded');
                        totalItemWrapper.addClass('folded');
                    });
					
                }
				let maxDealtView = $(".max-dealt-bar");
				let maxDealtViewWidth = maxDealtView.width();
            });

            const detailMenuListTabContainer = $('#game_history_item_desc_'+i+' '+'.detail-menu-list-tab');
            const generalMatchInfoTab = $('#general_match_info_tab_'+i);
            const dealAmountInfoTab = $('#deal_amount_info_tab_'+i);
            const pulledByDealInfo = $('#game_history_item_desc_'+i+' '+'.participant-info .pulled-deal-container');
            const pushedByDealInfo = $('#game_history_item_desc_'+i+' '+'.participant-info .pushed-deal-container');
            const originalPulledTabLeft = $('.participant-detail-info-5').first();
            
        
            dealAmountInfoTab.on("click", function(){
                pulledByDealInfo.fadeOut(animationDelay_DealInfo);
                pushedByDealInfo.fadeIn(animationDelay_DealInfo);
                detailMenuListTabContainer.removeClass("focused");
                detailMenuListTabContainer.addClass("unfocused");
                $(this).removeClass("unfocused");
                $(this).addClass("focused");
            });
        
            generalMatchInfoTab.on("click", function(){
                pulledByDealInfo.fadeIn(animationDelay_DealInfo);
                pushedByDealInfo.fadeOut(animationDelay_DealInfo);
                detailMenuListTabContainer.removeClass("focused");
                detailMenuListTabContainer.addClass("unfocused");
                $(this).removeClass("unfocused");
                $(this).addClass("focused");
            });
        }

        const winRateInfo = getWinRateInfo(matchList, userInfo , participantInfoBundle);
        let winRate = winRateInfo.winRate;
        let winNum = winRateInfo.winNum;
        let loseNum = winRateInfo.loseNum;

        const winRatePieChartElem = $('#win_rate_pie_chart');
        const winRatePercentageText = $('#win_rate_chart_percentage');
        const winNumText = $('#user_win_num');
        const loseNumText = $('#user_lose_num');
        let winRatePieChart = new Chart(winRatePieChartElem, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: [winRate, 100-winRate],
                    backgroundColor: [
                        'rgb(0, 214, 230)',
                        'rgb(250, 40, 40)',
                    ],
                    borderWidth: 0,
                }],
            },
            options: {
                maintainAspectRatio: false,
                cutoutPercentage: 75,
                animation: {
                    easing: 'easeInOutCirc',
                }
            }
        });

        $({
            curPercentValue: 0,
            winNumValue: 0,
            loseNumValue: 0,
        }).animate({
            curPercentValue: parseInt(winRate),
            winNumValue: winNum,
            loseNumValue: loseNum,
        }, {
            duration: 800,
            easing: 'swing',
            step: function(){
                winRatePercentageText.text(Math.ceil(this.curPercentValue)+"%");
                winNumText.text(Math.ceil(this.winNumValue)+"W");
                loseNumText.text(Math.ceil(this.loseNumValue)+"L");
            },
        });
    });
	let nexthistoryHTMLdocSegment = (`
		<div id="button_wrap">
			<input type="button" value="<<" onclick="HistoryCountingMinus(); clickedBtn();">
			<input type="button" value=">>" onclick="HistoryCountingPlus(); clickedBtn();">
			<br>
			<br>
			<p style="font-color:white;">${count_print}</p>
			<br>
			<br>
			<br>
			<br>
		</div>
	`);
	const nextButton = $('#next-game-list-button');
	$('#button_wrap').remove();
	nextButton.append(nexthistoryHTMLdocSegment);
}

//최근 전적 다음탭, 전탭
function HistoryCountingMinus() {	
	if(count_start==0) {
		swal("마지막 페이지입니다.");
	}
	else {
		for(let i=0;i<=SET_TIMER; i++) {
			clearTimeout(i);
		}
		TIME_COUNT=0;
		count_start-=19;
		count_print--;
		getSummonerRecentGameHistoryBySummonerPuuid(userInfo_next);
	}
}

function HistoryCountingPlus() {
	for(let i=0;i<=SET_TIMER; i++) {
			clearTimeout(i);
	}
	TIME_COUNT=0;
	count_start+=19;
	count_print++;
	getSummonerRecentGameHistoryBySummonerPuuid(userInfo_next);
}

//숙련도
function loadSummonerMasteryList(masteryEntries){
    const championMasteryList = $('#champion_mastery_list');
    const championMasteryItems = $('.champion-mastery-item');
	championMasteryItems.remove();
    

    let masteryTotalScore = 0;
    let masteryLevelStack = [0,0,0,0,0,0,0,0];
    masteryLevelStack.length = 8;

    for(let i=0;i<masteryEntries.length;i++){
        let masteryEntry = masteryEntries[i];
        let entryLabel = "normal-mastery";
        let entryIndex = i+1;
        if(i<3) entryLabel = "highest"+entryIndex+"-mastery";
		
        let championInfo = getChampionInfoFromKey(masteryEntry.championId);
		console.log(masteryEntry.championId);
        if(championInfo == undefined) continue;
        let championImgPath = getLatestDataDragonURL()+"/img/champion/"+championInfo.id+".png";
        let masteryAmount = masteryEntry.championPoints;
        let masteryLevel = masteryEntry.championLevel;
	
        let masterySegment = `
		<div class="erase_mastery_list"> 
			<div class="champion-mastery-item ${entryLabel}" id="champion_mastery_item_${i}">
				<div class="mastery-champion-img" id="mastery_champion_img_${i}"></div>
				<span class="mastery-champion-name">${championInfo.name}</span>
				<span class="champion-mastery">${numberWithCommas(masteryAmount)} 점</span>
			</div>
		</div>
        `;

        championMasteryList.append(masterySegment);
        $('#mastery_champion_img_'+i).css("background-image", `url(${championImgPath})`);
        let championMasteryItemView = $('#champion_mastery_item_'+i);
        switch(masteryLevel){
            case 7:
                championMasteryItemView.css("background", "linear-gradient(to right, #009683, #111)");
                break;
            case 6:
                championMasteryItemView.css("background", "linear-gradient(to right, #b800b0, #111)");
                break;
            case 5:
                championMasteryItemView.css("background", "linear-gradient(to right, #c10, #111)");
                break;
            default:
                championMasteryItemView.css("background", "linear-gradient(to right, #6f6f6f, #111)");
                break;
        }
        
        masteryLevelStack[masteryLevel]++;
        masteryTotalScore += masteryAmount;
    }
    for(let i=7;i>=3;i--){
        let masterySegAmountView = $(`#champion_mastery${i}_total_value`);
        masterySegAmountView.text(masteryLevelStack[i]);
    }
    $('#total_mastery').text(numberWithCommas(masteryTotalScore)+" 점");
	
}


function getAndLoadParticipantsLeagueInfoBySummonerID(span, id){
    $.ajax({
        url: "https://kr.api.riotgames.com/lol/league/v4/entries/by-summoner/"+id,
        type: "GET",
        dataType: "json",
        data: {
            "api_key": key,
        },
        success: function(res){
            let candidates = [];
            for(let i=0;i<res.length;i++){
                let tier_info = getConvertedLeagueTier(res[i].tier);
                let type_info = getConvertedLeagueType(res[i].queueType);
                let label_info = tier_info.name + " " + res[i].rank;
                candidates.push({
                    tierInfo: tier_info,
                    typeInfo: type_info,
                    labelInfo: label_info,
                });
            }

            for(let i=0;i<candidates.length;i++){
                candidate = candidates[i];
                if(candidate.typeInfo.level === 3){
                    let tierInfo = candidate.tierInfo;
                    span.text(candidate.labelInfo);
                    if(tierInfo.level > 5)
                        span.css("background-image", `linear-gradient( 150deg, ${tierInfo.color}, ${tierInfo.color2})`);
                    else
                        span.css("background-color", `${tierInfo.color})`);
                    return;
                }
            }
            for(let i=0;i<candidates.length;i++){
                candidate = candidates[i];
                if(candidate.typeInfo.level === 2){
                    let tierInfo = candidate.tierInfo;
                    span.text(candidate.labelInfo);
                    if(tierInfo.level > 5)
                        span.css("background-image", `linear-gradient( 150deg, ${tierInfo.color}, ${tierInfo.color2})`);
                    else
                        span.css("background-color", `${tierInfo.color})`);
                    return;
                }
            }
            for(let i=0;i<candidates.length;i++){
                candidate = candidates[i];
                if(candidate.typeInfo.level === 1){
                    span.text(candidate.labelInfo);
                    span.css("background", "green");
                    return;
                }
            }
            /*$.ajax({
                url: "https://kr.api.riotgames.com/lol/summoner/v4/summoners/"+id,
                type: "GET",
                aync: false,
                dataType: "json",
                data: {
                    "api_key": key,
                },
                success: function(res){
                    span.text(res.summonerLevel+" 레벨");
                },
                error: function(req, stat, err){
                    if(err == "Not Found") console.log("존재하지 않는 소환사_id: "+id);
                    else if(err == "Forbidden") console.log("API_KEY 만료됨");
                    else{
                        console.log(err);
                        if(err == "Too Many Requests") span.text('Error-1');
                        else span.text('Error-2');
                    }
                },
            });*/
        },
        error: function(req, stat, err){
            
            if(err == "Service Unavailable") console.log('현재 API 서버 사용 불가능');
            else if(err == "Too Many Requests") console.log('요청이 너무 빠름');
            else console.log(err);
        },
    });
}

function loadSummonerGeneralInfo(info){
	
    $('#current_summoner_profile_icon_img').attr("src", getLatestDataDragonURL()+"/img/profileicon/"+info.profileIconId+".png");
    $('#current_summoner_name').text(info.name);
    $('#current_summoner_level').text(info.summonerLevel);
}

//현재 게임 정보
function loadSummonerLeagueInfo(info){
    const tierInfoWrapper = $('#tier_info_detail_wrapper');
    $('#tier_info_detail_wrapper .small-info-box').remove();

    for(let i=0;i<info.length;i++){
        let tier_info = getConvertedLeagueTier(info[i].tier);
        let tier_rank = tier_info.name+" "+info[i].rank;
        let converted_type = getConvertedLeagueType(info[i].queueType).type;
        let new_rank_label = converted_type+" | "+tier_rank;
        tierInfoWrapper.append(`<div class="small-info-box" id="info_box_${converted_type}">${new_rank_label}</div>`);
        
        let box = $('#info_box_'+converted_type);
        
        if(tier_info.level > 5){
            box.css("border", "2px");
            box.css("border-style", "solid");
            box.css("border-image", `linear-gradient( 150deg, ${tier_info.color}, ${tier_info.color2})`);
            box.css("border-image-slice", "1");
        }
        else{
            box.css("border", `2px solid ${tier_info.color}`);
        }
    }
}

function loadRotationChampion(info) {
	console.log(info);
	console.log(info.freeChampionIds);
	console.log(info.freeChampionIds[0]);
	for(let i=0;i<info.freeChampionIds.length;i++) {
		let rotation_champion_img_box = `<img class="img_rotation_champ" id="champion${i}">`
		$('#rotation_champ').append(rotation_champion_img_box);
		
		let rotation_champion_id = getChampionInfoFromKey(info.freeChampionIds[i]);
		$('#champion'+i).attr("src", getLatestDataDragonURL()+"/img/champion/"+rotation_champion_id.id+".png");
	}
	console.log(championData);
}

