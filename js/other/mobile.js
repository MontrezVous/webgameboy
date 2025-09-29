var inFullscreen = false;
var mainCanvas = null;
var fullscreenCanvas = null;
var showAsMinimal = false;
var nintendotext = '<a id="liennintendo" href="https://montrezvous.net/portfolio-items/gameboy-sur-smartphone" target="_blank">GAMEBOY</a>';
var keyZones = [
  ["right", [39]],
  ["left", [37]],
  ["up", [38]],
  ["down", [40]],
  ["a", [88, 74]],
  ["b", [90, 81, 89]],
  ["select", [16]],
  ["start", [13]]
];
var cout = console.log.bind(console);
document.getElementById("nintendo").innerHTML=nintendotext;

var urlParams = new URLSearchParams(window.location.search);
//alert('['+urlParams.get('game')+']');
let queryString = urlParams.get('game');
if(queryString == null || queryString =="null" || queryString ==false){queryString = "Mario2DX";}
//alert('['+urlParams.get('game')+'-'+queryString+']');
document.getElementById("game-select").querySelector("option[value='" + queryString + "']").selected = true;

/*var tl1 = "<button id="loadstate">S1</button>";
var tl2 = "<button id="loadstate">S2</button>";
var tl3 = "<button id="loadstate">S3</button>";
var tl4 = "<button id="loadstate">S4</button>";
if(getLocalStorageKeys().length >= 1) {
  var tl1 ='';
  document.getElementById("l1").innerHTML =tl1;
  //alert(tl1);
}*/

//Gamepad detect
/*window.addEventListener('gamepadconnected', (event) => {
  const update = () => {
    const output = document.getElementById('buttons');
    output.innerHTML = ''; // clear the output

    for (const gamepad of navigator.getGamepads()) {
      if (!gamepad) continue;
      for (const [index, button] of gamepad.buttons.entries()) {
        
        output.insertAdjacentHTML('beforeend',
          `<label>${gamepad.index}, ${index}
             <progress value=${button.value}></progress>
             ${button.touched ? 'touched' : ''}
             ${button.pressed ? 'pressed.' : ''}
           </label>`+`he`);

        
      }
    }
    requestAnimationFrame(update);
  };
  update();
  if(1){
    console.log('ok')
  }
});*/


function soundchg(sound){
	settings[3] = Math.min(Math.max(parseFloat(sound), 0), 1);
	gameboy.changeVolume();
	document.getElementById("xvolume").innerHTML = (sound * 100)+'%';
}

function vitessechg(vitesse){
	if (vitesse != null && vitesse.length > 0) {
		gameboy.setSpeed(Math.max(parseFloat(vitesse), 0.001));
		document.getElementById("xvitesse").innerHTML = 'x'+(vitesse);
	}
}

function startGame (blob) {
  var binaryHandle = new FileReader();
  binaryHandle.onload = function () {
    if (this.readyState === 2) {
      try {
        start(mainCanvas, this.result);
      } catch (e) {
        alert(e.message);
      }
    }
  };
  binaryHandle.readAsBinaryString(blob);
};
/*
var gamep = new URL(window.location.toLocaleString());
	gamep = gamep.toString().split('?')[1];
	gamep = gamep.toString().split('=')[1];
	//alert(gamep);
*/

function loadViaMozActivity () {
  var activity = new MozActivity({
    name: "pick",
    data: {},
  });
  activity.onsuccess = function () {
    startGame(this.result.blob);
  };
  activity.onerror = function () {
    alert(this.error.name);
  };
};

