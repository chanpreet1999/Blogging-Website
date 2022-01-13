const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload')
let initialPath = path.join(__dirname, 'public');

const app = express();
app.use(express.static(initialPath));
app.use(fileUpload());

app.get('/', (req, res) => {
    res.sendFile( path.join(initialPath, 'home.html') )
});

app.get( '/editor', (req, res) => {
    res.sendFile( path.join(initialPath, 'editor.html') );
});

app.post('/upload', (req, res) => {
    try{
        let file = req.files.image;
        let date = new Date();
        // image name
        let imageName = date.getDate() + date.getTime() + file.name;
         // image upload path
        let path = `public/uploads/${imageName}`;

        //create upload
        file.mv(path, (err, result) => {
            if(err){
                throw err
            }
            else{
                res.json(`uploads/${imageName}`);                
            }
        });

    }catch(err) {
        console.log(err);
    }    
});

app.get('/:blog', (req, res) => {
    res.sendFile( path.join(initialPath, 'blog.html') )
});

app.use((req, res) => {
    res.json('404')
});

app.listen("3000", () => {
    console.log("listening...");
})

