const express = require('express')
const path = require('path')
const app = express()

const port = process.env.PORT || 3000



const publicDir = path.join(__dirname ,'../static')
app.use(express.static(publicDir))


app.get('*', (req,res) =>{
  res.sendFile(publicDir+'/cellAuto.html')

})

app.listen(port, ()=>{
  console.log('server runnig')
})
