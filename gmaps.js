
dojo.provide("XslTransform");

dojo.declare("XslTransform", [],
{
	_xslDoc : null,
	_xslPath : null,

	constructor : function(xslPath) {
		this._xslPath = xslPath;
	},

	transform : function(xmlPath) {
		if (this._xslDoc === null)
			this._xslDoc = this._loadXML(this._xslPath);

		var result = null;
		var xmlDoc = this._loadXML(xmlPath);

		if (dojo.isIE) {
			result = xmlDoc.transformNode(this._xslDoc);
		} else if(typeof XSLTProcessor !== undefined) {
			xsltProcessor = new XSLTProcessor();
	  		xsltProcessor.importStylesheet(this._xslDoc);

	  		var ownerDocument = document.implementation.createDocument("", "", null);
	  		result = xsltProcessor.transformToFragment(xmlDoc, ownerDocument);
		} else {
			alert("Your browser doesn't support XSLT!");
		}

		return result;

	},

	createXMLDocument : function(xmlText) {
		var xmlDoc = null;

		if (dojo.isIE) {
			xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
			xmlDoc.async = false;
			xmlDoc.loadXML(xmlText);
		} else if (window.DOMParser) {
			parser = new DOMParser();
			xmlDoc = parser.parseFromString(xmlText, "text/xml");
		} else {
			alert("Your browser doesn't suppoprt XML parsing!");
		}

		return xmlDoc;
	},

	// Synchronously loads a remote xml file
	_loadXML : function(xmlPath) {
		var getResult = dojo.xhrGet({
			url : xmlPath,
			handleAs : "xml",
			sync: true
		});

		var xml = null;
		// Returns immediately, because the GET is synchronous.
		var xmlData = getResult.then(function (response) {
			xml = response;
		});

		return xml;
	}
});


/////////////
var datarray = [];
var ADDR;
function callFile(str) {

  var xhttp = new XMLHttpRequest();
  xhttp.open("GET", str, false);
  xhttp.send();
}

function callFilePost(str) {

  var xhttp = new XMLHttpRequest();
  xhttp.open("POST", str, false);
  xhttp.send();
  
}

function listConvo() {
  callFile("chataliases.php?c=1");
  var alias = getCookie("aliases");
  alias = alias.substring(1,alias.length-1);
  alias = alias.split(",");
  var x = document.getElementById("chatters");
  var h = 0;
  console.log(alias);
  while (x.childElementCount > h++) {
    x.removeChild(x.firstChild);
  }
  x.options[0] = new Option("You have " + alias.length + " people to chat with!","");
  if (alias[0] === "") {
    callFile('getstore.php?a=' + getCookie('store_name') + '&b=' + getCookie('store_no'));
    //callPage();
    return;
  }
  if (alias.length == 1) {
    console.log(alias);
    x.options[1] = new Option(alias,alias);
  }
  else {
    for (var i = 0 ; i < alias.length ; i++)
      x.options[i+1] = new Option(alias[i].substr(1,alias[i].length-2),alias[i].substr(1,alias[i].length-2));
  }
  callPage();
}

function loginUnsuccessful() {
  var y = getCookie("count");
  y++;
  setCookie("count", y);
  document.getElementById("warning").value = "Wrong Email/Password (" + y + "/3)";
  menuList('login.php');
}

function logout() {
  
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      return;
    }
  };
  xhttp.open("GET", "nologin.php", true);
  xhttp.send();

  localStorage.clear();
}

function unload() {
  if (localStorage.getItem("remember") == false)
    logout();
}

function getOption() {
  var x = document.getElementById("chatters");
  var idx = x.options[x.selectedIndex];
  var str = idx.value;
  if (str.charAt(0) === '"')
    str = str.substr(1,str.length-2);
  if (str == "")
    return;
  setCookie("nodeNo", x.selectedIndex);
  setCookie("chataddr", str);
  callPage();
}

