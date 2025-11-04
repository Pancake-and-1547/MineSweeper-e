/*
扫雷游戏思路

1. 初始化游戏界面，使用HTML和CSS创建一个网格布局。
ok

2. 生成地雷，在玩家按下第一个按钮之后再布雷，以防玩家第一步就踩到雷。
ok

3. 监听玩家的点击事件，判断左右键并做出不同的反应：
   - 左键点击：如果是地雷，游戏结束；如果不是地雷，显示周围地雷数量。
   - 右键点击：标记或取消标记地雷。
放弃吧，你不可能做到的，这是白日做梦
4. 当所有非地雷的按钮都被打开时玩家胜利
*/
let gameStart = false; // 检测游戏是否开始
let notMinesCount = 0; // 记录非地雷按钮的数量

// timer
let time = 0;
let timerActive = false;
let timer = null;

function startTime(){
  if(!timerActive){
    timerActive = true;
    timer = setInterval(() => {
      time++;
      document.getElementById('timer').innerText = `${time} seconds`;
    }, 1000);
  }
}
function stopTime(){
  timerActive = false;
  clearInterval(timer);
}

// 设置地雷字体颜色
function setMineColor(btn, num){
  const MineColor = {
    0:'black', 
    1:'blue',
    2:'green',
    3:'red',
    4:'navy',
    5:'brown',
    6:'teal',
    7:'black',
    8:'gray'
  };
  btn.style.color = MineColor[num] || 'black';
}

class Mine{
  constructor(id){
    this.id = id;
    this.isMine = false; // 判断是否是地雷
    this.isOpen = false; // 判断是否被打开
    this.isFlagged = false; // 判断是否被标记
  }
  detectMines(){
    let mineCount = 0;
    let neighbors = [];
    for(let i = -1; i <= 1; i++){
      for(let j = -1; j <= 1; j++){
        if(i === 0 && j === 0) continue; // 跳过自己
        let neighborId = this.id + i * 9 + j;
        if(j === -1 && this.id % 9 === 1) continue;
        if(j === 1 && this.id % 9 === 0) continue;
        if(i === -1 && this.id <= 9) continue;
        if(i === 1 && this.id > 72) continue;
        if(neighborId >= 1 && neighborId <= 81) {
          neighbors.push(neighborId);
          if(mines[neighborId] && mines[neighborId].isMine){
            mineCount++;
          }
        }
      }
    }
    return {mineCount, neighbors};
  }
  leftClick(){
    if(this.isOpen || this.isFlagged){
      return;
    }
    if(this.isMine){
      document.getElementById(this.id).innerText = '💣';
      stopTime();
      alert('It cost you ' + time + ' seconds, you lose!');
      location.reload();
      gameStart = false;
    }else{
      this.isOpen = true;
      let {mineCount, neighbors} = this.detectMines();
      //document.getElementById(this.id).innerText = mineCount === 0 ? 0 : mineCount;
      let btn = document.getElementById(this.id);
      btn.innerText = mineCount === 0 ? '0' : mineCount;
      setMineColor(btn, mineCount);
      notMinesCount += 1;
      if(notMinesCount === 71){
        stopTime();
        alert('You win! you cost ' + time + ' seconds!');
        gameStart = false;
        location.reload();
      }
      // 递归，在这里浪费了好多时间
      if(mineCount === 0){
        for(let id of neighbors){
          if(mines[id] && !mines[id].isOpen && !mines[id].isFlagged){
            mines[id].leftClick();
        }
      }
    }
  }
}
  rightClick(){
    if(gameStart){
      if(this.isOpen){
        return;
      }
      if(this.isFlagged){
        this.isFlagged = false;
        document.getElementById(this.id).innerText = '';
        // 取消旗帜的相关代码
      }else{
        this.isFlagged = true;
        document.getElementById(this.id).innerText = '🚩'; // 设置旗帜图标
        // 设置旗帜的相关代码
    }
  }
  }
}

// 布雷，玩家点击任意按钮之后再布雷，以防玩家第一步就踩到雷
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function generateMines(MineCount, startId){
  let mineIDs = [];
  while(mineIDs.length < MineCount){
    let id = getRandomInt(1, 81);
    if(!mineIDs.includes(id) && id !== startId){
      // 确保生成的地雷不重复且不在玩家第一次点击的按钮上
      mineIDs.push(id);
    }}
    console.log(mineIDs);
  // 将生成的地雷设置为Mine对象的isMine属性为true
  for(let id of mineIDs){
    if(mines[id]){
      mines[id].isMine = true;
    }
  }
}

// 存储所有Mine对象
const mines = {};

// 批量绑定事件
for (let i = 1; i <= 81; i++) {
  const btn = document.getElementById(String(i));
  if (!btn) continue; // 防止有的按钮不存在
  mines[i] = new Mine(i);

  // 左键
  btn.addEventListener('click', () => {
    if (!gameStart) {
      gameStart = true;
      generateMines(10, btn.id);
      startTime();
    }
    mines[i].leftClick();
  });

  // 右键
  btn.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    mines[i].rightClick();
  });
}

// 重置按钮功能实现
document.getElementById('reset').addEventListener('click', () => {
  location.reload(); // 刷新页面
});


// testing
/*
class Button{
  constructor(id){
    this.id = id;
  }
  click(){
    alert(`Button ${this.id} clicked!`);
  }
}
const button = document.getElementById('1');
const btn = new Button(1);
button.addEventListener('click', () => {
  btn.click();
});
*/

// 之前测试的代码
/*
// 将按钮和类联系起来
const button_1 = document.getElementById('1');
const btn_1 = new Mine(1);
// 监听左键
button_1.addEventListener('click', () => {
  if(!gameStart){
    gameStart = true; // 游戏开始
    generateMines(10); // 生成10个地雷
  }
  btn_1.leftClick();
});
// 监听右键
button_1.addEventListener('contextmenu', (e) => {
  e.preventDefault(); // 阻止默认右键菜单
  btn_1.rightClick();
});


*/