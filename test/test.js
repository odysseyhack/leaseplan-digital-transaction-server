var expect = require('chai').expect;
const express = require('express')
const { addRoutes } = require('../server/server')

describe('addRoutes()', function () {
    it('should add new routes', function () {
      
      // 1. ARRANGE
      const app = express()
  
      // 2. ACT
      addRoutes(app, function(tx, res) {

      })

      console.log(app._router.stack)
      var forwardRoute = app._router.stack.filter(function(route) {
          if (route.path === '/forward-transaction') {
              return true;
          }
          return false;
      })
  
      // 3. ASSERT
      expect(app._router.stack).to.not.be.null
      expect(forwardRoute).to.not.be.null
  
    });
  });