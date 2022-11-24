function loadRotationChampion(info) {
	for (let key in championKeyDictEngName) {
		$.ajax({
			url: getLatestDataDragonURL() + "/data/ko_KR/champion/"+championKeyDictEngName[key]+".json",
			type: "GET",
			dataType: "json",
			success: function(res) {
				console.log(res);
				const skills = [];
				const skills_name = [];
				const skills_description = []; 
				const tags = [];
				const skills_MP = [];
				const skills_COOL = [];
				for(let i=0;i<res.data[championKeyDictEngName[key]].spells.length;i++) {
					skills[i] = res.data[championKeyDictEngName[key]].spells[i].id; //스킬 영어 이름(이미지에 쓰임)
					skills_name[i] = res.data[championKeyDictEngName[key]].spells[i].name; //스킬 이름
					skills_description[i] = res.data[championKeyDictEngName[key]].spells[i].description; //스킬 설명
					skills_MP[i] = res.data[championKeyDictEngName[key]].spells[i].costBurn;
					skills_COOL[i] = res.data[championKeyDictEngName[key]].spells[i].cooldownBurn
				}
				for(let i=0;i<res.data[championKeyDictEngName[key]].tags.length;i++) {
					tags[i] = res.data[championKeyDictEngName[key]].tags[i]; //챔피언 특성(메이지, 전사, 탱커)
				}
				
				load2(skills, skills_name, skills_description, skills_MP, skills_COOL, tags ,key);
			},
			error: function(req, stat, err) {
				console.log(err);
			}
		});
	}
}

function load2(skills, skills_name, skills_description, skills_MP, skills_COOL, tags ,key) {
	key = parseInt(key);
			let loadChampionhtml = (`
					<div class="row" id="tooltip${key}">
						<div class="tooltip">
							<img class="img_rotation_champ" id="champion${key}">
								<div class="tooltip-content">
									<div class="p-2 text-left font-size-11">
										<div class="mb-2">
											<span class="mr-2 align-middle">${championKeyDictKorName[key]}</span>
											<h1 style="color:red;">${tags}</h1>
										</div>
										<div class="mt-2">
											<div class="mb-1">스킬</div>
											<br>
											<div class="font-size-0">
												<div class="d-inline-block mr-2 mb-2">
													<h2>${skills_name[0]}</h2>
													<img style="float:left;" src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${skills[0]}.png" alt="" width="32" height="32">
													<h1>필요마나 : <font style="color:#36FFFF">${skills_MP[0]}</font></h1>
													<h1>쿨타임 : <font style="color:#FF85FF">${skills_COOL[0]}</font></h1>
													<h1 style="float:left;">${skills_description[0]}</h1>
													<br>
													<br>
												</div>
												<div class="d-inline-block mr-2 mb-2">
													<h2>${skills_name[1]}</h2>
													<img style="float:left;" src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${skills[1]}.png" alt="" width="32" height="32">
													<h1>필요마나 : <font style="color:#36FFFF">${skills_MP[1]}</font></h1>
													<h1>쿨타임 : <font style="color:#FF85FF">${skills_COOL[1]}</font></h1>
													<h1 style="float:left;">${skills_description[1]}</h1>
													<br>
													<br>
												</div>
												<div class="d-inline-block mr-2 mb-2">
													<h2>${skills_name[2]}</h2>
													<img style="float:left;" src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${skills[2]}.png" alt="" width="32" height="32">
													<h1>필요마나 : <font style="color:#36FFFF">${skills_MP[2]}</font></h1>
													<h1>쿨타임 : <font style="color:#FF85FF">${skills_COOL[2]}</font></h1>
													<h1 style="float:left;">${skills_description[2]}</h1>
													<br>
													<br>
												</div>
												<div class="d-inline-block mr-2 mb-2">
													<h2>${skills_name[3]}</h2>
													<img style="float:left;" src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${skills[3]}.png" alt="" width="32" height="32">
													<h1>필요마나 : <font style="color:#36FFFF">${skills_MP[3]}</font></h1>
													<h1>쿨타임 : <font style="color:#FF85FF">${skills_COOL[3]}</font></h1>
													<h1 style="float:left;">${skills_description[3]}</h1>
												</div>
											</div>
										</div>
									</div>
								</div>
							</div>
							<h1 class="img_rotation_text" id=h1_champion${key}>unknown</h1>
						</div>
			`);
		$('.champion_table').append(loadChampionhtml);
		$('#champion'+key).attr("src", getLatestDataDragonURL()+"/img/champion/"+championKeyDictEngName[key]+".png");
		$('#h1_champion'+key).text(championKeyDictKorName[key]);
}