function displayNone(ele){
  ele.classList.remove("d-block");
  ele.classList.add("d-none");
}

function displayBlock(ele){
  ele.classList.remove("d-none");
  ele.classList.add("d-block");
}

const config = {
  startPage: document.getElementById("startPage"),
  mainPage: document.getElementById("mainPage"),
}

class Player{
  constructor(name, age, money, days, burgers, items = null){
    this.name = name;
    this.age = age;
    this.money = money;
    this.days = days;
    this.burgers = burgers;
    if(items != null){
      this.items = items;
    }
    else{
      this.items = this.initializeItems();
    }
  }

  initializeItems(){
    const itemList = {
      "Flip Machine": new Item("Flip Machine", "ability", 15000, 0, 25, "+ ¥25 / click", "Get extra 25 yen / click", 0, 500, "flipMachine"),
      "ETF Stock": new Item("ETF Stock", "investment", 300000, 0, 0.1, "+ 0.1% of total / sec", "Get 0.1% of your total balance / sec", 0, -1, "etfStock"),
      "ETF Bonds": new Item("ETF Bonds", "investment", 300000, 0, 0.07, "+ 0.07% of total / sec", "Get 0.07% of your total balance / sec", 0, -1, "etfStock"),
      "Lemonade Stand": new Item("Lemonade Stand", "realEstate", 30000, 0, 30, "+ ¥30 / sec", "Get extra 30 yen / sec", 0, 1000, "lemonade"),
      "Ice Cream Truck": new Item("Ice Cream Truck", "realEstate", 100000, 0, 120, "+ ¥120 / sec", "Get extra 120 yen / sec", 0, 500, "iceCream"),
      "House": new Item("House", "realEstate", 20000000, 0, 32000, "+ ¥32,000 / sec", "Get extra 32,000 yen / sec", 0, 100, "house"),
      "TownHouse": new Item("TownHouse", "realEstate", 40000000, 0, 64000, "+ ¥64,000 / sec", "Get extra 64,000 yen / sec", 0, 100, "townHouse"),
      "Mansion": new Item("Mansion", "realEstate", 250000000, 0, 500000, "+ ¥500,000 / sec", "Get extra 500,000 yen / sec", 0, 20, "mansion"),
      "Industrial Space": new Item("Industrial Space", "realEstate", 1000000000, 0, 2200000, "+ ¥2,200,000 / sec", "Get extra 2,200,000 yen / sec", 0, 10, "indusSpace"),
      "Hotel Skyscraper": new Item("Hotel Skyscraper", "realEstate", 10000000000, 0, 25000000, "+ ¥25,000,000 / sec", "Get extra 25,000,000 yen / sec", 0, 5, "hotelSky"),
      "Bullet-Speed Sky Railway": new Item("Bullet-Speed Sky Railway", "realEstate", 10000000000000, 0, 30000000000, "+ ¥30,000,000,000 / sec", "Get extra 30,000,000,000 yen / sec", 0, 1, "bulletSpeed")
    };

    return itemList;
  } 

  updatePlayerMoney(amount, operator){
    if(operator == "+"){
      this.money += Number(amount);
    }
    else{
      this.money -= Number(amount);
    }
  }

  countDays(){
    this.days++;
    if(this.days % 365 == 0){
      this.age++;
    }
  }

  incomePerClick(income){
    // Flip Machineの数に比例してクリック時の増加分が変化する
    return income * (this.items["Flip Machine"].count + 1);
  }
}

class Item{
  constructor(name, type, price, totalPrice, income, info1, info2, count, maxCount, imgUrl){
    this.name = name;
    this.type = type; // Itemの種類
    this.price = price;
    this.totalPrice = totalPrice; // Item購入分の合計
    this.income = income; // Itemを購入して得られる効果
    this.info1 = info1; // Item-Btn内に記入するInfo
    this.info2 = info2; // Purchase-Page内に記入するInfo
    this.count = count; // Itemの購入数
    this.maxCount = maxCount; // Itemの最大購入数（限度）
    this.imgUrl = imgUrl;
  }

  // For "ETF Stock" price
  updateItemPrice(amount, operator){
    if(operator == "+"){
      this.price += Number(amount);
    }
    else{
      this.price -= Number(amount);
    }
  }

  updateItemTotalPrice(amount, operator){
    if(operator == "+"){
      this.totalPrice += Number(amount);
    }
    else{
      this.totalPrice -= Number(amount);
    }
  }

  updateItemCount(amount, operator){
    if(operator == "+"){
      this.count += Number(amount);
    }
    else{
      this.count -= Number(amount);
    }
  }
}


