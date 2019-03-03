import React, {Component} from 'react';
import Board from './Board';
import {message, Button, Menu, Dropdown, Icon,} from 'antd';
import PropTypes from 'prop-types';


//单个area的格式:{id:0,icon:unknown/0/1/2/3/4/5/6/7/8/bang/flag/wrong}
//areas,一个数组,每个元素是一个area.其中icon表示显示的图标,可以代表操作状态,是否点击过等.
// 考虑新增一个属性isMine,表示此块是不是雷.开始游戏时,随机放一些雷. TODO
// (进阶,点击第一块时,随机放雷) TODO
//


class Game extends Component {
	constructor() {
		super();
		this.startClick = this.startClick.bind(this);
		this.areaClick = this.areaClick.bind(this);//绑定this的指向~
		this.areaClick2 = this.areaClick2.bind(this);
		//this.sweep=this.sweep.bind(this);
		this.bang = this.bang.bind(this);
		this.reset = this.reset.bind(this);
		this.handleMenuClick = this.handleMenuClick.bind(this);
		let width = 10;
		let height = 10;
		let areas = new Array(width * height);
		let isMine = new Array(width * height);
		isMine.fill(false);
		for (let i = 0; i < areas.length; i++) {
			areas[i] = {id: i, icon: 'unknown'};
		}
		this.state = {
			defaultWidth: 10,
			defaultHeight: 10,
			defaultMinesNum: 10,
			width: width,
			height: height,
			areas: areas,
			gameStatus: 'no',
			isMine: isMine,
			minesNum: 10,
		};
	}

	startClick() {
		console.log(`点击了 - 开始按钮`);

		this.setState({
			gameStatus: 'yes'
		});
		//随机放x个雷
		this.reset(this.state.defaultWidth, this.state.defaultHeight, this.state.defaultMinesNum);

	}

	handleMenuClick(e) {
		console.log(`点击了下拉菜单，${e}这一项。其值为：${e.key}`);
		const width = e.key==='10'?10:( e.key==='20'?20:30);
		const height = 10;
		const minesNum = width;
		this.setState({
			gameStatus: 'yes',
			defaultWidth: width,
			defaultHeight: height,
			defaultMinesNum: minesNum,
			width:width,
			height: height,
		});
		this.reset(width, height, minesNum);

	}

//重置
	reset(width, height, minesNum) {
		console.log(`reset${width} - ${height} - ${minesNum}`);
		let areas = new Array(width * height);//重铸areas
		for (let i = 0; i < areas.length; i++) {
			areas[i] = {id: i, icon: 'unknown'};
		}
		this.setState({
			width: width,
			height: height,
			areas: areas,
			minesNum: minesNum,
		});
		//随机放雷
		let isMine = new Array(width * height);//重铸isMine
		isMine.fill(false);
		for (let k = 0; k < minesNum; k++) {

			let rand = Math.ceil(Math.random() * width * height);
			if (isMine[rand] === false) {
				isMine[rand] = true;
			} else {
				k = k - 1;
			}
		}
		this.setState({
			isMine: isMine
		});
		//console.log(isMine.map(boo=>boo?'t':'f').join());
	}

