
const express = require ('express');
const app = express();
const fs = require('fs/promises');

const PORT= 5000;



app
.use(express.json())
.use(express.urlencoded({extended:false}))
.use((req, res, next)=>{
    res.header('Acces-Control-Allow-Origin', '*');
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



app.post("/task", async(req, res)=>{
  try{
        const task=req.body;

        const listBuffer= await fs.readFile('./tasks.json');
        const currentTasks = JSON.parse(listBuffer);
        let maxTaskId= 1;
        if(currentTasks && currentTasks.length > 0){
            maxTaskId= currentTasks.reduce((maxId, currentElement) => currentElement.id> maxId ? currentElement.id: maxId,
            maxTaskId);

           
        }
        const newTask = {id :maxTaskId + 1, ...task};
        const newList =currentTasks ? [...currentTasks, newTask] : [newTask];
        
        
        await fs.writeFile('./tasks.json',JSON.stringify(newList));
        res.send(newTask);
    } catch(error){
        res.status(500).send({error: error.stack});
    }  
});

app.delete('/task/:id', async (req,res)=>{
    console.log(req);
    try{
        const id = req.params.id;
        const listBuffer= await fs.readFile('./tasks.json');
        const currentTasks= JSON.parse(listBuffer);
        if (currentTasks.length > 0){
        

            await fs.writeFile(
                './tasks.json', JSON.stringify(currentTasks.filter((task)=> task.id != id)));
            res.send({message: `uppgift med id ${id} togs bort`});

        }else{
            res.status(404).send({error: 'ingen uppgift att ta bort'})
        }

    } catch(error){
        res.status(500).send({error: error.stack});
    }
    
});

app.listen(PORT, () => console.log('Server running on http://localhost:5000'));