function loadViaXHR () {
	//const gamep = urlParams.get('game');
	var gamep = new URL(window.location.toLocaleString());
	//alert(gamep);
	if(gamep == "http://localhost/gameboy/mobile.html" || gamep == "https://montrezvous.net/gameboy2/mobile.html" || gamep == "https://gameboy.montrezvous.net/" || gamep == "http://gameboy.montrezvous.net/"){
		gamep = gamep+"?game=Mario2DX";
		//gamep = "";

	}

	if(gamep.toString().split('?')[0] !== "" && gamep !== "undefined"){//alert(gamep);
		if(gamep.toString().includes('?')){
			gamep = gamep.toString().split('?')[1];
			if(gamep.toString().split('=')[1] !== "undefined"){
					gamep = gamep.toString().split('=')[1];
			}else{gamep ='Mario2DX';}
		}else{gamep ='Mario2DX';}
	}else{gamep ='Mario2DX';}

	
	
	//alert(gamep);
	//const gamep ='kerby';
	var urlg = "";
	//console.log(gamep);
	switch (gamep) {
  	case 'tetris':urlg = "games2/Tetris.GB"; break;
  	case 'kirby':urlg = "games2/Kirby.gb"; break;
  	case 'solar':urlg = "games2/Solar Striker.gb"; break;
  	case 'zelda':urlg = "games2/zelda.gb"; break;
  	case 'roilion':urlg = "games2/Lion King.gb"; break;
  	case 'lucky':urlg = "games2/LuckyLuke.gb"; break;
  	case 'bn':urlg = "games2/Bataille Navale.gb"; break;
  	case 'mario1':urlg = "games2/Super Mario Land.gb"; break;
  	case 'mario2':urlg = "games2/Super Mario Land 2.gb"; break;
  	case 'mario3':urlg = "games2/Wario Land - Super Mario Land 3.gb"; break;
  	case 'mario4':urlg = "games2/Wario Land II.gb"; break;
    case 'mario4dx':urlg = "games2/mario4dx.gbc"; break;
  	case 'tetrisdx':urlg = "games2/Tetris DX.gbc"; break;
  	case 'kirby2':urlg = "games2/Kirby2.gbc"; break;
  	case 'aladdin':urlg = "games2/Aladdin.gbc"; break;
  	case 'park':urlg = "games2/SPGAM120.gb"; break;
  	case 'spider':urlg = "games2/Spider-Man.gbc"; break;
  	case 'toy':urlg = "games2/Toy Story Racer.gbc"; break;
  	case 'toy2':urlg = "games2/toy2.gbc"; break;
  	case 'zelda2':urlg = "games2/29465.gbc"; break;
    case 'cmr2':urlg = "games2/cmr2.gbc"; break;
  	case 'roilion2':urlg = "games2/Roi Lion Les Adventures de Simba.gbc"; break;
  	case 're':urlg = "games2/ResidentEvilGaiden.gbc"; break;
  	case 'lz':urlg = "games2/lz.gbc"; break;
  	case 'batman':urlg = "games2/batman.gbc"; break;
  	case 'robocop':urlg = "games2/robocop.gbc"; break;
  	case 'ad':urlg = "games2/ad.gbc"; break;
  	case 'pokemonjeune':urlg = "games2/pokemonjeune.gbc"; break;
  	case 'mm':urlg = "games2/mm.gbc"; break;
  	case 'tintin1':urlg = "games2/tintin1.gbc"; break;
  	case 'tintin2':urlg = "games2/tintin2.gb"; break;
  	case 'dw':urlg = "games2/dw.gbc"; break;
  	case 'metroid2':urlg = "games2/metroid2.gb"; break;
  	case 'rtype':urlg = "games2/rtype.gbc"; break;
  	case 'paper':urlg = "games2/paper.gbc"; break;
  	case 'asterix1':urlg = "games2/asterix1.gb"; break;
  	case 'asterix2':urlg = "games2/asterix2.gbc"; break;
  	case 'dd1':urlg = "games2/dd1.gb"; break;
  	case 'dd2':urlg = "games2/dd2.gb"; break;
  	case 'dd3':urlg = "games2/dd3.gb"; break;
  	case 'dk3':urlg = "games2/dk3.gb"; break;
  	case 'mq':urlg = "games2/mq.gb"; break;
  	case 'dk3':urlg = "games2/dk3.gb"; break;
  	case 'contra':urlg = "games2/contra.gb"; break;
  	case 'tt1':urlg = "games2/tt1.gb"; break;
  	case 'tt2':urlg = "games2/tt2.gb"; break;
  	case 'tt3':urlg = "games2/tt3.gb"; break;
  	case 'dk2':urlg = "games2/dk2.gb"; break;
  	case 'castle':urlg = "games2/castle.gb"; break;
  	case 'castle2':urlg = "games2/castle2.gb"; break;
  	case 'ff1':urlg = "games2/ff1.gb"; break;
  	case 'ff2':urlg = "games2/ff2.gb"; break;
  	case 'ff3':urlg = "games2/ff3.gb"; break;
  	case 'mgs':urlg = "games2/mgs.gbc"; break;
  	case 'dkc':urlg = "games2/dkc.gbc"; break;
  	case 'pkmr':urlg = "games2/pkmr.gbc"; break;
  	case 'gta':urlg = "games2/gta.gbc"; break;
  	case 'ig':urlg = "games2/ig.gbc"; break;
  	case 'tgr1':urlg = "games2/tgr1.gbc"; break;
  	case 'tgr2':urlg = "games2/tgr2.gbc"; break;
  	case 'rayman1':urlg = "games2/rayman1.gbc"; break;
  	case 'rayman2':urlg = "games2/rayman2.gbc"; break;
  	case 'bbunny1':urlg = "games2/bbunny1.gbc"; break;
  	case 'bbunny2':urlg = "games2/bbunny2.gbc"; break;
  	case 'gb':urlg = "games2/gb.gbc"; break;
  	case 'tz':urlg = "games2/tz.gbc"; break;
  	case 'dbz':urlg = "games2/dbz.gbc"; break;
  	case 'cmrr':urlg = "games2/cmrr.gbc"; break;
  	case 'ps':urlg = "games2/ps.gbc"; break;
  	case 'fb':urlg = "games2/fb.gbc"; break;
  	case 'dk':urlg = "games2/dk.gbc"; break;
  	case 'Mario2DX':urlg = "games2/Mario2DX.gbc"; break;
  	case 'gta2':urlg = "games2/gta2.gbc"; break;
  	case 'harrycs':urlg = "games2/harrycs.gbc"; break;
  	case 'harryc2':urlg = "games2/harryc2.gbc"; break;
  	case 'wario3':urlg = "games2/wario3.gbc"; break;
  	case 'austin':urlg = "games2/austin.gbc"; break;
  	case 'pokemona':urlg = "games2/pokemona.gbc"; break;
  	case 'pokemono':urlg = "games2/pokemono.gbc"; break;
  	case 'indienville':urlg = "games2/indienville.gbc"; break;
  	case 'mk4':urlg = "games2/mk4.gbc"; break;
  	case 'jim':urlg = "games2/jim.gbc"; break;
  	case 'visiteurs':urlg = "games2/visiteurs.gbc"; break;
  	case 'hercules':urlg = "games2/hercules.gbc"; break;
  	case 'Mario1DX':urlg = "games2/Mario1DX.gbc"; break;
  	case 'looneytunes1':urlg = "games2/looneytunes1.gbc"; break;
  	case 'looneytunes2':urlg = "games2/looneytunes2.gbc"; break;
  	case 'aitd':urlg = "games2/aitd.gbc"; break;
  	case 'pokemonc':urlg = "games2/pokemonc.gbc"; break;
  	case 'gex1':urlg = "games2/gex1.gbc"; break;
  	case 'gex3':urlg = "games2/gex3.gbc"; break;
  	case 'addams':urlg = "games2/addams.gbc"; break;
  	case 'mmadness':urlg = "games2/mmadness.gbc"; break;
  	case 'fighter':urlg = "games2/fighter.gbc"; break;
  	case 'livre':urlg = "games2/livre.gbc"; break;
  	case 'scrabble':urlg = "games2/scrabble.gbc"; break;
  	case 'mariobross':urlg = "games2/mariobross.gbc"; break;
  	case 'winnie':urlg = "games2/winnie.gbc"; break;
  	case 'agent007':urlg = "games2/agent007.gbc"; break;
  	case 'testdrive':urlg = "games2/testdrive.gbc"; break;
  	case 'testdrive6':urlg = "games2/testdrive6.gbc"; break;
  	case 'turok1':urlg = "games2/turok1.gbc"; break;
  	case 'turok2':urlg = "games2/turok2.gbc"; break;
  	case 'turok3':urlg = "games2/turok3.gbc"; break;
  	case 'mib1':urlg = "games2/mib1.gbc"; break;
  	case 'mib2':urlg = "games2/mib2.gbc"; break;
  	case 'croc1':urlg = "games2/croc1.gbc"; break;
  	case 'croc2':urlg = "games2/croc2.gbc"; break;
  	case 'megaman1':urlg = "games2/megaman1.gbc"; break;
  	case 'megaman2':urlg = "games2/megaman2.gbc"; break;
  	case 'xmen1':urlg = "games2/xmen1.gbc"; break;
  	case 'xmen2':urlg = "games2/xmen2.gbc"; break;
  	case 'xmen3':urlg = "games2/xmen3.gbc"; break;
  	case 'worms':urlg = "games2/worms.gbc"; break;
  	case 'razmoket1':urlg = "games2/razmoket1.gbc"; break;
  	case 'razmoket2':urlg = "games2/razmoket2.gbc"; break;
  	case 'razmoket3':urlg = "games2/razmoket3.gbc"; break;
  	case 'merlin':urlg = "games2/merlin.gbc"; break;
  	case 'dn':urlg = "games2/dn.gbc"; break;
  	case 'rob':urlg = "games2/rob.gbc"; break;
  	case 'robin':urlg = "games2/robin.gbc"; break;
  	case 'dracula':urlg = "games2/dracula.gbc"; break;
  	case 'indiana':urlg = "games2/indiana.gbc"; break;
    case 'kirikou':urlg = "games2/kirikou.gbc"; break;
    case 'gremlins':urlg = "games2/gremlins.gbc"; break;
    case 'grinch':urlg = "games2/grinch.gbc"; break;
    case 'casper':urlg = "games2/casper.gbc"; break;
    case 'chessmaster':urlg = "games2/chessmaster.gbc"; break;
  	default:urlg = "games2/Super Mario Land.gb"; break;
    case 'pong':urlg = "games2/pong.gbc"; break;
    case 'rampage1':urlg = "games2/rampage1.gbc"; break;
    case 'rampage2':urlg = "games2/rampage2.gbc"; break;
    case 'smurfs':urlg = "games2/smurfs.gbc"; break;
    case 'scooby':urlg = "games2/scooby.gbc"; break;
    case 'spiderman1':urlg = "games2/spiderman1.gbc"; break;
    case 'spiderman2':urlg = "games2/spiderman2.gbc"; break;
    case 'bob':urlg = "games2/bob.gbc"; break;
    case 'spirou':urlg = "games2/spirou.gbc"; break;
    case 'bubble':urlg = "games2/bubble.gbc"; break;
    case 'zorro':urlg = "games2/zorro.gbc"; break;
    case 'simpsons':urlg = "games2/simpsons.gbc"; break;
    case 'speedy':urlg = "games2/speedy.gbc"; break;
    case 'nascar':urlg = "games2/nascar.gbc"; break;
    case 'pacman':urlg = "games2/pacman.gbc"; break;
    case 'nutz':urlg = "games2/nutz.gbc"; break;
    case 'blade':urlg = "games2/blade.gbc"; break;
    case 'buffy':urlg = "games2/buffy.gbc"; break;
    case 'buzz':urlg = "games2/buzz.gbc"; break;
    case 'blaster':urlg = "games2/blaster.gbc"; break;
    case 'tr1':urlg = "games2/tr1.gbc"; break;
    case 'tr2':urlg = "games2/tr2.gbc"; break;
    case 'toca':urlg = "games2/toca.gbc"; break;
    case 'tiger':urlg = "games2/tiger.gbc"; break;
    case 'taxi2':urlg = "games2/taxi2.gbc"; break;
    case 'taxi3':urlg = "games2/taxi3.gbc"; break;
    case 'taz':urlg = "games2/taz.gbc"; break;
    case 'xena':urlg = "games2/xena.gbc"; break;
    case 'tony':urlg = "games2/tony.gbc"; break;
    case 'wwf':urlg = "games2/wwf.gbc"; break;
    case 'disney':urlg = "games2/disney.gbc"; break;
    case 'dalma':urlg = "games2/dalma.gbc"; break;
    case 'bust1':urlg = "games2/bust1.gbc"; break;
    case 'bust2':urlg = "games2/bust2.gbc"; break;
    case 'cp2':urlg = "games2/cp2.gbc"; break;
    case 'cg':urlg = "games2/cg.gbc"; break;
    case 'cp':urlg = "games2/cp.gbc"; break;
    case 'chase':urlg = "games2/chase.gbc"; break;
    case 'cr':urlg = "games2/cr.gbc"; break;
    case 'donald':urlg = "games2/donald.gbc"; break;
    case 'doug':urlg = "games2/doug.gbc"; break;
    case 'dz':urlg = "games2/dz.gbc"; break;
    case 'et1':urlg = "games2/et1.gbc"; break;
    case 'et2':urlg = "games2/et2.gbc"; break;
    case 'fifa2000':urlg = "games2/fifa2000.gbc"; break;
    case 'fs':urlg = "games2/fs.gbc"; break;
    case 'cw':urlg = "games2/cw.gbc"; break;
    case 'fb':urlg = "games2/fb.gbc"; break;
    case 'ht':urlg = "games2/ht.gbc"; break;
    case 'hm':urlg = "games2/hm.gbc"; break;
    case 'hw':urlg = "games2/hw.gbc"; break;
    case 'tf1':urlg = "games2/tf1.gbc"; break;
    case 'tf2':urlg = "games2/tf2.gbc"; break;
    case 'cross':urlg = "games2/cross.gbc"; break;
    case 'maya1':urlg = "games2/maya1.gbc"; break;
    case 'maya2':urlg = "games2/maya2.gbc"; break;
    case 'mi':urlg = "games2/mi.gbc"; break;
    case 'pf':urlg = "games2/pf.gbc"; break;
    case 'pd':urlg = "games2/pd.gbc"; break;
    case 'r2r':urlg = "games2/r2r.gbc"; break;
    case 'rr':urlg = "games2/rr.gbc"; break;
    case 'tj':urlg = "games2/tj.gbc"; break;
    case 'sfr':urlg = "games2/sfr.gbc"; break;
    case 'rs':urlg = "games2/rs.gbc"; break;
    case 'vrally':urlg = "games2/vrally.gbc"; break;
    case 'ret':urlg = "games2/ret.gbc"; break;
    case 'yoda':urlg = "games2/yoda.gbc"; break;
    case 'swa':urlg = "games2/swa.gbc"; break;
    case 'ttt':urlg = "games2/ttt.gbc"; break;
    case 'monop':urlg = "games2/monop.gbc"; break;
    case 'driver1':urlg = "games2/driver1.gbc"; break;
    case 'driver2':urlg = "games2/driver2.gbc"; break;
    case 'am':urlg = "games2/am.gbc"; break;
    case 'jp1':urlg = "games2/jp1.gbc"; break;
    case 'jp2':urlg = "games2/jp2.gbc"; break;
    case 'tt':urlg = "games2/tt.gbc"; break;
    case 'dh':urlg = "games2/dh.gbc"; break;
    case 'val':urlg = "games2/val.gbc"; break;
    case 'spirouo':urlg = "games2/spirouo.gbc"; break;
    case 'vip':urlg = "games2/vip.gbc"; break;
    case 'drf':urlg = "games2/drf.gbc"; break;
    case 'fish':urlg = "games2/fish.gbc"; break;
    case 'lego1':urlg = "games2/lego1.gbc"; break;
    case 'lego2':urlg = "games2/lego2.gbc"; break;
    case 'alf':urlg = "games2/alf.gbc"; break;
    case 'am2':urlg = "games2/am2.gbc"; break;
    case 'cb':urlg = "games2/cb.gbc"; break;
    case 'di':urlg = "games2/di.gbc"; break;
    case 'dai':urlg = "games2/dai.gbc"; break;
    case 'll':urlg = "games2/ll.gbc"; break;
    case 'wf':urlg = "games2/wf.gbc"; break;
    case 'pr':urlg = "games2/pr.gbc"; break;
    case 'at':urlg = "games2/at.gbc"; break;
    case 'alice':urlg = "games2/alice.gbc"; break;
    case 'tg':urlg = "games2/tg.gbc"; break;
    case 'ri':urlg = "games2/ri.gbc"; break;
    case 'titi':urlg = "games2/titi.gbc"; break;
    case 'mr':urlg = "games2/mr.gbc"; break;
    case 'zd':urlg = "games2/zd.gbc"; break;
    case 'tif':urlg = "games2/tif.gbc"; break;
    case 'sk':urlg = "games2/sk.gbc"; break;
    case 'ast':urlg = "games2/ast.gbc"; break;
    case 'sm':urlg = "games2/sm.gbc"; break;
    case 'kdx':urlg = "games2/kdx.gbc"; break;
    case 'smb3':urlg = "games2/smb3.gbc"; break;
    case 'dwx':urlg = "games2/dwx.gbc"; break;
    case 'dkcc':urlg = "games2/dkcc.gbc"; break;
    case 'sht':urlg = "games2/sht.gbc"; break;
    case 'pp':urlg = "games2/pp.gbc"; break;
    case 'drm':urlg = "games2/drm.gbc"; break;
    case 'fel':urlg = "games2/fel.gbc"; break;
    case 'sg':urlg = "games2/sg.gbc"; break;
    case 'oag':urlg = "games2/oag.gbc"; break;
    case 'tot':urlg = "games2/tot.gbc"; break;
    case 'qc':urlg = "games2/qc.gbc"; break;
    case 'az':urlg = "games2/az.gbc"; break;
    case 'hat':urlg = "games2/hat.gbc"; break;

    //case '':urlg = "games2/.gbc"; break;
    //case '':urlg = "games2/.gbc"; break;
  }

  var xhr = new XMLHttpRequest();
  xhr.open("GET", urlg);//"/gameboy/games2/Tetris.GB"
  xhr.responseType = "blob";
  xhr.onload = function () {
  	//alert('https://montrezvous.net/gameboy2/'+urlg);
    startGame(new Blob([this.response], { type: "text/plain" }));
  };
  xhr.send();
  document.getElementById('mainCanvas').setAttribute("style","height:198");
};