	areaClick(i) {
		console.log(`点击了 - ${i}号地块`);
		if (this.state.gameStatus === 'yes') {//判断游戏是否开始
			//area的格式{id:0,icon:unknown/0/1/2/3/4/5/6/7/8/bang/flag/wrong/what}
			if (this.state.areas[i].icon === 'unknown') {
				//没点击过
				if (this.state.isMine[i] === true) {
					this.bang();
				} else {
					let icons = this.state.areas.map(area => area.icon);
					const width = this.state.width;
					const height = this.state.height;
					const proportion = height * width;//面积
					const neighborDefault = [
						0 - width - 1, 0 - width, 0 - width + 1,
						-1, 1,
						width - 1, width, width + 1
					];
					const neighborOfLeft = [
						0 - width, 0 - width + 1, 1, width, width + 1
					];
					const neighborOfRight = [
						0 - width - 1, 0 - width, -1, width - 1, width
					];
					const isMine = this.state.isMine;
					let sweep = (t) => {
						//console.log(`开始判定${t}号地块`);
						if (icons[t] !== 'unknown') {
							return;
						}
						let mines = 0;//周边雷数
						let neighbor = neighborDefault;
						switch (t % width) {
							case 0:
								neighbor = neighborOfLeft;
								break;
							case width - 1:
								neighbor = neighborOfRight;
								break;
							default:
								break;
						}
						for (let s = 0; s < neighbor.length; s++) {
							if (t + neighbor[s] >= 0 && t + neighbor[s] < proportion) {

								mines += isMine[t + neighbor[s]] ? 1 : 0;
							}
						}
						//console.log(`${t}号地块周围有${mines}个雷`);
						icons[t] = mines.toString();
						if (mines === 0) {
							for (let s = 0; s < 8; s++) {
								if (t + neighbor[s] >= 0 && t + neighbor[s] < proportion) {
									sweep(t + neighbor[s]);
								}
							}
						}
					};
					sweep(i);
					//console.log(icons.toLocaleString());
					//判定游戏是否结束
					let gameOver = true;
					for (let x = 0; x < proportion; x++) {
						if ((!isMine[x]) && (icons[x] === 'unknown')) {
							gameOver = false;
							console.log(`第${x}个地块不是雷但还没开，所以gameOver=${gameOver}`);
							break;
						}
					}

					if (gameOver) {
						this.setState({
							gameStatus:'no'
						});
						console.log(`游戏结束了，雷扫完了`);
						message.success(`游戏结束了，雷扫完了`);
					}

					this.setState({
						areas: this.state.areas.map(area => ({id: area.id, icon: icons[area.id]}))
					});
				}

			}

		} else {
			message.warning('游戏还没开始');
			console.log(`但是游戏还没开始，白点`);
		}
	}
//鼠标右键
	areaClick2(i) {
		if(this.state.gameStatus==='no'){
			return;
		}
		const areas = this.state.areas;
		if (areas[i].icon === 'unknown') {
			areas[i].icon = 'flag';
		} else if (areas[i].icon === 'flag') {
			areas[i].icon = 'what';
		} else if (areas[i].icon === 'what') {
			areas[i].icon = 'unknown';
		}
		this.setState({
			areas: areas
		});
	}

	bang() {
		//炸了，掀开所有的雷，并把flag显示特殊icon
		console.log(`点到雷了，爆炸了`);
		message.error(`点到雷了，爆炸了！`);
		this.setState({gameStatus: 'no'});
		const {width, height, isMine, areas} = this.state;
		//更新界面图标
		for (let b = 0; b < width * height; b++) {
			if (isMine[b]) {
				if (areas[b].icon === 'flag') {
					areas[b].icon = 'flag';
				} else {
					areas[b].icon = 'bang';
				}
			} else {
				if (areas[b].icon === 'flag') {
					areas[b].icon = 'wrong';
				}
			}
		}
		this.setState({
			areas: areas,
		});
	}


	endClick() {

	}


	render() {
		console.log(`game - render`);
		const menu = (
			<Menu onClick={this.handleMenuClick}>
				<Menu.Item key="10">简单</Menu.Item>
				<Menu.Item key="20">中等</Menu.Item>
				<Menu.Item key="30">困难</Menu.Item>
			</Menu>
		);

		//console.log(this.state.areas.toString());
		return (
			<div style={{margin: 'auto auto', textAlign: 'center',padding:24}}>
				<div style={{height: 32, margin: 12}}>
					<Button type="default"   //按钮样式颜色
						//shape = "circle"　　//按钮圆角（默认为方形）
						    onClick={this.startClick}
						    style={{margin: 'auto 8px'}}
					>
						{this.state.gameStatus==="no"?'开始游戏':'重新开始'}
					</Button>
					<Dropdown overlay={menu}>
						<Button>
							其它尺寸<Icon type="down"/>
						</Button>
					</Dropdown>
					{/*<Button type="default"   */}
					        {/*style={{margin: 'auto 8px'}}*/}
					        {/*onClick={this.endClick}*/}
					{/*>结束游戏</Button>*/}
				</div>
				<Board
					classname={'board'}
					width={this.state.width}
					height={this.state.height}
					areas={this.state.areas}
					isMine={this.state.isMine}
					onClick={(i) => this.areaClick(i)}
					oc={(i) => this.areaClick2(i)}
				/>
			</div>
		);
	}
}


export default Game;