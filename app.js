
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

    const response = await fetch("staff_master.csv");
    const text = await response.text();

    // Windowsの改行にも対応
    const lines = text.trim().split(/\r?\n/);

    const selects = [
        document.getElementById("staffSelect"),
        document.getElementById("manager"),
        document.getElementById("inspectionStaff"),
        document.getElementById("observeStaff"),
        document.getElementById("supervisorStaff"),
    ];

    for (let i = 1; i < lines.length; i++) {

        // 空行なら飛ばす
        if (lines[i].trim() === "") {
            continue;
        }

        const columns = lines[i].split(",");

        // 念のため2列無い行は飛ばす
        if (columns.length < 2) {
            console.log("読み飛ばした行:", lines[i]);
            continue;
        }

        const staffId = columns[0].trim();
        const staffName = columns[1].trim();

        selects.forEach(function(select) {

            if (!select) {
                return;
            }

            const option = document.createElement("option");

            option.value = staffId;
            option.textContent = staffName;

            select.appendChild(option);
        });
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
            snp: columns[3].trim(),
            referenceWeight: columns[4].trim(),
            tolerance: columns[5].trim(),
            cavity: columns[6].trim(),
            material: columns[7].trim(),
            cycle: columns[8].trim()
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
        document.getElementById("cycle").value = "";
        document.getElementById("snp").value = "";
        document.getElementById("kgDango").value = "";
        document.getElementById("kgJunbi").value = "";
        document.getElementById("kgTsuika").value = "";
        document.getElementById("kgEnd").value = "";
        return;
    }

    if (product.type === "SET") {

    document.getElementById("productSet").style.display = "block";
    document.getElementById("productMulti").style.display = "none";

    document.getElementById("snp").value = product.snp;

   document.getElementById("inspectionSet").style.display = "block";
    document.getElementById("inspectionMulti").style.display = "none";

    } else if (product.type === "MULTI") {

        document.getElementById("productSet").style.display = "none";
        document.getElementById("productMulti").style.display = "block";

        document.getElementById("snpMulti").value = product.snp;

        document.getElementById("inspectionSet").style.display = "none";
        document.getElementById("inspectionMulti").style.display = "block";

    }

    // 品目名称を表示
    document.getElementById("productName").value =
        product.productName;

    // サイクルを表示
    document.getElementById("cycle").value =
        product.cycle;

    // SNPを表示
    document.getElementById("snp").value =
        product.snp;
    document.getElementById("kgDango").value = "";
    document.getElementById("kgJunbi").value = "";
    document.getElementById("kgTsuika").value = "";
    document.getElementById("kgEnd").value = "";

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

        //終了値の再計算
        calcMaterial()
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
        
        //終了値の再計算
        calcMaterial()
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

    //終了値の再計算
    calcMaterial()
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
        
    //終了値の再計算
    calcMaterial()
}




//設備情報が追加された時
function addStop() {

    const startTime =
        document.getElementById("stopStart1").value;

    const endTime =
        document.getElementById("stopEnd1").value;

    const stopReasonSelect =
        document.getElementById("stopReason");

    const stopReason =
        stopReasonSelect.options[stopReasonSelect.selectedIndex].text;

    const managerSelect =
        document.getElementById("manager");

    let manager = "";

    if (managerSelect.value !== "") {
        manager =
            managerSelect.selectedOptions[0].text;
    }

    const remarks=
        document.getElementById("remarks").value;

    // 不良内容が選択されていない
    if (startTime === "") {
        alert("停止開始を入力してください");
        return;
    }

    // 停止理由入力されていない
    if (stopReason === "選択してください") {
        alert("停止理由を選択してください");
        return;
    }




    // 現在時刻を取得
    const now = new Date();

    const time =
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0") + ":" +
        String(now.getSeconds()).padStart(2, "0");


    // 配列に1件追加
    machineRecords.push({
        time: time,
        stime: startTime,
        etime: endTime,
        reason: stopReason,
        man: manager,
        remark: remarks,
    });


    // 配列の内容から画面を作り直す
    displayStop();


    // 入力欄をクリア
    document.getElementById("stopStart1").value = "";
    document.getElementById("stopEnd1").value = "";
    document.getElementById("stopReason").value = "";
    document.getElementById("manager").value = "";
    document.getElementById("remarks").value = "";
}

//設備情報の追加
function displayStop() {

    const list =
        document.getElementById("machineList");

    // 今表示している一覧を一旦消す
    list.innerHTML = "";

    machineRecords.forEach(function(record, index) {

        const row =
            document.createElement("div");

        row.className = "machine";


        const text =
            document.createElement("span");

        text.textContent =
            record.time +
            "　" + record.stime +
            "　" + record.etime+
            "　" + record.reason+
            "　" + record.man+
            "　" + record.remark;


        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "削除";

        deleteButton.onclick = function () {
            deleteStop(index);
        };


        row.appendChild(text);
        row.appendChild(deleteButton);

        list.appendChild(row);

    });
}