function shim (eles) {
  function onDown (e) {
    var keyZone = e.target.dataset.keyZone;
    if (!keyZone) {
      keyZone = e.target.parentNode.dataset.keyZone;
      if (!keyZone) return;
    }
    GameBoyKeyDown(keyZone);
    navigator.vibrate(50);
  };
  function onUp (e) {
    var keyZone = e.target.dataset.keyZone;
    if (!keyZone) {
      keyZone = e.target.parentNode.dataset.keyZone;
      if (!keyZone) return;
    }
    GameBoyKeyUp(keyZone);
    navigator.vibrate(0);
  };
  eles.forEach(function (ele) {
    ele.ontouchstart = ele.onmousedown = onDown;
    ele.ontouchend = ele.onmouseup = onUp;
  });
};

  function loady(){
  	var lastsave = getLocalStorageKeys();
  	alert(lastsave.join('|'));
  	//runFreeze("\""+lastsave+"\"");
  }

var $ = document.getElementById.bind(document);
function registerTouchEventShim () {
  shim([
    $("a_button_group"),
    $("b_button_group"),
    $("arrow_up"),
    $("arrow_down"),
    $("arrow_right"),
    $("arrow_left"),
    $("select_button_group"),
    $("start_button_group")
  ]);
};

//$("#game_button_group")
/*$( "#game-select" ).on( "change", function() {
  //alert( "Handler for `change` called." );
  var str = "";
    $( "select option:selected" ).each( function() {
      alert($( this ).text());
    } );
} );*/



