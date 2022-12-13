const express = require ('express');
const app = express();
const fs = require('fs/promises');

const PORT= 5000;

app
.use(express.json())
.use(express.urlencoded({extended:false}))
.use((req, res, next)=>{
    res.header('Acces-Control-Allow-origin', '*');
    res.header('Acces-Controll-Allow-Headers', '*');
    res.header('Access-Controll-Allow-Method', '*');
    
    next();
    });
    app.get('/task',async (req, res)=>{
        try{
        const tasks = await fs.readFile('./tasks.json');
        res.send(JSON.parse(tasks));
    }catch(error){
        res.status(500).send({error});
    }
    });
app.listen(PORT, () => console.log('Server running on http://localhost:5000'));
