var inFullscreen = false;
var mainCanvas = null;
var fullscreenCanvas = null;
var showAsMinimal = false;
var keyZones = [
	["right", [39]],
	["left", [37]],
	["up", [38]],
	["down", [40]],
	["a", [88, 74, 99]],
	["b", [90, 81, 89, 96]],
	["select", [46]],
	["start", [13]]
];
function windowingInitialize() {
	cout("windowingInitialize() called.", 0);
	windowStacks[0] = windowCreate("GameBoy", true);
	windowStacks[1] = windowCreate("terminal", false);
	windowStacks[2] = windowCreate("about", false);
	windowStacks[3] = windowCreate("settings", false);
	windowStacks[4] = windowCreate("input_select", false);
	windowStacks[5] = windowCreate("instructions", false);
	windowStacks[6] = windowCreate("local_storage_popup", false);
	windowStacks[7] = windowCreate("local_storage_listing", false);
	windowStacks[8] = windowCreate("freeze_listing", false);
	windowStacks[9] = windowCreate("save_importer", false);
	mainCanvas = document.getElementById("mainCanvas");
	fullscreenCanvas = document.getElementById("fullscreen");
	try {
		//Hook the GUI controls.
		registerGUIEvents();
	}
	catch (error) {
		cout("Fatal windowing error: \"" + error.message + "\" file:" + error.fileName + " line: " + error.lineNumber, 2);
	}
	//Update the settings to the emulator's default:
	document.getElementById("enable_sound").checked = settings[0];
	document.getElementById("enable_gbc_bios").checked = settings[1];
	document.getElementById("disable_colors").checked = settings[2];
	document.getElementById("rom_only_override").checked = settings[9];
	document.getElementById("mbc_enable_override").checked = settings[10];
	document.getElementById("enable_colorization").checked = settings[4];
	document.getElementById("do_minimal").checked = showAsMinimal;
	document.getElementById("software_resizing").checked = settings[12];
	document.getElementById("typed_arrays_disallow").checked = settings[5];
	document.getElementById("gb_boot_rom_utilized").checked = settings[11];
	document.getElementById("resize_smoothing").checked = settings[13];
    document.getElementById("channel1").checked = settings[14][0];
    document.getElementById("channel2").checked = settings[14][1];
    document.getElementById("channel3").checked = settings[14][2];
    document.getElementById("channel4").checked = settings[14][3];
}
function registerGUIEvents() {
	cout("In registerGUIEvents() : Registering GUI Events.", -1);
	addEvent("click", document.getElementById("terminal_clear_button"), clear_terminal);
	addEvent("click", document.getElementById("local_storage_list_refresh_button"), refreshStorageListing);
	addEvent("click", document.getElementById("terminal_close_button"), function () { windowStacks[1].hide() });
	addEvent("click", document.getElementById("about_close_button"), function () { windowStacks[2].hide() });
	addEvent("click", document.getElementById("settings_close_button"), function () { windowStacks[3].hide() });
	addEvent("click", document.getElementById("input_select_close_button"), function () { windowStacks[4].hide() });
	addEvent("click", document.getElementById("instructions_close_button"), function () { windowStacks[5].hide() });
	addEvent("click", document.getElementById("local_storage_list_close_button"), function () { windowStacks[7].hide() });
	addEvent("click", document.getElementById("local_storage_popup_close_button"), function () { windowStacks[6].hide() });
	addEvent("click", document.getElementById("save_importer_close_button"), function () { windowStacks[9].hide() });
	addEvent("click", document.getElementById("freeze_list_close_button"), function () { windowStacks[8].hide() });
	addEvent("click", document.getElementById("GameBoy_about_menu"), function () { windowStacks[2].show() });
	addEvent("click", document.getElementById("GameBoy_settings_menu"), function () { windowStacks[3].show() });
	addEvent("click", document.getElementById("local_storage_list_menu"), function () { refreshStorageListing(); windowStacks[7].show(); });
	addEvent("click", document.getElementById("freeze_list_menu"), function () { refreshFreezeListing(); windowStacks[8].show(); });
	addEvent("click", document.getElementById("view_importer"), function () { windowStacks[9].show() });
	addEvent("keydown", document, keyDown);
	addEvent("keyup", document,  function (event) {
		if (event.keyCode == 27) {
			//Fullscreen on/off
			fullscreenPlayer();
		}
		else {
			//Control keys / other
			keyUp(event);
		}
	});
	addEvent("MozOrientation", window, GameBoyGyroSignalHandler);
	addEvent("deviceorientation", window, GameBoyGyroSignalHandler);
	new popupMenu(document.getElementById("GameBoy_file_menu"), document.getElementById("GameBoy_file_popup"));
	new popupMenu(document.getElementById("divers_menu"), document.getElementById("divers_popup"));
	//new popupMenu(document.getElementById("mario_menu"), document.getElementById("mario_popup"));
	addEvent("click", document.getElementById("data_uri_clicker"), function () {
		//var datauri = prompt("Please input the ROM image's Base 64 Encoded Text:", "");

		var filePath2 = "games/SML1.txt";
		var resultx = null;
		  var xmlhttp = new XMLHttpRequest();
		  xmlhttp.open("GET", filePath2, false);
		  xmlhttp.send();
		  if (xmlhttp.status==200) {
		    resultx = xmlhttp.responseText;
		 }
		 //alert("ha! "+resultx);
		 var datauri = resultx;


		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("GameBoy_mario1"), function () {
		var filePath2 = "games/SML1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("GameBoy_mario2"), function () {
		var filePath2 = "games/SML2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("mariobross"), function () {
		var filePath2 = "games/mariobross.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("GameBoy_mario3"), function () {
		var filePath2 = "games/SML3.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("tetris"), function () {
		var filePath2 = "games/tetris.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("tetrisdx"), function () {
		var filePath2 = "games/tetrisdx.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("GameBoy_mario4"), function () {
		var filePath2 = "games/wario2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("re"), function () {
		var filePath2 = "games/re.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("solar"), function () {
		var filePath2 = "games/solar.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("zelda"), function () {
		var filePath2 = "games/zelda.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("zelda2"), function () {
		var filePath2 = "games/zelda2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("cmr2"), function () {
		var filePath2 = "games/cmr2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("roilion"), function () {
		var filePath2 = "games/roilion.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("roilion2"), function () {
		var filePath2 = "games/roilion2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("bn"), function () {
		var filePath2 = "games/bn.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("lucky"), function () {
		var filePath2 = "games/lucky.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("kirby"), function () {
		var filePath2 = "games/kirby.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("kirby2"), function () {
		var filePath2 = "games/kirby2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("aladdin"), function () {
		var filePath2 = "games/aladdin.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("park"), function () {
		var filePath2 = "games/park.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("spider"), function () {
		var filePath2 = "games/spider.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("toy"), function () {
		var filePath2 = "games/toy.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("toy2"), function () {
		var filePath2 = "games/toy2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("lz"), function () {
		var filePath2 = "games/lz.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("batman"), function () {
		var filePath2 = "games/batman.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("robocop"), function () {
		var filePath2 = "games/robocop.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("ad"), function () {
		var filePath2 = "games/ad.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("pokemonjeune"), function () {
		var filePath2 = "games/pokemonjeune.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("mm"), function () {
		var filePath2 = "games/mm.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("tintin1"), function () {
		var filePath2 = "games/tintin1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("tintin2"), function () {
		var filePath2 = "games/tintin2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("dw"), function () {
		var filePath2 = "games/dw.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("metroid2"), function () {
		var filePath2 = "games/metroid2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("rtype"), function () {
		var filePath2 = "games/rtype.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("paper"), function () {
		var filePath2 = "games/paper.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("asterix1"), function () {
		var filePath2 = "games/asterix1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("asterix2"), function () {
		var filePath2 = "games/asterix2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("dd1"), function () {
		var filePath2 = "games/dd1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("dd2"), function () {
		var filePath2 = "games/dd2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("dd3"), function () {
		var filePath2 = "games/dd3.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("mq"), function () {
		var filePath2 = "games/mq.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("dk3"), function () {
		var filePath2 = "games/dk3.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("dk2"), function () {
		var filePath2 = "games/dk2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("contra"), function () {
		var filePath2 = "games/contra.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("tt1"), function () {
		var filePath2 = "games/tt1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("tt2"), function () {
		var filePath2 = "games/tt2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("tt3"), function () {
		var filePath2 = "games/tt3.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("castle"), function () {
		var filePath2 = "games/castle.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("castle2"), function () {
		var filePath2 = "games/castle2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("ff1"), function () {
		var filePath2 = "games/ff1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("ff2"), function () {
		var filePath2 = "games/ff2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("ff3"), function () {
		var filePath2 = "games/ff3.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("ToyStory2"), function () {
		var filePath2 = "games/ToyStory2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	addEvent("click", document.getElementById("mgs"), function () {
		var filePath2 = "games/mgs.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	


	addEvent("click", document.getElementById("indienville"), function () {
		var filePath2 = "games/indienville.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("dk"), function () {
		var filePath2 = "games/dk.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("fb"), function () {
		var filePath2 = "games/fb.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("ps"), function () {
		var filePath2 = "games/ps.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("cmrr"), function () {
		var filePath2 = "games/cmrr.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("dbz"), function () {
		var filePath2 = "games/dbz.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("tz"), function () {
		var filePath2 = "games/tz.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("gb"), function () {
		var filePath2 = "games/gb.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("tgr1"), function () {
		var filePath2 = "games/tgr1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("tgr2"), function () {
		var filePath2 = "games/tgr2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("bbunny1"), function () {
		var filePath2 = "games/bbunny1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("bbunny2"), function () {
		var filePath2 = "games/bbunny2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("rayman1"), function () {
		var filePath2 = "games/rayman1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("rayman2"), function () {
		var filePath2 = "games/rayman2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("mmadness"), function () {
		var filePath2 = "games/mmadness.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("ig"), function () {
		var filePath2 = "games/ig.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("oa2"), function () {
		var filePath2 = "games/oa2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("dkc"), function () {
		var filePath2 = "games/dkc.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("pkmr"), function () {
		var filePath2 = "games/pkmr.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("gta"), function () {
		var filePath2 = "games/gta.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("Mario2DX"), function () {
		var filePath2 = "games/Mario2DX.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("gta2"), function () {
		var filePath2 = "games/gta2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("harrycs"), function () {
		var filePath2 = "games/harrycs.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("harryc2"), function () {
		var filePath2 = "games/harryc2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("wario3"), function () {
		var filePath2 = "games/wario3.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("austin"), function () {
		var filePath2 = "games/austin.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("pokemona"), function () {
		var filePath2 = "games/pokemona.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("pokemono"), function () {
		var filePath2 = "games/pokemono.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("mk4"), function () {
		var filePath2 = "games/mk4.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("click", document.getElementById("jim"), function () {
		var filePath2 = "games/jim.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("visiteurs", document.getElementById("visiteurs"), function () {
		var filePath2 = "games/visiteurs.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("hercules", document.getElementById("hercules"), function () {
		var filePath2 = "games/hercules.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("Mario1DX", document.getElementById("Mario1DX"), function () {
		var filePath2 = "games/Mario1DX.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("looneytunes1", document.getElementById("looneytunes1"), function () {
		var filePath2 = "games/looneytunes1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("looneytunes2", document.getElementById("looneytunes2"), function () {
		var filePath2 = "games/looneytunes2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("aitd", document.getElementById("aitd"), function () {
		var filePath2 = "games/aitd.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("pokemonc", document.getElementById("pokemonc"), function () {
		var filePath2 = "games/pokemonc.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("gex1", document.getElementById("gex1"), function () {
		var filePath2 = "games/gex1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("gex3", document.getElementById("gex3"), function () {
		var filePath2 = "games/gex3.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("addams", document.getElementById("addams"), function () {
		var filePath2 = "games/addams.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("fighter", document.getElementById("fighter"), function () {
		var filePath2 = "games/fighter.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("livre", document.getElementById("livre"), function () {
		var filePath2 = "games/livre.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("scrabble", document.getElementById("scrabble"), function () {
		var filePath2 = "games/scrabble.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("winnie", document.getElementById("winnie"), function () {
		var filePath2 = "games/winnie.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("agent007", document.getElementById("agent007"), function () {
		var filePath2 = "games/agent007.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("testdrive6", document.getElementById("testdrive6"), function () {
		var filePath2 = "games/testdrive6.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("testdrive", document.getElementById("testdrive"), function () {
		var filePath2 = "games/testdrive.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("turok", document.getElementById("turok"), function () {
		var filePath2 = "games/turok.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("turok2", document.getElementById("turok2"), function () {
		var filePath2 = "games/turok2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("turok3", document.getElementById("turok3"), function () {
		var filePath2 = "games/turok3.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("xmen1", document.getElementById("xmen1"), function () {
		var filePath2 = "games/xmen1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("xmen2", document.getElementById("xmen2"), function () {
		var filePath2 = "games/xmen2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("xmen3", document.getElementById("xmen3"), function () {
		var filePath2 = "games/xmen3.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("razmoket1", document.getElementById("razmoket1"), function () {
		var filePath2 = "games/razmoket1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("razmoket2", document.getElementById("razmoket2"), function () {
		var filePath2 = "games/razmoket2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("razmoket3", document.getElementById("razmoket3"), function () {
		var filePath2 = "games/razmoket3.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("mib1", document.getElementById("mib1"), function () {
		var filePath2 = "games/mib1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("mib2", document.getElementById("mib2"), function () {
		var filePath2 = "games/mib2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("megaman1", document.getElementById("megaman1"), function () {
		var filePath2 = "games/megaman1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("megaman2", document.getElementById("megaman2"), function () {
		var filePath2 = "games/megaman2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("worms", document.getElementById("worms"), function () {
		var filePath2 = "games/worms.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("merlin", document.getElementById("merlin"), function () {
		var filePath2 = "games/merlin.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("dn", document.getElementById("dn"), function () {
		var filePath2 = "games/dn.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("dracula", document.getElementById("dracula"), function () {
		var filePath2 = "games/dracula.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("indiana", document.getElementById("indiana"), function () {
		var filePath2 = "games/indiana.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("rob", document.getElementById("rob"), function () {
		var filePath2 = "games/rob.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("robin", document.getElementById("robin"), function () {
		var filePath2 = "games/robin.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("kirikou", document.getElementById("kirikou"), function () {
		var filePath2 = "games/kirikou.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("gremlins", document.getElementById("gremlins"), function () {
		var filePath2 = "games/gremlins.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("grinch", document.getElementById("grinch"), function () {
		var filePath2 = "games/grinch.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("casper", document.getElementById("casper"), function () {
		var filePath2 = "games/casper.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("chessmaster", document.getElementById("chessmaster"), function () {
		var filePath2 = "games/chessmaster.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("pong", document.getElementById("pong"), function () {
		var filePath2 = "games/pong.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("rampage1", document.getElementById("rampage1"), function () {
		var filePath2 = "games/rampage1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("rampage2", document.getElementById("rampage2"), function () {
		var filePath2 = "games/rampage2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("smurfs", document.getElementById("smurfs"), function () {
		var filePath2 = "games/smurfs.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("scooby", document.getElementById("scooby"), function () {
		var filePath2 = "games/scooby.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("spiderman1", document.getElementById("spiderman1"), function () {
		var filePath2 = "games/spiderman1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("spiderman2", document.getElementById("spiderman2"), function () {
		var filePath2 = "games/spiderman2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("bob", document.getElementById("bob"), function () {
		var filePath2 = "games/bob.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("spirou", document.getElementById("spirou"), function () {
		var filePath2 = "games/spirou.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("bubble", document.getElementById("bubble"), function () {
		var filePath2 = "games/bubble.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("zorro", document.getElementById("zorro"), function () {
		var filePath2 = "games/zorro.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("simpsons", document.getElementById("simpsons"), function () {
		var filePath2 = "games/simpsons.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("speedy", document.getElementById("speedy"), function () {
		var filePath2 = "games/speedy.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("mario4dx", document.getElementById("mario4dx"), function () {
		var filePath2 = "games/mario4dx.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("nutz", document.getElementById("nutz"), function () {
		var filePath2 = "games/nutz.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("nascar", document.getElementById("nascar"), function () {
		var filePath2 = "games/nascar.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("pacman", document.getElementById("pacman"), function () {
		var filePath2 = "games/pacman.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("buffy", document.getElementById("buffy"), function () {
		var filePath2 = "games/buffy.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("buzz", document.getElementById("buzz"), function () {
		var filePath2 = "games/buzz.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("blade", document.getElementById("blade"), function () {
		var filePath2 = "games/blade.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("blaster", document.getElementById("blaster"), function () {
		var filePath2 = "games/blaster.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("tr1", document.getElementById("tr1"), function () {
		var filePath2 = "games/tr1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("tr2", document.getElementById("tr2"), function () {
		var filePath2 = "games/tr2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("toca", document.getElementById("toca"), function () {
		var filePath2 = "games/toca.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("tiger", document.getElementById("tiger"), function () {
		var filePath2 = "games/tiger.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("taz", document.getElementById("taz"), function () {
		var filePath2 = "games/taz.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("taxi2", document.getElementById("taxi2"), function () {
		var filePath2 = "games/taxi2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("taxi3", document.getElementById("taxi3"), function () {
		var filePath2 = "games/taxi3.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("xena", document.getElementById("xena"), function () {
		var filePath2 = "games/xena.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("tony", document.getElementById("tony"), function () {
		var filePath2 = "games/tony.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("disney", document.getElementById("disney"), function () {
		var filePath2 = "games/disney.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("wwf", document.getElementById("wwf"), function () {
		var filePath2 = "games/wwf.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("dalma", document.getElementById("dalma"), function () {
		var filePath2 = "games/dalma.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("bust1", document.getElementById("bust1"), function () {
		var filePath2 = "games/bust1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("bust2", document.getElementById("bust2"), function () {
		var filePath2 = "games/bust2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("cg", document.getElementById("cg"), function () {
		var filePath2 = "games/cg.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("cp2", document.getElementById("cp2"), function () {
		var filePath2 = "games/cp2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("cw", document.getElementById("cw"), function () {
		var filePath2 = "games/cw.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("cp", document.getElementById("cp"), function () {
		var filePath2 = "games/cp.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("cr", document.getElementById("cr"), function () {
		var filePath2 = "games/cr.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("chase", document.getElementById("chase"), function () {
		var filePath2 = "games/chase.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("doug", document.getElementById("doug"), function () {
		var filePath2 = "games/doug.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("donald", document.getElementById("donald"), function () {
		var filePath2 = "games/donald.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("dz", document.getElementById("dz"), function () {
		var filePath2 = "games/dz.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("et1", document.getElementById("et1"), function () {
		var filePath2 = "games/et1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("et2", document.getElementById("et2"), function () {
		var filePath2 = "games/et2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("fifa2000", document.getElementById("fifa2000"), function () {
		var filePath2 = "games/fifa2000.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("fs", document.getElementById("fs"), function () {
		var filePath2 = "games/fs.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("fb", document.getElementById("fb"), function () {
		var filePath2 = "games/fb.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("ht", document.getElementById("ht"), function () {
		var filePath2 = "games/ht.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("hm", document.getElementById("hm"), function () {
		var filePath2 = "games/hm.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("hw", document.getElementById("hw"), function () {
		var filePath2 = "games/hw.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("tf1", document.getElementById("tf1"), function () {
		var filePath2 = "games/tf1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("tf2", document.getElementById("tf2"), function () {
		var filePath2 = "games/tf2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("cross", document.getElementById("cross"), function () {
		var filePath2 = "games/cross.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("mi", document.getElementById("mi"), function () {
		var filePath2 = "games/mi.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("maya1", document.getElementById("maya1"), function () {
		var filePath2 = "games/maya1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("maya2", document.getElementById("maya2"), function () {
		var filePath2 = "games/maya2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("pf", document.getElementById("pf"), function () {
		var filePath2 = "games/pf.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("pd", document.getElementById("pd"), function () {
		var filePath2 = "games/pd.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("rr", document.getElementById("rr"), function () {
		var filePath2 = "games/rr.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("r2r", document.getElementById("r2r"), function () {
		var filePath2 = "games/r2r.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("tj", document.getElementById("tj"), function () {
		var filePath2 = "games/tj.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("sfr", document.getElementById("sfr"), function () {
		var filePath2 = "games/sfr.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("rs", document.getElementById("rs"), function () {
		var filePath2 = "games/rs.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("vrally", document.getElementById("vrally"), function () {
		var filePath2 = "games/vrally.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("ret", document.getElementById("ret"), function () {
		var filePath2 = "games/ret.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("yoda", document.getElementById("yoda"), function () {
		var filePath2 = "games/yoda.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("swa", document.getElementById("swa"), function () {
		var filePath2 = "games/swa.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("ttt", document.getElementById("ttt"), function () {
		var filePath2 = "games/ttt.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("monop", document.getElementById("monop"), function () {
		var filePath2 = "games/monop.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("am", document.getElementById("am"), function () {
		var filePath2 = "games/am.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("driver1", document.getElementById("driver1"), function () {
		var filePath2 = "games/driver1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("driver2", document.getElementById("driver2"), function () {
		var filePath2 = "games/driver2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("tt", document.getElementById("tt"), function () {
		var filePath2 = "games/tt.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("jp1", document.getElementById("jp1"), function () {
		var filePath2 = "games/jp1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("jp2", document.getElementById("jp2"), function () {
		var filePath2 = "games/jp2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("tt", document.getElementById("tt"), function () {
		var filePath2 = "games/tt.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("dh", document.getElementById("dh"), function () {
		var filePath2 = "games/dh.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("val", document.getElementById("val"), function () {
		var filePath2 = "games/val.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("spirouo", document.getElementById("spirouo"), function () {
		var filePath2 = "games/spirouo.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("vip", document.getElementById("vip"), function () {
		var filePath2 = "games/vip.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("drf", document.getElementById("drf"), function () {
		var filePath2 = "games/drf.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("fish", document.getElementById("fish"), function () {
		var filePath2 = "games/fish.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("lego1", document.getElementById("lego1"), function () {
		var filePath2 = "games/lego1.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("lego2", document.getElementById("lego2"), function () {
		var filePath2 = "games/lego2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("alf", document.getElementById("alf"), function () {
		var filePath2 = "games/alf.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("am2", document.getElementById("am2"), function () {
		var filePath2 = "games/am2.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("di", document.getElementById("di"), function () {
		var filePath2 = "games/di.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("cb", document.getElementById("cb"), function () {
		var filePath2 = "games/cb.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("ll", document.getElementById("ll"), function () {
		var filePath2 = "games/ll.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("dai", document.getElementById("dai"), function () {
		var filePath2 = "games/dai.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("wf", document.getElementById("wf"), function () {
		var filePath2 = "games/wf.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("pr", document.getElementById("pr"), function () {
		var filePath2 = "games/pr.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("at", document.getElementById("at"), function () {
		var filePath2 = "games/at.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("alice", document.getElementById("alice"), function () {
		var filePath2 = "games/alice.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("tg", document.getElementById("tg"), function () {
		var filePath2 = "games/tg.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("ri", document.getElementById("ri"), function () {
		var filePath2 = "games/ri.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("titi", document.getElementById("titi"), function () {
		var filePath2 = "games/titi.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("mr", document.getElementById("mr"), function () {
		var filePath2 = "games/mr.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("zd", document.getElementById("zd"), function () {
		var filePath2 = "games/zd.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("tif", document.getElementById("tif"), function () {
		var filePath2 = "games/tif.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("sk", document.getElementById("sk"), function () {
		var filePath2 = "games/sk.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("ast", document.getElementById("ast"), function () {
		var filePath2 = "games/.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("sm", document.getElementById("sm"), function () {
		var filePath2 = "games/sm.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("kdx", document.getElementById("kdx"), function () {
		var filePath2 = "games/kdx.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("smb3", document.getElementById("smb3"), function () {
		var filePath2 = "games/smb3.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("dwx", document.getElementById("dwx"), function () {
		var filePath2 = "games/dwx.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("dkcc", document.getElementById("dkcc"), function () {
		var filePath2 = "games/dkcc.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("pp", document.getElementById("pp"), function () {
		var filePath2 = "games/pp.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("sht", document.getElementById("sht"), function () {
		var filePath2 = "games/sht.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("drm", document.getElementById("drm"), function () {
		var filePath2 = "games/drm.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("fel", document.getElementById("fel"), function () {
		var filePath2 = "games/fel.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("oag", document.getElementById("oag"), function () {
		var filePath2 = "games/oag.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("sg", document.getElementById("sg"), function () {
		var filePath2 = "games/sg.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("tot", document.getElementById("tot"), function () {
		var filePath2 = "games/tot.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("qc", document.getElementById("qc"), function () {
		var filePath2 = "games/qc.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("az", document.getElementById("az"), function () {
		var filePath2 = "games/az.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});
	addEvent("hat", document.getElementById("hat"), function () {
		var filePath2 = "games/hat.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});

	/*addEvent("", document.getElementById(""), function () {
		var filePath2 = "games/.txt";
		var resultx = null;
		var xmlhttp = new XMLHttpRequest();
		xmlhttp.open("GET", filePath2, false);
		xmlhttp.send();
		if (xmlhttp.status==200) {resultx = xmlhttp.responseText;}
		var datauri = resultx;
		if (datauri != null && datauri.length > 0) {
			try {
				cout(Math.floor(datauri.length * 3 / 4) + " bytes of data submitted by form (text length of " + datauri.length + ").", 0);
				initPlayer();
				start(mainCanvas, base64_decode(datauri));
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
	});*/
	

	addEvent("click", document.getElementById("set_volume"), function () {
		if (GameBoyEmulatorInitialized()) {
			var volume = prompt("Set the volume here:", "1.0");
			if (volume != null && volume.length > 0) {
				settings[3] = Math.min(Math.max(parseFloat(volume), 0), 1);
				gameboy.changeVolume();
			}
		}
	});
	addEvent("click", document.getElementById("set_speed"), function () {
		if (GameBoyEmulatorInitialized()) {
			var speed = prompt("Set the emulator speed here:", "1.0");
			if (speed != null && speed.length > 0) {
				gameboy.setSpeed(Math.max(parseFloat(speed), 0.001));
			}
		}
	});
	addEvent("click", document.getElementById("internal_file_clicker"), function () {
		var file_opener = document.getElementById("local_file_open");
		windowStacks[4].show();
		file_opener.click();
	});
	addEvent("blur", document.getElementById("input_select"), function () {
		windowStacks[4].hide();
	});
	addEvent("change", document.getElementById("local_file_open"), function () {
		windowStacks[4].hide();
		if (typeof this.files != "undefined") {
			try {
				if (this.files.length >= 1) {
					//alert(this);
					//alert(JSON.stringify(this.files, null, 4));
					cout("Reading the local file \"" + this.files[0].name + "\"", 0);
					try {
						//Gecko 1.9.2+ (Standard Method)
						var binaryHandle = new FileReader();
						binaryHandle.onload = function () {
							if (this.readyState == 2) {
								cout("file loaded.", 0);
								try {
									initPlayer();
									start(mainCanvas, this.result);
								}
								catch (error) {
									alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
								}
							}
							else {
								cout("loading file, please wait...", 0);
							}
						}
						binaryHandle.readAsBinaryString(this.files[this.files.length - 1]);
					}
					catch (error) {
						cout("Browser does not support the FileReader object, falling back to the non-standard File object access,", 2);
						//Gecko 1.9.0, 1.9.1 (Non-Standard Method)
						var romImageString = this.files[this.files.length - 1].getAsBinary();
						try {
							initPlayer();
							start(mainCanvas, romImageString);
						}
						catch (error) {
							alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
						}
						
					}
				}
				else {
					cout("Incorrect number of files selected for local loading.", 1);
				}
			}
			catch (error) {
				cout("Could not load in a locally stored ROM file.", 2);
			}
		}
		else {
			cout("could not find the handle on the file to open.", 2);
		}
	});
	addEvent("change", document.getElementById("save_open"), function () {
		windowStacks[9].hide();
		if (typeof this.files != "undefined") {
			try {
				if (this.files.length >= 1) {
					cout("Reading the local file \"" + this.files[0].name + "\" for importing.", 0);
					try {
						//Gecko 1.9.2+ (Standard Method)
						var binaryHandle = new FileReader();
						binaryHandle.onload = function () {
							if (this.readyState == 2) {
								cout("file imported.", 0);
								try {
									import_save(this.result);
									refreshStorageListing();
								}
								catch (error) {
									alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
								}
							}
							else {
								cout("importing file, please wait...", 0);
							}
						}
						binaryHandle.readAsBinaryString(this.files[this.files.length - 1]);
					}
					catch (error) {
						cout("Browser does not support the FileReader object, falling back to the non-standard File object access,", 2);
						//Gecko 1.9.0, 1.9.1 (Non-Standard Method)
						var romImageString = this.files[this.files.length - 1].getAsBinary();
						try {
							import_save(romImageString);
							refreshStorageListing();
						}
						catch (error) {
							alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
						}
						
					}
				}
				else {
					cout("Incorrect number of files selected for local loading.", 1);
				}
			}
			catch (error) {
				cout("Could not load in a locally stored ROM file.", 2);
			}
		}
		else {
			cout("could not find the handle on the file to open.", 2);
		}
	});
	addEvent("click", document.getElementById("restart_cpu_clicker"), function () {
		if (GameBoyEmulatorInitialized()) {
			try {
				if (!gameboy.fromSaveState) {
					initPlayer();
					start(mainCanvas, gameboy.getROMImage());
				}
				else {
					initPlayer();
					openState(gameboy.savedStateFileName, mainCanvas);
				}
			}
			catch (error) {
				alert(error.message + " file: " + error.fileName + " line: " + error.lineNumber);
			}
		}
		else {
			cout("Could not restart, as a previous emulation session could not be found.", 1);
		}
	});
	addEvent("click", document.getElementById("run_cpu_clicker"), function () {
		run();
	});
	addEvent("click", document.getElementById("kill_cpu_clicker"), function () {
		pause();
	});
	addEvent("click", document.getElementById("save_state_clicker"), function () {
		save();
	});
	addEvent("click", document.getElementById("save_SRAM_state_clicker"), function () {
		saveSRAM();
	});
	addEvent("click", document.getElementById("enable_sound"), function () {
		settings[0] = document.getElementById("enable_sound").checked;
		if (GameBoyEmulatorInitialized()) {
			gameboy.initSound();
		}
	});
	addEvent("click", document.getElementById("disable_colors"), function () {
		settings[2] = document.getElementById("disable_colors").checked;
	});
	addEvent("click", document.getElementById("rom_only_override"), function () {
		settings[9] = document.getElementById("rom_only_override").checked;
	});
	addEvent("click", document.getElementById("mbc_enable_override"), function () {
		settings[10] = document.getElementById("mbc_enable_override").checked;
	});
	addEvent("click", document.getElementById("enable_gbc_bios"), function () {
		settings[1] = document.getElementById("enable_gbc_bios").checked;
	});
	addEvent("click", document.getElementById("enable_colorization"), function () {
		settings[4] = document.getElementById("enable_colorization").checked;
	});
	addEvent("click", document.getElementById("do_minimal"), function () {
		showAsMinimal = document.getElementById("do_minimal").checked;
		fullscreenCanvas.className = (showAsMinimal) ? "minimum" : "maximum";
	});
	addEvent("click", document.getElementById("software_resizing"), function () {
		settings[12] = document.getElementById("software_resizing").checked;
		if (GameBoyEmulatorInitialized()) {
			gameboy.initLCD();
		}
	});
	addEvent("click", document.getElementById("typed_arrays_disallow"), function () {
		settings[5] = document.getElementById("typed_arrays_disallow").checked;
	});
	addEvent("click", document.getElementById("gb_boot_rom_utilized"), function () {
		settings[11] = document.getElementById("gb_boot_rom_utilized").checked;
	});
	addEvent("click", document.getElementById("resize_smoothing"), function () {
		settings[13] = document.getElementById("resize_smoothing").checked;
		if (GameBoyEmulatorInitialized()) {
			gameboy.initLCD();
		}
	});
    addEvent("click", document.getElementById("channel1"), function () {
        settings[14][0] = document.getElementById("channel1").checked;
    });
    addEvent("click", document.getElementById("channel2"), function () {
        settings[14][1] = document.getElementById("channel2").checked;
    });
    addEvent("click", document.getElementById("channel3"), function () {
        settings[14][2] = document.getElementById("channel3").checked;
    });
    addEvent("click", document.getElementById("channel4"), function () {
        settings[14][3] = document.getElementById("channel4").checked;
    });
	addEvent("click", document.getElementById("view_fullscreen"), fullscreenPlayer);
	new popupMenu(document.getElementById("GameBoy_view_menu"), document.getElementById("GameBoy_view_popup"));
	addEvent("click", document.getElementById("view_terminal"), function () { windowStacks[1].show() });
	addEvent("click", document.getElementById("view_instructions"), function () { windowStacks[5].show() });
	addEvent("mouseup", document.getElementById("gfx"), initNewCanvasSize);
	addEvent("resize", window, initNewCanvasSize);
	addEvent("unload", window, function () {
		autoSave();
	});
}
function keyDown(event) {
	var keyCode = event.keyCode;
	var keyMapLength = keyZones.length;
	for (var keyMapIndex = 0; keyMapIndex < keyMapLength; ++keyMapIndex) {
		var keyCheck = keyZones[keyMapIndex];
		var keysMapped = keyCheck[1];
		var keysTotal = keysMapped.length;
		for (var index = 0; index < keysTotal; ++index) {
			if (keysMapped[index] == keyCode) {
				GameBoyKeyDown(keyCheck[0]);
				try {
					event.preventDefault();
				}
				catch (error) { }
			}
		}
	}
}
function keyUp(event) {
	var keyCode = event.keyCode;
	var keyMapLength = keyZones.length;
	for (var keyMapIndex = 0; keyMapIndex < keyMapLength; ++keyMapIndex) {
		var keyCheck = keyZones[keyMapIndex];
		var keysMapped = keyCheck[1];
		var keysTotal = keysMapped.length;
		for (var index = 0; index < keysTotal; ++index) {
			if (keysMapped[index] == keyCode) {
				GameBoyKeyUp(keyCheck[0]);
				try {
					event.preventDefault();
				}
				catch (error) { }
			}
		}
	}
}
function initPlayer() {
	document.getElementById("title").style.display = "none";
	document.getElementById("port_title").style.display = "none";
	document.getElementById("fullscreenContainer").style.display = "none";
}
function fullscreenPlayer() {
	if (GameBoyEmulatorInitialized()) {
		if (!inFullscreen) {
			gameboy.canvas = fullscreenCanvas;
			fullscreenCanvas.className = (showAsMinimal) ? "minimum" : "maximum";
			document.getElementById("fullscreenContainer").style.display = "block";
			windowStacks[0].hide();
		}
		else {
			gameboy.canvas = mainCanvas;
			document.getElementById("fullscreenContainer").style.display = "none";
			windowStacks[0].show();
		}
		gameboy.initLCD();
		inFullscreen = !inFullscreen;
	}
	else {
		cout("Cannot go into fullscreen mode.", 2);
	}
}
function runFreeze(keyName) {
	try {
		windowStacks[8].hide();
		initPlayer();
		openState(keyName, mainCanvas);
	}
	catch (error) {
		cout("A problem with attempting to open the selected save state occurred.", 2);
	}
}
//Wrapper for localStorage getItem, so that data can be retrieved in various types.
function findValue(key) {
	try {
		if (window.localStorage.getItem(key) != null) {
			return JSON.parse(window.localStorage.getItem(key));
		}
	}
	catch (error) {
		//An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
		if (window.globalStorage[location.hostname].getItem(key) != null) {
			return JSON.parse(window.globalStorage[location.hostname].getItem(key));
		}
	}
	return null;
}
//Wrapper for localStorage setItem, so that data can be set in various types.
function setValue(key, value) {
	try {
		window.localStorage.setItem(key, JSON.stringify(value));
	}
	catch (error) {
		//An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
		window.globalStorage[location.hostname].setItem(key, JSON.stringify(value));
	}
}
//Wrapper for localStorage removeItem, so that data can be set in various types.
function deleteValue(key) {
	try {
		window.localStorage.removeItem(key);
	}
	catch (error) {
		//An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
		window.globalStorage[location.hostname].removeItem(key);
	}
}
function outputLocalStorageLink(keyName, dataFound, downloadName) {
	return generateDownloadLink("data:application/octet-stream;base64," + dataFound, keyName, downloadName);
}
function refreshFreezeListing() {
	var storageListMasterDivSub = document.getElementById("freezeListingMasterContainerSub");
	var storageListMasterDiv = document.getElementById("freezeListingMasterContainer");
	storageListMasterDiv.removeChild(storageListMasterDivSub);
	storageListMasterDivSub = document.createElement("div");
	storageListMasterDivSub.id = "freezeListingMasterContainerSub";
	var keys = getLocalStorageKeys();
	while (keys.length > 0) {
		key = keys.shift();
		if (key.substring(0, 7) == "FREEZE_") {
			storageListMasterDivSub.appendChild(outputFreezeStateRequestLink(key));
		}
	}
	storageListMasterDiv.appendChild(storageListMasterDivSub);
}
function outputFreezeStateRequestLink(keyName) {
	var linkNode = generateLink("javascript:runFreeze(\"" + keyName + "\")", keyName);
	var storageContainerDiv = document.createElement("div");
	storageContainerDiv.className = "storageListingContainer";
	storageContainerDiv.appendChild(linkNode)
	return storageContainerDiv;
}
function refreshStorageListing() {
	var storageListMasterDivSub = document.getElementById("storageListingMasterContainerSub");
	var storageListMasterDiv = document.getElementById("storageListingMasterContainer");
	storageListMasterDiv.removeChild(storageListMasterDivSub);
	storageListMasterDivSub = document.createElement("div");
	storageListMasterDivSub.id = "storageListingMasterContainerSub";
	var keys = getLocalStorageKeys();
	var blobPairs = [];
	for (var index = 0; index < keys.length; ++index) {
		blobPairs[index] = getBlobPreEncoded(keys[index]);
		storageListMasterDivSub.appendChild(outputLocalStorageRequestLink(keys[index]));
	}
	storageListMasterDiv.appendChild(storageListMasterDivSub);
	var linkToManipulate = document.getElementById("download_local_storage_dba");
	linkToManipulate.href = "data:application/octet-stream;base64," + base64(generateMultiBlob(blobPairs));
	linkToManipulate.download = "gameboy_color_saves.export";
}
function getBlobPreEncoded(keyName) {
	if (keyName.substring(0, 9) == "B64_SRAM_") {
		return [keyName.substring(4), base64_decode(findValue(keyName))];
	}
	else if (keyName.substring(0, 5) == "SRAM_") {
		return [keyName, convertToBinary(findValue(keyName))];
	}
	else {
		return [keyName, JSON.stringify(findValue(keyName))];
	}
}
function outputLocalStorageRequestLink(keyName) {
	var linkNode = generateLink("javascript:popupStorageDialog(\"" + keyName + "\")", keyName);
	var storageContainerDiv = document.createElement("div");
	storageContainerDiv.className = "storageListingContainer";
	storageContainerDiv.appendChild(linkNode)
	return storageContainerDiv;
}
function popupStorageDialog(keyName) {
	var subContainer = document.getElementById("storagePopupMasterContainer");
	var parentContainer = document.getElementById("storagePopupMasterParent");
	parentContainer.removeChild(subContainer);
	subContainer = document.createElement("div");
	subContainer.id = "storagePopupMasterContainer";
	parentContainer.appendChild(subContainer);
	var downloadDiv = document.createElement("div");
	downloadDiv.id = "storagePopupDownload";
	if (keyName.substring(0, 9) == "B64_SRAM_") {
		var downloadDiv2 = document.createElement("div");
		downloadDiv2.id = "storagePopupDownloadRAW";
		downloadDiv2.appendChild(outputLocalStorageLink("Download RAW save data.", findValue(keyName), keyName));
		subContainer.appendChild(downloadDiv2);
		downloadDiv.appendChild(outputLocalStorageLink("Download in import compatible format.", base64(generateBlob(keyName.substring(4), base64_decode(findValue(keyName)))), keyName));
	}
	else if (keyName.substring(0, 5) == "SRAM_") {
		var downloadDiv2 = document.createElement("div");
		downloadDiv2.id = "storagePopupDownloadRAW";
		downloadDiv2.appendChild(outputLocalStorageLink("Download RAW save data.", base64(convertToBinary(findValue(keyName))), keyName));
		subContainer.appendChild(downloadDiv2);
		downloadDiv.appendChild(outputLocalStorageLink("Download in import compatible format.", base64(generateBlob(keyName, convertToBinary(findValue(keyName)))), keyName));
	}
	else {
		downloadDiv.appendChild(outputLocalStorageLink("Download in import compatible format.", base64(generateBlob(keyName, JSON.stringify(findValue(keyName)))), keyName));
	}
	var deleteLink = generateLink("javascript:deleteStorageSlot(\"" + keyName + "\")", "Delete data item from HTML5 local storage.");
	deleteLink.id = "storagePopupDelete";
	subContainer.appendChild(downloadDiv);
	subContainer.appendChild(deleteLink);
	windowStacks[6].show();
}
function convertToBinary(jsArray) {
	var length = jsArray.length;
	var binString = "";
	for (var indexBin = 0; indexBin < length; indexBin++) {
		binString += String.fromCharCode(jsArray[indexBin]);
	}
	return binString;
}
function deleteStorageSlot(keyName) {
	deleteValue(keyName);
	windowStacks[6].hide();
	refreshStorageListing();
}
function generateLink(address, textData) {
	var link = document.createElement("a");
	link.href = address;
	link.appendChild(document.createTextNode(textData));
	return link;
}
function generateDownloadLink(address, textData, keyName) {
	var link = generateLink(address, textData);
	link.download = keyName + ".sav";
	return link;
}
function checkStorageLength() {
	try {
		return window.localStorage.length;
	}
	catch (error) {
		//An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
		return window.globalStorage[location.hostname].length;
	}
}
function getLocalStorageKeys() {
	var storageLength = checkStorageLength();
	var keysFound = [];
	var index = 0;
	var nextKey = null;
	while (index < storageLength) {
		nextKey = findKey(index++);
		if (nextKey !== null && nextKey.length > 0) {
			if (nextKey.substring(0, 5) == "SRAM_" || nextKey.substring(0, 9) == "B64_SRAM_" || nextKey.substring(0, 7) == "FREEZE_" || nextKey.substring(0, 4) == "RTC_") {
				keysFound.push(nextKey);
			}
		}
		else {
			break;
		}
	}
	return keysFound;
}
function findKey(keyNum) {
	try {
		return window.localStorage.key(keyNum);
	}
	catch (error) {
		//An older Gecko 1.8.1/1.9.0 method of storage (Deprecated due to the obvious security hole):
		return window.globalStorage[location.hostname].key(keyNum);
	}
	return null;
}
//Some wrappers and extensions for non-DOM3 browsers:
function isDescendantOf(ParentElement, toCheck) {
	if (!ParentElement || !toCheck) {
		return false;
	}
	//Verify an object as either a direct or indirect child to another object.
	function traverseTree(domElement) {
		while (domElement != null) {
			if (domElement.nodeType == 1) {
				if (isSameNode(domElement, toCheck)) {
					return true;
				}
				if (hasChildNodes(domElement)) {
					if (traverseTree(domElement.firstChild)) {
						return true;
					}
				}
			}
			domElement = domElement.nextSibling;
		}
		return false;
	}
	return traverseTree(ParentElement.firstChild);
}
function hasChildNodes(oElement) {
	return (typeof oElement.hasChildNodes == "function") ? oElement.hasChildNodes() : ((oElement.firstChild != null) ? true : false);
}
function isSameNode(oCheck1, oCheck2) {
	return (typeof oCheck1.isSameNode == "function") ? oCheck1.isSameNode(oCheck2) : (oCheck1 === oCheck2);
}
function pageXCoord(event) {
	if (typeof event.pageX == "undefined") {
		return event.clientX + document.documentElement.scrollLeft;
	}
	return event.pageX;
}
function pageYCoord(event) {
	if (typeof event.pageY == "undefined") {
		return event.clientY + document.documentElement.scrollTop;
	}
	return event.pageY;
}
function mouseLeaveVerify(oElement, event) {
	//Hook target element with onmouseout and use this function to verify onmouseleave.
	return isDescendantOf(oElement, (typeof event.target != "undefined") ? event.target : event.srcElement) && !isDescendantOf(oElement, (typeof event.relatedTarget != "undefined") ? event.relatedTarget : event.toElement);
}
function mouseEnterVerify(oElement, event) {
	//Hook target element with onmouseover and use this function to verify onmouseenter.
	return !isDescendantOf(oElement, (typeof event.target != "undefined") ? event.target : event.srcElement) && isDescendantOf(oElement, (typeof event.relatedTarget != "undefined") ? event.relatedTarget : event.fromElement);
}
function addEvent(sEvent, oElement, fListener) {
	try {	
		oElement.addEventListener(sEvent, fListener, false);
		cout("In addEvent() : Standard addEventListener() called to add a(n) \"" + sEvent + "\" event.", -1);
	}
	catch (error) {
		oElement.attachEvent("on" + sEvent, fListener);	//Pity for IE.
		cout("In addEvent() : Nonstandard attachEvent() called to add an \"on" + sEvent + "\" event.", -1);
	}
}
function removeEvent(sEvent, oElement, fListener) {
	try {	
		oElement.removeEventListener(sEvent, fListener, false);
		cout("In removeEvent() : Standard removeEventListener() called to remove a(n) \"" + sEvent + "\" event.", -1);
	}
	catch (error) {
		oElement.detachEvent("on" + sEvent, fListener);	//Pity for IE.
		cout("In removeEvent() : Nonstandard detachEvent() called to remove an \"on" + sEvent + "\" event.", -1);
	}
}