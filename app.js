
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

// 担当者マスターを読み込む
async function loadStaffMaster() {

    const response = await fetch("担当者マスター.csv");
    const text = await response.text();

    // CSVを1行ずつに分ける
    const lines = text.trim().split("\n");

    const select = document.getElementById("staffSelect");

    // 1行目は見出しなので飛ばす
    for (let i = 1; i < lines.length; i++) {

        const columns = lines[i].split(",");

        const staffId = columns[0].trim();
        const staffName = columns[1].trim();

        // プルダウンの選択肢を作る
        const option = document.createElement("option");

        option.value = staffId;
        option.textContent = staffName;

        select.appendChild(option);
    }
}


// ページを開いたら担当者マスターを読み込む
window.addEventListener("DOMContentLoaded", function () {

    loadStaffMaster();
    loadProductMaster();

});


// 製品マスターを読み込む
async function loadProductMaster() {

    const response = await fetch("製品マスター.csv");
    const text = await response.text();

    const lines = text.trim().split("\n");

    const select = document.getElementById("productSelect");

    // 製品データを保存しておく
    window.productMaster = [];

    // 1行目は見出しなので飛ばす
    for (let i = 1; i < lines.length; i++) {

        const columns = lines[i].split(",");

        const product = {
            productCode: columns[0].trim(),
            productName: columns[1].trim(),
            type: columns[2].trim(),
            snp: columns[3].trim()
        };

        productMaster.push(product);

        // 製品コードの選択肢を作る
        const option = document.createElement("option");

        option.value = product.productCode;
        option.textContent = product.productCode;

        select.appendChild(option);
    }
}

//製品を選んだ時の制御
function selectProduct() {

    const productCode =
        document.getElementById("productSelect").value;

    const product = productMaster.find(item =>
        item.productCode === productCode
    );


    if (!product) {
        document.getElementById("productName").value = "";
        document.getElementById("snp").value = "";
        return;
    }

    if (product.type === "SET") {

    document.getElementById("productSet").style.display = "block";
    document.getElementById("productMulti").style.display = "none";

    document.getElementById("snp").value = product.snp;

    } else if (product.type === "MULTI") {

        document.getElementById("productSet").style.display = "none";
        document.getElementById("productMulti").style.display = "block";

        document.getElementById("snpMulti").value = product.snp;

    }

    // 品目名称を表示
    document.getElementById("productName").value =
        product.productName;

    // SNPを表示
    document.getElementById("snp").value =
        product.snp;

    console.log("TYPE:", product.type);
}


//set時の不良発生して追加した時
function addDefectSet() {

    const defectName =
        document.getElementById("defectNameSet").value;

    const rh =
        Number(document.getElementById("defectRhSet").value);

    const lh =
        Number(document.getElementById("defectLhSet").value);

    if (defectName === "") {
        alert("不良内容を選択してください");
        return;
    }

    if (rh === 0 && lh === 0) {
        alert("RHまたはLHの不良数を入力してください");
        return;
    }

    // 追加した時刻を取得
    const now = new Date();

    const time =
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0") + ":" +
        String(now.getSeconds()).padStart(2, "0");


    // 配列に1件追加
    defectRecordsSet.push({
        time: time,
        name: defectName,
        rh: rh,
        lh: lh
    });


    // 配列の内容から画面を作り直す
    displayDefectSet();


    // 入力欄をクリア
    document.getElementById("defectNameSet").value = "";
    document.getElementById("defectRhSet").value = "";
    document.getElementById("defectLhSet").value = "";
}

//set時の不良の追加
function displayDefectSet() {

    const list =
        document.getElementById("defectListSet");

    // 今表示している一覧を一旦消す
    list.innerHTML = "";

    //不良合計の初期化
    let badRh = 0;
    let badLh = 0;

    defectRecordsSet.forEach(function(record, index) {

        //不良数の加算
        badRh += record.rh;
        badLh += record.lh;

        const row =
            document.createElement("div");

        row.className = "defectRecord";


        const text =
            document.createElement("span");

        text.textContent =
            record.time +
            "　" + record.name +
            "　RH:" + record.rh +
            "　LH:" + record.lh;


        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "削除";

        deleteButton.onclick = function () {
            deleteDefectSet(index);
        };


        row.appendChild(text);
        row.appendChild(deleteButton);

        list.appendChild(row);

        document.getElementById("badRh").value = badRh;
        document.getElementById("badLh").value = badLh;
    });
}

//set時の不良の削除
function deleteDefectSet(index) {

    defectRecordsSet.splice(index, 1);

    displayDefectSet();
}

const defectRecordsSet = [];


//multiの不良が追加された時
function addDefectMulti() {

    const defectName =
        document.getElementById("defectNameMulti").value;

    const qty =
        Number(document.getElementById("defectQtyMulti").value);


    // 不良内容が選択されていない
    if (defectName === "") {
        alert("不良内容を選択してください");
        return;
    }


    // 数量が入力されていない
    if (qty === 0) {
        alert("不良数を入力してください");
        return;
    }


    // 現在時刻を取得
    const now = new Date();

    const time =
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0") + ":" +
        String(now.getSeconds()).padStart(2, "0");


    // 配列に1件追加
    defectRecordsMulti.push({
        time: time,
        name: defectName,
        数量: qty,
    });


    // 配列の内容から画面を作り直す
    displayDefectMulti();


    // 入力欄をクリア
    document.getElementById("defectNameMulti").value = "";
    document.getElementById("defectQtyMulti").value = "";
}

//Multi時の不良の追加
function displayDefectMulti() {

    const list =
        document.getElementById("defectListMulti");

    // 今表示している一覧を一旦消す
    list.innerHTML = "";

    //不良数初期化
    let badMulti = 0;

    defectRecordsMulti.forEach(function(record, index) {

        //不良数加算
        badMulti += record.数量;

        const row =
            document.createElement("div");

        row.className = "defectRecord";


        const text =
            document.createElement("span");

        text.textContent =
            record.time +
            "　" + record.name +
            "　QTY:" + record.数量;


        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "削除";

        deleteButton.onclick = function () {
            deleteDefectMulti(index);
        };


        row.appendChild(text);
        row.appendChild(deleteButton);

        list.appendChild(row);

        document.getElementById("badMulti").value = badMulti;

    });
}

//Multi時の不良の削除
function deleteDefectMulti(index) {

    defectRecordsMulti.splice(index, 1);

    displayDefectMulti();
}

const defectRecordsMulti = [];




//製品情報の自動計算set
function calcSetGood() {

    const snp =
        Number(document.getElementById("snp").value);

    const boxRh =
        Number(document.getElementById("boxRh").value);

    const boxLh =
        Number(document.getElementById("boxLh").value);

    const pieceRh =
        Number(document.getElementById("pieceRh").value);

    const pieceLh =
        Number(document.getElementById("pieceLh").value);

    const goodRh =
        boxRh * snp + pieceRh;

    const goodLh =
        boxLh * snp + pieceLh;

    document.getElementById("goodRh").value = goodRh;
    document.getElementById("goodLh").value = goodLh;
}

//製品情報の自動計算multi
function calcMultiGood() {

    const snp =
        Number(document.getElementById("snpMulti").value);

    const box =
        Number(document.getElementById("boxMulti").value);

    const piece =
        Number(document.getElementById("pieceMulti").value);

    const good =
        box * snp + piece;

    document.getElementById("goodMulti").value = good;
}