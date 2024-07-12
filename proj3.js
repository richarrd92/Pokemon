// Project 3 CMSC 433: Created By: Darrian Corkadel, Chelsea Okoroji, Bhoj Raj Pandey, Richard M.
var audio1 = null;
var audio2 = null;
var audio3 = null;

var image_loading_done = false;
var database_loading_done = false;
var game_loading_done = false;
var loading_done = false;
var playersTurn = "YOURS";
var landType;
var playerPokemon;
var enemyPokemon;
var imageenemyPokemon;
var playerImage;
var allPokemons = [];
var playerPokiList = [];
var enemy_event_text = null;
var player_event_text = null;
var event_text = null;
var timeout_frames = 0;
var started = false;
var currently_stepping_on="grass";
var battle_started = false;
var has_interacted = false;
var maxhp_enemy = 0;

document.getElementById('fightMenu').style.display = 'none';
document.getElementById('itemMenu').style.display = 'none';

async function databaseFinishedLoading() {
	// Runs upload.js and waits for it to stop running
	const database_loading = await import("./upload.js");
	// Then checks
	var temp_loading_done = await database_loading.checkState();
	
	var loading_div = document.getElementById("Loading");
	var complete_div = document.getElementById("CompletedLoading");
	loading_div.style.display = "none";
	complete_div.style.display = "block";
	database_loading_done = true;
	// First load the resources
	waitForLoad();
}

databaseFinishedLoading();

function stopAudio1() {
	audio1.pause();
	audio1.currentTime = 0;  // Reset playback position to the beginning
}
function stopAudio2() {
	audio2.pause();
	audio2.currentTime = 0;  // Reset playback position to the beginning
}
function stopAudio3() {
	audio3.pause();
	audio3.currentTime = 0;  // Reset playback position to the beginning
}

$(document).ready(function() {
	var SoundSettings = $("#SoundSettings");
	var HelpButton = $("#HelpButton");
	var volumeControl = $("#volumeControl");
	var MenuOptionButton = $("#MenuOptionButton");
	
	$("#PlayButton").click(function () {
		
		if (image_loading_done == true && database_loading_done == true && game_loading_done == true) {
			loading_done = true;
			$("#heading").hide();
			$("#menu").hide();
			$("#screen").show();
			$("#MenuOptionButton").show();
			started = true;
			startGame();
		} 
		else if(started === true){
			$("#heading").hide();
			$("#menu").hide();
			$("#screen").show();
			$("#MenuOptionButton").show()
		}
		else {
			console.log("Loading not done yet");
		}
	});

	$("#SoundSettingsButton").click(function () {
		SoundSettings.show();
	});

	$("#CloseSound").click(function () {
		SoundSettings.hide();
	});
	
	$("#QuitButton").click(function () {
		alert("Quitting game...");
		$("#menu").remove();
		$("#screen").show(); 
		location.reload();
	});

	MenuOptionButton.click(function () {
		document.getElementById('fightMenu').style.display = 'none';
		$("#screen").hide();
		stopAudio2();
		stopAudio3();
		$("#menu").show();
		MenuOptionButton.hide();
		exitLoop();
	});

	volumeControl.on("input", function () {
		audio1.volume = this.value / 100;
		audio2.volume = this.value / 100;
		audio3.volume = this.value / 100;
	});
	$("#FightButton").click(function () {
		
		fight();
	});
});
function generateMenu(menuItems) {
	const poke = document.getElementById('poke');
        if (poke) {
            poke.innerHTML = ''; // Clear existing menu items
            
            menuItems.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                poke.appendChild(li);
            });
        } else {
            console.error('Element with ID "poke" not found');
        }
}

function initializeGame() {
	// Randomly select player and enemy Pokémon from the Loaded data
	playerPokemon = getPokemonByStr(land_pokemon[Math.floor(Math.random() * land_pokemon.length)]).data;
	enemyPokemon = getPokemonByStr(land_pokemon[Math.floor(Math.random() * land_pokemon.length)]).data;
	maxhp_enemy = enemyPokemon.hp;
	
	// Set initial HP for the selected Pokémon
	playerPokemon.hp = 100; // or use actual data if available
	enemyPokemon.hp = 50; // or use actual data if available

}

// Function to parse the image list and create Pokemon stats
function parsePokemonList() {
	var pokemonList = [];
	image_load_list.forEach(function (imageName) {
		var pokemonName = imageName.split(".")[0].replace(/[0-9]/g, "");
		pokemonList.push({
			name: pokemonName.charAt(0).toUpperCase() + pokemonName.slice(1),
			hp: Math.floor(Math.random() * 100) + 50, // Random HP between 50 and 150
			attack: Math.floor(Math.random() * 20) + 5, // Random attack between 5 and 25
		});
	});
	return pokemonList;
}

// Function to get a random Pokemon from the list
function getRandomPokemon(pokemonList) {
	var index = Math.floor(Math.random() * pokemonList.length);
	return Object.assign({}, pokemonList[index]);
}

// !TODO someone implement this function!!!!!!!

function selectStarterPokemon(pokemon) {
	switch(pokemon) {
		case "Balbasaur": {
			playerPokemon = allPokemons[0];
			playerPokiList.push(playerPokemon.name);
	
			break;
		}
		case "Charmander": {
			playerPokemon = allPokemons[4];
			playerPokiList.push(playerPokemon.name);
	
			break;
		}
		case "Squirtle" : {
			playerPokemon = allPokemons[9];
			playerPokiList.push(playerPokemon.name);

			break;
		}
		default: {
			break;
		}
	}
}

// Reset game after win/loss
function resetGame() {
	playerPokemon = getRandomPokemon(parsePokemonList());
	enemyPokemon = getRandomPokemon(parsePokemonList());
	updateBattleLog();
}
function findPokemonNumber(name) {
    for (var i = 0; i < image_load_list_1.length; i++) {
        if (image_load_list_1[i].includes(name)) {
            return image_load_list_1[i].slice(0, 3);
        }
    }
    return "Pokemon not found";
}
function findPokemon(title) {
    for (var i = 0; i < allPokemons.length; i++) {
        if (allPokemons[i].name === title) {
            return allPokemons[i];
        }
    }

    return null;
}
// Image variables
var image_load_list_2=["Battle_scene_background.png", "water_battle.png","title_screen.png","text_box.png","poke_box.png","grass2.png", "grassground.png", "mountain1.png", "waterdeep.png", "grass1.png", "sand1.png", "water1.png"];
var image_load_list_1=["000Bulbasaur.png","004Charmander.png","005Charmeleon.png","006Charizard.png","007Squirtle.png","008Wartortle.png","009Blastoise.png","010Caterpie.png","011Metapod.png","012Butterfree.png","013Weedle.png","014Kakuna.png","015Beedrill.png","016Pidgey.png","017Pidgeotto.png","018Pidgeot.png","019Rattata.png","021Spearow.png","022Fearow.png","023Ekans.png","024Arbok.png","025Pikachu.png","026Raichu.png","027Sandshrew.png","028Sandslash.png","029NidoranF.png","030Nidorina.png","031Nidoqueen.png","032NidoranM.png","033Nidorino.png","034Nidoking.png","035Clefairy.png","036Clefable.png","037Vulpix.png","038Ninetales.png","039Jigglypuff.png","040Wigglytuff.png","041Zubat.png","042Golbat.png","043Oddish.png","044Gloom.png","045Vileplume.png","046Paras.png","047Parasect.png","048Venonat.png","049Venomoth.png","050Diglett.png","051Dugtrio.png","052Meowth.png","053Persian.png","054Psyduck.png","055Golduck.png","056Mankey.png","057Primeape.png","058Growlithe.png","059Arcanine.png","060Poliwag.png","061Poliwhirl.png","062Poliwrath.png","063Abra.png","064Kadabra.png","065Alakazam.png","066Machop.png","067Machoke.png","068Machamp.png","069Bellsprout.png","070Weepinbell.png","071Victreebel.png","072Tentacool.png","073Tentacruel.png","074Geodude.png","075Graveler.png","076Golem.png","077Ponyta.png","078Rapidash.png","079Slowpoke.png","080Slowbro.png","081Magnemite.png","082Magneton.png","083Farfetch'd.png","084Doduo.png","085Dodrio.png","086Seel.png","087Dewgong.png","088Grimer.png","089Muk.png","090Shellder.png","091Cloyster.png","092Gastly.png","093Haunter.png","094Gengar.png","095Onix.png","096Drowzee.png","097Hypno.png","098Krabby.png","099Kingler.png","100Voltorb.png","101Electrode.png","102Exeggcute.png","103Exeggutor.png","104Cubone.png","105Marowak.png","106Hitmonlee.png","107Hitmonchan.png","108Lickitung.png","109Koffing.png","110Weezing.png","111Rhyhorn.png","112Rhydon.png","113Chansey.png","114Tangela.png","115Kangaskhan.png","116Horsea.png","117Seadra.png","118Goldeen.png","119Seaking.png","120Staryu.png","121Starmie.png","122Mr._Mime.png","123Scyther.png","124Jynx.png","125Electabuzz.png","126Magmar.png","127Pinsir.png","128Tauros.png","129Magikarp.png","130Gyarados.png","131Lapras.png","132Ditto.png","133Eevee.png","134Vaporeon.png","135Jolteon.png","136Flareon.png","137Porygon.png","138Omanyte.png","139Omastar.png","140Kabuto.png","141Kabutops.png","142Aerodactyl.png","143Snorlax.png","144Articuno.png","145Zapdos.png","146Moltres.png","147Dratini.png","148Dragonair.png","149Dragonite.png","150Mewtwo-Mega_X.png","150Mewtwo-Mega_Y.png","150Mewtwo.png","151Mew.png"];
var pokemon_data_list=[];
var water_type_pokemon=["007Squirtle.png", "008Wartortle.png", "009Blastoise.png", "054Psyduck.png", "055Golduck.png", "060Poliwag.png", "061Poliwhirl.png", "062Poliwrath.png", "072Tentacool.png", "073Tentacruel.png", "079Slowpoke.png", "080Slowbro.png", "086Seel.png", "087Dewgong.png", "090Shellder.png", "091Cloyster.png", "116Horsea.png", "117Seadra.png", "118Goldeen.png", "119Seaking.png", "120Staryu.png", "121Starmie.png", "129Magikarp.png", "130Gyarados.png", "131Lapras.png", "134Vaporeon.png"];
var land_pokemon = image_load_list_1.filter((pokemon) => !water_type_pokemon.includes(pokemon));
var image_list_1 = {};
var image_list_2 = {};
// Main engine variables
var current_scene = "OPENWORLD"; // Mainly used for switching the entire content of the screen
var scene_state = "POKEMON_SELECTION"; // Used for updating sub-menus or overlays when a scene is running
var running_interval = null; // The interval running the mainLoop function
var audio_to_load = 3;
var complete_images = 0;