const element8 = document.getElementById("run_cpu_clicker");
const element9 = document.getElementById("pause_cpu_clicker");

element8.addEventListener("click", myFunction7);
function myFunction7() {
  run();
  element9.style.display = 'inline';
	element8.style.display = 'none';
}

element9.addEventListener("click", myFunction8);
function myFunction8() {
  pause();
  element9.style.display = 'none';
	element8.style.display = 'inline'
}

function clearSave(){
  //document.getElementById('loadstate').style.visibility= "hidden";
  document.getElementById('loadstate').style.display= "none";
  document.getElementById('loadstate2').style.display= "none";
  document.getElementById('loadstate3').style.display= "none";
  document.getElementById('loadstate4').style.display= "none";
  document.getElementById('loadstate5').style.display= "none";
  document.getElementById('loadstate6').style.display= "none";
  document.getElementById('loadstate7').style.display= "none";
  document.getElementById('loadstate8').style.display= "none";
  document.getElementById('loadstate9').style.display= "none";
  if(gameboy.cartridgeType == 27){
  	document.getElementById('savestate').style.display= "none";
  	document.getElementById('suppstate').style.display= "none";
  }else{
  	document.getElementById('savestate').style.display= "inline-block";
  	document.getElementById('suppstate').style.display= "inline-block";
  }
  
	let iu = 0;
	var cpt = 0
		while (iu < getLocalStorageKeys().length) {
	  	if(getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_"){
	  		/*if(gameboy.name == getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)){
	  			document.getElementById('loadstate').style.border = '2px solid red';
	  		}*/
	  		//alert(gameboy.name+'='+getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2));
	  		switch (cpt) {
  				case 0:if(gameboy.name == getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)){
	  			document.getElementById('loadstate').style.border = '2px solid red';
	  		}document.getElementById('loadstate').style.display= "inline-block";document.getElementById('loadstate').innerHTML = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)+'('+cpt+')';break;
	  			case 1:if(gameboy.name == getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)){
	  			document.getElementById('loadstate2').style.border = '2px solid red';
	  		}document.getElementById('loadstate2').style.display= "inline-block";document.getElementById('loadstate2').innerHTML = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)+'('+cpt+')';break;
	  			case 2:if(gameboy.name == getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)){
	  			document.getElementById('loadstate3').style.border = '2px solid red';
	  		}document.getElementById('loadstate3').style.display= "inline-block";document.getElementById('loadstate3').innerHTML = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)+'('+cpt+')';break;
	  			case 3:if(gameboy.name == getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)){
	  			document.getElementById('loadstate4').style.border = '2px solid red';
	  		}document.getElementById('loadstate4').style.display= "inline-block";document.getElementById('loadstate4').innerHTML = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)+'('+cpt+')';break;
	  			case 4:if(gameboy.name == getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)){
	  			document.getElementById('loadstate5').style.border = '2px solid red';
	  		}document.getElementById('loadstate5').style.display= "inline-block";document.getElementById('loadstate5').innerHTML = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)+'('+cpt+')';break;
  				case 5:if(gameboy.name == getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)){
	  			document.getElementById('loadstate6').style.border = '2px solid red';
	  		}document.getElementById('loadstate6').style.display= "inline-block";document.getElementById('loadstate6').innerHTML = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)+'('+cpt+')';break;
	  			case 6:if(gameboy.name == getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)){
	  			document.getElementById('loadstate7').style.border = '2px solid red';
	  		}document.getElementById('loadstate7').style.display= "inline-block";document.getElementById('loadstate7').innerHTML = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)+'('+cpt+')';break;
	  			case 7:if(gameboy.name == getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)){
	  			document.getElementById('loadstate8').style.border = '2px solid red';
	  		}document.getElementById('loadstate8').style.display= "inline-block";document.getElementById('loadstate8').innerHTML = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)+'('+cpt+')';break;
	  			case 8:if(gameboy.name == getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)){
	  			document.getElementById('loadstate9').style.border = '2px solid red';
	  		}document.getElementById('loadstate9').style.display= "inline-block";document.getElementById('loadstate9').innerHTML = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2)+'('+cpt+')';break;
	  		}
	  		cpt++;
	  	}
	  	iu++;
	  }
}
const element0 = document.getElementById("xvolume");
element0.addEventListener("click", myFunctionx);
function myFunctionx() {
	if(document.getElementById("xvolume").innerHTML == 1 || document.getElementById("xvolume").innerHTML == "100%"){
		settings[3] = Math.min(Math.max(parseFloat(0), 0), 1);
		gameboy.changeVolume();
		document.getElementById("xvolume").innerHTML = (0 * 100)+'%';
		document.getElementById("volumegb").value = 0;
	}else{
		settings[3] = Math.min(Math.max(parseFloat(1), 0), 1);
		gameboy.changeVolume();
		document.getElementById("xvolume").innerHTML = (1 * 100)+'%';
		document.getElementById("volumegb").value = 1;
	}
	
}

