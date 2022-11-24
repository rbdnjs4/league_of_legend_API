function loadRotationChampion(info) {
	console.log(info[0]);
	console.log(info.freeChampionIds);
	console.log(info.freeChampionIds[0]);
	for(let i=0;i<info.freeChampionIds.length;i++) {
		let rotation_champion_id = getChampionInfoFromKey(info.freeChampionIds[i]);
		console.log(rotation_champion_id);
		$('#champion'+i).attr("src", getLatestDataDragonURL()+"/img/champion/"+rotation_champion_id.id+".png");
		console.log(getLatestDataDragonURL()+"/img/champion/"+rotation_champion_id.id+".png");
		$('#h1_champion'+i).text(rotation_champion_id.name);
	}
}