audio1 = new Audio('main_menu_sound.mp3');
audio2 = new Audio('openworld_music.mp3');
audio3 = new Audio('battle_audio.mp3');
audio1.onloadeddata = function () {
	audio_to_load = audio_to_load - 1;
	if (complete_images == image_load_list_1.length + image_load_list_2.length && audio_to_load == 0) {
		image_loading_done = true; // Loading is indicated to be done
	}
};
audio2.onloadeddata = function () {
	audio_to_load = audio_to_load - 1;
	if (complete_images == image_load_list_1.length + image_load_list_2.length && audio_to_load == 0) {
		image_loading_done = true; // Loading is indicated to be done
	}
};
audio3.onloadeddata = function () {
	audio_to_load = audio_to_load - 1;
	if (complete_images == image_load_list_1.length + image_load_list_2.length && audio_to_load == 0) {
		image_loading_done = true; // Loading is indicated to be done
	}
};

// Loading checks / database loading checks
function waitForLoad() {
	// Load all of the images
	complete_images = 0;
	for (var i = 0; i < image_load_list_1.length; i++) {
		image_list_1[image_load_list_1[i]] = new Image();
		image_list_1[image_load_list_1[i]].src = "1st Generation\\" + image_load_list_1[i];
		image_list_1[image_load_list_1[i]].onload = function () {
			complete_images = complete_images + 1;
			if (complete_images == image_load_list_1.length + image_load_list_2.length && audio_to_load == 0) {
				image_loading_done = true; // Loading is indicated to be done
			}
		};
	}
	for (var i = 0; i < image_load_list_2.length; i++) {
		image_list_2[image_load_list_2[i]] = new Image();
		image_list_2[image_load_list_2[i]].src = "assets\\" + image_load_list_2[i];
		image_list_2[image_load_list_2[i]].onload = function () {
			complete_images = complete_images + 1;
			if (complete_images == image_load_list_1.length + image_load_list_2.length && audio_to_load == 0) {
				image_loading_done = true; // Loading is indicated to be done
			}
		};
	}

	// Load Pokémon data from the server
	$.ajax({
	url: "loadData.php",
	method: "GET",
	dataType: "json",
	success: function (data) {
		allPokemons = data;

		// Initialize player and enemy Pokémon after data is loaded
		createPokemonTable();
		initializeGame();
		game_loading_done = true;
	},
	error: function (jqXHR, textStatus, errorThrown) {
		console.error("Failed to load Pokémon data:", textStatus, errorThrown);
	},
	});
}
// NOTE: owwe : Open_World World_Exploration
// NOTE: owps : Open World Pokemon Selection
var owwe_player = null;
var owwe_purple = null;
var owwe_world_objects = null;
var owwe_grass_objects = null;
var owwe_water_objects = null;

var owps_background = null;

var owps_bulbasaur = null;
var owps_charmander = null;
var owps_squirtle = null;

var owps_title = null;

var owps_desc_bulbasaur = null;
var owps_desc_charmander = null;
var owps_desc_squirtle = null;

var owps_select_bulbasaur = null;
var owps_select_charmander = null;
var owps_select_squirtle = null;

var battle_background = null;
var water_background = null;
var event_text = null;
var text_box = null;
var poke_box = null;
var player_text_box = null;

function createPokemonTable() {
	for(var i = 0; i < image_load_list_1.length;i++) {
		var name = image_load_list_1[i];
		name = name.substr(3, name.length - 7);
		var pokemon = null;
		if(name === "NidoranM") {
			name = "Nidoranâ™€";
		}
		if(name === "NidoranF") {
			name = "Nidoranâ™‚";
		}
		if(name === "Mr._Mime") {
			name = "Mr. Mime";
		}
		for(var j = 0; j < allPokemons.length;j++) {
			if(allPokemons[j].name === name) {
				pokemon = allPokemons[j];
				break;
			}
		}
		var temp = {
			id: Number(image_load_list_1[i].substr(0, 3)),
			data: pokemon
		};
		pokemon_data_list.push(temp);
	}
}
function getPokemonID(str) {
	return Number(str.substr(0, 3));
}
function getPokemonByID(id) {
	for(var i = 0; i < pokemon_data_list.length;i++) {
		if(pokemon_data_list[i] === id) {
			return pokemon_data_list[i];
		}
	}
	console.log("<-- ERROR getPokemonByID: " + id + " not found. -->");
	return null;
}
function getPokemonByStr(str) {
	var id = getPokemonID(str);
	if(id !== null) {
		for(var i = 0; i < pokemon_data_list.length;i++) {
			if(pokemon_data_list[i].id === id && pokemon_data_list[i].data !== null) {
				return pokemon_data_list[i];
			}
		}
	}
	console.log("<-- ERROR getPokemonByStr: " + str + " not found. -->");
	return null;
}


