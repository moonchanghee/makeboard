var express = require('express');
var router = express.Router();
var pool = require('../config/config');
var bcrypt = require('bcrypt-nodejs');

router.get('/', function(req, res, next) {
  var sess = req.session;
  var sql = 'SELECT * FROM example1.post , example1.member WHERE example1.member.member_id = example1.post.member_id';
    pool.getConnection(function(err, conn){
     conn.query(sql, function(err , row){
       if(err){
         console.log(err)
       }
       else{
         if(row){
          if(sess.userName != null){
            res.render('board', { title: '게시판'  , row : row , sess:sess});     
          }     
          else{
            res.render('board', { title: '게시판 22' ,row : row ,sess:null});
          }
        }
      }
     })
    })
  });

      // // 페이지수-1* 행의수
      // router.get('/page', function(req, res, next) {
      //   var sess = req.session;
      //   var id = req.param("id"); 
      //   var data = req.query.data
      //   console.log("data:"+data)
      //   // var cnt = id*3;
      //   var cnt = data*3;
      //   var sql = 'SELECT * FROM example1.post , example1.member WHERE example1.member.member_id = example1.post.member_id LIMIT ?,?';
      //     pool.getConnection(function(err, conn){
      //      conn.query(sql,[cnt,3] ,function(err , row){
      //        if(err){
      //          console.log(err)
      //        }
      //        else{
      //          if(row){
      //           if(sess.userName != null){
      //             res.render('board', { title: '게시판'  , row : row , sess:sess});     
      //           }     
      //           else{
      //             res.render('board', { title: '게시판 22' ,row : row ,sess:null});
      //           }
      //         }
      //       }
      //      })
      //     })
      //   });
  

          // 페이지수-1* 행의수
          router.get('/page', function(req, res, next) {
            var sess = req.session;
            var id = req.param("id"); 
            var data = req.query.data
            console.log("data:"+data)
            // var cnt = id*3;
            var cnt = (data-1)*5;
            var sql = 'SELECT * FROM example1.post , example1.member WHERE example1.member.member_id = example1.post.member_id LIMIT ?,?';
              pool.getConnection(function(err, conn){
               conn.query(sql,[cnt,5] ,function(err , row){
                 if(err){
                   console.log(err)
                 }
                 else{
                   if(row){
                     console.log(row)
                res.send(row)
        
             
                }
              }
               })
              })
            });

  router.post('/', function(req, res, next) {
    var data = req.body.search;
    var sess =req.session
    var sql = 'SELECT *FROM example1.post , example1.member WHERE example1.post.member_id = example1.member.member_id AND member_name LIKE ?';
    console.log("data : " + data)  
    pool.getConnection(function(err, conn){
       conn.query(sql, ['%' + data + '%' ] ,function(err , row){
         if(err){
           console.log(err)
         }
         else{
           if(row){
            if(sess.userName != null){
              res.render('board', { title: '게시판'  , row : row , sess:sess});     
            }     
            else{
              res.render('board', { title: '게시판 22' ,row : row ,sess:null});
            } 
          }
        }
       })
      })
    });


router.get('/login', function(req, res, next) {
  res.render('login');
});

router.get('/register', function(req, res, next) {
  res.render('register');
});



router.get('/write', function(req, res, next) {
  var sess = req.session;
   res.render('write', { title: 'Express'  , sess :sess});
 });

router.get('/logout', function(req, res, next) {
  var sess = req.session;
  sess.destroy();
  res.redirect('/')
});

router.get('/board/detail', function(req, res, next) {
  var post_id = req.param("id"); 
  var sess = req.session;
  var sql = "SELECT * FROM example1.post , example1.member WHERE example1.member.member_id = example1.post.member_id AND post_id = ?";
  pool.getConnection(function(err, conn){
    conn.query(sql ,[post_id] ,function(err , row){
    if(err){
      console.log(err)
      console.log("err")
    }
    else{
      if(row){
        console.log(row[0].member_id)
        console.log("sess :" + sess.userName)
        res.render('write2' , {row : row , sess : sess} )        
      }
}
});
});
});


