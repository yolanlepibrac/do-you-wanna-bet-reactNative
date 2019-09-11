import React, { Component } from 'react';
import {  Image } from 'react-native';

export default {
    displayMark : (mark) => {
      switch(Math.floor(mark*2)/2) {
        case 5 :
          return <Image source={require('../assets/images/stars5.png')} style={{borderRadius:75, width:300, height:50}}/>;
        case 4.5 :
          return <Image source={require('../assets/images/stars45.png')} style={{borderRadius:75, width:300, height:50}}/>;
        case 4 :
          return <Image source={require('../assets/images/stars4.png')} style={{borderRadius:75, width:300, height:50}}/>;
        case 3.5 :
          return <Image source={require('../assets/images/stars35.png')} style={{borderRadius:75, width:300, height:50}}/>;
        case 3:
          return <Image source={require('../assets/images/stars3.png')} style={{borderRadius:75, width:300, height:50}}/>;
        case 2.5 :
          return <Image source={require('../assets/images/stars25.png')} style={{borderRadius:75, width:300, height:50}}/>;
        case 2 :
          return <Image source={require('../assets/images/stars2.png')} style={{borderRadius:75, width:300, height:50}}/>;
        case 1.5 :
          return <Image source={require('../assets/images/stars15.png')} style={{borderRadius:75, width:300, height:50}}/>;
        case 1 :
          return <Image source={require('../assets/images/stars1.png')} style={{borderRadius:75, width:300, height:50}}/>;
        case 0.5 :
          return <Image source={require('../assets/images/stars05.png')} style={{borderRadius:75, width:300, height:50}}/>;
        case 0 :
          return <Image source={require('../assets/images/stars0.png')} style={{borderRadius:75, width:300, height:50}}/>;
        default:
          return <Image source={require('../assets/images/stars0.png')} style={{borderRadius:75, width:300, height:50}}/>;
      }
    }
}
