import React, { Component } from 'react';
import {Layout } from 'antd';
import Game from './components/Game';
//import logo from './logo.svg';
import './App.css';


const {Header, Footer, Content} = Layout;

class App extends Component {
    constructor(){
        super();
    }

  render() {


    return (
      <div className="App">
	      <Layout theme={"light"}>
            <Header>
                <h1 style={{color:'#bbbbbb'}}>扫雷&nbsp;MineSweeper</h1>
            </Header>
            <Content >
                <Game  style={{margin:'auto auto',textAlign:'center',padding:24}}/>
            </Content>
            <Footer>
                <div >shiwen 扫雷游戏</div>
            </Footer>
          </Layout>

      </div>
    );

  }
}

export default App;
