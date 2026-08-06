alert(tabId);

//タブで画面表示変えるやつ
function showTab(tabId) {
    
    //alert(tabId);

    const panels = document.querySelectorAll(".panel");

    panels.forEach(panel =>{
        panel.style.display = "none";
    });

    document.getElementById(tabId).style.display="block";
}

//時計の現在時刻を拾うやつ
function setNow(id){
    const now  = new Date();

    const hour = String(now.getHours()).padStart(2,'0');
    const minute = String(now.getMinutes()).padStart(2,'0');

    document.getElementById(id).value = hour + ":" + minute;
}