'use strict'
let _right = 1;
let _team;
let _settings;
let _opponents;
ParticipantHelper.init = (settings, opponents) => {
	_team = opponents.findIndex(opponent=>opponent===null);
	_settings = settings;
	_opponents = opponents;
	console.log(_settings);
	console.log(_opponents);
}
ParticipantHelper.onmessage = data => {
	if(_right){
		let max = data.length-1;
		let mid = max/2;
		let teamForward;
		let teamLeft;
		let teamRight;
		switch(_team){
			case 0:
				teamForward = 1;
				teamLeft = 2;
				teamRight = 3;
				break;
			case 1:
				teamForward = 0;
				teamLeft = 3;
				teamRight = 2;
				break;
			case 2:
				teamForward = 3;
				teamLeft = 1;
				teamRight = 0;
				break;
			case 3:
				teamForward = 2;
				teamLeft = 0;
				teamRight = 1;
				break;
		}
		let teamCorrect = _team === data[mid][0].occupiedBy.team;
		let teamForwardCorrect = teamForward === data[mid][max].occupiedBy.team;
		let teamLeftCorrect = true;
		let teamRightCorrect = true;
		if(2 < _opponents.length){
			teamLeftCorrect = teamLeft === data[0][mid].occupiedBy.team;
			teamRightCorrect = teamRight === data[max][mid].occupiedBy.team;
		}
		if(!teamCorrect || !teamForwardCorrect || !teamLeftCorrect || !teamRightCorrect){
			console.log('team('+_team+'): '+teamCorrect+'\n'+
			'teamForward: '+teamForward+', '+teamForwardCorrect+'\n'+
			'teamLeft: '+teamLeft + ', ' +teamLeftCorrect+'\n'+
			'teamRight: '+teamRight + ', ' +teamRightCorrect);
			debugger;
		}
	}
	ParticipantHelper.respond(_right);
	_right = 0;
}
