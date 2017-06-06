const express = require('express');
const WXBizDataCrypt = require('../libs/WXBizDataCrypt');
const crypto = require('crypto');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Song = mongoose.model('Song');
const Base = mongoose.model('Base');

const request = require('request');

const appId = 'wx4b6904f8779e0977';
const appSecert = '8c3697c3ffd44c007b42a45aee42754e';

module.exports = function (app) {
    app.use('/', router);
};

router.post('/mini/getuserinfo', function (req,res,next) {
	let resData = req.body;
   	let code = resData.code;
   	let nickName = resData.nickName;
   	let city = resData.city;
   	request({ 
   		url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecert}&js_code=${code}&grant_type=authorization_code`
   	}, function (err, res, body) {
   		let bodyData = JSON.parse(body);
   		let openid = bodyData.openid;
   		console.log(openid)
   	})
   	res.send('post成功');
})

router.get('/mini/getplaylist', function (req,res,next) {
	let type = 'playlist';
	let id = '507182467';
	request({
		url: `https://api.imjad.cn/cloudmusic/?type=${type}&id=${id}`
	}, function (err, res, body) {
		let bodyData = JSON.parse(body);
		let tracks = bodyData.playlist.tracks;
		console.log(tracks);
		// 将list 写入 base
	})
})
