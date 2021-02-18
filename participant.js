'use strict'
let _right = 1;
let _team;
let _settings;
let _opponents;
let _pos;
let _tick = 0;
let _response = {
	current: null,
	FORWARD: 0,
	LEFT: -1,
	RIGHT: 1,
}
let _directions = {
	current: 'UP',
	UP: 'UP',
	DOWN: 'DOWN',
	LEFT: 'LEFT',
	RIGHT: 'RIGHT'
};
ParticipantHelper.init = (settings, opponents) => {
	_team = opponents.findIndex(opponent=>opponent===null);
	_settings = settings;
	_opponents = opponents;
}
ParticipantHelper.onmessage = data => {
	if(_tick === 0){
		let max = data.length-1;
		let mid = max/2;
		_pos = [mid, 0];
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
			console.error('team('+_team+'): '+teamCorrect+'\n'+
			'teamForward: '+teamForward+', '+teamForwardCorrect+'\n'+
			'teamLeft: '+teamLeft + ', ' +teamLeftCorrect+'\n'+
			'teamRight: '+teamRight + ', ' +teamRightCorrect);
			debugger;
		}
	}
	let eatables = [];
	data.forEach((column, x) => {
		column.forEach((space, y) => {
			if(space.eatables.apple || 0 < space.eatables.other){
				let e = {distance: Math.abs(_pos[0]-x)+Math.abs(_pos[1]-y), eatables: space.eatables.other, pos: [x,y]};
				if(space.eatables.apple){
					e.eatables++;
				}
				eatables.push(e);
			}
		});
	});
	console.log(eatables);
	console.log('// TODO: Find best pos and avoid wall/occupiedBy.');
	_response.current = _response.FORWARD;
	ParticipantHelper.respond(_response.current);
	switch(_response.current){
		case -1:
			switch(_directions.current){
				case _directions.UP: _directions.current = _directions.LEFT; break;
				case _directions.DOWN: _directions.current = _directions.RIGHT; break;
				case _directions.LEFT: _directions.current = _directions.DOWN; break;
				case _directions.RIGHT: _directions.current = _directions.UP; break;
			}
			break;
		case 1:
			switch(_directions.current){
				case _directions.UP: _directions.current = _directions.RIGHT; break;
				case _directions.DOWN: _directions.current = _directions.LEFT; break;
				case _directions.LEFT: _directions.current = _directions.UP; break;
				case _directions.RIGHT: _directions.current = _directions.DOWN; break;
			}
			break;
	}
	switch(_directions.current){
		case _directions.UP: _pos[1]++; break;
		case _directions.DOWN: _pos[1]--; break;
		case _directions.LEFT: _pos[0]--; break;
		case _directions.RIGHT: _pos[0]++; break;
	}
	_tick++;
}
