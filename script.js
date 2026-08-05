let goals = JSON.parse(localStorage.getItem("goals")) || [];


// 目標追加
function addGoal() {
  const title = document.getElementById("title").value.trim();
  const goal = Number(document.getElementById("goal").value);
  const saved = Number(document.getElementById("saved").value) || 0;

  if (!title || isNaN(goal) || goal <= 0) {
    alert("正しく入力してください！(目標金額は1円以上にしてください)");
    return;
  }

  if (saved < 0) {
    alert("現在の貯金額はマイナスにできません！");
    return;
  }

  const history = [];
  if (saved > 0) {
    history.push({
      date: new Date().toLocaleDateString("ja-JP"),
      amount: saved
    });
  }

  goals.push({
    title: title,
    goal: goal,
    history: history
  });

  saveGoals();

  displayGoals();

  // 入力欄をリセット
  document.getElementById("title").value = "";
  document.getElementById("goal").value = "";
  document.getElementById("saved").value = "";
}



// 保存
function saveGoals(){

  localStorage.setItem(
    "goals",
    JSON.stringify(goals)
  );

}



// 貯金合計計算
function getTotal(history){

  return history.reduce(
    (sum,item)=>sum + item.amount,
    0
  );

}



// 表示
function displayGoals(){

 const list =
 document.getElementById("goalList");


 list.innerHTML="";


 goals.forEach((item,index)=>{

 // ↓この1行を追加
 item.history = item.history || [];


 const total =
 getTotal(item.history);


 const percent =
 Math.floor(total / item.goal * 100);


const history = item.history || [];


 list.innerHTML += `


<div>


<h3>${item.title}</h3>


<p>
目標：
${item.goal.toLocaleString()}円
</p>


<p>
現在：
${total.toLocaleString()}円
</p>


<p>
達成率：
${percent}%
</p>


<h4>貯金履歴</h4>

${item.history.map((h,historyIndex)=>
`
<p>
${h.date}
 +${h.amount.toLocaleString()}円

<button class="edit-btn" onclick="editHistory(${index},${historyIndex})">
編集
</button>

<button class="delete-btn" onclick="deleteHistory(${index},${historyIndex})">
削除
</button>

</p>
`
).join("")}



<input id="money${index}" placeholder="今回貯めた金額">


<button onclick="addMoney(${index})">
貯金追加
</button>

<div class="action-buttons">

<button class="edit-btn" onclick="editItem(${index})">
編集
</button>


<button class="delete-btn" onclick="deleteItem(${index})">
削除
</button>

</div>

</div>

<hr>


 `;


 });


}



// 貯金追加
function addMoney(index){


 const money =
 Number(
 document.getElementById(`money${index}`).value
 );


 const today =
 new Date().toLocaleDateString(
 "ja-JP"
 );


 goals[index].history.push({

 date:today,

 amount:money

 });


 saveGoals();

 displayGoals();


}



// 編集
function editItem(index){

 const title =
 prompt(
 "タイトル",
 goals[index].title
 );


 const goal =
 prompt(
 "目標金額",
 goals[index].goal
 );


 if(title && goal){

 const goalNum = Number(goal);

 if (isNaN(goalNum) || goalNum <= 0) {
   alert("目標金額は1円以上の数字にしてください！");
   return;
 }

 goals[index].title=title;

 goals[index].goal=goalNum;


 saveGoals();

 displayGoals();

 }


}



// 削除
function deleteItem(index){


 if(confirm("削除しますか？")){


 goals.splice(index,1);


 saveGoals();

 displayGoals();


 }


}



displayGoals();


// バックアップの書き出し(JSONファイルとしてダウンロード)
function exportGoals(){

  const dataStr = JSON.stringify(goals, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const today = new Date().toISOString().slice(0, 10);

  const a = document.createElement("a");
  a.href = url;
  a.download = `貯金アプリ_バックアップ_${today}.json`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);

  URL.revokeObjectURL(url);
}


// バックアップの読み込み(JSONファイルから復元)
function importGoals(event){

  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = function(e){

    try {
      const imported = JSON.parse(e.target.result);

      if (!Array.isArray(imported)) {
        throw new Error("不正な形式です");
      }

      const doOverwrite = confirm(
        "現在のデータに追加しますか？\n" +
        "「OK」で追加、「キャンセル」で今のデータを置き換えます。"
      );

      // history未定義のデータでも壊れないようにする
      imported.forEach(item => {
        item.history = item.history || [];
      });

      if (doOverwrite) {
        goals = goals.concat(imported);
      } else {
        goals = imported;
      }

      saveGoals();
      displayGoals();

      alert("バックアップを読み込みました！");

    } catch (err) {
      alert("読み込みに失敗しました。正しいバックアップファイルか確認してください。");
    }

    // 同じファイルを連続で選んでもonchangeが発火するようリセット
    event.target.value = "";
  };

  reader.readAsText(file);
}







function editHistory(goalIndex, historyIndex){

 const current =
 goals[goalIndex].history[historyIndex].amount;


 const newAmount =
 prompt(
 "変更後の金額",
 current
 );


 if(newAmount){

  goals[goalIndex]
  .history[historyIndex]
  .amount = Number(newAmount);


  saveGoals();

  displayGoals();

 }

}



function deleteHistory(goalIndex, historyIndex){


 if(confirm("この貯金履歴を削除しますか？")){


  goals[goalIndex]
  .history
  .splice(historyIndex,1);


  saveGoals();

  displayGoals();


 }

}