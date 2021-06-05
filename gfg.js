const puppeteer = require("puppeteer");
const fs = require("fs");
let company = process.argv.slice(2);

let zeroth = company[0];

(async function () {
    let browser = await puppeteer.launch({ headless: false, defaultViewport: null, args: ["--start-maximized"], slowMo : 100,});
    let pages = await browser.pages();
    let tab = pages[0];
    //HOMEPAGE
    await tab.goto("https://www.geeksforgeeks.org/");

    
    await tab.waitForSelector("#hslider li");
    let buttons = await tab.$$("#hslider li");
   //INTERVIEW PREPARATION PAGE
    await buttons[2].click();
    
    await tab.waitForSelector(".header-main__list-item");


    buttons = await tab.$$(".header-main__list-item");
    await buttons[0].click();

    let url = `https://practice.geeksforgeeks.org/explore/?company%5B%5D=${zeroth}&problemType=functional&page=1&sortBy=submissions&company%5B%5D=${zeroth}`
    await tab.goto(url);

    await tab.waitForSelector(".panel.problem-block a");
    let panel = await tab.$$(".panel.problem-block a");

  
    let ques = await tab.$$(".panel.problem-block span");
    let ques_name = [];
    for(i = 0; i < ques.length; i++){
        let name =  await tab.evaluate(function (elem) { return elem.innerText }, ques[i]);
        ques_name.push(name);
    }
    let finalData = {}
    let idx = 0;

   //QUESTION NAME
    for (i = 0; i < panel.length; i++) {
        let text = await tab.evaluate(function (elem) { return elem.innerText }, panel[i]);
        if (text == "") {
            let href = await tab.evaluate(function (elem) { return elem.getAttribute("href"); }, panel[i]);
            finalData[ques_name[idx]] = href;
            idx+=2;
          }
        }
       //CREATING JSON FILE
        fs.writeFileSync(`${company}-ques.json`, JSON.stringify(finalData));
        browser.close();
    })();