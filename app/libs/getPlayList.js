const request = require('request');
function getPlayList() {
	let type = 'playlist';
	let id = '507182467';
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
		//forEach循环服务器会崩溃
		// 递归解决
		(function getdata(index) {
		    if(index>=tracks.length) {
		    	console.log('写入数据库结束');
		    	return true;
		    }
		   	let id = tracks[index].id;
			let poster = tracks[index].al.picUrl;
			let name = tracks[index].name.split('(').shift();
			let author = tracks[index].ar[0].name;
			let url = '';
	    	request({
				url: `https://api.imjad.cn/cloudmusic/?type=song&id=${id}`
			}, function (err, res, body) {
				if (body.includes('<html>')) return; //判断返回数据是否标准
				getdata(index+1);	
				let bodyData = JSON.parse(body);
				url = bodyData.data[0].url;
				if (!url) {
					console.log(name);
					console.log(num ++);
					return 
				}else {
					const base = new Base({
	             		id,poster,name,author,url
				    });
			        base.save(function (err, base) {
			            if (err) {
			                console.error('conversation save err:' , err);
			            }
			        })
				}
			})	
		})(0)
	})
}

module.exports = getPlayList;
	