// -------------------------------
//  First function to be executed
// -------------------------------
function initializePlayerGame(){
  const newGame = document.getElementById("newGame");
  let playerName = config.startPage.querySelectorAll(`input[name="playerName"]`)[0].value;

  if(newGame.checked){
    let player = createNewPlayer(playerName);
    showMainPage(player);
    setTimeInterval(player);
  }
  else{
    let playerObj = {};
    let playerJsonString = localStorage.getItem(playerName);

    if(playerJsonString == null){
      alert("There is no data.")
      return false;
    }
    else{
      playerObj = JSON.parse(playerJsonString);
      let player = createLoadPlayer(playerObj);
      showMainPage(player);
      setTimeInterval(player);
    }
  }
}

function savePlayerData(Player){
  let playerJsonString = JSON.stringify(Player);
  try{
    localStorage.setItem(Player.name, playerJsonString);
    return true;
  } catch {
    return false;
  }
}

function createNewPlayer(playerName){
  let player = new Player(playerName, 20, 50000, 0, 0, null);

  if(playerName == "cheater" || playerName == "noa") {
    player.money = 1000000000000000000000;
  }
  
  return player;
}

function createLoadPlayer(continueData){
  let player = new Player(continueData.name, continueData.age, continueData.money, continueData.days, continueData.burgers);

  Object.keys(player.items).forEach(key => {
    player.items[key].count = continueData.items[key].count;
    if(key == "ETF Stock") {
      player.items[key].price = continueData.items[key].price;
    }
  })

  return player;
}

function setTimeInterval(Player){
  let interval = null;
  interval = setInterval(function(){
    Player.countDays();

    Object.keys(Player.items).forEach(key => {
      let item = Player.items[key];
      if(item.name == "ETF Stock"){
        Player.updatePlayerMoney(item.totalPrice * (item.income / 100), "+");
      }
      else if(item.name == "ETF Bond"){
        Player.updatePlayerMoney(item.totalPrice * (item.income / 100), "+");
      }
      else if(item.type == "realEstate"){
        Player.updatePlayerMoney(item.income * item.count, "+");
      }
    })
    updatePlayerCon(Player);
  }, 1000);
}

function pageController(deletePage, displayPage, htmlString){
  displayNone(deletePage);
  displayBlock(displayPage);
  deletePage.innerHTML = "";
  displayPage.innerHTML = htmlString;

  return htmlString;
}


// ----------------------
//   Page Effect
// ----------------------

function setBrowserEvent(btn){
  btn.addEventListener("mousedown", () => btn.classList.remove("hover"));
  btn.addEventListener("mouseup", () => btn.classList.add("hover"));
  btn.addEventListener("touchstart", () => btn.classList.remove("hover"));
  btn.addEventListener("touchend", () => btn.classList.add("hover"));
}

function showMainPage(Player){
  pageController(startPage, mainPage, createMainPage(Player, "itemList"));

  let burgerImg = config.mainPage.querySelectorAll(".burger-img")[0];
  setBrowserEvent(burgerImg);
  burgerImg.addEventListener("click", function(){
    Player.burgers++;
    Player.updatePlayerMoney(Player.incomePerClick(Player.items["Flip Machine"].income), "+");
    updatePlayerCon(Player);
    updateBurgerCon(Player);
  })


  // もしItem Listのボタンが押されたら（Side Pageを表示）
  let btns = config.mainPage.querySelectorAll(".item-btn");
  btns.forEach(btn => {
    btn.addEventListener("click", function(){
      // クリックされたItemオブジェクトのデータ
      let item = Player.items[btn.querySelector(".title").innerHTML];
      let itemBox = config.mainPage.querySelector(".item-box");
      pageController(itemBox, itemBox, createSidePage(Player, item));
      setSidePageEvent(Player, item);
    })
  })

  let restartBtn = config.mainPage.querySelector('#restart');
  let saveBtn = config.mainPage.querySelector('#save');
  let helpBtn = config.mainPage.querySelector('#help');
  const closeButton = document.getElementById('close_button');
  const modal = document.getElementById('modal');
  const mask = document.getElementById('mask');
  setBrowserEvent(restartBtn);
  setBrowserEvent(saveBtn);
  setBrowserEvent(helpBtn);

  restartBtn.addEventListener("click", function(){
    let playerAns = window.confirm("Reset All Data?");
    if(playerAns) {
      window.location.reload();
    };
  })

  saveBtn.addEventListener("click", function(){
    let valid = savePlayerData(Player);
    if(valid){
      alert("Saved your data. Please put the same name when you login.");
    }
    else{
      alert("Something went wrong...");
    }
  })

  helpBtn.addEventListener("click", function(){
    modal.classList.remove('hidden');
    mask.classList.remove('hidden');
  })

  closeButton.addEventListener("click", function(){
    modal.classList.add('hidden');
    mask.classList.add('hidden');
  })

  mask.addEventListener("click", function(){
    closeButton.click();
  })
}