//設備情報の削除
function deleteStop(index) {

    machineRecords.splice(index, 1);

    displayStop();
}

const machineRecords = [];



//中間検査が追加された時
function addInspection() {

    const inspectionTime =
        document.getElementById("inspectionTime1").value;

    const judgeSelect =
        document.getElementById("judge");

    const judge =
        judgeSelect.selectedOptions[0]?.text ?? "";

    const staffSelect =
        document.getElementById("inspectionStaff");

    const staff =
        staffSelect.selectedOptions[0]?.text ?? "";

    const spool =
        Number(document.getElementById("weightSpool").value);

    const remark =
        document.getElementById("inspectionRemarks").value;


    // 製品情報を取得
    const productCode =
        document.getElementById("productSelect").value;

    const product =
        productMaster.find(item =>
            item.productCode === productCode
        );


    // --------------------
    // 入力チェック
    // --------------------

    if (!product) {
        alert("製品を選択してください");
        return;
    }

    if (inspectionTime === "") {
        alert("検査時間を入力してください");
        return;
    }

    if (judge === "" || judge === "選択してください") {
        alert("判定を選択してください");
        return;
    }

    if (staff === "" || staff === "選択してください") {
        alert("担当者を選択してください");
        return;
    }


    // 登録ボタンを押した時刻
    const now = new Date();

    const time =
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0") + ":" +
        String(now.getSeconds()).padStart(2, "0");


    // --------------------
    // SET
    // --------------------

    if (product.type === "SET") {

        const rh =
            Number(document.getElementById("weightRh").value);

        const lh =
            Number(document.getElementById("weightLh").value);

        inspectionRecords.push({
            type: "SET",
            time: time,
            instime: inspectionTime,
            rh: rh,
            lh: lh,
            spool: spool,
            judge: judge,
            staff: staff,
            remark: remark
        });
    }


    // --------------------
    // MULTI
    // --------------------

    else if (product.type === "MULTI") {

        const weight =
            Number(document.getElementById("inspectionWeightMulti").value);

        inspectionRecords.push({
            type: "MULTI",
            time: time,
            instime: inspectionTime,
            weight: weight,
            spool: spool,
            judge: judge,
            staff: staff,
            remark: remark
        });
    }


    // 一覧を描き直す
    displayInspection();


    // --------------------
    // 入力欄クリア
    // --------------------

    document.getElementById("inspectionTime1").value = "";

    document.getElementById("weightRh").value = "";
    document.getElementById("weightLh").value = "";
    document.getElementById("inspectionWeightMulti").value = "";

    document.getElementById("weightSpool").value = "";
    document.getElementById("judge").value = "";
    document.getElementById("inspectionStaff").value = "";
    document.getElementById("inspectionRemarks").value = "";
}

//中間検査の追加
function displayInspection() {

    const list =
        document.getElementById("inspectionList");

    list.innerHTML = "";

    inspectionRecords.forEach(function(record, index) {

        const row =
            document.createElement("div");

        row.className = "inspectionRecord";

        const text =
            document.createElement("span");


        if (record.type === "SET") {

            text.textContent =
                record.time +
                "　検査:" + record.instime +
                "　RH:" + record.rh + "g" +
                "　LH:" + record.lh + "g" +
                "　スプール:" + record.spool + "g" +
                "　" + record.judge +
                "　担当:" + record.staff +
                "　" + record.remark;

        } else if (record.type === "MULTI") {

            text.textContent =
                record.time +
                "　検査:" + record.instime +
                "　重量:" + record.weight + "g" +
                "　スプール:" + record.spool + "g" +
                "　" + record.judge +
                "　担当:" + record.staff +
                "　" + record.remark;
        }


        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "削除";

        deleteButton.onclick = function () {
            deleteInspection(index);
        };


        row.appendChild(text);
        row.appendChild(deleteButton);

        list.appendChild(row);
    });
}

//中間検査の削除
function deleteInspection(index) {

    inspectionRecords.splice(index, 1);

    displayInspection();
}

const inspectionRecords = [];