const element1 = document.getElementById("xvitesse");
element1.addEventListener("click", myFunction0);
function myFunction0() {
	gameboy.setSpeed(Math.max(parseFloat(1), 0.001));
	document.getElementById("xvitesse").innerHTML = 'x'+1;
	document.getElementById("vitessegb").value = 1;
}

const element2 = document.getElementById("savestate");
element2.addEventListener("click", myFunction1);
function myFunction1() {//alert("save");
	save();//alert(gameboy.name);
  //saveSRAM();
  clearSave();
	  		/*svtrue = getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_";
	  		if(svtrue){
	  			svname = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2);
	  		}
	  }*/
}

if(document.getElementById("loadstate")){
	const element3 = document.getElementById("loadstate");
	element3.addEventListener("click", myFunction2);
	function myFunction2() {//alert("load");
		let iu = 0;let second = 1;var svtrue = "";var svname = "";
	  while (iu < getLocalStorageKeys().length) {
	  		/*svtrue = getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_" && svname == gameboy.name;
	  		if(svtrue){
	  			svname = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2);
	  		}else{
	  			svname = getLocalStorageKeys()[iu].substring(9);
	  		}*/
  		if(getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_"){
  			//if(svname == gameboy.name){
  				if(second == 1){
	  				openState(getLocalStorageKeys()[iu], mainCanvas);break;
	  			}
  			//}
  			second++;
  		}else{}
	    iu++;
		}
	}
}
if(document.getElementById("loadstate2")){
	const element5 = document.getElementById("loadstate2");
	element5.addEventListener("click", myFunction4);
	function myFunction4() {//alert("load2");
		let iu = 0;let second = 1;var svtrue = "";var svname = "";
	  while (iu < getLocalStorageKeys().length) {
	  		svtrue = getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_";
	  		if(svtrue){
	  			svname = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2);
	  		}else{
	  			svname = getLocalStorageKeys()[iu].substring(9);
	  		}
	  		//alert(getLocalStorageKeys()[iu].substr(0, 7)+'|'+getLocalStorageKeys()[iu]+'|'+iu+'|'+second);
	  		
		  		if(getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_"){
			  			if(second == 2){
								openState(getLocalStorageKeys()[iu], mainCanvas);break;
			  			}
		  		second++;	
		  		}else{
		  			if(second == 2){
		  				//openRTC(getLocalStorageKeys()[iu]);
		  					//openSRAM(getLocalStorageKeys()[iu]);
		  					//start(mainCanvas, getLocalStorageKeys()[iu]);
		  				//alert(getLocalStorageKeys()[iu]);
		  			}
		  			//second++;
		  		}
		  		iu++;
		}
	}
}
if(document.getElementById("loadstate3")){
	const element6 = document.getElementById("loadstate3");
	element6.addEventListener("click", myFunction5);
	function myFunction5() {//alert("load2");
		let iu = 0;
		let second = 1;
		var svtrue = "";
		var svname = "";
	  while (iu < getLocalStorageKeys().length) {//alert(getLocalStorageKeys()[iu].substr(0, 10));
	  		//alert(getLocalStorageKeys()[iu].substr(0, 7)+'|'+getLocalStorageKeys()[iu]+'|'+iu+'|'+second);
	  		svtrue = getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_";
	  		if(svtrue){
	  			svname = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2);
	  		}else{
	  			svname = getLocalStorageKeys()[iu].substring(9);
	  		}
	  		if(getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_"){
		  			if(second == 3){
							openState(getLocalStorageKeys()[iu], mainCanvas);break;
		  			}
		  		second++;	
	  		}
		    iu++;
		}
	}
}
if(document.getElementById("loadstate4")){
	const element7 = document.getElementById("loadstate4");
	element7.addEventListener("click", myFunction6);
	function myFunction6() {//alert("load2");
		let iu = 0;let second = 1;var svtrue = "";var svname = "";
	  while (iu < getLocalStorageKeys().length) {//alert(getLocalStorageKeys()[iu].substr(0, 10));
	  		svtrue = getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_";
	  		if(svtrue){
	  			svname = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2);
	  		}else{
	  			svname = getLocalStorageKeys()[iu].substring(9);
	  		}
	  		//alert(svname+'|game='+gameboy.name+'|ui='+(iu+1)+'/'+getLocalStorageKeys().length+'|nom save : '+getLocalStorageKeys()[iu]);

	  		if(getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_"){
		  			if(second == 4){
							openState(getLocalStorageKeys()[iu], mainCanvas);break;alert("ok");
		  			}
	  			second++;
	  		}else{}
		    iu++;
		}
	}
}
if(document.getElementById("loadstate5")){
	const element8 = document.getElementById("loadstate5");
	element8.addEventListener("click", myFunction7);
	function myFunction7() {//alert("load2");
		let iu = 0;let second = 1;var svtrue = "";var svname = "";
	  while (iu < getLocalStorageKeys().length) {//alert(getLocalStorageKeys()[iu].substr(0, 10));
	  		//alert(getLocalStorageKeys()[iu].substr(0, 7)+'|'+getLocalStorageKeys()[iu]+'|'+iu+'|'+second);
	  		svtrue = getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_";
	  		if(svtrue){
	  			svname = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2);
	  		}else{
	  			svname = getLocalStorageKeys()[iu].substring(9);
	  		}
	  		if(getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_"){
		  			if(second == 5){
							openState(getLocalStorageKeys()[iu], mainCanvas);break;
		  			}
		  		second++;	
	  		}
		    iu++;
		}
	}
}
if(document.getElementById("loadstate6")){
	const element9 = document.getElementById("loadstate6");
	element9.addEventListener("click", myFunction8);
	function myFunction8() {//alert("load2");
		let iu = 0;let second = 1;var svtrue = "";var svname = "";
	  while (iu < getLocalStorageKeys().length) {//alert(getLocalStorageKeys()[iu].substr(0, 10));
	  		//alert(getLocalStorageKeys()[iu].substr(0, 7)+'|'+getLocalStorageKeys()[iu]+'|'+iu+'|'+second);
	  		svtrue = getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_";
	  		if(svtrue){
	  			svname = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2);
	  		}else{
	  			svname = getLocalStorageKeys()[iu].substring(9);
	  		}
	  		if(getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_"){
		  			if(second == 6){
							openState(getLocalStorageKeys()[iu], mainCanvas);break;
		  			}
		  		second++;	
	  		}
		    iu++;
		}
	}
}
if(document.getElementById("loadstate7")){
	const element10 = document.getElementById("loadstate7");
	element10.addEventListener("click", myFunction9);
	function myFunction9() {//alert("load2");
		let iu = 0;let second = 1;var svtrue = "";var svname = "";
	  while (iu < getLocalStorageKeys().length) {//alert(getLocalStorageKeys()[iu].substr(0, 10));
	  		//alert(getLocalStorageKeys()[iu].substr(0, 7)+'|'+getLocalStorageKeys()[iu]+'|'+iu+'|'+second);
	  		svtrue = getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_";
	  		if(svtrue){
	  			svname = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2);
	  		}else{
	  			svname = getLocalStorageKeys()[iu].substring(9);
	  		}
	  		if(getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_"){
		  			if(second == 7){
							openState(getLocalStorageKeys()[iu], mainCanvas);break;
		  			}
		  		second++;	
	  		}
		    iu++;
		}
	}
}
if(document.getElementById("loadstate8")){
	const element11 = document.getElementById("loadstate8");
	element11.addEventListener("click", myFunction10);
	function myFunction10() {//alert("load2");
		let iu = 0;let second = 1;var svtrue = "";var svname = "";
	  while (iu < getLocalStorageKeys().length) {//alert(getLocalStorageKeys()[iu].substr(0, 10));
	  		//alert(getLocalStorageKeys()[iu].substr(0, 7)+'|'+getLocalStorageKeys()[iu]+'|'+iu+'|'+second);
	  		svtrue = getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_";
	  		if(svtrue){
	  			svname = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2);
	  		}else{
	  			svname = getLocalStorageKeys()[iu].substring(9);
	  		}
	  		if(getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_"){
		  			if(second == 8){
							openState(getLocalStorageKeys()[iu], mainCanvas);break;
		  			}
		  		second++;	
	  		}
		    iu++;
		}
	}
}
if(document.getElementById("loadstate9")){
	const element12 = document.getElementById("loadstate9");
	element12.addEventListener("click", myFunction11);
	function myFunction11() {//alert("load2");
		let iu = 0;let second = 1;var svtrue = "";var svname = "";
	  while (iu < getLocalStorageKeys().length) {//alert(getLocalStorageKeys()[iu].substr(0, 10));
	  		//alert(getLocalStorageKeys()[iu].substr(0, 7)+'|'+getLocalStorageKeys()[iu]+'|'+iu+'|'+second);
	  		svtrue = getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_";
	  		if(svtrue){
	  			svname = getLocalStorageKeys()[iu].substring(7,getLocalStorageKeys()[iu].length - 2);
	  		}else{
	  			svname = getLocalStorageKeys()[iu].substring(9);
	  		}
	  		if(getLocalStorageKeys()[iu].substr(0, 7) == "FREEZE_"){
		  			if(second == 9){
							openState(getLocalStorageKeys()[iu], mainCanvas);break;
		  			}
		  		second++;	
	  		}
		    iu++;
		}
	}
}
var map = {}; // You could also use an array
onkeydown = onkeyup = function(e){
    e = e || event; // to deal with IE
    map[e.keyCode] = e.type == 'keydown';
    /* insert conditional here */
    //alert(e.keyCode.toString());
}