function startGame() {

	if(loading_done == true) {
		var canvas = document.getElementById("screen");
		canvas.oncontextmenu = function(menu) { menu.preventDefault(); menu.stopPropagation(); }
		
		owps_background = new Rect(1280 * 0.125, 720 * 0.25, 0.75 * 1280, 0.5 * 720);
		owps_background.setColor("grey");

		owps_bulbasaur = new Rect((1280 * 0.125) + 8.4, 720 * 0.25, 300, 300);
		owps_bulbasaur.setImg("000");
		owps_charmander = new Rect((1280 * 0.125) + ((0.75 * 1280) *(1/3)) + 8.4, 720 * 0.25, 300, 300);
		owps_charmander.setImg("004");
		owps_squirtle = new Rect((1280 * 0.125) + ((0.75 * 1280) * (2/3)) + 8.4, 720 * 0.25, 300, 300);
		owps_squirtle.setImg("007");

		owps_title = new Rect((1280 * 0.125), 720 * (1/16), (0.75 * 1280), 720 * (2/16));
		owps_title.setColor("white");
		owps_title.setText("Please Pick A Starting Pokemon!", "32px serif", "black", "center", "center");

		owps_desc_bulbasaur = new Rect((1280 * 0.125), (720 * 0.25) + 300, ((0.75 * 1280) * (1/3)), 60);
		owps_desc_bulbasaur.setColor("green");
		owps_desc_bulbasaur.setText("Bulbasaur Grass Type", "32px serif", "white", "center", "center");
		owps_desc_charmander = new Rect((1280 * 0.125) + ((0.75 * 1280) * (1/3)), (720 * 0.25) + 300, ((0.75 * 1280) *(1/3)), 60);
		owps_desc_charmander.setColor("red");
		owps_desc_charmander.setText("Charmander Fire Type", "32px serif", "white", "center", "center");
		owps_desc_squirtle = new Rect((1280 * 0.125) + ((0.75 * 1280) * (2/3)), (720 * 0.25) + 300, ((0.75 * 1280) * (1/3)), 60);
		owps_desc_squirtle.setColor("blue");
		owps_desc_squirtle.setText("Squirtle Water Type", "32px serif", "white", "center", "center");

		owps_select_bulbasaur = new Rect((1280 * 0.125) + (((0.75 * 1280) * (1/3)) * 0.125), (720 * 0.75) + 30, ((0.75 * 1280) * (1/3)) * 0.75, 60);
		owps_select_bulbasaur.setColor("rgba(0,64,0,1");
		owps_select_bulbasaur.setText("Select", "32px serif", "white", "center", "center");
		owps_select_bulbasaur.addEvent("OPENWORLD", "POKEMON_SELECTION", "click", function(event, rect) { selectStarterPokemon("Balbasaur"); scene_state = "WORLD_EXPLORATION"; });
		owps_select_bulbasaur.addEvent("OPENWORLD", "POKEMON_SELECTION", "hover", function(event, rect) { rect.setColor("rgba(0,96,0,1"); });
		owps_select_bulbasaur.addEvent("OPENWORLD", "POKEMON_SELECTION", "nohover", function(event, rect) { rect.setColor("rgba(0,64,0,1"); });
		owps_select_charmander = new Rect((1280 * 0.125) + ((0.75 * 1280) * (1/3)) + (((0.75 * 1280) * (1/3)) * 0.125), (720 * 0.75) + 30, ((0.75 * 1280) * (1/3)) * 0.75, 60);
		owps_select_charmander.setColor("rgba(127,0,0,1");
		owps_select_charmander.setText("Select", "32px serif", "white", "center", "center");
		owps_select_charmander.addEvent("OPENWORLD", "POKEMON_SELECTION", "click", function(event, rect) { selectStarterPokemon("Charmander"); scene_state = "WORLD_EXPLORATION"; });
		owps_select_charmander.addEvent("OPENWORLD", "POKEMON_SELECTION", "hover", function(event, rect) { rect.setColor("rgba(163,0,0,1"); });
		owps_select_charmander.addEvent("OPENWORLD", "POKEMON_SELECTION", "nohover", function(event, rect) { rect.setColor("rgba(127,0,0,1"); });
		owps_select_squirtle = new Rect((1280 * 0.125) + ((0.75 * 1280) * (2/3)) + (((0.75 * 1280) * (1/3)) * 0.125), (720 * 0.75) + 30, ((0.75 * 1280) * (1/3)) * 0.75, 60);
		owps_select_squirtle.setColor("rgba(0,0,127,1");
		owps_select_squirtle.setText("Select", "32px serif", "white", "center", "center");
		owps_select_squirtle.addEvent("OPENWORLD", "POKEMON_SELECTION", "click", function(event, rect) { selectStarterPokemon("Squirtle"); scene_state = "WORLD_EXPLORATION"; });
		owps_select_squirtle.addEvent("OPENWORLD", "POKEMON_SELECTION", "hover", function(event, rect) { rect.setColor("rgba(0,0,163,1"); });
		owps_select_squirtle.addEvent("OPENWORLD", "POKEMON_SELECTION", "nohover", function(event, rect) { rect.setColor("rgba(0,0,127,1"); });
		
		
		owwe_player = new Rect(40,40,40,40);
		owwe_player.addEventKeyboard("OPENWORLD","WORLD_EXPLORATION", "keydown", 'w', function(event, rect) { rect.setYPos(rect.ypos() - 10); });
		owwe_player.addEventKeyboard("OPENWORLD","WORLD_EXPLORATION", "keydown", "a", function(event, rect) { rect.setXPos(rect.xpos() - 10); });
		owwe_player.addEventKeyboard("OPENWORLD","WORLD_EXPLORATION", "keydown", 's', function(event, rect) { rect.setYPos(rect.ypos() + 10); });
		owwe_player.addEventKeyboard("OPENWORLD","WORLD_EXPLORATION", "keydown", 'd', function(event, rect) { rect.setXPos(rect.xpos() + 10); });
		
		owwe_player.addEventKeyboard("OPENWORLD","WORLD_EXPLORATION", "keydown", "38", function(event, rect) { rect.setYPos(rect.ypos() - 10); });
		owwe_player.addEventKeyboard("OPENWORLD","WORLD_EXPLORATION", "keydown", "37", function(event, rect) { rect.setXPos(rect.xpos() - 10); });
		owwe_player.addEventKeyboard("OPENWORLD","WORLD_EXPLORATION", "keydown", "40", function(event, rect) { rect.setYPos(rect.ypos() + 10); });
		owwe_player.addEventKeyboard("OPENWORLD","WORLD_EXPLORATION", "keydown", "39", function(event, rect) { rect.setXPos(rect.xpos() + 10); });
		owwe_player.setCollisions("OPENWORLD", true, "Dynamic");

		owwe_purple = new Rect(256,128,100,64);
		owwe_purple.setColor("rgba(5,0,0,0)");
		
		owwe_world_objects = [];
		owwe_grass_objects = [];
		owwe_water_objects = [];
		var str = "\
mmmmmmmmmmmmmmmmmmmmmmmmmmmmmmmm\n\
m       ggggg  g  g m   g   g  m\n\
m   g g  g    g  m  g m   g gggm\n\
mmm g gmm g  gmm gm   g g mmmmmm\n\
m                 g   gm    gmmm\n\
m g ggg g g gmgg    g   g   gmmm\n\
mgg gg gg gg gg g g     g mmmmmm\n\
mmmmmmmmmmmmmmmmmmmm  mmmmmmmmmm\n\
jgg gg gg gg gg g              j\n\
js ss s sssss ssssss ssssssssssj\n\
jsssbbssssbbsssssbbssssbsssbssbj\n\
jbbssssssssssssssssssssssssssssj\n\
kwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwd\n\
kwwdwdwwwdwwwwwwwwwwwwdddwwwdwdd\n\
kwdwwwwwdddwwwwdwwwdwwdddwwwdwwd\n\
kwddwwwwwdddwwwwwwwddddddwwdwwwd\n\
qwddwwwwwwwddwwwdwddsssjdwwwwddd\n\
dddddddddddddddddddsj mjjddddddd\n\
		";
		var temp_x = 0;
		var temp_y = 0;

		for(var i = 0; i < str.length;i++) {
			if(str.charAt(i) === 'm') {
				var temp = new Rect(temp_x, temp_y, 40, 40);
				temp.setImg("mountain1.png");
				temp.setCollisions("OPENWORLD", true, "Static");
				var temp2 = new Rect(temp_x, temp_y, 40, 40);
				temp2.setImg("grassground.png");
				temp2.setRotation(Math.floor(Math.random() * 4) * 90);
				temp_x = temp_x + 40;
				owwe_world_objects.push(temp2);
				owwe_world_objects.push(temp);
			}
			else {
				if(str.charAt(i) === 'g') {
					var temp = new Rect(temp_x, temp_y, 40, 40);
					temp.setImg("grass2.png");
					temp.setRotation(Math.floor(Math.random() * 4) * 90);
					var temp2 = new Rect(temp_x, temp_y, 40, 40);
					temp2.setImg("grassground.png");
					temp2.setRotation(Math.floor(Math.random() * 4) * 90);
					temp_x = temp_x + 40;
					owwe_world_objects.push(temp2);
					owwe_grass_objects.push(temp);
				}
				else {
					if(str.charAt(i) === 's') {
						var temp = new Rect(temp_x, temp_y, 40, 40);
						temp.setImg("sand1.png");
						temp.setRotation(Math.floor(Math.random() * 4) * 90);
						temp_x = temp_x + 40;
						owwe_world_objects.push(temp);
					}
					else {
						if(str.charAt(i) === 'b') {
							var temp = new Rect(temp_x, temp_y, 40, 40);
							temp.setImg("sand1.png");
							temp.setRotation(Math.floor(Math.random() * 4) * 90);
							var temp2 = new Rect(temp_x, temp_y, 40, 40);
							temp2.setImg("grass1.png");
							temp2.setRotation(Math.floor(Math.random() * 4) * 90);
							temp_x = temp_x + 40;
							owwe_world_objects.push(temp);
							owwe_grass_objects.push(temp2);
						}
						else {
							if(str.charAt(i) === 'w') {
								var temp = new Rect(temp_x, temp_y, 40, 40);
								temp.setImg("water1.png");
								temp.setRotation(Math.floor(Math.random() * 4) * 90);
								temp_x = temp_x + 40;
								owwe_water_objects.push(temp);
							}
							else {
								if(str.charAt(i) === 'd') {
									var temp = new Rect(temp_x, temp_y, 40, 40);
									temp.setImg("waterdeep.png");
									temp.setRotation(Math.floor(Math.random() * 4) * 90);
									temp.setCollisions("OPENWORLD", true, "Static");
									temp_x = temp_x + 40;
									owwe_world_objects.push(temp);
								}
								else {
									if(str.charAt(i) === 'j') {
										var temp = new Rect(temp_x, temp_y, 40, 40);
										temp.setImg("mountain1.png");
										temp.setCollisions("OPENWORLD", true, "Static");
										var temp2 = new Rect(temp_x, temp_y, 40, 40);
										temp2.setImg("sand1.png");
										temp2.setRotation(Math.floor(Math.random() * 4) * 90);
										temp_x = temp_x + 40;
										owwe_world_objects.push(temp2);
										owwe_world_objects.push(temp);
									}
									else {
										if(str.charAt(i) === 'k') {
											var temp = new Rect(temp_x, temp_y, 40, 40);
											temp.setImg("mountain1.png");
											temp.setCollisions("OPENWORLD", true, "Static");
											var temp2 = new Rect(temp_x, temp_y, 40, 40);
											temp2.setImg("water1.png");
											temp2.setRotation(Math.floor(Math.random() * 4) * 90);
											temp_x = temp_x + 40;
											owwe_world_objects.push(temp2);
											owwe_world_objects.push(temp);
										}
										else {
											if(str.charAt(i) === 'q') {
											var temp = new Rect(temp_x, temp_y, 40, 40);
											temp.setImg("mountain1.png");
											temp.setCollisions("OPENWORLD", true, "Static");
											var temp2 = new Rect(temp_x, temp_y, 40, 40);
											temp2.setImg("waterdeep.png");
											temp2.setRotation(Math.floor(Math.random() * 4) * 90);
											temp_x = temp_x + 40;
											owwe_world_objects.push(temp2);
											owwe_world_objects.push(temp);
											}
											else {
												if(str.charAt(i) === '\n') {
													temp_x = 0;
													temp_y = temp_y + 40;
												}
												else {
													var temp = new Rect(temp_x, temp_y, 40, 40);
													temp.setImg("grassground.png");
													temp.setRotation(Math.floor(Math.random() * 4) * 90);
													temp_x = temp_x + 40;
													owwe_world_objects.push(temp);
												}
											}
										}
									}
								}
							}
						}
					}
				}
			}
		}
		
		// BATTLE
		battle_background = new Rect(0, 0, 1280, 720);
		battle_background.setImg("Battle_scene_background.png");
		water_background = new Rect(0, 0, 1280, 720);
		water_background.setImg("water_battle.png");
		// Run the main loop function
		running_interval = setInterval(mainLoop, 7); // Note: 7ms ~= 144fps
	}
}
function exitGame() {
	if(loading_done == true) {
		exitLoop();
		// Clean up non-game related resources
	}
}
// Drawing functions / Classes
class CollisionSolver {
	static addRect(scene_name, rect) {
		if(rect.collisionType() == "Static") {
			if(scene_name in CollisionSolver.#static_objects) {
				CollisionSolver.#static_objects[scene_name].push([rect.id().toString(),rect]);
				CollisionSolver.#static_count = CollisionSolver.#static_count + 1;
			}
			else {
				CollisionSolver.#static_objects[scene_name] = [[rect.id().toString(),rect]];
				CollisionSolver.#static_count = CollisionSolver.#static_count + 1;
			}
		}
		else {
			if(rect.collisionType() == "Dynamic") {
				if(scene_name in CollisionSolver.#dynamic_objects) {
					CollisionSolver.#dynamic_objects[scene_name].push([rect.id().toString(),rect]);
					CollisionSolver.#dynamic_count = CollisionSolver.#dynamic_count + 1;
				}
				else {
					CollisionSolver.#dynamic_objects[scene_name] = [[rect.id().toString(),rect]];
					CollisionSolver.#dynamic_count = CollisionSolver.#dynamic_count + 1;
				}
			}
			else {
				console.log("<-- ERROR addRect: " + rect.collisionType() + " not found. -->");
			}
		}
	}
	static removeRect(scene_name, rect) {
		if(rect.collisionType() == "Static") {
			if(scene_name in CollisionSolver.#static_objects) {
				for(var i = 0; i < CollisionSolver.#static_objects[scene_name].length;i++) {
					if(rect.id().toString() == CollisionSolver.#static_objects[scene_name][i][0]) {
						CollisionSolver.#static_objects[scene_name].splice(i, 1);
						break;
					}
				}
				CollisionSolver.#static_count = CollisionSolver.#static_count - 1;
			}
		}
		else {
			if(rect.collisionType() == "Dynamic") {
				if(scene_name in CollisionSolver.#dynamic_objects) {
					for(var i = 0; i < CollisionSolver.#dynamic_objects[scene_name].length;i++) {
						if(rect.id().toString() == CollisionSolver.#dynamic_objects[scene_name][i][0]) {
							CollisionSolver.#dynamic_objects[scene_name].splice(i, 1);
							break;
						}
					}
					CollisionSolver.#dynamic_count = CollisionSolver.#dynamic_count - 1;
				}
			}
			else {
				console.log("<-- ERROR removeRect: " + rect.collisionType() + " not found. -->");
			}
		}
	}
	static resolveCollisions() {
		if(CollisionSolver.#dynamic_count > 0 && CollisionSolver.#static_count > 0) {
			if(current_scene in CollisionSolver.#dynamic_objects) {
				if(current_scene in CollisionSolver.#static_objects) {
					for(let dyn of CollisionSolver.#dynamic_objects[current_scene]) {
						var value_dyn = dyn[1];
						for(let stat of CollisionSolver.#static_objects[current_scene]) {
							var value_stat = stat[1];
							var width_dyn = value_dyn.width();
							var height_dyn = value_dyn.height();
							var posx_dyn = value_dyn.xpos();
							var posy_dyn = value_dyn.ypos();
							
							var points_dyn = [[posx_dyn, posy_dyn],[posx_dyn + width_dyn, posy_dyn],[posx_dyn + width_dyn, posy_dyn + height_dyn],[posx_dyn, posy_dyn + height_dyn]];
							var center_dyn = [posx_dyn + (width_dyn / 2), posy_dyn + (height_dyn / 2)];
							
							var width_stat = value_stat.width();
							var height_stat = value_stat.height();
							var posx_stat = value_stat.xpos();
							var posy_stat = value_stat.ypos();
							
							var points_stat = [[posx_stat, posy_stat],[posx_stat + width_stat, posy_stat],[posx_stat + width_stat, posy_stat + height_stat],[posx_stat, posy_stat + height_stat]];
							// Note: we are breaking after b/c the next conflict will
							// be solved in the next frame
							for(var i = 0; i < points_dyn.length;i++) {
								var line_dyn = [center_dyn, points_dyn[i]];
								for(var j = 0; j < points_stat.length;j++) {
									var edge_stat = [points_stat[j], points_stat[(j + 1) % points_stat.length]];
									
									var d = ((line_dyn[0][0] - line_dyn[1][0])*(edge_stat[0][1] - edge_stat[1][1])) - ((line_dyn[0][1] - line_dyn[1][1])*(edge_stat[0][0] - edge_stat[1][0]));
									
									var t = (((line_dyn[0][0] - edge_stat[0][0])*(edge_stat[0][1] - edge_stat[1][1])) - ((line_dyn[0][1] - edge_stat[0][1])*(edge_stat[0][0] - edge_stat[1][0])))/d;
									
									var u = -(((line_dyn[0][0] - line_dyn[1][0])*(line_dyn[0][1] - edge_stat[0][1])) - ((line_dyn[0][1] - line_dyn[1][1])*(line_dyn[0][0] - edge_stat[0][0])))/d;
									
									if(u >= 0 && u <= 1.0 && t >= 0 && t <= 1.0) {
										if(value_dyn.xpos() < value_stat.xpos()) {
											value_dyn.setXPos(posx_dyn + ((1.0 - t) * (line_dyn[0][0] - line_dyn[1][0])));
										}
										if(value_dyn.xpos() > value_stat.xpos()) {
											value_dyn.setXPos(posx_dyn + ((1.0 - t) * (line_dyn[0][0] - line_dyn[1][0])));
											if(value_dyn.ypos() > value_stat.ypos()) {
												value_dyn.setYPos(posy_dyn + ((1.0 - t) * (line_dyn[0][1] - line_dyn[1][1])));
											}
											if(value_dyn.ypos() < value_stat.ypos()) {
												value_dyn.setYPos(posy_dyn + ((1.0 - t) * (line_dyn[0][1] - line_dyn[1][1])));
											}
											break;
										}
										if(value_dyn.ypos() > value_stat.ypos()) {
											value_dyn.setYPos(posy_dyn + ((1.0 - t) * (line_dyn[0][1] - line_dyn[1][1])));
										}
										if(value_dyn.ypos() < value_stat.ypos()) {
											value_dyn.setYPos(posy_dyn + ((1.0 - t) * (line_dyn[0][1] - line_dyn[1][1])));
											break;
										}
									}
									
								}	
							}
						}
					}
				}
			}
		}
	}
	static testCollisions(rect1, rect2) {
		// AABB - Axis Aligned Bounding Box
		if(rect1.xpos() + rect1.width() >= rect2.xpos() && rect1.xpos() <= rect2.xpos() + rect2.width() &&
				rect1.ypos() + rect1.height() >= rect2.ypos() && rect1.ypos() <= rect2.ypos() + rect2.height()) {
			return true;
		}
		else {
			return false;
		}
	}
	static testInside(rect1, rect2) {
		// AABB - Axis Aligned Bounding Box
		if(rect1.xpos() + rect1.width() > rect2.xpos() && rect1.xpos() < rect2.xpos() + rect2.width() &&
				rect1.ypos() + rect1.height() > rect2.ypos() && rect1.ypos() < rect2.ypos() + rect2.height()) {
			return true;
		}
		else {
			return false;
		}
	}
	static #dynamic_objects = {};
	static #dynamic_count = 0;
	static #static_objects = {};
	static #static_count = 0;
}
class EventHandler {
	static handleKeyDown(event) {
		var index = current_scene + scene_state;
		 if(index in EventHandler.#event_keydown) {
			 if(EventHandler.#event_keydown[index] !== undefined) {
				 for(var i = 0; i < EventHandler.#event_keydown[index].length;i++) {
					 if(event.keyCode == EventHandler.#event_keydown[index][i][0]) {
						 EventHandler.#event_keydown[index][i][1](event);
					 }
				 }
			 }
		}
	}
	static handleKeyUp(event) {
		var index = current_scene + scene_state;
		if(index in EventHandler.#event_keyup) {
			 if(EventHandler.#event_keyup[index] !== undefined) {
				 for(var i = 0; i < EventHandler.#event_keyup[index].length;i++) {
					 if(event.keyCode == EventHandler.#event_keyup[index][i][0]) {
						 EventHandler.#event_keyup[index][i][1](event);
					 }
				 }
			 }
		}
	}
	static handleKeyPress(event) {
		var index = current_scene + scene_state;
		if(index in EventHandler.#event_keypress) {
			 if(EventHandler.#event_keypress[index] !== undefined) {
				 for(var i = 0; i < EventHandler.#event_keypress[index].length;i++) {
					 if(event.keyCode == EventHandler.#event_keypress[index][i][0]) {
						 EventHandler.#event_keypress[index][i][1](event);
					 }
				 }
			 }
		}
	}
	static handleMLeftDown(event) {
		var index = current_scene + scene_state;
		if(index in EventHandler.#event_mouseleftdown) {
			 if(EventHandler.#event_mouseleftdown[index] !== undefined) {
				 for(var i = 0; i < EventHandler.#event_mouseleftdown[index].length;i++) {
					 EventHandler.#event_mouseleftdown[index][i](event);
				 }
			 }
		}
	}
	static handleClick(event, mouse_x, mouse_y) {
		var index = current_scene + scene_state;
		if(index in EventHandler.#event_click) {
			 if(EventHandler.#event_click[index] !== undefined) {
				 for(var i = 0; i < EventHandler.#event_click[index].length;i++) {
					 var temp = new Rect(mouse_x, mouse_y, 1, 1);
					 if(CollisionSolver.testCollisions(temp, EventHandler.#event_click[index][i][0])) {
						 EventHandler.#event_click[index][i][1](event);
					 }
				 }
			 }
		}
	}
	static handleMRightDown(event) {
		var index = current_scene + scene_state;
		if(index in EventHandler.#event_mouserightdown) {
			 if(EventHandler.#event_mouserightdown[index] !== undefined) {
				 for(var i = 0; i < EventHandler.#event_mouserightdown[index].length;i++) {
					 EventHandler.#event_mouserightdown[index][i](event);
				 }
			 }
		}
	}
	static handleMLeftUp(event) {
		var index = current_scene + scene_state;
		if(index in EventHandler.#event_mouseleftup) {
			 if(EventHandler.#event_mouseleftup[index] !== undefined) {
				 for(var i = 0; i < EventHandler.#event_mouseleftup[index].length;i++) {
					 EventHandler.#event_mouseleftup[index][i](event);
				 }
			 }
		}
	}
	static handleMRightUp(event) {
		var index = current_scene + scene_state;
		if(index in EventHandler.#event_mouserightup) {
			 if(EventHandler.#event_mouserightup[index] !== undefined) {
				 for(var i = 0; i < EventHandler.#event_mouserightup[index].length;i++) {
					 EventHandler.#event_mouserightup[index][i](event);
				 }
			 }
		}
	}
	static handleMHover(event, mouse_x, mouse_y) {
		var index = current_scene + scene_state;
		if(index in EventHandler.#event_mousehover) {
			 if(EventHandler.#event_mousehover[index] !== undefined) {
				 for(var i = 0; i < EventHandler.#event_mousehover[index].length;i++) {
					 var temp = new Rect(mouse_x, mouse_y, 1, 1);
					 if(CollisionSolver.testCollisions(temp, EventHandler.#event_mousehover[index][i][0])) {
						 EventHandler.#event_mousehover[index][i][1](event);
					 }
				 }
			 }
		}
		if(index in EventHandler.#event_mousenohover) {
			 if(EventHandler.#event_mousenohover[index] !== undefined) {
				 for(var i = 0; i < EventHandler.#event_mousenohover[index].length;i++) {
					 var temp = new Rect(mouse_x, mouse_y, 1, 1);
					 if(!CollisionSolver.testCollisions(temp, EventHandler.#event_mousenohover[index][i][0])) {
						 EventHandler.#event_mousenohover[index][i][1](event);
					 }
				 }
			 }
		}
	}
	// For keyboard events
	static addEventKeyboard(scene_name, event_type, key, callback) {
		switch(event_type) {
			case "keydown": {
				if(!(scene_name in EventHandler.#event_keydown)) {
					EventHandler.#event_keydown[scene_name] = [[key, callback]];
				}
				else {
					EventHandler.#event_keydown[scene_name].push([key, callback]);
				}
				break;
			}
			case "keyup": {
				if(!(scene_name in EventHandler.#event_keyup)) {
					EventHandler.#event_keyup[scene_name] = [[key, callback]];
				}
				else {
					EventHandler.#event_keyup[scene_name].push([key, callback]);
				}
				break;
			}
			case "keypress": {
				if(!(scene_name in EventHandler.#event_keypress)) {
					EventHandler.#event_keypress[scene_name] = [[key, callback]];
				}
				else {
					EventHandler.#event_keypress[scene_name].push([key, callback]);
				}
				break;
			}
			default: {
				console.log("<-- ERROR addEvent: " + event_type + " not found. -->");
				break;
			}
		}
	}
	// For non-keyboard events
	static addEventMouse(scene_name, event_type, callback) {
		switch(event_type) {
			case "mouseleftdown": {
				if(!(scene_name in EventHandler.#event_mouseleftdown)) {
					EventHandler.#event_mouseleftdown[scene_name] = [callback];
				}
				else {
					EventHandler.#event_mouseleftdown[scene_name].push(callback);
				}
				break;
			}
			case "mouserightdown": {
				if(!(scene_name in EventHandler.#event_mouserightdown)) {
					EventHandler.#event_mouserightdown[scene_name] = [callback];
				}
				else {
					EventHandler.#event_mouserightdown[scene_name].push(callback);
				}
				break;
			}
			case "mouseleftup": {
				if(!(scene_name in EventHandler.#event_mouseleftup)) {
					EventHandler.#event_mouseleftup[scene_name] = [callback];
				}
				else {
					EventHandler.#event_mouseleftup[scene_name].push(callback);
				}
				break;
			}
			case "mouserightup": {
				if(!(scene_name in EventHandler.#event_mouserightup)) {
					EventHandler.#event_mouserightup[scene_name] = [callback];
				}
				else {
					EventHandler.#event_mouserightup[scene_name].push(callback);
				}
				break;
			}
			default: {
				console.log("<-- ERROR addEvent: " + event_type + " not found. -->");
				break;
			}
		}
	}
	// For hover events
	static addEventHover(scene_name, event_type, rect, callback) {
		if(event_type == "hover") {
			if(!(scene_name in EventHandler.#event_mousehover)) {
				EventHandler.#event_mousehover[scene_name] = [[rect, callback]];
			}
			else {
				EventHandler.#event_mousehover[scene_name].push([rect, callback]);
			}
		}
		else {
			if(event_type == "nohover") {
				if(!(scene_name in EventHandler.#event_mousenohover)) {
					EventHandler.#event_mousenohover[scene_name] = [[rect, callback]];
				}
				else {
					EventHandler.#event_mousenohover[scene_name].push([rect, callback]);
				}
			}
			else {
				if(event_type == "click") {
					if(!(scene_name in EventHandler.#event_click)) {
						EventHandler.#event_click[scene_name] = [[rect, callback]];
					}
					else {
						EventHandler.#event_click[scene_name].push([rect, callback]);
					}
				}
				else {
					console.log("<-- ERROR addEvent: " + event_type + " not found. -->");
				}
			}
		}
	}
	// Keyboard Events
	static #event_keydown = {};
	static #event_keyup = {};
	static #event_keypress = {};
	// Mouse Events
	static #event_mouseleftdown = {};
	static #event_mouserightdown = {};
	static #event_mouseleftup = {};
	static #event_mouserightup = {};
	static #event_mousehover = {};
	static #event_mousenohover = {};
	// Object Events
	static #event_click = {};
}
$(document).on("keydown", function(event) {
	EventHandler.handleKeyDown(event);
});
$(document).on("keyup", function(event) {
	EventHandler.handleKeyUp(event);
});
$(document).on("keypress", function(event) {
	has_interacted = true;
	EventHandler.handleKeyPress(event);
});
$(document).on("mousedown", function(event) {
	has_interacted = true;
	switch(event.which) {
		case 1: {
			EventHandler.handleMLeftDown(event);
			var $canvas = $("#screen");
			EventHandler.handleClick(event, (event.pageX - $canvas.offset().left), (event.pageY - $canvas.offset().top));
			break;
		}
		case 3: {
			EventHandler.handleMRightDown(event);
			break;
		}
		default: {
			break;
		}
	}
});
$(document).on("mouseup", function(event) {
	switch(event.which) {
		case 1: {
			EventHandler.handleMLeftUp(event);
			break;
		}
		case 3: {
			EventHandler.handleMRightUp(event);
			break;
		}
		default: {
			break;
		}
	}
});
$(document).on("mousemove", function(event) {
	if($("menu").is(":hidden") === false) {
		if(audio_to_load == 0) {
			if(has_interacted == true) {
				audio1.play();
			}
		}
	}
	if(loading_done == true) {
		var $canvas = $("#screen");
		EventHandler.handleMHover(event, (event.pageX - $canvas.offset().left), (event.pageY - $canvas.offset().top));
	}
});
class Rect {
	// Constructor
	constructor(pos_x, pos_y, width, height) {
		this.#width = width; 
		this.#height = height;
		this.#pos_x = pos_x;	
		this.#pos_y = pos_y;
		this.#rotation = 0;
		this.#offset_x = 0;
		this.#offset_y = 0;	
		this.#color = "rgba(0, 0, 0, 0)";
		this.#img_list = 1;
		this.#img = "";	
		this.#has_collisions = false;
		this.#text = "";
		this.#font = "";
		this.#font_color = "";
		this.#text_alignment_x = "";
		this.#text_alignment_y = "";
		this.#id = Rect.#counter;
		this.#reversed = false;
		Rect.#counter = Rect.#counter + 1;
	}
	// Getters / Setters Functions
	setWidth(new_width) {
		this.#width = new_width;
	}
	setHeight(new_height) {
		this.#height = new_height;
	}
	setXPos(new_pos_x) {
		this.#pos_x = new_pos_x;
	}
	setYPos(new_pos_y) {
		this.#pos_y = new_pos_y;
	}
	setRotation(new_rotation) {
		this.#rotation = new_rotation;
	}
	setOffsetX(new_offset_x) {
		this.#offset_x = new_offset_x;
	}
	setOffsetY(new_offset_y) {
		this.#offset_y = new_offset_y;
	}
	setColor(new_color) {
		this.#color = new_color;
	}
	setImg(new_img) {
		new_img = new_img.toString();
		// Also accepts by number
		var regex = new RegExp("(^[0-9][0-9]*[0-9]$)|(^[0-9]$)|(^[0-9][0-9]$)|(^[0-9][0-9][0-9]$)");
		if(new_img.search(regex) != -1) {
			var num = Number(new_img).toString();
			if(num.length == 1) {
				regex = new RegExp("00" + num + ".*");
			}
			if(num.length == 2) {
				regex = new RegExp("0" + num + ".*");
			}
			if(num.length >= 3) {
				regex = new RegExp(num + ".*");
			}
			for(var i = 0; i < image_load_list_1.length;i++) {
				if(image_load_list_1[i].search(regex) != -1) {
					this.#img = image_load_list_1[i];
					return;
				}
			}
			console.log("<-- ERROR " + this + " setImg " + "ID not found: ID: " + num + " -->");
		}
		else {
			if(image_load_list_1.includes(new_img)) {
				this.#img_list = 1;
				
				this.#img = new_img;
			}
			else {
				if(image_load_list_2.includes(new_img)) {
					this.#img_list = 2;
					
					this.#img = new_img;
				}
				else {
					console.log("<-- ERROR Image: " + new_img + " not found. -->");
				}
			}
		}
	}
	setCollisions(scene_name, new_value) {
		this.#has_collisions = new_value;
		this.#collision_type = "Static";
		if(this.#has_collisions == true) {
			CollisionSolver.addRect(scene_name, this);
		}
		else {
			CollisionSolver.removeRect(scene_name, this);
		}
	}
	setCollisions(scene_name, new_value, type) {
		this.#has_collisions = new_value;
		this.#collision_type = type;
		if(this.#has_collisions == true) {
			
			CollisionSolver.addRect(scene_name, this);
		}
		else {
			CollisionSolver.removeRect(scene_name, this);
		}
	}
	addEventKeyboard(scene_name, state_name, event_type, key, callback) {
		var number = null;
		if(isNaN(key)) {
			key = ("" + key).toUpperCase();
			number = key.charCodeAt(0);
		}
		else {
			number = Number(key);
		}
		EventHandler.addEventKeyboard(scene_name + state_name, event_type, number, function(event) { callback(event, this); }.bind(this));
	}
	addEvent(scene_name, state_name, event_type, callback) {
		if(event_type == "hover" || event_type == "nohover" || event_type == "click") {
			EventHandler.addEventHover(scene_name + state_name, event_type, this, function(event) { callback(event, this); }.bind(this));
		}
		else {
			EventHandler.addEventMouse(scene_name + state_name, event_type, function(event) { callback(event, this); }.bind(this));
		}
	}
	setText(new_text, font_info, font_color, align_x, align_y) {
		this.#text = new_text;
		this.#font = font_info;
		this.#font_color = font_color;
		this.#text_alignment_x = align_x;
		this.#text_alignment_y = align_y;
	}
	setReversed(value) {
		this.#reversed = value;
	}
	width() {
		return Object.freeze(this.#width);
	}
	height() {
		return Object.freeze(this.#height);
	}
	xpos() {
		return Object.freeze(this.#pos_x);
	}
	ypos() {
		return Object.freeze(this.#pos_y);
	}
	rotation() {
		return Object.freeze(this.#rotation);
	}
	offsetx() {
		return Object.freeze(this.#offset_x);
	}
	offsety() {
		return Object.freeze(this.#offset_y);
	}
	color() {
		return Object.freeze(this.#color);
	}
	img() {
		return Object.freeze(this.#img);
	}
	hasCollisions() {
		return Object.freeze(this.#has_collisions);
	}
	text() {
		return Object.freeze(this.#text);
	}
	collisionType() {
		return Object.freeze(this.#collision_type);
	}
	id() {
		return Object.freeze(this.#id);
	}
	reversed() {
		return Object.freeze(this.#reversed);
	}
	// General functions
	// Draws the rectangle to the screen
	draw() {
		var canvas = document.getElementById("screen");
		var draw_context = canvas.getContext("2d");
		if(this.#img != "") {
			if(this.#img_list == 1) {
				draw_context.translate(this.#pos_x + (this.#width / 2), this.#pos_y + (this.#height / 2));
				draw_context.rotate(-(this.#rotation * Math.PI) / 180);
				if(this.#reversed === true) {
					draw_context.scale(-1, 1);
				}
				draw_context.translate(-this.#pos_x - (this.#width / 2), -this.#pos_y - (this.#height / 2));
				draw_context.drawImage(image_list_1[this.#img], 0, 0, image_list_1[this.#img].width, image_list_1[this.#img].height, this.#pos_x + this.#offset_x, this.#pos_y + this.#offset_y, this.#width, this.#height);
				draw_context.setTransform(1.0, 0, 0, 1.0, 0, 0);
			}
			else {
				draw_context.translate(this.#pos_x + (this.#width / 2), this.#pos_y + (this.#height / 2));
				draw_context.rotate(-(this.#rotation * Math.PI) / 180);
				if(this.#reversed === true) {
					draw_context.scale(-1, 1);
				}
				draw_context.translate(-this.#pos_x - (this.#width / 2), -this.#pos_y - (this.#height / 2));
				draw_context.drawImage(image_list_2[this.#img], 0, 0, image_list_2[this.#img].width, image_list_2[this.#img].height, this.#pos_x + this.#offset_x, this.#pos_y + this.#offset_y, this.#width, this.#height);
				draw_context.setTransform(1.0, 0, 0, 1.0, 0, 0);
			}
			if(this.#text != "") {
				draw_context.fillStyle = this.#font_color;
				draw_context.font = this.#font;
				
				var text_width = 0;
				
				if(this.#width < draw_context.measureText(this.#text).width) {
					text_width = this.#width;
				}
				else {
					text_width = draw_context.measureText(this.#text).width;
				}
				if(this.#text_alignment_y == "bottom") {
					switch(this.#text_alignment_x) {
						case "left": {
							draw_context.fillText(this.#text, this.#pos_x + this.#offset_x, this.#pos_y + this.#height + this.#offset_y, text_width);
							break;
						}
						case "right": {
							draw_context.fillText(this.#text, this.#pos_x + this.#offset_x + (this.#width - text_width), this.#pos_y + this.#height + this.#offset_y, text_width);
							break;
						}
						case "center": {
							draw_context.fillText(this.#text, this.#pos_x + this.#offset_x + ((this.#width - text_width) / 2), this.#pos_y + this.#height + this.#offset_y, text_width);
							break;
						}
						default: {
							console.log("<-- ERROR text_alignment_x: " + this.#text_alignment_x + " not found. -->")
							break;
						}
					}
				}
				else {
					var index = this.#font.indexOf("px");
					var str = this.#font.substr(0, index);
					var size_num = Number(str);
					switch(this.#text_alignment_x) {
						case "left": {
							draw_context.fillText(this.#text, this.#pos_x + this.#offset_x, this.#pos_y + (this.#height / 2.0) + (size_num / 2.75) + this.#offset_y, text_width);
							break;
						}
						case "right": {
							draw_context.fillText(this.#text, this.#pos_x + this.#offset_x + (this.#width - text_width), this.#pos_y + (this.#height / 2.0) + (size_num / 2.75) + this.#offset_y, text_width);
							break;
						}
						case "center": {
							draw_context.fillText(this.#text, this.#pos_x + this.#offset_x + ((this.#width - text_width) / 2), this.#pos_y + (this.#height / 2.0) + (size_num / 2.75) + this.#offset_y, text_width);
							break;
						}
						default: {
							console.log("<-- ERROR text_alignment_x: " + this.#text_alignment_x + " not found. -->")
							break;
						}
					}
				}
			}
		}
		else {
			draw_context.fillStyle = this.#color;
			draw_context.fillRect(this.#pos_x + this.#offset_x, this.#pos_y + this.#offset_y, this.#width, this.#height);
			if(this.#text != "") {
				draw_context.fillStyle = this.#font_color;
				draw_context.font = this.#font;
				
				var text_width = 0;
				
				if(this.#width < draw_context.measureText(this.#text).width) {
					text_width = this.#width;
				}
				else {
					text_width = draw_context.measureText(this.#text).width;
				}
				if(this.#text_alignment_y == "bottom") {
					switch(this.#text_alignment_x) {
						case "left": {
							draw_context.fillText(this.#text, this.#pos_x + this.#offset_x, this.#pos_y + this.#height + this.#offset_y, text_width);
							break;
						}
						case "right": {
							draw_context.fillText(this.#text, this.#pos_x + this.#offset_x + (this.#width - text_width), this.#pos_y + this.#height + this.#offset_y, text_width);
							break;
						}
						case "center": {
							draw_context.fillText(this.#text, this.#pos_x + this.#offset_x + ((this.#width - text_width) / 2), this.#pos_y + this.#height + this.#offset_y, text_width);
							break;
						}
						default: {
							console.log("<-- ERROR text_alignment_x: " + this.#text_alignment_x + " not found. -->")
							break;
						}
					}
				}
				else {
					var index = this.#font.indexOf("px");
					var str = this.#font.substr(0, index);
					var size_num = Number(str);
					switch(this.#text_alignment_x) {
						case "left": {
							draw_context.fillText(this.#text, this.#pos_x + this.#offset_x, this.#pos_y + (this.#height / 2.0) + (size_num / 2.75) + this.#offset_y, text_width);
							break;
						}
						case "right": {
							draw_context.fillText(this.#text, this.#pos_x + this.#offset_x + (this.#width - text_width), this.#pos_y + (this.#height / 2.0) + (size_num / 2.75) + this.#offset_y, text_width);
							break;
						}
						case "center": {
							draw_context.fillText(this.#text, this.#pos_x + this.#offset_x + ((this.#width - text_width) / 2), this.#pos_y + (this.#height / 2.0) + (size_num / 2.75) + this.#offset_y, text_width);
							break;
						}
						default: {
							console.log("<-- ERROR text_alignment_x: " + this.#text_alignment_x + " not found. -->")
							break;
						}
					}
				}
			}
		}
	}
	// Variables
	#width = 0; 					// Width of the rect
	#height = 0;					// Height of the rect
	#pos_x = 0;						// Absolute x position of the rect
	#pos_y = 0;						// Absolute y position of the rect
	#rotation = 0;					// Rotation in degrees
	#offset_x = 0;					// An offset to the x position of the rect (should be used for effects)
	#offset_y = 0;					// An offset to the y position of the rect (should be used for effects)
	#color = "rgba(0, 0, 0, 0)";	// The color of the rect, note: If there is an image the image will be colored
	#img_list = 1;					// Where the image comes from
	#img = "";						// A possible image to be used when rendering
	#text = "";						// Text to be rendered inside the rect
	#font = "";						// Font info for the text
	#font_color = "";				// Color of the text
	#text_alignment_x = "";			// Center or Left or Right
	#text_alignment_y = "";			// Either bottom or center, top is not supported by text standards
	#reversed = false;
	// Events
	
	// Collisions
	#has_collisions = false;
	#collision_type = "";
	// ID
	#id = 0;
	static #counter = 0;
}

function clearScreen() {
	var canvas = document.getElementById("screen");
	var draw_context = canvas.getContext("2d");
	draw_context.clearRect(0, 0, canvas.width, canvas.height);
}
function addHoverEffect(rect, baseColor, hoverColor) {
	rect.addEvent("mouseover", function() {
		rect.setColor(hoverColor);
		rect.draw();
	});
	rect.addEvent("mouseout", function() {
		rect.setColor(baseColor);
		rect.draw();
	});
}
var defense_tracker = 0;
var battle_title = null;
var item_lst = {HealthPotion: 30, Pokeball: 10000000};
var health_potion_desc= null;
var defense_potion_desc = null;
function handleAttack() {
	poke.style.display = 'none';
	document.getElementById('fightMenu').style.display = 'none';
	var num = Math.floor(Math.random() * playerPokemon.attack) + 5;
	enemyPokemon.hp -= num;
	event_text.draw(); 
	if(enemyPokemon.hp > 0){
	playersTurn = "ENEMYS"; 
	}else{
		playersTurn = "YOURS";
	}
	
}

function handlePokemon() {
	poke.style.display = 'flex';
    generateMenu(playerPokiList);
}

function handleRun() {
	poke.style.display = 'none';
	current_scene = "OPENWORLD";
	timeout_frames = 4 * 82;
	enemyPokemon = getPokemonByStr(land_pokemon[Math.floor(Math.random() * land_pokemon.length)]).data;
	playersTurn = "PLAYERS"; 
	
}
function handleItem() {
	poke.style.display = 'none';
	document.getElementById('itemMenu').style.display = 'flex';
}
function healthItem(){
	poke.style.display = 'none';
	document.getElementById('itemMenu').style.display = 'none';
	if(item_lst.HealthPotion > 0){
	item_lst.HealthPotion -= 1;
	console.log("You have this many health potions left: " + item_lst.HealthPotion);
	playerPokemon.hp += 20;
	}else{
		alert("GASP, No health potions left");
	}
	
}
function PokeballItem(){
	poke.style.display = 'none';
	document.getElementById('itemMenu').style.display = 'none';
	
	if(Math.random() < ((maxhp_enemy - enemyPokemon.hp) / (maxhp_enemy))){
		let term = enemyPokemon.name;
		console.log(term);
		playerPokiList.push(findPokemon(term.toString()).name);
		timeout_frames = 4 * 82;
		current_scene = "OPENWORLD";
		enemyPokemon = getPokemonByStr(land_pokemon[Math.floor(Math.random() * land_pokemon.length)]).data;
		}
	else{

		alert("Unable to capture pokeball");
	}
	document.getElementById('itemMenu').style.display = 'none';
	
}

function enemyAttack(){
		poke.style.display = 'none';
		playerPokemon.hp -= Math.floor(Math.random() * enemyPokemon.attack) + 5;		
		playersTurn = "YOURS"; 
}
function Close(){
	poke.style.display = 'none';
	document.getElementById('itemMenu').style.display = 'none';
}

document.querySelector('.menu-item-attack').addEventListener('click', handleAttack);
document.querySelector('.menu-item-pokemon').addEventListener('click', handlePokemon);
document.querySelector('.menu-item-run').addEventListener('click', handleRun);
document.querySelector('.menu-item-item').addEventListener('click', handleItem);
document.querySelector('.itemmenu-item-health').addEventListener('click', healthItem);
document.querySelector('.itemmenu-item-close').addEventListener('click', Close);
document.querySelector('.itemmenu-item-pokeball').addEventListener('click', PokeballItem);
document.getElementById('poke').addEventListener('click', function(event) {
	poke.style.display = 'flex';
	let desc = event.target.textContent;
	playerPokemon = findPokemon(desc.toString());
	poke.style.display = 'none';
});


function mainLoop() {
	// Handle any collisions from the last frame
	CollisionSolver.resolveCollisions();
	// Clear the last frame
	clearScreen();
	// Render the current scene
	switch(current_scene) {
		case "OPENWORLD": {
			battle_started = false;
			owwe_player.setImg(findPokemonNumber(playerPokemon.name));
			switch(scene_state) {
				case "POKEMON_SELECTION": {
		
					var canvas = document.getElementById("screen");
					canvas.style.background = "black";
					owps_title.draw();
					owps_background.draw();
					owps_bulbasaur.draw();
					owps_charmander.draw();
					owps_squirtle.draw();
					owps_desc_bulbasaur.draw();
					owps_desc_charmander.draw();
					owps_desc_squirtle.draw();
					owps_select_bulbasaur.draw();
					owps_select_charmander.draw();
					owps_select_squirtle.draw();
					break;
				}
				case "WORLD_EXPLORATION": {
					stopAudio1();
					stopAudio3();
					audio2.play();
					var canvas = document.getElementById("screen");
					canvas.style.background = "white";
					for(var i = 0; i < owwe_world_objects.length;i++) {
						if(CollisionSolver.testInside(owwe_player, owwe_world_objects[i]) == true) {
							switch(owwe_world_objects[i].img()) {
								case "sand1.png": {
									currently_stepping_on="sand";
									break;
								}
								case "water1.png": {
									currently_stepping_on="water";
									break;
								}
								default: {
									currently_stepping_on="grass";
									break;
								}	
							}
						}
						owwe_world_objects[i].draw();
					}
					if(timeout_frames > 0) {
						timeout_frames = timeout_frames - 1;
					}
					for(var i = 0; i < owwe_grass_objects.length;i++) {
						owwe_grass_objects[i].draw();
						
						if(timeout_frames == 0) {
							if(CollisionSolver.testInside(owwe_player, owwe_grass_objects[i]) == true) {
								if(Math.random() > 0.99) {
									current_scene = "BATTLE_LAND";
									
									
								}
								
							}
						}
					}
					for(var i = 0; i < owwe_water_objects.length;i++) {
						owwe_water_objects[i].draw();
						
						if(timeout_frames == 0) {
							if(CollisionSolver.testInside(owwe_player, owwe_water_objects[i]) == true) {
								if(Math.random() > 0.99) {
									current_scene = "BATTLE_WATER";
									
									
								}
								
								
							}
						}
					}
					document.getElementById('fightMenu').style.display = 'none';

					owwe_player.draw();
					break;
				}
			}
			break;
		}
		case "BATTLE_LAND": {
			if(battle_started == false) {
				battle_started = true;
				enemyPokemon = getPokemonByStr(land_pokemon[Math.floor(Math.random() * land_pokemon.length)]).data;
				maxhp_enemy = enemyPokemon.hp;
			}
			stopAudio1();
			stopAudio2();
			audio3.play();
			if(timeout_frames == 0) {
				text_box = new Rect((1280 * 0.125) - 130, 720 * 0.25 + 350, 700, 200);
				text_box.setImg("text_box.png");
				poke_box = new Rect((1280 * 0.125) - 100, 720 * 0.25 - 100, 450, 100);
				poke_box.setImg("poke_box.png");
				player_text_box = new Rect((1280 * 0.125) + 600, (720 * 0.25) + 400, 450, 100);
				player_text_box.setImg("poke_box.png");
				imageenemyPokemon = new Rect((1280 * 0.125) + 8.4 + 600, 720 * 0.25 - 120, 300, 300);
				imageenemyPokemon.setImg(findPokemonNumber(enemyPokemon.name));
				playerImage = new Rect((1280 * 0.125) + 8.4 + 100, 720 * 0.25 + 200, 170, 170);
				playerImage.setReversed(true);		
				playerImage.setImg(findPokemonNumber(playerPokemon.name));
				battle_background.draw();
				imageenemyPokemon.draw();
				playerImage.draw();
				event_text = new Rect((1280 * 0.125) + 70, 720 * 0.25 + 300, 300, 300);
				event_text.setText("What will player do next", "64px serif", "black", "center", "center");
				enemy_event_text = new Rect((1280 * 0.125) - 75, (720 * 0.25) - 75, ((0.75 * 1280) * (1/3)) + 50, 50);
				enemy_event_text.setText(`Pokemon: ${enemyPokemon.name}\nHp: ${enemyPokemon.hp}`, "32px serif", "black", "center", "center");
				player_event_text = new Rect((1280 * 0.125) + 630, (720 * 0.25) + 430, ((0.75 * 1280) * (1/3)) + 50, 50);
				player_event_text.setText(`Player Pokemon: ${playerPokemon.name}\nHp: ${playerPokemon.hp}`, "32px serif", "black", "center", "center");
				poke_box.draw();
				player_text_box.draw();
				text_box.draw();
				player_event_text.draw();
				enemy_event_text.draw();
				event_text.draw();
				document.getElementById('fightMenu').style.display = 'flex';
				switch(playersTurn){
					case "YOURS":{
						switch(true) {
							case (playerPokemon.hp <= 0):
								alert("You lost...");
								current_scene = "OPENWORLD";
								playerPokemon.hp = 20;
								timeout_frames = 4 * 82;
								break;
							case (enemyPokemon.hp <= 0):
								alert("You win!");
								playersTurn = "YOURS";
								current_scene = "OPENWORLD";
								playerPokemon.hp = Number(playerPokemon.hp) + 20;
								timeout_frames = 4 * 82;
								document.getElementById('fightMenu').style.display = 'flex';
								break;
							default:
								document.getElementById('fightMenu').style.display = 'flex';
								break;
						}
						break;
					}
					case "ENEMYS":{
						switch(true) {
							case (playerPokemon.hp <= 0):
								alert("You lost...");
								current_scene = "OPENWORLD";
								playerPokemon.hp = 20;
								timeout_frames = 4 * 82;
								break;
							case (enemyPokemon.hp <= 0):
								alert("You win!");
								playersTurn = "YOURS";
								current_scene = "OPENWORLD";
								playerPokemon.hp = Number(playerPokemon.hp) + 20;
								timeout_frames = 4 * 82;

								document.getElementById('fightMenu').style.display = 'flex';
								break;
							default:
								document.getElementById('fightMenu').style.display = 'none';
								enemyAttack();
								playersTurn = "YOURS";
								break;
						}
						break;
					}
					}
				}	

						
			break;
		
		}
		case "BATTLE_WATER": {
			if(battle_started == false) {
				battle_started = true;
				enemyPokemon = getPokemonByStr(water_type_pokemon[Math.floor(Math.random() * water_type_pokemon.length)]).data;
				maxhp_enemy = enemyPokemon.hp;
			}
			stopAudio1();
			stopAudio2();
			audio3.play();
			if(timeout_frames == 0) {
				text_box = new Rect((1280 * 0.125) - 130, 720 * 0.25 + 350, 700, 200);
				text_box.setImg("text_box.png");
				poke_box = new Rect((1280 * 0.125) - 100, 720 * 0.25 - 100, 450, 100);
				poke_box.setImg("poke_box.png");
				player_text_box = new Rect((1280 * 0.125) + 600, (720 * 0.25) + 400, 450, 100);
				player_text_box.setImg("poke_box.png");
				imageenemyPokemon = new Rect((1280 * 0.125) + 8.4 + 650, 720 * 0.25 + 100, 170, 170);				
				imageenemyPokemon.setImg(findPokemonNumber(enemyPokemon.name));
				playerImage = new Rect((1280 * 0.125) + 8.4 + 100, 720 * 0.25 + 200, 170, 170);
				playerImage.setReversed(true);		
				playerImage.setImg(findPokemonNumber(playerPokemon.name));
				water_background.draw();
				imageenemyPokemon.draw();
				playerImage.draw();
				event_text = new Rect((1280 * 0.125) + 70, 720 * 0.25 + 300, 300, 300);
				event_text.setText("What will player do next", "64px serif", "black", "center", "center");
				enemy_event_text = new Rect((1280 * 0.125) - 75, (720 * 0.25) - 75, ((0.75 * 1280) * (1/3)) + 50, 50);
				enemy_event_text.setText(`Pokemon: ${enemyPokemon.name}\nHp: ${enemyPokemon.hp}`, "32px serif", "black", "center", "center");
				player_event_text = new Rect((1280 * 0.125) + 630, (720 * 0.25) + 430, ((0.75 * 1280) * (1/3)) + 50, 50);
				player_event_text.setText(`Player Pokemon: ${playerPokemon.name}\nHp: ${playerPokemon.hp}`, "32px serif", "black", "center", "center");
				poke_box.draw();
				player_text_box.draw();
				text_box.draw();
				player_event_text.draw();
				enemy_event_text.draw();
				event_text.draw();
				document.getElementById('fightMenu').style.display = 'flex';
				switch(playersTurn){
					case "YOURS":{
						switch(true) {
							case (playerPokemon.hp <= 0):
								alert("You lost...");
								current_scene = "OPENWORLD";
								playerPokemon.hp = 20;
								timeout_frames = 4 * 82;
								break;
							case (enemyPokemon.hp <= 0):
								alert("You win!");
								playersTurn = "YOURS";
								current_scene = "OPENWORLD";
								playerPokemon.hp = Number(playerPokemon.hp) + 20;
								timeout_frames = 4 * 82;

								document.getElementById('fightMenu').style.display = 'flex';
								break;
							default:
								document.getElementById('fightMenu').style.display = 'flex';
								break;
						}
						break;
					}
					case "ENEMYS":{
						switch(true) {
							case (playerPokemon.hp <= 0):
								alert("You lost...");
								current_scene = "OPENWORLD";
								playerPokemon.hp = 20;
								timeout_frames = 4 * 82;
								break;
							case (enemyPokemon.hp <= 0):
								playersTurn = "YOURS";
								alert("You win!");
								current_scene = "OPENWORLD";
								playerPokemon.hp = Number(playerPokemon.hp) + 20;
								timeout_frames = 4 * 82;

								document.getElementById('fightMenu').style.display = 'flex';
								break;
							default:
								document.getElementById('fightMenu').style.display = 'none';
								enemyAttack();
								playersTurn = "YOURS";
								break;
						
						}
						break;
					}
					}
				}	

						
			break;
		}
		default: {
			/// !TODO implement exit
			exitLoop();
			break;
		}
	}
}
// Exits the applictaion and cleans up used resources
function exitLoop() {
	clearInterval(running_interval);
	// !TODO clean up resources
}