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
	if(_team === 0){
		console.debug('- - - - - - - - - - -');
	}
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
	if(data[_pos[0]][_pos[1]] !== undefined && data[_pos[0]][_pos[1]].occupiedBy !== null && _team !== data[_pos[0]][_pos[1]].occupiedBy.team){
		console.error('Participant lost! ('+_team+')');
		debugger;
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
		if(_team === 0){
			console.debug({..._target, name: '_target'});
		}
	}
	let response = _response.FORWARD;
	let dx = _target.pos_x-_pos[0];
	let dy = _target.pos_y-_pos[1];
	if(_team === 0){
	//	debugger;
	//	console.debug({..._pos, distance: _target.distance});
	}
	if(dx !== 0 && Math.abs(dy) < Math.abs(dx)){
		if(0 < dx){
			switch(_directions.current){
				case _directions.UP:
					if(_team === 0){
	//					debugger;
					}
					response = _response.RIGHT;
					if(_team === 0){
						console.debug({response: response, dx: dx, dy: dy, state: 1});
					}
					break;
				case _directions.DOWN:
					if(_team === 0){
	//					debugger;
					}
					response = _response.LEFT;
					if(_team === 0){
						console.debug({response: response, dx: dx, dy: dy, state: 2});
					}
					break;
				case _directions.LEFT:
					if(_team === 0){
	//					debugger;
					}
					response = Math.round(Math.random()) === 0 ? _response.LEFT : _response.RIGHT;
					if(_team === 0){
						console.debug({response: response, dx: dx, dy: dy, state: 3});
					}
					break;
				default:
					if(_team === 0){
	//					debugger;
						console.debug({response: response, state: -1});
					}
					break;
			}
		}else{
			switch(_directions.current){
				case _directions.UP:
					if(_team === 0){
	//					debugger;
					}
					response = _response.LEFT;
					if(_team === 0){
						console.debug({response: response, dx: dx, dy: dy, state: 4});
					}
					break;
				case _directions.DOWN:
					if(_team === 0){
	//					debugger;
					}
					response = _response.RIGHT;
					if(_team === 0){
						console.debug({response: response, dx: dx, dy: dy, state: 5});
					}
					break;
				case _directions.RIGHT:
					if(_team === 0){
	//					debugger;
					}
					response = Math.round(Math.random()) === 0 ? _response.LEFT : _response.RIGHT;
					if(_team === 0){
						console.debug({response: response, dx: dx, dy: dy, state: 6});
					}
					break;
				default:
					if(_team === 0){
	//					debugger;
						console.debug({response: response, state: -2});
					}
					break;
			}
		}
	}else{
		if(0 < dy){
			switch(_directions.current){
				case _directions.DOWN:
					if(_team === 0){
	//					debugger;
					}
					response = Math.round(Math.random()) === 0 ? _response.LEFT : _response.RIGHT;
					if(_team === 0){
						console.debug({response: response, dx: dx, dy: dy, state: 7});
					}
					break;
				case _directions.LEFT:
					if(_team === 0){
	//					debugger;
					}
					response = _response.RIGHT;
					if(_team === 0){
						console.debug({response: response, dx: dx, dy: dy, state: 8});
					}
					break;
				case _directions.RIGHT:
					if(_team === 0){
	//					debugger;
					}
					response = _response.LEFT;
					if(_team === 0){
						console.debug({response: response, dx: dx, dy: dy, state: 9});
					}
					break;
				default:
					if(_team === 0){
	//					debugger;
						console.debug({response: response, state: -3});
					}
					break;
			}
		}else{
			switch(_directions.current){
				case _directions.UP:
					if(_team === 0){
	//					debugger;
					}
					response = Math.round(Math.random()) === 0 ? _response.LEFT : _response.RIGHT;
					if(_team === 0){
						console.debug({response: response, dx: dx, dy: dy, state: 10});
					}
					break;
				case _directions.LEFT:
					if(_team === 0){
	//					debugger;
					}
					response = _response.LEFT;
					if(_team === 0){
						console.debug({response: response, dx: dx, dy: dy, state: 11});
					}
					break;
				case _directions.RIGHT:
					if(_team === 0){
	//					debugger;
					}
					response = _response.RIGHT;
					if(_team === 0){
						console.debug({response: response, dx: dx, dy: dy, state: 12});
					}
					break;
				default:
					if(_team === 0){
	//					debugger;
						console.debug({response: response, state: -4});
					}
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