const element4 = document.getElementById("suppstate");
element4.addEventListener("click", myFunction3);
function myFunction3() {//alert("delete");
  //openState(getLocalStorageKeys()[0], mainCanvas);
  //if(getLocalStorageKeys()[0]){deleteStorageSlot(getLocalStorageKeys()[0]);}
  //alert(getLocalStorageKeys().length);
  deleteStorageSlot(getLocalStorageKeys()[(getLocalStorageKeys().length-1)]);
  /*if(getLocalStorageKeys()[1]){deleteStorageSlot(getLocalStorageKeys()[1]);}
  if(getLocalStorageKeys()[2]){deleteStorageSlot(getLocalStorageKeys()[2]);}
  if(getLocalStorageKeys()[3]){deleteStorageSlot(getLocalStorageKeys()[3]);}
  if(getLocalStorageKeys()[4]){deleteStorageSlot(getLocalStorageKeys()[4]);}
  if(getLocalStorageKeys()[5]){deleteStorageSlot(getLocalStorageKeys()[5]);}
  if(getLocalStorageKeys()[6]){deleteStorageSlot(getLocalStorageKeys()[6]);}
  if(getLocalStorageKeys()[4]){deleteStorageSlot(getLocalStorageKeys()[7]);}
  if(getLocalStorageKeys()[5]){deleteStorageSlot(getLocalStorageKeys()[8]);}
  if(getLocalStorageKeys()[6]){deleteStorageSlot(getLocalStorageKeys()[9]);}
  document.getElementById('loadstate').style.display= "none";
  document.getElementById('loadstate2').style.display= "none";
  document.getElementById('loadstate3').style.display= "none";
  document.getElementById('loadstate4').style.display= "none";
  document.getElementById('loadstate5').style.display= "none";
  document.getElementById('loadstate6').style.display= "none";
  document.getElementById('loadstate7').style.display= "none";
  document.getElementById('loadstate8').style.display= "none";
  document.getElementById('loadstate9').style.display= "none";*/
  clearSave();
}

