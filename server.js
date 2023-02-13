var http = require('http'); 
var fs = require('fs'); 
var formidable = require('formidable'); 
 
// 包含上传表单的html文件
var upload_html = fs.readFileSync("index.html");
var response_html = fs.readFileSync("response.html"); 

 
// 将其替换为保存上传文件的位置
var upload_path = "./upload/"; 
 
http.createServer(function (req, res) { 
    if (req.url == '/') { 
      res.writeHead(200); 
      res.write(upload_html); 
      return res.end(); 
    } else if (req.url == '/fileupload') { 
        var form = new formidable.IncomingForm(); 
        form.parse(req, function (err, fields, files) { 
            // oldpath：文件保存到的临时文件夹
            var regex_num_set = /&#(\d+);/g;
            var FileName = files.filetoupload.originalFilename
            FileName = FileName.replace(regex_num_set, function (_, $1) {
                return String.fromCharCode($1);
            });
            console.log(FileName)
            var oldpath = files.filetoupload.filepath;
            var newpath = upload_path + FileName; 
            // 将文件复制到新位置
            fs.rename(oldpath, newpath, function (err) { 
                if (err) throw err; 
                // 您可能会用另一个html页面进行响应
                res.writeHead(200);
                res.write(response_html); 
                res.write("<h3>Success Upload</h3>")
                res.end()
            }); 
        }); 
    }  
}).listen(8080);

console.log("Server is running at port 8080")
console.log("Please open http://localhost:8080/")