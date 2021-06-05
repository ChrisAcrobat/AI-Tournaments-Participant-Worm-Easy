'use strict'
let _right = 1;
let _team;
let _settings;
let _opponents;
let _pos;
let _tick = 0;
let _response = {
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
ParticipantHelper.onmessage = data => {
	if(_tick === 0){
		let max = data.length-1;
		let mid = max/2;
		_pos = [mid, 0];
	}
	if(_target === null || !data[_target.pos_x][_target.pos_y].eatables.apple){
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
	let response = _response.FORWARD;
	let dx = _target.pos_x-_pos[0];
	let dy = _target.pos_y-_pos[1];
	if(dx !== 0 && Math.abs(dy) < Math.abs(dx)){
		if(0 < dx){
			switch(_directions.current){
				case _directions.UP:
					response = _response.RIGHT;
					break;
				case _directions.DOWN:
					response = _response.LEFT;
					break;
				case _directions.LEFT:
					response = Math.round(Math.random()) === 0 ? _response.LEFT : _response.RIGHT;
					break;
				default:
					break;
			}
		}else{
			switch(_directions.current){
				case _directions.UP:
					response = _response.LEFT;
					break;
				case _directions.DOWN:
					response = _response.RIGHT;
					break;
				case _directions.RIGHT:
					response = Math.round(Math.random()) === 0 ? _response.LEFT : _response.RIGHT;
					break;
				default:
					break;
			}
		}
	}else{
		if(0 < dy){
			switch(_directions.current){
				case _directions.DOWN:
					response = Math.round(Math.random()) === 0 ? _response.LEFT : _response.RIGHT;
					break;
				case _directions.LEFT:
					response = _response.RIGHT;
					break;
				case _directions.RIGHT:
					response = _response.LEFT;
					break;
				default:
					break;
			}
		}else{
			switch(_directions.current){
				case _directions.UP:
					response = Math.round(Math.random()) === 0 ? _response.LEFT : _response.RIGHT;
					break;
				case _directions.LEFT:
					response = _response.LEFT;
					break;
				case _directions.RIGHT:
					response = _response.RIGHT;
					break;
				default:
					break;
			}
		}
	}
	ParticipantHelper.respond(response);
	switch(response){
		case _response.LEFT:
			switch(_directions.current){
				case _directions.UP: _directions.current = _directions.LEFT; break;
				case _directions.DOWN: _directions.current = _directions.RIGHT; break;
				case _directions.LEFT: _directions.current = _directions.DOWN; break;
				case _directions.RIGHT: _directions.current = _directions.UP; break;
			}
			break;
		case _response.RIGHT:
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