function callPage() {
  callFile("createchat.php");
  callFile("chataliases.php?c=2");
  var x = getCookie("chatfile");
  var xhttp = new XMLHttpRequest();
  xhttp.onreadystatechange = function() {
    if (this.readyState == 4 && this.status == 200) {
      //clearChat();
    }
  };
  xhttp.open("POST", "xml/" + x, false);
  xhttp.send();
  var s = xhttp.responseXML.firstChild;
  var xsltProcessor = new XSLTProcessor();
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", "xml/chatxml.xsl", false);
  xhttp.send(null);
  xsltProcessor.importStylesheet(s);
  
  myXMLHTTPRequest = new XMLHttpRequest();
  myXMLHTTPRequest.open("GET", "xml/" + x, false);
  myXMLHTTPRequest.send(null);
  
  xmlDoc = myXMLHTTPRequest.responseXML.firstChild;
  var xslTransform = new XslTransform("xml/chatxml.xsl");
  var outputText = xslTransform.transform("xml/" + x);
  document.getElementById("chatpane").innerHTML = ""; 
  document.getElementById("chatpane").append(outputText);
  var x = document.getElementById("in-window");
  x.scroll(0,x.childElementCount*20);
}

function getInbox(no, data) {

  if (getCookie("login") !== "true") {
    menuList("login.php");
    return;
  }
  else {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        g = this.response;
        document.getElementById("chatpane").innerHTML = g;
      }
    };
    xhttp.open("GET", "toads.php?c=" + no + "&p=" + data, false);
    xhttp.send();
  }
}

function getAdSheet(no) {

  if (getCookie("login") !== "true") {
    menuList("login.php");
    return;
  }
  else {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        g = this.response;
        document.getElementById("chatpane").innerHTML = g;
      }
    };
    xhttp.open("GET", "toads.php?c=" + no, false);
    xhttp.send();
  }
}

function getStores(no) {

  if (getCookie("login") !== "true") {
    menuList("login.php");
    return;
  }
  else {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        g = this.response;
        document.getElementById("storepane").innerHTML = g;
      }
    };
    xhttp.open("GET", "tostores.php?c=" + no, false);
    xhttp.send();
  }
}

function goChat(i,j) {
  if (j == 13) {
    var y = i.cloneNode();
    i.value = "";
    
    callFile("chat.php?a=" + y.value);
    var x = document.getElementById("in-window");
    x.offsetTop = x.childElementCount*20;
    callPage();
    callFile("chataliases.php?c=1");
  }
}

function clearChat() {
  var x = document.getElementById("in-window");
  x.innerHTML = "";
  return;
}

function getZip(address) {
  geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': address }, function(results, status) {
    results[0].address_components[6].long_name;
    setCookie("zip_code", results[0].address_components[6].long_name);
  });
}

function honey() {
  //glaze();
  navigator.geolocation.getCurrentPosition(collectXML);
}

function glaze(address) {
  if (address == "")
    return;
  geocoder = new google.maps.Geocoder();
  geocoder.geocode({ 'address': address }, function(results, status) {
    if (status == google.maps.GeocoderStatus.OK) {
      //map.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: map,
        position: results[0].geometry.location
      });
    }
  });
}

function makeZipStores(a) {
  callFile("makezips.php?a=" + a);
}

