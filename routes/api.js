'use strict';

const mongoose = require('mongoose');
const mongodb = require('mongodb');

module.exports = function (app) {
  
  mongoose.connect(process.env.MONOGO_URI || 'mongodb://localhost/issue-tracker', { useNewUrlParser: true }, { useUnifiedTopology: true } );

  const blogSchema = new mongoose.Schema({
    issue_title: {type: String, required: true},
    issue_text: {type: String, required: true},
    created_by: {type: String, required: true},
    assigned_to : String,
    status_text : String,
    open: {type: Boolean, required: true},
    created_on: {type: Date, required: true},
    updated_on: {type: Date, required: true},
    project: String
  });
  
 let Blog = mongoose.model('Blog', blogSchema);
  
  app.route('/api/issues/:project')
  
    .get(function (req, res){
      let project = req.params.project;
       let filterObj = Object.assign(req.query);
    filterObj['project'] = project;
    Blog.find(
   //  {project: project},
    filterObj,
      (error, results) => {
        if(!error && results) {
         return res.json(results) 
        }
      }
      
    )
    })
    
    .post(function (req, res){
         let project = req.params.project;
    
         //Validation test
         if(req.body.issue_title === ''|| !req.body.issue_text === ''|| req.body.create_by === ''){
          return res.json('Required fields are missing from the request')
          } 
         let newBlogPost = Blog({
         issue_title: req.body.issue_title,
         issue_text: req.body.issue_text,
         created_by: req.body.created_by,
         assigned_to: req.body.assigned_to || '',
         status_text: req.body.status_text || '',
         open: true,
         created_on: new Date().toUTCString(),
         updated_on: new Date().toUTCString(),
         project: project
      })
           newBlogPost.save((error, data) => {
            if(!error && data){
            return res.json(data);
        }
      })
      
    })
    
    .put(function (req, res){
      let project = req.params.project;
      let updateObj = {};
      
      Object.keys(req.body).forEach((key) =>{
        if(req.body[key] != ''){
          updateObj[key] = req.body[key]
        }
      })
    
    if(Object.keys(updateObj).length < 2){
      return res.json('No updated fields sent');
    }
    //update date to current date
       updateObj['updated_on'] = new Date().toUTCString(); 
    Blog.findByIdAndUpdate(
      req.body._id,
      updateObj,
      {new: true},
      (err, data) => {
        if(!err && data){
          return res.json('successfully updated')
        } else if(!data){
          return res.json('no update field sent '+ req.body._id)
        }
      }
                                
    )
    })
    
    .delete(function (req, res){
      let project = req.params.project;
      if(!req.body._id){
        return res.json('id error')
      }
      Blog.findByIdAndRemove(req.body._id, (err, data) => {
       if(!err && data){
         res.json('deleted '+ data.id)
       }else if(!data){
         res.json('could not delete '+ req.body._id)
       }
     })
    });
    
};
