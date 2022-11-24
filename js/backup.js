function loadRotationChampion(info) {
	let abc = $('#champion_table');
	for (let key in championKeyDictEngName) {
		key = parseInt(key);
		if(key % 4 == 0) {
			let loadChampionhtml = (`
				<tr>
					<td>
						<div class="tooltip"><img class="img_rotation_champ" id="champion${key}">
							<div class="tooltip-content">
								<div class="p-2 text-left font-size-11">
									<div class="mb-2">
										<span class="mr-2 align-middle">${championKeyDictKorName[key]}</span>
									</div>
									<div class="mt-2">
										<div class="mb-1">스킬</div>
										<div class="font-size-0">
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key]}Q.png" alt="" width="32" height="32">
											</div>
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key]}W.png" alt="" width="32" height="32">
											</div>
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key]}E.png" alt="" width="32" height="32">
											</div>
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key]}R.png" alt="" width="32" height="32">
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<h1 class="img_rotation_text" id=h1_champion${key}>unknown</h1>
					</td>
					
					<td>
						<div class="tooltip"><img class="img_rotation_champ" id="champion${key+1}">
							<div class="tooltip-content">
								<div class="p-2 text-left font-size-11">
									<div class="mb-2">
										<span class="mr-2 align-middle">${championKeyDictKorName[key+1]}</span>
									</div>
									<div class="mt-2">
										<div class="mb-1">스킬</div>
										<div class="font-size-0">
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key+1]}Q.png" alt="" width="32" height="32">
											</div>
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key+1]}W.png" alt="" width="32" height="32">
											</div>
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key+1]}E.png" alt="" width="32" height="32">
											</div>
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key+1]}R.png" alt="" width="32" height="32">
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<h1 class="img_rotation_text" id=h1_champion${key+1}>unknown</h1>
					</td>
					
					<td>
						<div class="tooltip"><img class="img_rotation_champ" id="champion${key+2}">
							<div class="tooltip-content">
								<div class="p-2 text-left font-size-11">
									<div class="mb-2">
										<span class="mr-2 align-middle">${championKeyDictKorName[key+2]}</span>
									</div>
									<div class="mt-2">
										<div class="mb-1">스킬</div>
										<div class="font-size-0">
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key+2]}Q.png" alt="" width="32" height="32">
											</div>
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key+2]}W.png" alt="" width="32" height="32">
											</div>
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key+2]}E.png" alt="" width="32" height="32">
											</div>
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key+2]}R.png" alt="" width="32" height="32">
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<h1 class="img_rotation_text" id=h1_champion${key+2}>unknown</h1>
					</td>
					
					<td>
						<div class="tooltip"><img class="img_rotation_champ" id="champion${key+3}">
							<div class="tooltip-content">
								<div class="p-2 text-left font-size-11">
									<div class="mb-2">
										<span class="mr-2 align-middle">${championKeyDictKorName[key+3]}</span>
									</div>
									<div class="mt-2">
										<div class="mb-1">스킬</div>
										<div class="font-size-0">
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key+3]}Q.png" alt="" width="32" height="32">
											</div>
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key+3]}W.png" alt="" width="32" height="32">
											</div>
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key+3]}E.png" alt="" width="32" height="32">
											</div>
											<div class="d-inline-block mr-2 mb-2">
												<img src="https://ddragon.leagueoflegends.com/cdn/12.22.1/img/spell/${championKeyDictEngName[key+3]}R.png" alt="" width="32" height="32">
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
						<h1 class="img_rotation_text" id=h1_champion${key+3}>unknown</h1>
					</td>
				</tr>
			`);
			$('.champion_table').append(loadChampionhtml);
		}
		$('#champion'+key).attr("src", getLatestDataDragonURL()+"/img/champion/"+championKeyDictEngName[key]+".png");
		$('#h1_champion'+key).text(championKeyDictKorName[key]);
	}
}