function collectXML (position) {
  var t = position.coords;
  var map = new google.maps.Map(
    document.getElementById('map'),
    {center: {lat: position.coords.latitude, lng: position.coords.longitude}, zoom: 13});
  var geocoder = new google.maps.Geocoder;
  geocoder.geocode({'location':{lat: position.coords.latitude, lng: position.coords.longitude}}, function(results, status) {
    if (status === 'OK') {
      if (results[0]) {
        map.setZoom(11);
        var marker = new google.maps.Marker({
          position: {lat: position.coords.latitude, lng: position.coords.longitude},
          map: map
        });
        console.log(results);
        if (results[0].address_components[6].long_name !== undefined) {
          setCookie("site_zip_code", results[0].address_components[6].long_name);
          makeZipStores(getCookie("site_zip_code"));
        }
        infowindow.setContent("<div>Me&nbsp;&nbsp;&nbsp;<br></div>");
        infowindow.open(map, marker);
      } else {
        window.alert('No results found');
      }
    } else {
      window.alert('Geocoder failed due to: ' + status);
    }
  });
    
  var input;
  var autocomplete;
  //if (null != document.getElementById('addr')) {
    input = document.getElementById('addr');

    autocomplete = new google.maps.places.Autocomplete(input);

    // Specify just the place data fields that you need.
    autocomplete.setFields(['address_components', 'geometry', 'name', 'formatted_address']);
  //}
  var infowindow = new google.maps.InfoWindow();
  var infowindowContent = document.getElementById('infowindow-content');
  infowindow.setContent(infowindowContent);

  // Change this depending on the name of your PHP or XML file
  var xml_file = getCookie("site_zip_code") + ".xml";
  downloadUrl(xml_file, function(data) {
    var xml = data.responseXML;
    var markers = xml.documentElement.getElementsByTagName('links');
    Array.prototype.forEach.call(markers, function(markerElem) {
      var name = markerElem.getAttribute('manager');
      var no = markerElem.getAttribute('store_no');
      console.log("ae" + no);
      var address = markerElem.getAttribute('address');
      if (!address.includes(markerElem.getAttribute('city')))
        address = address + ", " + markerElem.getAttribute('city');
      if (!address.includes(markerElem.getAttribute('state')))
        address = address + ", " + markerElem.getAttribute('state');
    //  if (!address.includes(markerElem.getAttribute('country')))
      //  address = address + ", " + markerElem.getAttribute('country');
      var biz = markerElem.getAttribute('business');
      var point = new google.maps.LatLng(
          parseFloat(markerElem.getAttribute('lat')),
          parseFloat(markerElem.getAttribute('long'))
          );

      var infowincontent = document.createElement('div');
      var strong = document.createElement('strong');
      strong.textContent = name
      infowincontent.appendChild(strong);
      infowincontent.appendChild(document.createElement('br'));

      var text = document.createElement('text');
      text.textContent = address
      infowincontent.appendChild(text);
      geocoder = new google.maps.Geocoder();
      geocoder.geocode({ 'address': address }, function(results, status) {

        if (status == google.maps.GeocoderStatus.OK) {
          //map.setCenter(results[0].geometry.location);
          var marker = new google.maps.Marker({
            map: map,
            position: results[0].geometry.location
          });
         getZip(address);
          var x = encodeURI(biz);
          var y = encodeURI(no);
          marker.addListener('click', function() {
           var infowindow = new google.maps.InfoWindow({
              content: '<div onclick="focusStore(\'' + x + '\',\'' + y + '\',' + getCookie("site_zip_code") + ');"><u>' + name + '</u>&nbsp;&nbsp;&nbsp;&nbsp;<u>' + biz + '</u>&nbsp;&nbsp;&nbsp;&nbsp;<u>' + address + '</u>&nbsp;&nbsp;&nbsp;&nbsp;</div><br>'
  
            });
            infowindow.open(map, marker);
          });
        }
      });
      glaze(address);
    });
  });
}

function focusStore(name,no,zip) {
  var request = window.ActiveXObject ?
    new ActiveXObject('Microsoft.XMLHTTP') :
    new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
    }
  };
  setCookie("store_name", name);
  setCookie("store_no", no);
  setCookie("zip", zip);
  
  request.open('GET', "getstore.php?a=" + name + "&b=" + no + "&c=" + zip, true);
  request.send(null);
  menuList('menu.php');
  
}

