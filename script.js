let goals = JSON.parse(localStorage.getItem("goals")) || [];


// 目標追加
function addGoal(){

  const title =
  document.getElementById("title").value;

  const goal =
  Number(document.getElementById("goal").value);


  const newGoal = {

    title:title,

    goal:goal,

    history:[]

  };


  goals.push(newGoal);

  saveGoals();

  displayGoals();

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


 const total =
 getTotal(item.history);


 const percent =
 Math.floor(total / item.goal * 100);



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

 goals[index].title=title;

 goals[index].goal=Number(goal);


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