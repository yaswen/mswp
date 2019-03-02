import React, {Component} from 'react';
//import Board from "./Board";
import PropTypes from "prop-types";
import p1 from '../img/1.png';
import p2 from '../img/2.png';
import p3 from '../img/3.png';
import p4 from '../img/4.png';
import p5 from '../img/5.png';
import p6 from '../img/6.png';
import p7 from '../img/7.png';
import p8 from '../img/8.png';
import flag from '../img/qi.png';
import wrong from '../img/cuowu.png';
import what from '../img/wenhao.png';
import bang from '../img/siwang.png';

//const img = [p1, p2, p3, p4, p5, p6, p7, p8];
//icon所有的值:unknown/0/1/2/3/4/5/6/7/8/bang/flag/wrong/what
const imag = {
	1:p1, 2:p2, 3:p3, 4:p4, 5:p5, 6:p6, 7:p7,8: p8,
	0:null,unknown:null,
	bang:bang,flag:flag,wrong:wrong,what:what,
};
// const backgroundColor={
// 	1:'#eeeeee', 2:'#eeeeee', 3:'#eeeeee', 4:'#eeeeee', 5:'#eeeeee', 6:'#eeeeee', 7:'#eeeeee',8: '#eeeeee',
// 	0:'#eeeeee',unknown:'#FFFAFA',
// 	bang:'#B22222',flag:'#FFD700',wrong:'#B22222',what:'#FFFAFA',
// };

class Area extends Component {
	constructor() {
		super();
		this.onMouseUp = this.onMouseUp.bind(this);
	}

	onMouseUp(e) {
		if (e.button === 2) {
			console.log(`鼠标右键`);
			this.props.oc();
		} else if (e.button === 0) {
			console.log(`鼠标左键`);
			this.props.onClick();
		}
	};
//,backgroundColor:backgroundColor[icon],
	render() {
		//console.log(`area - render`);
		const {icon} = this.props;
		const png=imag[icon];
		return (
			<div className={"area"+icon} style={{...styles.area}} onMouseUp={this.onMouseUp}>
				<img style={{height: 28, boxSizing: 'border-box'}} src={png}/>

			</div>
		);
	}
}

const styles = {
	area: {
		border: '1px solid',
		width: 36,
		height: 36,
		float: 'left',
		borderRadius: '3px',
		borderColor: '#888888',
		paddingTop: 3,

	}
};

Area.propTypes = {
	onClick: PropTypes.func.isRequired,
	oc: PropTypes.func.isRequired,
};
export default Area;