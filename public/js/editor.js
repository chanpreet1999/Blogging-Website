const blogTitleField = document.querySelector('.title');
const articleField = document.querySelector('.article');

//banner
const bannerImage = document.querySelector('#banner-upload');
const banner = document.querySelector('.banner');

let bannerPath;
let months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const publishBtn = document.querySelector('.publish-btn');
const uploadInput = document.querySelector('#image-upload');

bannerImage.addEventListener('change', () => {
    uploadImage(bannerImage, "banner");
});

uploadInput.addEventListener('change', () => {
    uploadImage(uploadInput, 'image');
});

const uploadImage = (uploadFile, uploadType) => {
    const [file] = uploadFile.files;
    if (file && file.type.includes('image')) {
        let formData = new FormData();
        formData.append('image', file);

        fetch('/upload', {
            method: 'post',
            body: formData
        })
            .then(res => res.json())
            .then(data => {
                if (uploadType === 'image') {
                    // if upload type is image then the data will contain image path
                    addImage( data, file.name )
                }
                else {
                    bannerPath = `${location.origin}/${data}`;
                    banner.style.backgroundImage = `url("${bannerPath}")`
                }
            })
    } 
    else {
        alert('upload image only');
    }
}

const addImage = (imagePath, alt) => {
    let curPos = articleField.selectionStart;
    let textToInsert = `\r![${alt}](${imagePath})\r`;
    articleField.value = articleField.value.slice(0, curPos) + textToInsert + articleField.value.slice(curPos);
}


publishBtn.addEventListener('click', () => {
    if(articleField.value.length && blogTitleField.value.length) {
        let docName;
        if(blogID[0] == 'editor') {
            let letters = 'abcdefghijklmnopqrstuvwxyz';
            let blogTitle = blogTitleField.value.split(' ').join('-');
            let id = '';
            for(let i = 0; i < 4; i++) {
                id += letters[ Math.floor( Math.random() * letters.length ) ]
            }

            // doc name
            docName = `${blogTitle}-${id}`;
        }
        else {
            docName = decodeURI(blogID[0])
        }
        
        let date = new Date(); // for publish info
        
        //access firestore with db
        db.collection('blogs').doc(docName).set({
            title: blogTitleField.value,
            article: articleField.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`, // getmonth returns an integer month
            author : auth.currentUser.email.split('@')[0]
        })
        .then( () => {
            console.log('Date entered');
            location.href = `/${docName}`
        })
        .catch( (err) =>{
            console.error(err)
        })
    }
})

//check if user logged in
auth.onAuthStateChanged( (user) => {
    if(!user) {
        location.replace('/auth');  // redirect to login page
    }
})

//checking for existing blog edits
let blogID = location.pathname.split('/');
try{
    blogID.shift();
}
catch(err) {
    console.log('error encountered while checking if the blog esists or not');
}

if(blogID[0] != 'editor') {
    //it is an existing blog
    db.collection('blogs').doc( decodeURI( blogID[0]) ).get().then( (doc) => {
      
        if(doc.exists) {
            let data = doc.data();
            bannerPath = data.bannerImage;
            banner.style.backgroundImage = `url(${bannerPath})`;
            blogTitleField.value = data.title;
            articleField.value = data.article;  
        }
        else {
            location.replace('/') // home page
        }
    }) 
}