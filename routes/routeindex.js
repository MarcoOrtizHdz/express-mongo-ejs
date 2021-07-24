const express = require('express');
const app = express();
const Task = require('../model/task');


// Nos regresaria las tareas guardadas en la BD con el método find(). Una vez obtenidas las tareas las regresamos a la pagina principal.
app.get('/', async function(req,res) {
	var tasks = await Task.find();
	console.log(tasks);
	
	res.render('index', {tasks});
});

// Ruta que nos permita agregar nuevas tareas que vienen desde un metodo post. Una vez enviada la tarea podemos redireccionar a la pagina principal con res.redirect('/')
app.post('/add', async (req,res) => {
	var task = new Task(req.body);

	/*
		// si los atributos no se llamaran igual en el index.ejs, sería así
		var desc = req.body.descripcion:
		var titulo = req.body.titulo;

		var task = new Task({
			title: titulo,
			descripcion: desc
		});

	*/

	console.log(task);
	await task.save(); // Guardando la Task en la BD

	res.redirect('/');
});

// Ruta para editar los datos. Primero necesitamos buscarlos en base a un id que ya me llega desde la ruta. Metodo de busqueda findById(). 
// Los editaremos en una pagina aparte llamada 'edit'
app.get('/edit/:id', async(req,res) => {
	var id = req.params.id;
	var task = await Task.findById(id);
	res.render('edit', {task});
})


// Ruta para efectuar la actualizacion de los datos utilizando el metodo update()
app.post('/edit/:id', async(req,res) => {
	// Los datos llegan en req.body
	var id = req.params.id;
	await Task.updateOne({_id: id}, req.body);
	res.redirect('/');
})

// Esta ruta permita modificar el estatus de una tarea por medio de su propiedad status. 
// Necesitamos buscar el task en la BD por medio de findById, una vez encontrado el registro hay que modificar el status y guardar con save(). 
app.get('/turn/:id', async (req, res, next) => {
	var id = req.params.id;
	var task = await Task.findById(id);

	task.status = !task.status;
	await task.save();
	res.redirect('/');
});

// Ruta que nos permita eliminar tareas con el método "deleteOne"
app.get('/delete/:id', async (req,res) => {
	var id = req.params.id;
	await Task.remove({_id: id});
	res.redirect('/');
})

module.exports = app;