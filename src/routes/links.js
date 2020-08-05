const express =require('express');
const router = express.Router();

const pool = require('../database');
const {ValidSession} =require('../lib/auth');

router.get('/add',ValidSession,(req,res) =>{
  res.render('links/add');
});

router.post('/add',ValidSession,async(req, res) => {
  const {title,url,description} = req.body;
  const newlink = {
    title,
    url,
    description
  };
 //? significael dato que se le va apasar
  await pool.query('insert into links set ?',[newlink]);
  req.flash('success','Link guardado exitosamente');
  //console.log(newlink);
  res.redirect('/links');

});

router.get('/',ValidSession,async(req,res) =>{
  const links = await pool.query('select * from links');
//console.log(links);
  res.render('links/list',{ links });
});

router.get('/delete/:id', ValidSession,async(req,res) =>{
  //console.log( req.params.id );
  const { id } = req.params;
  await pool.query ('delete from links where id = ?',[id]);
  req.flash('success','Link eliminado exitosamente');
   res.redirect('/links');
});

router.get('/edit/:id',ValidSession,async(req,res) =>{
  const { id } = req.params;
  const links = await pool.query('select * from links where id= ?',[id]);
 //console.log(links[0]);//solo optenemos un objeto no el arreglo completo

  res.render('links/edit',{link: links[0]});
});

router.post('/edit/:id',ValidSession,async (req, res) => {
  const {id} = req.params;
  const { title, url ,description} = req.body;
  const newlink ={
    title,
    url,
    description
  };
  //console.log(newlink);
  await pool.query('update links set ? where id = ?',[newlink, id]);
  req.flash('succes','link editado exitosamente');
  res.redirect('/links');
});

module.exports = router;