function check_key() {
    for (let key in championKeyDictEngName) {
		let champion_Name =  document.getElementById("h1_champion"+key).innerHTML;
		let champion_Name_div = document.getElementById("tooltip"+key);
		let keyUp = document.getElementById("search_summoner_input").value;
		if(champion_Name.indexOf(keyUp) > -1 || keyUp.length==0) {champion_Name_div.style.display = "inline-block"; }
		else champion_Name_div.style.display = "none";
	}
}