function downloadUrl(url, callback) {
  var request = window.ActiveXObject ?
    new ActiveXObject('Microsoft.XMLHTTP') :
    new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
      callback(request, request.status);
    }
  };

  request.open('POST', url, true);
  request.send(null);
}

function doNothing() {}


function passPOST(url) {
  var request = window.ActiveXObject ?
    new ActiveXObject('Microsoft.XMLHTTP') :
    new XMLHttpRequest;

  request.onreadystatechange = function() {
    if (request.readyState == 4) {
      request.onreadystatechange = doNothing;
    }
  };
  request.open('GET', url, true);
  request.send(null);
}

var map;
var service;
var infowindow;

function mapView() {
  var p = document.getElementById("page");
  var t = document.getElementById("map");
  var f = document.getElementById("following");
  if (p.index != "-1") {
    f.style.top = t.style.height + "px";
    f.style.index = "-1";
    f.style.style = "margin-top:" + t.style.height + "px;width:100%;z-index:-1;background:url('blacksand.jpg');position:static;";
    p.index = "-1";

    t.parentNode.style = "z-index:-1;height:100%;overflow:none;position:fixed;width:100%;";
  }
  else {
    f.style.index = "-1";
    f.style.style = "margin-top:105px;width:100%;z-index:1;background:url('blacksand.jpg');position:static;";
    p.index = "1";
    t.parentNode.style = "z-index:1;height:100%;overflow:none;position:fixed;width:100%;";
  }
}

function callback(results, status) {
  if (status == google.maps.places.PlacesServiceStatus.OK) {
    for (var i = 0; i < results.length; i++) {
      var place = results[i];
      createMarker(results[i]);
    }
  }
}

function createMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    name: place.name,
    placeId: place.place_id,
    position: place.geometry.location
  });

  google.maps.event.addListener(marker, 'click', function() {
    infowindow.setContent(place.name);
    infowindow.open(map, this);
    });
}

function revitup(i,ts) {
    var rt = 0;
    var card = document.getElementsByTagName("article");
    for (let s = 0 ; s < card.length ; s++) {
        if (card[s].getAttribute("serial") == ts) {
    rt = s;
    break;
        }
    }
    
    var stars = card[rt].getElementsByTagName("c");

    for (let j = 0 ; j < 4 ; j++) {
        stars[j].innerHTML = "&#9734;";
    }

    for (let j = 0 ; j < i ; j++) {
        stars[j].innerHTML = "&#11088;";
    }
}

function review(i,ts) {
  var obj, s
  s = document.createElement("script");
  s.src = "star_rated.php?x=" + i + "&y=" + ts;
  document.body.appendChild(s);
}

function confirm_star(i,ts) {
  if (confirm("You chose " + i + " stars!")) {
    revitup(i,ts);
    review(i,ts);
  }
}