router.get('/write/update', function(req, res, next) {
  var sess = req.session
  var postId = req.param("id"); 
  var sql = "SELECT * FROM example1.post , example1.member WHERE example1.member.member_id = example1.post.member_id AND post_id=?";
  pool.getConnection(function(err, conn){
    conn.query(sql ,[postId],function(err , row){
    if(err){
      console.log(err)
      console.log("err")
    }
    else{
      if(row){
        res.render('update' , {row : row , sess : sess} )        
      }
      }
});
});
});

router.get('/write/delete', function(req, res, next) {
  var sess = req.session;
  var postId = req.param("id"); 
  console.log(postId)
 var sql = "DELETE FROM post WHERE post_id =?"
 pool.getConnection(function(err,conn){
  conn.query(sql ,[postId], function(err, row){
    if(err){
      console.log(err)
    }
else{
if(row)
  res.send("<script> alert('삭제되었습니다.');history.back();</script>");
}
  });
  });
  });


  router.post('/login', function (req, res, next) {
    var sess=req.session;
  var  user_id = req.body.userId;
  var  password =   req.body.userPwd;
  var sql = 'SELECT *FROM example1.member WHERE example1.member.member_id = ? AND example1.member.member_pwd = ?';
  pool.getConnection(function(err, conn){
    conn.query(sql,[ user_id , password] , function (err, row) {
      if (err) {
        console.log('err :' + err);
      } else {
        if (row.length === 0) {
          res.send("<script> alert('존재하지않는 아이디입니다.');history.back();</script>")
        } else {
          
            sess.userId= row[0].member_id;  
            sess.userPwd = row[0].member_pwd;
            sess.userName = row[0].member_name;
            console.log("sess = " + sess.userName)
            res.redirect('/')
          
        }
      }
    });
  });
  });

    router.post('/write' , function(req , res , next){
      var body = req.body
      var sess=req.session;
      
      var sql = 'INSERT INTO post(post_content , post_date , member_id , post_title) VALUES (?,now(),?,?)';
        pool.getConnection(function(err, conn){
          conn.query(sql , [body.content  ,sess.userId ,body.title] , function(err , row){
            if(err){
              console.log(err) 
            }
            else{
              if(row){
                console.log("gd + " +sess)
                res.send("<script> alert('등록되었습니다.');history.back();</script>");
              }
            }
          });
        });
      });
    

      router.post('/write/update' , function(req, res, next){
        var body = req.body
        var post_id = req.param("id"); 
        var sql = "UPDATE post SET post_content = ? , post_date = now() , post_title = ? WHERE post_id = ? ";
        console.log("포스트아이디 :" + post_id)
        pool.getConnection(function(err,conn){
        conn.query(sql, [body.content  ,body.title , post_id] , function(err, row){
        if(err){
          console.log(err)
        }
        else{
        if(row){
          console.log(row)
          res.send("<script> alert('등록되었습니다.');history.back();</script>");
              }
          }
         });
         });
        });

        // router.post('/register' , function(req, res, next){
        //   var body = req.body
        //   var sql = "INSERT INTO member( member_id , member_pwd , member_name ) VALUE(?,?,?)";
        //   var sql2= "SELECT * FROM example1.member WHERE example1.member.member_id  = ? "

        //   pool.getConnection(function(err,conn){
        //     conn.query(sql2,[body.userId] , function(err,row){
        //       if(row){
        //         res.send("<script>alert('아이디가 중복되었습니다.');history.back();</script>");
        //         console.log(row)
        //       }
        //       else {
        //   conn.query(sql, [body.userId , body.userPwd , body.userName] , function(err, row){
        //   if(err){
        //     res.write('alert("중복된 아이디입니다.")');
        //     console.log("에러" + err)
        //   }
        //   else{
        //   if(row){
        //     console.log(row)
        //     res.redirect('/')
        //         }
        //     }
        //    });
        //   }
        //    });
        //   });
        //   });

        router.post('/register' , function(req, res, next){
          var body = req.body
          var sql = "INSERT INTO member( member_id , member_pwd , member_name ) VALUE(?,?,?)";
          pool.getConnection(function(err,conn){
          conn.query(sql, [body.userId , body.userPwd , body.userName] , function(err, row){
          if(err){
            res.send("<script>alert('아이디가 중복되었습니다.');history.back();</script>");
            console.log("에러" + err)
          }
          else{
          if(row){
            console.log(row)
            res.redirect('/')
                }
            }
           });
           });

          });


module.exports = router;