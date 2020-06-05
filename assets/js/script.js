window.onload = function () {
    loadDarkModeFromLocalStorage();
    darkLightToggle()
    runOnLoad()
};

function loadDarkModeFromLocalStorage(){
    if(localStorage.hasOwnProperty("isDark")){
        isDark = (localStorage.isDark == "true")
    }else{
        isDark = true    
    }
    document.getElementById('darkmode').checked = isDark
}

function darkLightToggle() {
    saveLocalStorageDarkMode();
    isDark = document.getElementById('darkmode').checked
    if (isDark) {
        var link = document.createElement('link');  
        link.rel = 'stylesheet';  
        link.type = 'text/css'; 
        link.href = 'assets/css/dark.css';  
        link.id = "darkcss";
        document.getElementsByTagName('head')[0].appendChild(link)
    } else {
        if (document.contains(document.getElementById("darkcss"))) {
            document.getElementById('darkcss').remove()
        }
    }
 }

 function saveLocalStorageDarkMode(){
    isDark = document.getElementById('darkmode').checked
    localStorage.isDark = isDark
 }