var http = require('http');
var fs = require('fs');
var path = require('path');
var mime = require('mime');
//加载URL模块 用来解析用户请求
var url = require('url');
var querystring = require('querystring');

var server = http.createServer(function(req, res) {
    var reqUrl = req.url.toLowerCase();
    var method = req.method.toLowerCase();
    var urlObj = url.parse(reqUrl, true);
    var reqUrl = urlObj.pathname;
    reqUrl = (reqUrl === '/favicon.ico' ? '/resources/images/y18.gif' : reqUrl)
    if ((reqUrl === '/index' || reqUrl === '/') && method === 'get') {

        fs.readFile(path.join(__dirname, 'views', 'index.html'), function(err, data) {
            if (err) {
                throw err;
            }
            res.end(data)
        })

    } else if (reqUrl === '/submit' && method === 'get') {

        fs.readFile(path.join(__dirname, 'views', 'submit.html'), function(err, data) {
            if (err) {
                throw err;
            }
            res.end(data)
        })

    } else if (reqUrl === '/details' && method === 'get') {

        fs.readFile(path.join(__dirname, 'views', 'details.html'), function(err, data) {
            if (err) {
                throw err;
            }
            res.end(data)
        })

    } else if (reqUrl.startsWith('/resources') && method === 'get') {

        fs.readFile(path.join(__dirname, reqUrl), function(err, data) {
            if (err) {
                throw err;
            }
            res.end(data)
        })

    } else if (reqUrl === '/r' && method === 'get') {
        // 0.先读取data.json里面的数据
        fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', function(err, data) {
            if (err && err !== 'ENOENT') {
                throw err;
            }
            var list = JSON.parse(data || []);
            // 1.get 请求获取请求发过来的数据

            list.push(urlObj.query);
            // console.log(urlObj.query);
            // 2.转化成数组存到json里面
            fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(list), 'utf8', function(err) {
                if (err) {
                    throw err;
                }
                // 3.跳转
                res.writeHead(302, 'Found', {
                    'Location': '/'
                })
                res.end();
            })

        })
    } else if (reqUrl === '/r' && method === 'post') {

        fs.readFile(path.join(__dirname, 'data', 'data.json'), 'utf8', function(err, data) {
            if (err && err !== 'ENOENT') {
                throw err;
            }
            var list = JSON.parse(data || []);


            //监听request事件
            var array = [];
            req.on('data', function(chunk) {
                array.push(chunk)
            });
            req.on('end', function() {
                var buf = Buffer.concat(array);
                var post_data = querystring.parse(buf.toString('utf8'));
                list.push(post_data);
                console.log(list)
                fs.writeFile(path.join(__dirname, 'data', 'data.json'), JSON.stringify(list), 'utf8', function(err) {
                    if (err) {
                        throw err;
                    }
                    res.writeHead('302', 'Found', {
                        'location': '/'
                    });
                    res.end()
                })
            })
        });

    } else {
        res.end('404 找不到你要的页面')
    }
});

server.listen(8888, function() {
    console.log('http://localhost:8888')
})