;
(function(){
	function passwordForget(){

		var isQuestionSet = isSet();
		var choices = [
		'您的主管叫什么？',
		'您的第一只宠物叫什么？',
		'请报一下您的三维。',
		'第一次后有什么感受？'
		];

		var container = document.querySelector('.contentContain');
		generate();

		document.querySelector('form').onsubmit = function( e ){
			e.preventDefault();
		};

		var submit = document.querySelector('.submitButton');
		if(isQuestionSet){
			var question = getQuestion();
			document.querySelector('.titleContent').innerHTML = "回答安全问题";
			fillQuestion(question);
		}

		submit.onclick = submitAnswer;

		function submitAnswer () {
			var ansValue = document.querySelector('.answer input').value;
			if(!isQuestionSet){
				var questValue = document.querySelector('.question').value;
				if(ansValue == ""){
					resetPage("没有输答案");
				} else{
					submitQuestion(questValue, ansValue);
				}
			}else if(!evalAnswer(ansValue)){
				resetPage("答案错误");
			} else{
				console.log('password correct');
			}
		}

		function resetPage( message ){
			document.querySelector('.answer input').value = "";
			document.querySelector('.title .status').innerHTML = message + "，请重试";
		}

		function generate(){
			if(!isQuestionSet){
				container.innerHTML = 
				'<div class="fixed">问题: <select class="question"/></select>'+
				'<div class="answer">回答: <input type="text" placeholder="answer" /></div>'
				;

				populateChoices(document.querySelector('.fixed select'));

			} else{
				container.innerHTML = 
				'<div class="fixed">问题: '+
					'<div class="question">'+
					'</div>'+
				'</div>'+
				'<div class="answer">答案:'+
					'<div><input type="text" placeholder="answer"/></div>'+
				'</div>';
			}

			container.innerHTML += 
			'<div class="submitContain">'+
				'<input type="submit" value="提交" class="submitButton"/>'+
			'</div>';
		}

		function populateChoices( select ){
			for(var i = 0; i < choices.length; i++){
				var element = document.createElement('option');
				element.value = choices[i];
				element.innerHTML = choices[i];
				select.appendChild(element);
			}
		}

		function fillQuestion( question ){
			var questionContain = document.querySelector('form .question');
			questionContain.innerHTML = question;
		}


		//临时函数，用自己的函数代替
		function isSet(){
			return true;
		}
		function getQuestion() {
			return '您主管名字是什么？';
		}
		function submitQuestion(quest, ans){
			console.log(quest + " " + ans);
		}
		function evalAnswer ( ans ) {
			return (ans == "正确");
		}
	}

    document.addEventListener("DOMContentLoaded", function() {
        this.passwordForget = passwordForget();
    });

})();