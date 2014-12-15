;
(function(){
    patternLock = function() {
        var passwordContain = document.querySelector('.patternContain');
        var setOrEnterText = document.querySelector('.title .setOrEnter');
        var buttons = [];
        var userInput = "";
        var wrongRem = false;
        var timeoutSetter = null;

        var toConfirmPass = "";
        var passConfirmed = false;

        var lastHitButton = null;

        document.querySelector('.forgetting').onclick = shiftAway;

        //这里换成你的函数
        var isPassSet = isPasswordSet();


        function generate() {
            if(!isPassSet){
                setOrEnterText.innerHTML = "设置";
                document.querySelector('.forgetting').style.display = "none";
            }
            for(var i = 0; i < 9; i++){
                var element = document.createElement('div');
                element.className = 'patternLockButton';
                element.innerHTML = '<div class="lockCore"></div>';
                element.coX = i % 3;
                element.coY = Math.floor(i / 3);
                element.inputCode = i+1;
                element.isHit = false;
                buttons.push(element);
                passwordContain.appendChild(element);
            }
        }

        // helper function to find the absolute position of an element
        function findPos(obj) {
            var curleft = curtop = 0;
            if (obj.offsetParent) {
                do {
                    curleft += obj.offsetLeft;
                    curtop += obj.offsetTop;
                } while (obj = obj.offsetParent);
            }
            return {left: curleft,top: curtop};
        }


        function passwordReset(isconfirm){

            if(!isPassSet){
                setOrEnterText.innerHTML = "设置";
            } else{
                setOrEnterText.innerHTML = "输入";
            }
            if(isconfirm){
                var info = document.querySelector(".currentPassword");
                if(toConfirmPass != ""){    
                    info.innerHTML = "请确认密码";
                } else{
                    info.innerHTML = "您输的密码不一样,请重试";
                }
                userInput = "";
                wrongRem = true;
            } else{
                var info = document.querySelector(".currentPassword");
                info.innerHTML = "对不起，密码不正确";
                for(var i = 0; i < buttons.length; i++){
                    buttons[i].className = 'patternLockButton wrong';
                }
                var lines = document.querySelectorAll('.markLine');
                for(var i = 0; i < lines.length; i++){
                    lines[i].className += " wrongLine";
                }
                userInput = "";
                wrongRem = true;
                
            }
            timeoutSetter = setTimeout(function() {
                wrongReset();
            }, 1500);
        }

        function wrongReset(){
            if(wrongRem){
                var info = document.querySelector(".currentPassword");
                info.innerHTML = "<br />";
                wrongRem = false;
                for(var i = 0; i < buttons.length; i++){
                    buttons[i].className = 'patternLockButton';
                    buttons[i].isHit = false;
                }
                lastHitButton = null;
                var lines = document.querySelectorAll('.markLine');
                for(var i = 0; i < lines.length; i++){
                    lines[i].parentNode.removeChild(lines[i]);
                }
                //isPassSet = isPasswordSet();
            }
        }

        function checkButtonHit(e, allowance) {
            var touch = e.touches[0];
            passwordContain.pos = findPos(passwordContain);
            var cox = touch.pageX - passwordContain.pos.left;
            var coy = touch.pageY - passwordContain.pos.top;

            var gridsize = parseInt(findPos(buttons[1]).left) - parseInt(findPos(buttons[0]).left);
            var fractionx = (cox/gridsize - Math.floor(cox/gridsize) - 0.5)*2;
            var fractiony = 2*(coy/gridsize - Math.floor(coy/gridsize) - 0.5);
            var accuracy = Math.sqrt(Math.pow(fractionx, 2) + Math.pow(fractiony, 2));
            var buttonOver = buttons[Math.floor(cox/gridsize) + Math.floor(coy/gridsize) * 3];
            if(buttonOver){
                if(!buttonOver.isHit && accuracy <= allowance){
                    checkStrikeThru(buttonOver);
                    hitButton(buttonOver);
                }
            }
        }

        function hitButton(button){
            if(!button.isHit){
                button.className += " selected";
                userInput += button.inputCode;
                button.isHit = true;
                if(lastHitButton){
                    passwordContain.appendChild(drawLine(lastHitButton, button));
                }
                lastHitButton = button;
            }
        }

        function drawLine(startButton, finishButton){
            var coreDist = 2.5;
            var startX = startButton.coX * 5.05 + coreDist;
            var startY = startButton.coY * 5.05 + coreDist;

            var finishX = finishButton.coX * 5.05 + coreDist;
            var finishY = finishButton.coY * 5.05 + coreDist;

            return drawLineHelp(startX,startY,finishX,finishY);
        }

       

        function drawLineHelp(x1, y1, x2, y2){

            if(y1 < y2){
                var pom = y1;
                y1 = y2;
                y2 = pom;
                pom = x1;
                x1 = x2;
                x2 = pom;
            }

            var a = Math.abs(x1-x2);
            var b = Math.abs(y1-y2);
            var c;
            var sx = (x1+x2)/2 ;
            var sy = (y1+y2)/2 ;
            var width = Math.sqrt(a*a + b*b ) ;
            var x = sx - width/2;
            var y = sy;

            a = width / 2;

            c = Math.abs(sx-x);

            b = Math.sqrt(Math.abs(x1-x)*Math.abs(x1-x)+Math.abs(y1-y)*Math.abs(y1-y) );

            var cosb = (b*b - a*a - c*c) / (2*a*c);
            var rad = Math.acos(cosb);
            var deg = (rad*180)/Math.PI

            htmlns = "http://www.w3.org/1999/xhtml";
            div = document.createElementNS(htmlns, "div");
            div.className = "markLine";
            div.setAttribute('style','width:'+width+'rem;height:0px;-moz-transform:rotate('+deg+'deg);-webkit-transform:rotate('+deg+'deg);position:absolute;top:'+y+'rem;left:'+x+'rem;');   

            return div;
        }

        function checkStrikeThru(thisButton) {
            if(!lastHitButton){
                return;
            }

            strikeY = Math.abs(thisButton.coY - lastHitButton.coY) > 1;
            strikeX = Math.abs(thisButton.coX - lastHitButton.coX) > 1;

            if(strikeX && strikeY){
                hitButton(buttons[4]);
            } else if(strikeX && lastHitButton.coY == thisButton.coY){
                hitButton(buttons[thisButton.coY * 3 + 1]);
            } else if(strikeY && lastHitButton.coX == thisButton.coX){
                hitButton(buttons[thisButton.coX + 3]);
            }
        }

        function startInput(e){
            userInput = "";
            checkButtonHit(e, 0.8);
        }

        passwordContain.addEventListener("touchstart", function(e) {
            e.preventDefault();
            wrongReset();
            window.clearTimeout(timeoutSetter);
            startInput(e);
        });

        passwordContain.addEventListener("touchmove", function(e) {
            e.preventDefault();
            checkButtonHit(e, 0.7);
        });

        //联调函数在这,叫passwordEval
        passwordContain.addEventListener("touchend", function(e){
            console.log(userInput);
            if(!isPassSet){
                //passConfirmed, toConfirmPass
                //first try sets toConfirmPass to nonzero string
                //second try is triggered by nonzero toConfirmPass,
                //checks if toConfirmPass == userInput
                //If true, send thru
                //if false, toConfirmPass = "", create a new reset state saying passwords do
                //not match.
                if(toConfirmPass != ""){
                    passConfirmed = (toConfirmPass == userInput);
                    if(passConfirmed){
                        console.log("passwordConfirmed: " + toConfirmPass);
                        setPass(userInput);
                        passwordReset(true);
                    } else{
                        console.log("password not matching");
                        toConfirmPass = "";
                        passwordReset(true);
                    }
                } else{
                    toConfirmPass = userInput;
                    console.log("password Logged: " + toConfirmPass);
                    passwordReset(true);
                }
            } else if(!passwordEval(userInput)){
                passwordReset(false);
            }
        });

        //判断函数；把这删了，用你的函数代替
        function passwordEval(input){
            return false;
        }
        function isPasswordSet(){
            return true;
        }
        function setPass(){

        }
        function shiftAway(e){
            e.preventDefault();
            window.location.replace("passwordForget.html");        
        }

        generate();
    }
    document.addEventListener("DOMContentLoaded", function() {
        this.patternLock = patternLock();
    });

})();