function setSidePageEvent(Player, item){
  let playerInput = config.mainPage.querySelectorAll(`input[name="itemAmount"]`)[0];
  let backBtn = config.mainPage.querySelectorAll('.back-btn')[0];
  let purchaseBtn = config.mainPage.querySelectorAll('.purchase-btn')[0];

  setBrowserEvent(backBtn);
  setBrowserEvent(purchaseBtn);
  backBtn.addEventListener("click", function(){
    showMainPage(Player);
  })

  playerInput.addEventListener("change", function(){
    let totalString = config.mainPage.querySelectorAll('#totalPrice')[0];
    totalString.innerHTML =
    `
    <p class="text-center pt-2">total: ¥${getTotalPrice(item.price, playerInput.value).toLocaleString()}</p>
    `
  })

  purchaseBtn.addEventListener("click", function(){
    let purchasePrice = getTotalPrice(item.price, playerInput.value);
    if(Player.money < purchasePrice){
      alert("You don't have enough money.");
    }
    else if(item.maxCount != -1 && item.count >= item.maxCount){
      alert("The maximum number of items has been reached.");
    }
    else{
      Player.updatePlayerMoney(purchasePrice, "-");
        item.updateItemTotalPrice(purchasePrice, "+");

        // 毎購入ごとに 10% 購入額が増加
        if(item.name == "ETF Stock"){
          const increment = 0.1;
          item.updateItemPrice(item.price * increment, "+");
          let itemBox = config.mainPage.querySelector(".item-box");
          pageController(itemBox, itemBox, showItemBox(Player, item));
          setSidePageEvent(Player, item);
          alert(`The price was increased by 10%. It is now ¥${item.price}`)
        }
        item.updateItemCount(playerInput.value, "+");
        updatePlayerCon(Player);
    }
  })
}

function getTotalPrice(price, count){
  return price * count;
}


// ----------------
//    Updates
// ----------------

function updatePlayerCon(Player){
  let playerMoney = config.mainPage.querySelectorAll("#player-money")[0];
  let playerAge = config.mainPage.querySelectorAll('#player-age')[0];
  let playerDays = config.mainPage.querySelectorAll('#player-days')[0];

  playerMoney.innerHTML = `¥${Math.round(Player.money).toLocaleString()}`;
  playerAge.innerHTML = `${Player.age}<small> yrs old</small>`;
  playerDays.innerHTML = `${Player.days}<small> days</small>`;
}

function updateBurgerCon(Player){
  let burger = config.mainPage.querySelectorAll("#burger")[0];
  burger.innerHTML = createBurgerCon(Player);
}



// ****************
//    Main Page
// ****************

function createMainPage(Player, item){
  let playerInfo = createPlayerCon(Player);
  let burger = createBurgerCon(Player);
  let items = showItemBox(Player, item);

  let mainPage =
  `
  <div class="row bg-darkPurple vh-100">
    <div class="bg-purple col-lg-8 col-sm-8 col-12 m-auto font-od box-shadow">
      <div class="text-orange">
        <div class="mb-md-4 m-3">
          ${playerInfo}
          <div class="row justify-content-center">
            <div class="user-select col-4 mb-3">
              ${burger}
              <div class="burger-size m-auto hover">
                <div>
                  <img class="burger-img img-fluid" src="img/cheeseBurger.png" alt="burger" />
                </div>
              </div>
            </div>
            <div class="item-box col-xl-8 col-12">
              <div class="item-list h-100">
              ${items}
              </div>
            </div>
          </div>
          </div>
          <div class="col-12 d-flex pb-2">
            <div class="col-6 pb-1">
              <button id="save" class="btn hover">
                <i class="fas fa-save fa-2x text-gray"></i>
              </button>
              <button id="restart" class="btn hover">
                <i class="fas fa-redo fa-2x text-gray"></i>
              </button>
            </div>
            <div id="mask" class="hidden">
              <div id="modal" class="text-darkPurple hidden">
                <div id="close_button">✖</div>
                <h2 class="text-center border-bottom">Clicker Empire Game</h2>
                <div class="px-3">
                  <p class="pt-3"> Suppose you are 20 years old and you work in a fast food restaurant.
                  For every hamburger you flip at the fast food restaurant, you earn ¥25. 
                  Save up your money to upgrade, invest, or buy real estate.</p>
                  <ol>
                    <li>Make money by clicking the hamburger.</li>
                    <li>In the game world, a day passes in just one second.</li>
                    <li>You can increase the amount of money you get in 1 click or 1 second by purchasing items.</li>
                    <li>If you want to save or reset your data, click the button at the lower left.</li>
                  </ol>
                  <p class="text-center">Make a giant leap from fast food restaurant to the World !!!</p>
                </div>
              </div>
            </div>
            <div class="col-6 text-right pt-1">
              <button id="help" class="text-orange btn hover font-od">
                ? How to play
              </button>
            </div>
          </div>
      </div>
    </div>
  </div>
  `

  return mainPage;
}

