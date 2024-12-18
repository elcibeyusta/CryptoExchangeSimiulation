//State = { Page: 0, 
//          active: 1
//          usersList:   [
//                        { name: "Hakan", wallet: [{coin: "Bitcoin", amount: 0.7}, {coin: "Ada", amount: 12.6}, {coin: "Etherium", amount: 35.0}] , cash: 364.82, day: 37 } , 
//                        { name: "Arda",  wallet: [{coin: "Bitcoin", amount: 5.3}, {coin: "Ada", amount: 10.8}, {coin: "Etherium", amount: 2.4 }] , cash: 14.67 , day: 122} , 
//                       ]
//         }

let timer = null
let states = {}

 let storedData = localStorage.getItem("states")
 states = storedData ? JSON.parse( storedData ) : { page: 0, active: null, usersList: []}
renderPage();


function update(){
    localStorage.setItem("states", JSON.stringify(states))
    renderPage();
    
}


function renderPage() {
    if(states.page === 0)
      renderIntroPage();
    else
      renderMainPage();
}

function renderIntroPage() {
    let out = `<div id="header"><div><span>CTIS</span> Crypto Trading Information System </div></div>
                <div id="overlay"></div> <div id="container">`
    if( states.usersList.length === 0){
        out += "<span>Empty</span>"
        
    }
    else{
        for(let i=0;i<states.usersList.length;i++)
            out += `<div class="user">  <i class="fa-solid fa-user fa-2xl"></i> 
                    <i class="fa-solid fa-circle-xmark" style="color: #74C0FC;"></i>
                    <p>${states.usersList[i].name}</p>
                    <div class="overlay2"></div>
                    </div>`
    }

    out += ` </div>
            <div class= "footer">
                <div class= "btnNewProfile">
                    <span>+</span> New Profile
                </div>
            </div>`
    
    

    out+=`
        <div class="addWindow">
            <p>New Profile</p>
            <input type="text" id="userName">
            <div class="addButton"> Add </div>
        </div>
        
        `
        $("#root").html(out)
        $("#root").css("display", "flex")
}

function renderMainPage(){
    //Header>>>>
    let out = `<div id="header"><div><span>CTIS</span> Crypto Trading Information System </div>
                    <div> 
                        <div>
                            <i class="fa-solid fa-user fa-lg"></i></i>${states.usersList[states.active].name}
                        </div>
                        <div>
                            <i class="fa-solid fa-door-open fa-lg"></i> Logout
                        </div>


                    </div>
    
    
                </div>`
               
                $("#root").css("display", "block")            
    out += renderDayInfo();

    // out += renderTable();

    // out += renderBalance();

    // out += `<div id="mainBot">
    //             <div id="left">
    //                 ${renderTrading()}
    //             </div>
    //             <div id="right">
    //                 ${renderWallet()}
    //             </div>
    //         </div>`


    $("#root").html(out);
}



function renderDayInfo(){
    let dateArr = market[states.usersList[states.active].day - 1].date.split("-");
    console.log()
    let out=`<p id="dayP"> Day ${states.usersList[states.active].day}</p>
             <p id="dateP"> ${dateArr[0]} ${months[parseInt(dateArr[1]) - 1]} ${dateArr[2]}  </p>
             `

    out += `<div id="BtnContainer">
                <div>
                    <i class="fa-solid fa-forward fa-lg"></i>Next Day
                    <div class="overlay2"></div>
                </div>
                <div>`
    if(timer===null)
        out += `<i class="fa-solid fa-play fa-lg"></i>Play
        <div class="overlay2"></div>`
    else
        out += `<i class="fa-solid fa-pause fa-lg"></i>Pause
        <div class="overlay2"></div>`

               out+= `</div>
            </div>
            `
    return out;
}





//Event Handlers ----------------------------------------------------------------------

$("#root").on("click", ".btnNewProfile", function(e){
    // alert("clicked")
    $("#overlay").css("display", "inline")
    $("#root .addWindow").css("display", "inline").css("opacity", 1)
})

$("#root").on("click", "#overlay", function() {
    $(".addWindow").css("display", "none");
    $(this).css("display", "none");
});

$("#root").on("click",".addButton", function(){
    let userObj = {};
    if($("#userName").val() !== ""){
        userObj = {name: $("#userName").val(), wallet: [], cash: 1000.0, day: 2};
        states.usersList.push(userObj);
        update();}
})


$("#root").on("click", "i:nth-of-type(2)", function(e){
    e.stopPropagation()
    let idx = $(this).parent().index()
    states.usersList.splice(idx, 1)
    update();
})

$("#root").on("click", ".user", function(e){
    e.stopPropagation()
    let idx = $(this).index()
    states.active = idx;
    states.page = 1;
    update();
})



//Event Handlers for the Main page
$("#root").on("click", "#header>div:nth-of-type(2)>div:nth-of-type(2)", function(){
    states.page = 0;
    states.active = null;
    update();
})

// NextDay button
$("#root").on("click", "#BtnContainer>div:first-of-type", function(e){
    e.stopPropagation()
    states.usersList[states.active].day++;
    update()
    // let s = $("#dayP").text()
    // s++;
    // $("#dayP").text(s);
})

function increamentDay(){
    states.usersList[states.active].day++;
    update();
}

$("#root").on("click", "#BtnContainer>div:nth-of-type(2)", function(e){
    e.stopPropagation()
    if(timer===null){
        timer = setInterval(increamentDay, 100);
        $("#BtnContainer>div:nth-of-type(2)").html(`<i class="fa-solid fa-pause fa-lg"></i>Pause
            <div class="overlay2"></div>`)
    }
    else{
        clearInterval(timer);
        timer=null;
        $("#BtnContainer>div:nth-of-type(2)").html(`<i class="fa-solid fa-play fa-lg"></i>Play
                    <div class="overlay2"></div>`)
        
    }
    //update()
})