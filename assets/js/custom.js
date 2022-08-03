var trueButton = document.getElementById("cookieTrue");
var falseButton = document.getElementById("cookieFalse");
var footer = document.getElementById("footer");

var currCookie = getCookie("acceptCookies");

if(currCookie == "true"){
    window['ga-disable-G-141F6FVG5D'] = false;
    closeFooter();
}
else if(currCookie == "false"){
    closeFooter();
}
else if(currCookie == ""){
    showFooter();
}

//TODO: Store cookie to remember choice
trueButton.addEventListener("click", function(x){
    window['ga-disable-G-141F6FVG5D'] = false;
    document.cookie = "acceptCookies=true"
    closeFooter();
});
falseButton.addEventListener("click", function(x){  //TODO: have customize cookie popup
    document.cookie = "acceptCookies=false"
    closeFooter();
});

function closeFooter(){
    footer.hidden = true;
}
function showFooter(){
    footer.hidden = false;
}

function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }