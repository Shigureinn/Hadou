const correctPassword = "Edelgard"; // ここに設定するパスワードを入力

document.addEventListener("DOMContentLoaded", () => {
    // ページが読み込まれたときにセッションストレージをチェック
    if (sessionStorage.getItem('authenticated') === 'true') {
        document.getElementById('passwordModal').style.display = 'none';
        document.getElementById('content').classList.remove('hidden');
    }
});

let selectedTime = 0;
let history = [];
let previousTimeButton = null;
let selectedSpeedButtons = [];
let selectedDynamicSpeedButtons = [];

function setTime(value, button) {
    selectedTime = value;
    console.log(`Selected time is: ${selectedTime}`);

    // 以前の選択されたボタンの選択状態を解除
    if (previousTimeButton) {
        previousTimeButton.classList.remove('selected');
    }

    // 新しく選択されたボタンを選択状態にする
    button.classList.add('selected');
    previousTimeButton = button;
}

function setSpeed(button) {
    const prefix = button.getAttribute('data-prefix');
    const speed = parseFloat(button.getAttribute('data-speed'));

    // 同じprefixのボタンが既に選択されている場合はそれを解除
    let alreadySelected = false;
    selectedSpeedButtons = selectedSpeedButtons.filter(btn => {
        if (btn.getAttribute('data-prefix').slice(0, 2) === prefix.slice(0, 2)) {
            if (btn === button) {
                alreadySelected = true;
            } else {
                btn.classList.remove('selected');
            }
            return false;
        }
        return true;
    });

    // 選択/解除のトグル処理
    if (alreadySelected) {
        button.classList.remove('selected');
    } else {
        button.classList.add('selected');
        selectedSpeedButtons.push(button);
    }

    // riseSpeedの計算
    let totalSpeed = selectedSpeedButtons.reduce((sum, btn) => sum + parseFloat(btn.getAttribute('data-speed')), 0);
    document.getElementById('rise_speed').value = totalSpeed;        

}

function setSpeedDynamic(button) {
    const prefix = button.getAttribute('data-prefix');
    const speed = parseFloat(button.getAttribute('data-speed-dynamic'));

    // 同じprefixのボタンが既に選択されている場合はそれを解除
    let alreadySelected = false;
    selectedDynamicSpeedButtons = selectedDynamicSpeedButtons.filter(btn => {
        if (btn.getAttribute('data-prefix').slice(0, 2) === prefix.slice(0, 2)) {
            if (btn === button) {
                alreadySelected = true; // 既に選択されている場合
            } else {
                btn.classList.remove('selected'); // 他のボタンの選択を解除
            }
            return false; // フィルタリングから外す
        }
        return true; // フィルタリングを続ける
    });

    // 選択/解除のトグル処理
    if (alreadySelected) {
        button.classList.remove('selected'); // 選択を解除
    } else {
        button.classList.add('selected'); // 選択
        selectedDynamicSpeedButtons.push(button); // 選択したボタンを追加
    }

    // riseSpeedの計算
    let totalSpeed = selectedDynamicSpeedButtons.reduce((sum, btn) => sum + parseFloat(btn.getAttribute('data-speed-dynamic')), 0);
    document.getElementById('rise_speed_dynamic').value = totalSpeed;        
}

function adjustIniGauge(amount) {
    const iniGaugeInput = document.getElementById('ini_gauge');
    let currentValue = parseFloat(iniGaugeInput.value);

    // ini_gaugeが未入力の場合は0として扱う
    if (isNaN(currentValue)) {
        currentValue = 0;
    }

    // ini_gaugeを増減
    currentValue = Math.max(0, currentValue + amount); // 0未満にならないようにする

    // ini_gaugeの値を更新
    iniGaugeInput.value = currentValue;
}

function calculate() {
    // 入力フィールドから値を取得
    let iniGauge = parseFloat(document.getElementById('ini_gauge').value);
    let riseSpeed = parseFloat(document.getElementById('rise_speed').value);
    let riseSpeed_dynamic = parseFloat(document.getElementById('rise_speed_dynamic').value);

    // ini_gaugeが未入力の場合は0として扱う
    if (isNaN(iniGauge)) {
        iniGauge = 0;
    }

   // riseSpeedが未入力の場合は0として扱う
    if (isNaN(riseSpeed)) {
        riseSpeed = 0;
    }

   // riseSpeed_dynamicが未入力の場合は0として扱う
   if (isNaN(riseSpeed_dynamic)) {
        riseSpeed_dynamic = 0;
    }    
    if (selectedTime === 0) {
        alert('時間を選択してください。');
        return;
    }

    // 計算式を実行
    let result = selectedTime / (1 + riseSpeed / 100) / (1 + riseSpeed_dynamic / 100) * (1 - iniGauge / 100);

    // 結果を小数第3位で切り捨て
    result = Math.floor(result * 1000) / 1000;

    // 結果を表示
    document.getElementById('result').textContent = result.toFixed(3); // 小数点以下3桁まで表示

    // 履歴に追加
    addHistory(iniGauge, riseSpeed, riseSpeed_dynamic, selectedTime, result.toFixed(3));
}

function addHistory(iniGauge, riseSpeed, riseSpeed_dynamic, time, result) {
    // 履歴のエントリを作成
    let entry = {
        iniGauge: iniGauge,
        riseSpeed: riseSpeed,
        riseSpeed_dynamic: riseSpeed_dynamic,
        time: time,
        result: result
    };

    // 履歴に追加
    history.unshift(entry);

    // 履歴が10件を超えたら削除
    if (history.length > 10) {
        history.pop();
    }

    // 履歴を表示
    displayHistory();
}

function displayHistory() {
    const historyDiv = document.getElementById('history');
    historyDiv.innerHTML = ''; // 履歴表示をクリア

    history.forEach(entry => {
        let div = document.createElement('div');
        div.className = 'history-entry';
        div.textContent = `出陣時ゲージ: ${entry.iniGauge}%, 戦法速度上昇: ${entry.riseSpeed}%, 戦法速度上昇(動的): ${entry.riseSpeed_dynamic}%, 戦法発動間隔: ${entry.time}s, 発動時間: ${entry.result}s`;
        historyDiv.appendChild(div);
    });
}