//作業観察が追加された時
function addObserve() {

    const observeTime =
        document.getElementById("observeTime1").value;

    const observeStaffSelect =
        document.getElementById("observeStaff");
    
    const observeStaff =
        observeStaffSelect.options[observeStaffSelect.selectedIndex].text;
    
    const supervisorStaffSelect =
        document.getElementById("supervisorStaff");
    
    const supervisorStaff =
        supervisorStaffSelect.options[supervisorStaffSelect.selectedIndex].text;

    const resultSelect =
        document.getElementById("result");
    
    const result =
        resultSelect.options[resultSelect.selectedIndex].text;
    
    const remark =
        document.getElementById("observeRemark").value;


    // 検査時間が選択されていない
    if (observeTime === "") {
        alert("観察時間を入力してください");
        return;
    }

    // 担当者入力されていない
    if (observeStaff === "選択してください") {
        alert("作業者を選択してください");
        return;
    }

    // 監督者入力されていない
    if (supervisorStaff === "選択してください") {
        alert("監督者を選択してください");
        return;
    }

    // 判定入力されていない
    if (result === "選択してください") {
        alert("判定を選択してください");
        return;
    }


    // 現在時刻を取得
    const now = new Date();

    const time =
        String(now.getHours()).padStart(2, "0") + ":" +
        String(now.getMinutes()).padStart(2, "0") + ":" +
        String(now.getSeconds()).padStart(2, "0");


    // 配列に1件追加
    observeRecords.push({
        time: time,
        observeTime: observeTime,
        observeStaff: observeStaff,
        supervisorStaff: supervisorStaff,
        result: result,
        remark: remark,
    });


    // 配列の内容から画面を作り直す
    displayOvserve();


    // 入力欄をクリア
    document.getElementById("observeTime1").value = "";
    document.getElementById("observeStaff").value = "";
    document.getElementById("supervisorStaff").value = "";
    document.getElementById("result").value = "";
    document.getElementById("observeRemark").value = "";
}

//作業観察の追加
function displayOvserve() {

    const list =
        document.getElementById("observeList");

    // 今表示している一覧を一旦消す
    list.innerHTML = "";

    observeRecords.forEach(function(record, index) {

        const row =
            document.createElement("div");

        row.className = "observe";


        const text =
            document.createElement("span");

        text.textContent =
            record.time +
            "　" + record.observeTime +
            "　" + record.observeStaff +
            "　" + record.supervisorStaff +
            "　" + record.result +
            "　" + record.remark;


        const deleteButton =
            document.createElement("button");

        deleteButton.type = "button";
        deleteButton.textContent = "削除";

        deleteButton.onclick = function () {
            deleteOvserve(index);
        };


        row.appendChild(text);
        row.appendChild(deleteButton);

        list.appendChild(row);

    });
}

//作業観察の削除
function deleteOvserve(index) {

    observeRecords.splice(index, 1);

    displayOvserve();
}


const observeRecords = [];

//重量計算
function calcMaterial() {

    const dango =
        Number(document.getElementById("kgDango").value);

    const junbi =
        Number(document.getElementById("kgJunbi").value);

    const tsuika =
        Number(document.getElementById("kgTsuika").value);


    // 現在選択されている製品コード
    const productCode =
        document.getElementById("productSelect").value;

    const product =
        productMaster.find(item =>
            item.productCode === productCode
        );

    // 製品未選択ならまだ計算しない
    if (!product) {
        document.getElementById("kgEnd").value = "";
        return;
    }


    let usage = 0;


    // SET
    if (product.type === "SET") {

        const goodRh =
            Number(document.getElementById("goodRh").value);

        const badRh =
            Number(document.getElementById("badRh").value);

        const goodLh =
            Number(document.getElementById("goodLh").value);

        const badLh =
            Number(document.getElementById("badLh").value);


        // ↓ この3つは実際のidに合わせる
        const weightRh =
            Number(document.getElementById("rweightSet").value);

        const weightLh =
            Number(document.getElementById("lweightSet").value);

        const spool =
            Number(document.getElementById("spoolSet").value);


        const usageRh =
            (goodRh + badRh)
            * (weightRh + spool / 2)
            / 1000;

        const usageLh =
            (goodLh + badLh)
            * (weightLh + spool / 2)
            / 1000;

        usage = usageRh + usageLh;
    }


    // MULTI
    else if (product.type === "MULTI") {

        const good =
            Number(document.getElementById("goodMulti").value);

        const bad =
            Number(document.getElementById("badMulti").value);


        // ↓ ここも実際のidに合わせる
        const weight =
            Number(document.getElementById("weightMulti").value);

        const spool =
            Number(document.getElementById("spoolMulti").value);

        const cavity =
            Number(document.getElementById("cavityMulti").value);


        if (cavity <= 0) {
            document.getElementById("kgEnd").value = "";
            return;
        }


        usage =
            (good + bad)
            * ((weight + spool) / cavity)
            / 1000;
    }


    const end =
        junbi
        + tsuika
        - dango
        - usage;


    document.getElementById("kgEnd").value =
        end.toFixed(2);
}