function createPlayerCon(Player){
  let playerMoney = Math.round(Player.money);
  
  let playerString=
  `
  <div id="player-info" class="row mb-4">
    <div class="col-lg-9 col-12">
      <h2>Total Balance:</h2>
      <p id="player-money" class="pt-2 border-btm text-right">¥${playerMoney.toLocaleString()}</p>
    </div>
    <div class="row col-lg-3 col-12 text-right">
      <p id="player-name" class="col-lg-12 col-4">Player: ${Player.name}</p>
      <p id="player-age" class="col-lg-12 col-4">${Player.age}
        <small> yrs old</small>
      </p>
      <p id="player-days" class="col-lg-12 col-4">${Player.days.toLocaleString()}
        <small> days</small>
      </p>
    </div>
  </div>
  `
  return playerString;
}

function createBurgerCon(Player){
  let burgerString =
  ` 
  <div id="burger">
    <p class="text-center">${Player.burgers.toLocaleString()}
      <small>Burgers</small>
    </p>
    <p class="text-center">[ one click ¥${Player.incomePerClick(Player.items["Flip Machine"].income)} ]</p>
  </div>
  `

  return burgerString;
}

// ----------------------------------
//  show ItemList OR Side Page
// ----------------------------------

function showItemBox(Player, item){
  let htmlString = "";

  return (item == "itemList") ? htmlString = `${createItemList(Player)}` : htmlString = `${createSidePage(Player, item)}`;
}

// Item List
function createItemList(Player){
  let itemListString = "";

  Object.keys(Player.items).forEach(key => {
    let item = Player.items[key];
    let maxString = item.maxCount;
    if(maxString == -1) maxString = "∞"

    itemListString +=
    `
    <div class="item-btn hover h-100">
      <button class="btn w-100 h-100">
        <div class="row align-items-center h-100">
          <div class="col-xl-2 col-lg-4 col-3 h-100">
            <img class="img-fluid h-100" src="img/${item.imgUrl}.png" alt="${item.name}" />
          </div>
          <div class="text-orange col-xl-8 col-lg-6 col-7 h-100">
            <div>
              <p class="title">${item.name}</p>
            </div>
            <div class="row h-50 justify-content-between">
              <p class="col-6 info">¥${item.price.toLocaleString()}</p>
              <p class="col-6 info">${item.info1}</p>
            </div>
          </div>
          <div class="text-orange col-2 text-right">
            <p>
            ${item.count}
            <small>/ ${maxString}</small>
            </p>
          </div>
        </div>
      </button>
    </div>
    `
  })

  return itemListString;
}


// *******************
//   Side Page
// *******************

function createSidePage(Player, item){
  let max = item.maxCount == -1 ? Infinity : item.maxCount;
  let maxString = item.maxCount;
  if(maxString == -1) maxString = "∞ (Infinity)"

  let sidePageString =
  `
  <div class="bg-purple">
    <div>
      <div class="itemInfo-box">
        <div class="item-description d-flex justify-content-between align-items-center">
          <div class="w-75">
            <h4>${item.name}</h4>
            <p>Max purchases: ${maxString}</p>
            <p>Price: ¥${item.price.toLocaleString()}</p>
            <p>${item.info2}</p>
          </div>
          <div class="align-items-center w-25">
            <img
              class="img-fluid pt-3"
              src="img/${item.imgUrl}.png"
            />
          </div>
        </div>
        <div>
          <label for="purchase">How many would you like to purchase?</label>
          <input
            name="itemAmount"
            type="number"
            placeholder="0"
            class="bg-gray text-dark col-12 form-control text-center"
            min="1" max="${max - item.count}"
            value="1"
          />
          <div id="totalPrice">
            <p class="text-center pt-2">total: ¥${item.price.toLocaleString()}</p>
          </div>
        </div>
        <div class="d-flex justify-content-between pb-3">
          <button class="back-btn btn bg-pink col-5 hover">
            Go Back
          </button>
          <button class="purchase-btn btn bg-pink  col-5 hover">Purchase</button>
        </div>
      </div>
    </div>
  </div>
  `

  return sidePageString;
}