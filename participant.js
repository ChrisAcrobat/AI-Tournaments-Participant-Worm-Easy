'use strict'
let _right = 1;
let _team;
let _settings;
let _opponents;
let _pos;
let _tick = 0;
let _responses = {
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
let _target = null;
ParticipantHelper.init = (settings, opponents) => {
	_team = opponents.findIndex(opponent=>opponent===null);
	_settings = settings;
	_opponents = opponents;
}
function isSpaceOpen(data, x, y){
	let column = data[x];
	if(column === undefined){
		return false;
	}else{
		let space = column[y];
		return space !== undefined && space.occupiedBy === null;
	}
}
ParticipantHelper.onmessage = data => {
	if(_tick === 0){
		let max = data.length-1;
		let mid = max/2;
		_pos = [mid, 0];
	}
	let possibleResponses = [];
	switch(_directions.current){
		case _directions.UP:
			if(isSpaceOpen(data, _pos[0], _pos[1]+1)){
				possibleResponses.push(_responses.FORWARD);
			}
			if(isSpaceOpen(data, _pos[0]-1, _pos[1])){
				possibleResponses.push(_responses.LEFT);
			}
			if(isSpaceOpen(data, _pos[0]+1, _pos[1])){
				possibleResponses.push(_responses.RIGHT);
			}
			break;
		case _directions.DOWN:
			if(isSpaceOpen(data, _pos[0], _pos[1]-1)){
				possibleResponses.push(_responses.FORWARD);
			}
			if(isSpaceOpen(data, _pos[0]+1, _pos[1])){
				possibleResponses.push(_responses.LEFT);
			}
			if(isSpaceOpen(data, _pos[0]-1, _pos[1])){
				possibleResponses.push(_responses.RIGHT);
			}
			break;
		case _directions.LEFT:
			if(isSpaceOpen(data, _pos[0]-1, _pos[1])){
				possibleResponses.push(_responses.FORWARD);
			}
			if(isSpaceOpen(data, _pos[0], _pos[1]-1)){
				possibleResponses.push(_responses.LEFT);
			}
			if(isSpaceOpen(data, _pos[0], _pos[1]+1)){
				possibleResponses.push(_responses.RIGHT);
			}
			break;
		case _directions.RIGHT:
			if(isSpaceOpen(data, _pos[0]+1, _pos[1])){
				possibleResponses.push(_responses.FORWARD);
			}
			if(isSpaceOpen(data, _pos[0], _pos[1]+1)){
				possibleResponses.push(_responses.LEFT);
			}
			if(isSpaceOpen(data, _pos[0], _pos[1]-1)){
				possibleResponses.push(_responses.RIGHT);
			}
			break;
	}
	if(!_target || !data[_target.pos_x][_target.pos_y].eatables.apple){
		let eatables = [];
		data.forEach((column, x) => {
			column.forEach((space, y) => {
				if(space.eatables.apple || 0 < space.eatables.other){
					let e = {distance: Math.abs(_pos[0]-x)+Math.abs(_pos[1]-y), eatables: space.eatables.other, pos_x: x, pos_y: y};
					if(space.eatables.apple){
						e.eatables++;
					}
					eatables.push(e);
				}
			});
		});
		_target = eatables[Math.floor(Math.random()*eatables.length)];
	}
	let response = _responses.FORWARD;
	if(_target){
		let dx = _target.pos_x-_pos[0];
		let dy = _target.pos_y-_pos[1];
		if(dx !== 0 && Math.abs(dy) < Math.abs(dx)){
			if(0 < dx){
				switch(_directions.current){
					case _directions.UP:
						response = _responses.RIGHT;
						break;
					case _directions.DOWN:
						response = _responses.LEFT;
						break;
					case _directions.LEFT:
						response = Math.round(Math.random()) === 0 ? _responses.LEFT : _responses.RIGHT;
						break;
					default:
						break;
				}
			}else{
				switch(_directions.current){
					case _directions.UP:
						response = _responses.LEFT;
						break;
					case _directions.DOWN:
						response = _responses.RIGHT;
						break;
					case _directions.RIGHT:
						response = Math.round(Math.random()) === 0 ? _responses.LEFT : _responses.RIGHT;
						break;
					default:
						break;
				}
			}
		}else{
			if(0 < dy){
				switch(_directions.current){
					case _directions.DOWN:
						response = Math.round(Math.random()) === 0 ? _responses.LEFT : _responses.RIGHT;
						break;
					case _directions.LEFT:
						response = _responses.RIGHT;
						break;
					case _directions.RIGHT:
						response = _responses.LEFT;
						break;
					default:
						break;
				}
			}else{
				switch(_directions.current){
					case _directions.UP:
						response = Math.round(Math.random()) === 0 ? _responses.LEFT : _responses.RIGHT;
						break;
					case _directions.LEFT:
						response = _responses.LEFT;
						break;
					case _directions.RIGHT:
						response = _responses.RIGHT;
						break;
					default:
						break;
				}
			}
		}
	}
	if(!possibleResponses.includes(response) && 0 < possibleResponses.length){
		response = possibleResponses[Math.floor(Math.random()*possibleResponses.length)];
	}
	ParticipantHelper.respond(response);
	switch(response){
		case _responses.LEFT:
			switch(_directions.current){
				case _directions.UP: _directions.current = _directions.LEFT; break;
				case _directions.DOWN: _directions.current = _directions.RIGHT; break;
				case _directions.LEFT: _directions.current = _directions.DOWN; break;
				case _directions.RIGHT: _directions.current = _directions.UP; break;
			}
			break;
		case _responses.RIGHT:
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
