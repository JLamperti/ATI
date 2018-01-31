//create a cookie
console.log(document.cookie);
function setLang() {
    if(!document.cookie){
  //get the language of the Browser
  let userLang = navigator.language || navigator.userLanguage.toString();
  console.log(document.cookie);
  let val = userLang == "en-US" ? "en" : "de";
  //create cookie
  document.cookie = "locale=" + val + "; path=/";}
}
//change the language and reload the site
function changeLang() {
  if (document.cookie.toString() == "locale=en") {
    document.cookie = "locale=de; path=/";
  } else if (document.cookie.toString() == "locale=de") {
    document.cookie = "locale=en; path=/";
  }
  console.log(document.cookie);
  location.reload();
}
