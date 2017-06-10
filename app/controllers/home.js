const express = require('express');
const WXBizDataCrypt = require('../libs/WXBizDataCrypt');
const getPlayList = require('../libs/getPlayList');
const crypto = require('crypto');
const schedule = require('node-schedule');
const router = express.Router();
const mongoose = require('mongoose');
const User = mongoose.model('User');
const Song = mongoose.model('Song');
const Base = mongoose.model('Base');

const request = require('request');

const appId = 'wx4b6904f8779e0977';
const appSecert = '8c3697c3ffd44c007b42a45aee42754e';

let num = 0;

module.exports = function (app) {
    app.use('/', router);
};
// 接受用户信息
router.post('/mini/getuserinfo', function (req, res, next) {
	let resData = req.body;
	console.log('resData');
   	console.log(resData);
   	let code = resData.code;
   	let nickName = resData.nickName;
   	let city = resData.city;
   	request({ 
   		url: `https://api.weixin.qq.com/sns/jscode2session?appid=${appId}&secret=${appSecert}&js_code=${code}&grant_type=authorization_code`
   	}, function (err, res, body) {
   		let bodyData = JSON.parse(body);
   		let openid = bodyData.openid;
   		console.log('openid');
   		console.log(openid);
   		const user = new User({
     		openid,nickName,city
	    });
	    user.save(function (err, user) {
            if (err) {
                console.error('user save err:' , err);
                return;
            }
            console.log('保存成功');
        })
   	})
   	res.send('post成功');
})

//获取每页歌单
router.get('/mini/baselist', function (req, res, next) {
	let _res = res;
	let page = req.query.page || 1;
	let maxPage = '';
	let limit = 25;
	let skip = (page - 1)*limit;
	Base.find().count().then(function (count) {
		maxPage = Math.ceil(count/limit);
		if (page > maxPage) {
			num = 0;
			console.log('num重置');
			_res.send('noMore');
			return;
		} else{
			Base.find().limit(limit).skip(skip).exec(function (err, res) {
				console.log('num: ' + num++);
				res.push({ 'maxPage' : maxPage});
				_res.send(res);
			})
		}
	});
})

//将默认歌单写入数据库
//链接具有时效性 定时任务 保证链接可用
router.get('/mini/getplaylist', function (req, res, next) {
	let type = 'playlist';
	let id = '507182467';
	let _res = res;
	Base.remove({}).exec(function(err,result){
		console.log('删除成功');
	})
	request({
		url: `https://api.imjad.cn/cloudmusic/?type=${type}&id=${id}`
	}, function (err, res, body) {
		let bodyData = JSON.parse(body);
		let tracks = bodyData.playlist.tracks;
		_res.send(tracks);
		let num = 0;
		let name = ''
		//forEach循环服务器会崩溃
		// 递归解决
		tracks.forEach((v,index,a) => {
			let id = tracks[index].id;
			let poster = tracks[index].al.picUrl;
			if (tracks[index].name.indexOf('(') > -1) {
				name = tracks[index].name.split('(').shift();
			}else if (tracks[index].name.indexOf('（') > -1) {
				name = tracks[index].name.split('（').shift();
			}else{
				name = tracks[index].name;
			}
			let author = tracks[index].ar[0].name;		
			const base = new Base({
	     		id,poster,name,author
		    });
	        base.save(function (err, base) {
	            if (err) {
	                console.error('conversation save err:' , err);
	            }
	        })
	        console.log(num++);
		})
	})
})

//获取搜索结果
router.get('/mini/search', function (req, res, next) {
	let _res = res;
	let s = req.query.s;
	let limit = req.query.limit || 10;
	console.log(s);
	request({ 
		url: `https://api.imjad.cn/cloudmusic/?type=search&s=${s}&limit=${limit}`
	}, function (err, res, body) {
		let bodyData = JSON.parse(body);
		let songs = bodyData.result.songs;
		let resArray = [];
		let songName = '';
		songs.forEach((v,i,a) => {
			if (v.name.indexOf('(') > -1) {
				songName = v.name.split('(').shift();
			}else if (v.name.indexOf('（') > -1) {
				songName = v.name.split('（').shift();
			}else{
				songName = v.name;
			}
			console.log(songName);
			resArray.push({
				id: v.id,
				name: songName,
				author: v.al.name,
				poster: v.al.picUrl
			})
			console.log('push中');
		})
		console.log('push完毕');
		console.log(resArray);
		_res.send(resArray);
	})
	
})

//获取歌曲播放链接
router.get('/mini/getUrl', function (req, res, next) {
	let id = req.query.id;
	let url = '';
	let _res = res;
	console.log('id');
	console.log(id);
	request({
		url: `https://api.imjad.cn/cloudmusic/?type=song&id=${id}`
	}, function (err, res, body) {
		url = JSON.parse(body).data[0].url;
		_res.send(url);
	})
})
// schedule.scheduleJob({ second: 0, minute: 0}, function(){
//   console.log(new Date());
//   getList();
// });

// function getList() {
// 	let type = 'playlist';
// 	let id = '507182467';
// 	Base.remove({}).exec(function(err,result){
// 		console.log('删除成功');
// 	})
// 	request({
// 		url: `https://api.imjad.cn/cloudmusic/?type=${type}&id=${id}`
// 	}, function (err, res, body) {
// 		let bodyData = JSON.parse(body);
// 		let tracks = bodyData.playlist.tracks;
// 		let num = 0;
// 		//forEach循环服务器会崩溃
// 		// 递归解决
// 		(function getdata(index) {
// 		    if(index>=tracks.length) {
// 		    	console.log('写入数据库结束');
// 		    	return true;
// 		    }
// 		   	let id = tracks[index].id;
// 			let poster = tracks[index].al.picUrl;
// 			let name = tracks[index].name.split('(').shift();
// 			let author = tracks[index].ar[0].name;
// 			let url = '';
// 	    	request({
// 				url: `https://api.imjad.cn/cloudmusic/?type=song&id=${id}`
// 			}, function (err, res, body) {
// 				if (body.includes('<html>')) return; //判断返回数据是否标准
// 				getdata(index+1);	
// 				let bodyData = JSON.parse(body);
// 				url = bodyData.data[0].url;
// 				if (!url) {
// 					console.log(name);
// 					console.log(num ++);
// 					return 
// 				}else {
// 					const base = new Base({
// 	             		id,poster,name,author,url
// 				    });
// 			        base.save(function (err, base) {
// 			            if (err) {
// 			                console.error('conversation save err:' , err);
// 			            }
// 			        })
// 				}
// 			})	
// 		})(0)
// 	})
// }