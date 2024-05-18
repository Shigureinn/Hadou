let selectedTime = 0;
let history = [];
let previousTimeButton = null;
let selectedSpeedButtons = [];

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

function calculate() {
    // 入力フィールドから値を取得
    let iniGauge = parseFloat(document.getElementById('ini_gauge').value);
    let riseSpeed = parseFloat(document.getElementById('rise_speed').value);

    if (selectedTime === 0) {
        alert('時間を選択してください。');
        return;
    }

    // 計算式を実行
    let result = selectedTime / (1 + riseSpeed / 100) * (1 - iniGauge / 100);

    // 結果を小数第3位で切り捨て
    result = Math.floor(result * 1000) / 1000;

    // 結果を表示
    document.getElementById('result').textContent = result.toFixed(3); // 小数点以下3桁まで表示

    // 履歴に追加
    addHistory(iniGauge, riseSpeed, selectedTime, result.toFixed(3));
}

function addHistory(iniGauge, riseSpeed, time, result) {
    // 履歴のエントリを作成
    let entry = {
        iniGauge: iniGauge,
        riseSpeed: riseSpeed,
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
        div.textContent = `ini_gauge: ${entry.iniGauge}, rise_speed: ${entry.riseSpeed}, time: ${entry.time}, result: ${entry.result}`;
        historyDiv.appendChild(div);
    });
}
