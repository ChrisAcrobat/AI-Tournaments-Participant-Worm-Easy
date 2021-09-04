'use strict'
let _right = 1;
let _team;
let _settings;
let _opponents;
let _pos;
let _tick = 0;
let _responses = {
	FORWARD: 'y+',
	BACKWARDS: 'y-',
	UP: 'z+',
	DOWN: 'z-',
	LEFT: 'x-',
	RIGHT: 'x+'
}
let _currentDirection = _responses.FORWARD;
let _target = null;
ParticipantHelper.init = (settings, opponents) => {
	_team = opponents.findIndex(opponent=>opponent===null);
	_settings = settings;
	_opponents = opponents;
}
function isSpaceOpen(data, x, y, z){
	let layer = data[z];
	if(layer){
		let column = layer[x];
		if(column){
			let space = column[y];
			if(space){
				return space.occupiedBy === null;
			}
		}
	}
	return false;
}
ParticipantHelper.onmessage = message => {
//	ParticipantHelper.onmessage = message => {
//		message.respond(0);
//	}
//	message.respond(1);
//	return;
	// TEMP ^^^^
	let data = message.data;
	if(_tick === 0){
		let max = data[0].length-1;
		let mid = max/2;
		let mid_z = (data.length-1)/2;
		_pos = {
			x: mid,
			y: 0,
			z: mid_z
		};
	}
	let possibleResponses = [];
	if(_currentDirection !== _responses.BACKWARDS && isSpaceOpen(data, _pos.x, _pos.y+1, _pos.z)){
		possibleResponses.push(_responses.FORWARD);
	}
	if(_currentDirection !== _responses.FORWARD && isSpaceOpen(data, _pos.x, _pos.y-1, _pos.z)){
		possibleResponses.push(_responses.BACKWARDS);
	}
	if(_currentDirection !== _responses.LEFT && isSpaceOpen(data, _pos.x+1, _pos.y, _pos.z)){
		possibleResponses.push(_responses.RIGHT);
	}
	if(_currentDirection !== _responses.RIGHT && isSpaceOpen(data, _pos.x-1, _pos.y, _pos.z)){
		possibleResponses.push(_responses.LEFT);
	}
	if(_currentDirection !== _responses.DOWN && isSpaceOpen(data, _pos.x, _pos.y, _pos.z+1)){
		possibleResponses.push(_responses.UP);
	}
	if(_currentDirection !== _responses.UP && isSpaceOpen(data, _pos.x, _pos.y, _pos.z-1)){
		possibleResponses.push(_responses.DOWN);
	}
	if(!_target || !data[_target.pos_z][_target.pos_x][_target.pos_y].eatables.apple){
		let eatables = [];
		data.forEach((height, z) => {
			height.forEach((column, x) => {
				column.forEach((space, y) => {
					if(space.eatables.apple || 0 < space.eatables.other){
						let e = {distance: Math.abs(_pos.x-x)+Math.abs(_pos.y-y)+Math.abs(_pos.z-z), eatables: space.eatables.other, pos_z: z, pos_x: x, pos_y: y};
						if(space.eatables.apple){
							e.eatables++;
						}
						eatables.push(e);
					}
				});
			});
		});
		_target = eatables[Math.floor(Math.random()*eatables.length)];
	}
	if(_target){
		let dx = _target.pos_x-_pos.x;
		let dy = _target.pos_y-_pos.y;
		let dz = _target.pos_z-_pos.z;
		if(_team===0){debugger}
		if(dx !== 0 && Math.abs(dy) < Math.abs(dx)){
			if(0 < dx){
				switch(_currentDirection){
					case _responses.FORWARD:
						_currentDirection = _responses.RIGHT;
						break;
					case _responses.BACKWARDS:
						_currentDirection = _responses.LEFT;
						break;
					case _responses.LEFT:
						_currentDirection = Math.round(Math.random()) === 0 ? _responses.LEFT : _responses.RIGHT;
						break;
					default:
						break;
				}
			}else{
				switch(_currentDirection){
					case _responses.FORWARD:
						_currentDirection = _responses.LEFT;
						break;
					case _responses.BACKWARDS:
						_currentDirection = _responses.RIGHT;
						break;
					case _responses.RIGHT:
						_currentDirection = Math.round(Math.random()) === 0 ? _responses.LEFT : _responses.RIGHT;
						break;
					default:
						break;
				}
			}
		}else{
			if(0 < dy){
				switch(_currentDirection){
					case _responses.BACKWARDS:
						_currentDirection = Math.round(Math.random()) === 0 ? _responses.LEFT : _responses.RIGHT;
						break;
					case _responses.LEFT:
						_currentDirection = _responses.RIGHT;
						break;
					case _responses.RIGHT:
						_currentDirection = _responses.LEFT;
						break;
					default:
						break;
				}
			}else{
				switch(_currentDirection){
					case _responses.FORWARD:
						_currentDirection = Math.round(Math.random()) === 0 ? _responses.LEFT : _responses.RIGHT;
						break;
					case _responses.LEFT:
						_currentDirection = _responses.LEFT;
						break;
					case _responses.RIGHT:
						_currentDirection = _responses.RIGHT;
						break;
					default:
						break;
				}
			}
		}
	}
	if(!possibleResponses.includes(_currentDirection) && 0 < possibleResponses.length){
		_currentDirection = possibleResponses[Math.floor(Math.random()*possibleResponses.length)];
	}
	message.respond(_currentDirection);
	if(_team===2){console.log(_currentDirection)}
	switch(_currentDirection){
		case _responses.FORWARD: _pos.y++; break;
		case _responses.BACKWARDS: _pos.y--; break;
		case _responses.LEFT: _pos.x--; break;
		case _responses.RIGHT: _pos.x++; break;
		case _responses.UP: _pos.z++; break;
		case _responses.DOWN: _pos.z--; break;
	}
	_tick++;
}
