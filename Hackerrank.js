const puppeteer = require("puppeteer");


let {email,password} = require('./secret.js')
let cTab;
let { answer } = require('./codes'); 

let browserOpenPromise = puppeteer.launch({
    headless: false,
    defaultViewport:null,
    args: ["--start-maximized"]
});
browserOpenPromise//fulfill
    .then(function(browser){
    console.log("browser is open");
    //an array of all open pages inside the browser
    //returns an array with all the pages in all browser contexts
    let allTabsPromise = browser.pages();
    return allTabsPromise;
    })
    .then(function(allTabsArr){
        cTab = allTabsArr[0];
        console.log("new tab");
        //url to navigate page to
        //By default, the maximum navigation timeout is 30 seconds in puppeteer
        let visitingLoginPagePromise = cTab.goto("https://www.hackerrank.com/auth/login",{timeout: 0});
        return visitingLoginPagePromise;
    })
    .then(function (){
        console.log("opened hackerrank login page");
        let emailTypePromise = cTab.type("#input-1",email);
        return emailTypePromise;
    })
    .then(function (){
        console.log("email is typed");
        let passwordTypePromise = cTab.type("#input-2",password);
        return passwordTypePromise;
    })
    .then(function(){
        console.log("password is typed");
        let willBeLoggedInPromise = cTab.click(".ui-btn.ui-btn-large.ui-btn-primary.auth-button.ui-btn-styled");
        return willBeLoggedInPromise;
    })
    .then(function(){
        console.log("Logged in successfully")
        //wait for the selector to load,and then click on the node
        let algorithmTabWillOpenPromise = waitAndClick("div[data-automation='algorithms']");
        return algorithmTabWillOpenPromise;
    })
    .then(function (){
        console.log("Algorithm page is opened");
        return;
    })
    .then(function () {
        function getAllQuesLinks() {
          let allElemArr = document.querySelectorAll(
            'a[data-analytics="ChallengeListChallengeName"]'
          );
          let linksArr = [];
          for (let i = 0; i < allElemArr.length; i++) {
            linksArr.push(allElemArr[i].getAttribute("href"));
          }
          return linksArr;
        }
        let linksArrPromise = cTab.evaluate(getAllQuesLinks);
        return linksArrPromise;
      })
      .then(function (linksArr) {
        console.log("links to all ques received");
        // console.log(linksArr);
        //question solve krna h
                                  //link to the question to besolved, idx of the linksArr
        let questionWillBeSolvedPromise = questionSolver(linksArr[0], 0);
        // for (let i = 1; i < linksArr.length; i++){
        //   questionWillBeSolvedPromise = questionWillBeSolvedPromise.then(function () {
        //     return questionSolver(linksArr[i], i);
        //   })
        //   // a = 10;
        //   // a = a + 1;
        // }
        return questionWillBeSolvedPromise;
      })
    .then(function () {
        console.log("question is solved");
      })
    .catch(function (err){
        console.log(err);
    })





    function waitAndClick(algoBtn){
        let waitClickPromise = new Promise(function (resolve,reject){
            let waitForSelectorPromise = cTab.waitForSelector(algoBtn);
            waitForSelectorPromise
             .then(function(){
                console.log("algo btn is found")
                let clickPromise = cTab.click(algoBtn);
                return clickPromise;
             })
             .then(function(){
                console.log("algo btn is clicked");
                resolve();
             })
             .catch(function(err){
                console.log(err);
             })
        })
        return waitClickPromise;
    }


    function questionSolver(url, idx) {
        return new Promise(function (resolve, reject) {
          let fullLink = `https://www.hackerrank.com${url}`;
          let goToQuesPagePromise = cTab.goto(fullLink);
          goToQuesPagePromise
            .then(function () {
              console.log("question opened");
              //tick the custom input box mark
              let waitForCheckBoxAndClickPromise = waitAndClick(".checkbox-input");
              return waitForCheckBoxAndClickPromise;
            })
            .then(function () {
              //select the box where code will be typed
              let waitForTextBoxPromise = cTab.waitForSelector(".custominput");
              return waitForTextBoxPromise;
            })
            .then(function () {
              let codeWillBeTypedPromise = cTab.type(".custominput", answer[idx], {
                delay: 100,
              });
              return codeWillBeTypedPromise;
            })
            .then(function () {
              //control key is pressed promise
              let controlPressedPromise = cTab.keyboard.down("Control");
              return controlPressedPromise;
            })
            .then(function () {
              let aKeyPressedPromise = cTab.keyboard.press("a");
              return aKeyPressedPromise;
            })
            .then(function () {
              let xKeyPressedPromise = cTab.keyboard.press("x");
              return xKeyPressedPromise;
            })
            .then(function () {
              let ctrlIsReleasedPromise = cTab.keyboard.up("Control");
              return ctrlIsReleasedPromise;
            })
            .then(function () {
              //select the editor promise
              let cursorOnEditorPromise = cTab.click(
                ".monaco-editor.no-user-select.vs"
              );
              return cursorOnEditorPromise;
            })
            .then(function () {
              //control key is pressed promise
              let controlPressedPromise = cTab.keyboard.down("Control");
              return controlPressedPromise;
            })
            .then(function () {
              let aKeyPressedPromise = cTab.keyboard.press("A");
              return aKeyPressedPromise;
            })
            .then(function () {
              let vKeyPressedPromise = cTab.keyboard.press("V");
              return vKeyPressedPromise;
            })
            .then(function () {
              let controlDownPromise = cTab.keyboard.up("Control");
              return controlDownPromise;
            })
            .then(function () {
              let submitButtonClickedPromise = cTab.click(".hr-monaco-submit");
              return submitButtonClickedPromise;
            })
            .then(function () {
              console.log("code submitted successfully");
              resolve();
            })
            .catch(function (err) {
              reject(err);
            });
        });
      }
