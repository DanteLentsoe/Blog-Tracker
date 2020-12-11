const chaiHttp = require('chai-http');
const chai = require('chai');
const assert = chai.assert;
const server = require('../server');

chai.use(chaiHttp);

let iden1 = ''
let iden2 = ''

suite('Functional Tests', function() {
  
    suite('POST /api/issues/{project} => object with issue data', function() {
      
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.assigned_to, 'Chai and Mocha');
          assert.equal(res.body.status_text, 'In QA');
          assert.equal(res.body.project, 'test');
          iden1 = res.body._id;
          console.log('id 1 has been allocated as ' + iden1)
          done();
        });
      });
      
       test('Required fields filled in', function(done) {
        chai.request(server)
        .post('/api/issues/test')
        .send({
          issue_title: 'Title 2',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
      }) 
         .end(function(err, res){
          assert.equal(res.status, 200);
          assert.equal(res.body.issue_title, 'Title');
          assert.equal(res.body.issue_text, 'text');
          assert.equal(res.body.created_by, 'Functional Test - Every field filled in')
          assert.equal(res.body.assigned_to, '');
          assert.equal(res.body.status_text, '');
          assert.equal(res.body.project, 'test');
          iden2 = res.body._id;
          console.log('id 2 has been allocated as ' + iden2);
          done();
        });
      });
      
      test('Missing required fields', function(done) {
         chai.request(server)
         .post('/api/issues/test')
         .send({
           issue_title: 'Title'
         })
         .end(function(err, res){
           assert.equal(res.body, 'Required fields are missing from the request')
           done();
         });
      });

      //suite Post Closing Tags
});
  
   suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({   //Characters is less than 2
        })
        .end(function(error, response){
          assert.equal(response.body, 'no updated field sent')
          done();
        })
      });
      
      test('One field to update', function(done) {
        chai.request(server)
        .put('/api/issues/test')
        .send({
          _id: iden1,
          issue_text: 'new text'
        })
        .end(function(err, res){
          assert.equal(res.body, 'sucessfully updated')
          done();
        })
      });
      
      test('Multiple fields to update', function(done) {
         chai.request(server)
        .put('/api/issues/test')
        .send({
           _id: iden2,
           issue_title: 'new title',
           issue_text: 'new text'
         })
        .end(function(err, res){
           assert.equal(res.body, 'successfully updated')
           done();
         })
      });
 //suite put closing tags      
    });

     suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          //id sent for delete
        })
        .end(function(err, res){
          assert.equal(res.body, 'id error')
          done();
        }); 
      });
      
      test('Valid _id', function(done) {
        chai.request(server)
        .delete('/api/issues/test')
        .send({
          _id: iden1
        })
        .end(function(err, res){
          assert.equal(res.body, 'deleted '+ iden1)
        });
        chai.request(server)
        delete('/api/issues/test')
        .send({
          _id: iden2
        })
        .end(function(err, res){
          assert.equal(res.body, 'deleted '+ iden2)
      });
      
    });
//suit delete closing tags
});
      
//closing tag Functional Tests
});