function setCookie(cname, cvalue, exdays) {
  var d = new Date();
  d.setTime(d.getTime() + (24*60*60*1000));
  var expires = "expires="+ d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function countCookies() {
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  return ca.length;
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');
  for(var i = 0; i < ca.length; i++) {
    var c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return "";
}

function move() {
  var elem = document.getElementById("myBar"); 
  var width = 1;
  var id = setInterval(frame, 10);
  function frame() {
    if (width >= 100) {
      clearInterval(id);
      document.getElementById("myProgress").style.display = "none";
    } else {
      width++; 
      elem.style.width = width + '%'; 
    }
  }
}

  function menuslide() {
    if (document.getElementById('menu').style.display == "table-cell") {
      document.getElementById('menu').style.display = "none";
      document.getElementById('page').style.left = "0px";
      document.getElementById('map').style.left = "0px";
    }
    else {
      document.getElementById('menu').style.display = "table-cell";
      document.getElementById('page').style.left = "305px";
      document.getElementById('map').style.left = "295px";
    }
  }

  function fillMenu(i) {
    document.getElementById("menu-article").innerHTML = "";
    //i.parseFromString
    
    document.getElementById("menu-article").innerHTML = i;
  }
  
  function menuList(i) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        g = this.response;
        fillMenu(g);
      }
    };
    xhttp.open("GET", i, false);
    xhttp.send();
  }
  
  function addNewItem() {
    var h = document.getElementById("preorders");
    var p = h.firstChild.cloneNode(true);
    p.childNodes[0].value = "";
    p.childNodes[2].value = 1;
    h.append(p);
  }

  function removeItem(vthis) {
    var h = vthis.parentNode.parentNode;
    if (h.childElementCount > 1)
      h.removeChild(vthis.parentNode);
  }

  function makePreorder() {
    var g = document.getElementsByClassName("inclusions");
    var cnt = g.length;
    var z = [];
    var y = [];
    var c;
    for (j = 0; j < cnt ; j++) {
      c = g[j];
      var v = c.getElementsByTagName("input");
      if (v[0].value !== undefined) {
        z.unshift(v[0].value);
        y.unshift(v[1].value);
      }
    }
    var x = document.getElementById("days");
    x = x.options[x.selectedIndex].value;
    if (z.length > 0)
      callFile("preorderxml.php?a=" + encodeURI(z) + "&b=" + encodeURI(y) + "&c=" + x);
    else
      return;
  }

  function editFields(vthis) {
    var t = vthis;
    var pn = vthis.getAttribute("name");
    callFile("toorders.php?c=u&b=" + pn + "&a=" + t.innerHTML);
      
  }
  
  function updateRows(vthis) {
    var t = vthis;
    var pn = vthis.getAttribute("id");
    var cookie = vthis.parentNode[0].innerHTML;
    callFile("toads.php?c=up&b=" + pn + "&a=" + t.innerHTML + "&d=" + cookie);
      
  }
  
  function updateTime(vthis) {
    var t = vthis;
    var scookie = vthis.parentNode[0].innerHTML;
    var tcookie = vthis.parentNode[3].innerHTML;
    callFile("toads.php?c=uptime&a=" + t.innerHTML + "&d=" + scookie + "&e=" + tcookie);
      
  }
  
  function editDrop(vthis) {
    var t = vthis.options;
    var vn = t[t.selectedIndex].value;
    callFile("toorders.php?c=u&b=action&a=" + vn);
      
  }
  
  function editStack(vthis) {
    var t = vthis.options;
    var vn = t[t.selectedIndex].value;
    callFile("toorders.php?c=g&b=" + vn);
  }
  
  function choseKeyword(keywrd) {
    if (keywrd === "")
      return;
    document.getElementById("div-keys").style.display = "visible";
    var div_out = document.createElement("div");
    div_out.style = 'margin:3px;border-right:2px solid white;background:lightblue;border-radius:10px;color:black;width:55px;font-size:12px;display:table-cell;height:13px;vertical-align:middle;';
    var div_word = document.createElement("div");
    div_word.style = 'margin:3px;width:45px;background:lightblue;display:table-cell;font-size:10px;padding:0px;';
    div_word.className = 'key-names';
    div_word.innerHTML = keywrd;
    div_out.appendChild(div_word);
    var div_final = document.createElement("div");
    div_final.style = 'background:lightblue;display:table-cell;font-size:10px;;padding:0px';
    div_final.setAttribute("onclick","insertTagInput();this.parentNode.parentNode.removeChild(this.parentNode);");
    div_final.innerHTML = "&times;";
    div_out.appendChild(div_final);
    document.getElementById("keywrds").insertBefore(div_out,document.getElementById("keywrds").lastChild);
  }
  
  function keywordLookup(keys,j) {
    var dense = keys.value.length;
    term = keys.value;
    if (dense > 10)
      keys.value = term.substr(0,10);
    if (j === 13) {
      term = term.replace(/\b(?:slut|fuck|whore|asshole|tard|fucker|nigger|blackie|queer|noose|slave|retard|shit?|ass|damn?|anal|sex|bitch|twat|cunt|fag|faggot|dick|penis|vagina|crack|cocaine|heroin|motherfucker)\b/ig, '');
      if (term.length < dense || term == undefined) {
        alert("Watch it, bud");
        keys.value = "";
        return;
      }
      
      setCookie("word",term);
      def = term;
      def = def;
      var urlstr = "keyword.php?b=2&str=";
      //document.getElementById("div-keys").style.display = "table";
      var xhttp = new XMLHttpRequest();
      xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
          var g = this.responseText;
          if (g === undefined || g === "") {
            console.log(g);
            newWord(def);
            return;
          }
          var h = document.getElementById('div-keys');
          h.innerHTML = g;
        }
      };
      xhttp.open("GET", urlstr + def, false);
      xhttp.send();
      if (document.getElementById("keywrds").childElementCount > 4)
        document.getElementById("insWrd").parentNode.removeChild(document.getElementById("insWrd"));
      choseKeyword(def);
      keys.value = "";
      return;
    }
    var urlstr = "keyword.php?b=2&str=";
    
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
      if (this.readyState == 4 && this.status == 200) {
        var g = this.responseText;
        if (g === undefined || g === "") {
          document.getElementById("div-keys").innerHTML = "";
          return;
        }
        var h = document.getElementById('div-keys');
        h.innerHTML = g;
      }
    };
    xhttp.open("GET", urlstr + term, false);
    xhttp.send();
  }
  
  function insertTagInput() {
    if (document.getElementById("keywrds").lastChild.tagName == "INPUT")
      return;
    var x = document.createElement("input");
    x.setAttribute("id", "insWrd");
    x.style = 'display:table-cell;width:40px;color:black;border-radius:10px;border:0px solid white;';
    x.setAttribute("onkeypress",'keywordLookup(this,event.keyCode);');
    document.getElementById("keywrds").append(x);
  }
  
  function newWord(indef) {
    if (indef === "" || indef === undefined)
      return;
    if (document.getElementById("div-keys").childElementCount > 0)
      document.getElementById("div-keys").removeChild(document.getElementById("div-keys").firstChild);
    var block = document.createElement("div");
    block.id = "defineKey";
    var keyword = document.createElement("div");
    keyword.id = "word";
    keyword.style = "width:160px;font-size:14px;text-decoration:bold;";
    keyword.innerHTML = indef;
    block.append(keyword);
    var hr = document.createElement("hr");
    block.append(hr);
    var inputdef = document.createElement("input");
    inputdef.id = "insDef";
    inputdef.style = "width:150px;color:black;border-radius:10px;border:0px solid white;";
    inputdef.setAttribute("onkeypress", "defineWord(event.keyCode);");
    inputdef.type = "text";
    inputdef.max = 35;
    inputdef.min = 15;
    block.append(inputdef);
    document.getElementById("div-keys").append(block);
  }
  
function defineWord(j) {
  if (document.getElementById("insDef").value.length < 15)
    return;
  if (j == 13) {
    var deflen = document.getElementById("insDef").value.length;
    var indef = document.getElementById("insDef").value;
    console.log(indef);
    var def = indef.replace(/\b(?:slut|fuck|whore|asshole|tard|fucker|nigger|blackie|queer|noose|slave|retard|shit|ass|damn?|anal|sex|bitch|twat|cunt|fag|faggot|dick|penis|vagina|crack|cocaine|heroin|motherfucker)\b/ig, '');
    if (def.length < deflen) {
      alert("Watch it, bud");
      document.getElementById("insDef").value = "";
      return;
    }
    var xhttp = new XMLHttpRequest();
    xhttp.open("GET", "keyword.php?a=" + getCookie("word") + "&b=1&c=" + indef, false);
    xhttp.send();
    document.getElementById("div-keys").removeChild(document.getElementById("div-keys").firstChild);
  }
}