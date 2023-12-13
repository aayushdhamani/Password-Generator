const inputSlider = document.querySelector("[data-lengthSlider]");
const lengthDisplay = document.querySelector("[data-lengthNum]");
const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const Copybtn = document.querySelector("[copy-btn]");
const CopyMsg = document.querySelector("[data-copyMsg]");
const UppercaseCheck = document.querySelector("#uppercase");
const LowerCaseCheck = document.querySelector("#Lowercase");
const NumbersCheck = document.querySelector("#Numbers");
const SymbolsCheck = document.querySelector("#Symbols");
const Indicator = document.querySelector("[data-indicator]");
const GeneratorBtm = document.querySelector(".Generatebutton");
const allCheckBox = document.querySelectorAll("input[type=checkbox]");
const symbols = '~!@#$%^&*()_+:"?></*-.=-{}[];.,';

let password = "";
let passwordlength = 10;
let checkCount = 0;
handleSlider();
// set strength circle is to grey as default
Setindicator("#ccc");

function handleSlider() {
  inputSlider.value = passwordlength;
  lengthDisplay.innerText = passwordlength;
  const min=inputSlider.min;
  const max=inputSlider.max;
  inputSlider.style.backgroundSize=((passwordlength-min)*100/(max-min))+"% 100%" 
}

function Setindicator(color) {
  Indicator.style.backgroundColor = color;
  Indicator.style.boxShadow=`0px 0px 12px 1px ${color}`;
}

function getrandomInt(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}

function generaterandomNumber() {
  return getrandomInt(0, 9);
}
function generateUppercase() {
  return String.fromCharCode(getrandomInt(97, 123));
}
function generateLowercase() {
  return String.fromCharCode(getrandomInt(65, 91));
}

function generateSymbols() {
  const ramdomNum = getrandomInt(0, symbols.length);
  return symbols.charAt(ramdomNum);
}

function calStrength() {
  let isUpper = false;
  let isLower = false;
  let isNumber = false;
  let isSymbol = false;

  if (UppercaseCheck.checked) isUpper = true;
  if (LowerCaseCheck.checked) isLower = true;
  if (NumbersCheck.checked) isNumber = true;
  if (SymbolsCheck.checked) isSymbol = true;

  if (isUpper && isLower && (isNumber || isSymbol) && passwordlength >= 8) {
    Setindicator("#0f0");
  } else if (
    (isUpper || isLower) &&
    (isNumber || isSymbol) &&
    passwordlength >= 6
  ) {
    Setindicator("#ff0");
  } else {
    Setindicator("#f00");
  }
}

async function copyContent(){
    try {
        await navigator.clipboard.writeText(passwordDisplay.value);
        CopyMsg.innerText="Copied"
    } catch (error) {
        CopyMsg.innerText="failed";
    }
    CopyMsg.classList.add("active");
    setTimeout(() => {
        CopyMsg.classList.remove("active");
    }, 2000);
}

function shufflepass(array){
    //fisher yates method
    for(let i=array.length-1;i>0;i--){
        const j=Math.floor(Math.random()*(i+1));
        const temp=array[i];
        array[i]=array[j];
        array[j]=temp;
    }
    let str="";
    array.forEach((el)=>(str+=el));
    return str;
}

function handlecheckBoxchange(){
     checkCount=0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked){
            checkCount++;
        }
    });

    if(passwordlength<checkCount){
        passwordlength=checkCount;
        handleSlider(); 
    }

}

allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change', handlecheckBoxchange);
})

inputSlider.addEventListener('input', (e)=>{
        passwordlength=e.target.value;
        handleSlider();
})

Copybtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

GeneratorBtm.addEventListener('click',()=>{
    if(checkCount==0) return;
    if(passwordlength<checkCount){
        passwordlength=checkCount;
        handleSlider(); 
    }

    password="";
    let funcArr=[];

    if(UppercaseCheck.checked){
        funcArr.push(generateUppercase);
    }
    if(LowerCaseCheck.checked){
        funcArr.push(generateLowercase);
    }
    if(NumbersCheck.checked){
        funcArr.push(generaterandomNumber);
    }
    if(SymbolsCheck.checked){
        funcArr.push(generateSymbols);
    }

    for(let i=0; i<funcArr.length;i++){
        password+=funcArr[i]();
    }
    for(let i=0;i<passwordlength-funcArr.length;i++){
        let randomIndex=getrandomInt(0, funcArr.length);
        password+=funcArr[randomIndex]();
    }
    password=shufflepass(Array.from(password));
    passwordDisplay.value=password;
    calStrength();
})