var gameBoyColors = ["#33B678", "#FFDC2B", "#F61300", "#0356F2"];
function pickRandomColor () {
  var nintendo = $("nintendo");
  $("gameboy_shell").style.backgroundColor =
    $("on_off").style.color =
    nintendo.style.borderColor =
    nintendo.style.color =
    gameBoyColors[(gameBoyColors.length * Math.random()) | 0];
};

function windowingInitialize() {
	cout("windowingInitialize() called.", 0);
  pickRandomColor();
	mainCanvas = document.getElementById("mainCanvas");
  registerTouchEventShim();
  window.onunload = autoSave;
  ("MozActivity" in window ? loadViaMozActivity : loadViaXHR)();
}
var DEBUG_MESSAGES = false;
var DEBUG_WINDOWING = false;
window.addEventListener("DOMContentLoaded", windowingInitialize);
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
	addEvent("click", document.getElementById("data_uri_clicker"), function () {
		var datauri = prompt("Please input the ROM image's Base 64 Encoded Text:", "");
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
/*
	var Anchors = document.getElementById("savestate");
	Anchors.addEventListener("click", function (event) {
		event.preventDefault();alert("ok");
    //if (confirm('Are you sure?')){window.location = this.href;}
  },false);

	addEvent("click", document.getElementById("savestate"), function () {
		alert("ok");
	});

	/*addEvent("click", document.getElementById("loadstate"), function () {
		//if (GameBoyEmulatorInitialized()) {
			//refreshFreezeListing(); windowStacks[8].show();
		//}
		//FREEZE_MARIOLAND2_0 getLocalStorageKeys()[2] runFreeze("FREEZE_MARIOLAND2_0")
		runFreeze(getLocalStorageKeys()[0]);
	});


	addEvent("click", document.getElementById("testt"), function () {
		alert("ok");
		//save();
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
	/*addEvent("click", document.getElementById("xvitesse"), function () {
		if (GameBoyEmulatorInitialized()) {
			var speed = 1;
			if (speed != null && speed.length > 0) {
				gameboy.setSpeed(Math.max(parseFloat(speed), 0.001));
				document.getElementById("xvitesse").innerHTML = 'x'+(vitesse);
			}
		}
	});*/
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
  alert("getBlobPreEncoded");
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
	//windowStacks[6].hide();
	//refreshStorageListing();
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
  //alert("getLocalStorageKeys");
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