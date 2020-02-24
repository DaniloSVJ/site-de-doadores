const express = require('express')
const server = express()
const nunjucks =require('nunjucks')



server.use(express.static('public'))
//Habilitar o body do formulario
server.use(express.urlencoded({extended:true}))

//configuração de concexão com o postgree
const Pool = require('pg').Pool
const db = new Pool({
    user: 'postgres',
    password: '777dsvj',
    host: 'localhost',
    port: 5432,
    database: 'doe'

})


nunjucks.configure("./",{
    express: server,
    noCache: true
})

server.get('/',function(req,res){
    
    
    const query =  `select * from donors`

    db.query(query,function(err,result
        ){
        if(err) return res.send("erro no banco de dados")
        const donors = result.rows
        return res.render('index.html',{donors})
    }) 
    

})

server.post('/',function(req,res){

    const name  = req.body.name
    const email = req.body.email
    const blood = req.body.blood

    if (name==""|| email=="" || blood==""){
        return res.send("Todos os campos são obrigatorios")
    }

    const query = `insert into donors  ("name","email","blood") 
                  values ($1,$2,$3)`
    //return res.render('index.html',{donors})
    const values = [name,email,blood]
    db.query(query,values,function(err){
        if(err) return res.send("erro no banco de dados")

        return res.redirect('/')
    })
})

server.listen(3000)


