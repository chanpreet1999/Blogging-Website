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
        let blogTitle = blogTitleField.value.split(' ').join('-');
        let id = '';
        let letters = 'abcdefghijklmnopqrstuvwxyz';
        for(let i = 0; i < 4; i++) {
            id += letters[ Math.floor( Math.random() * letters.length ) ]
        }

        // doc name
        let docName = `${blogTitle}-${id}`;

        let date = new Date(); // for publish info
        
        //access firestore with db
        db.collection('blogs').doc(docName).set({
            title: blogTitleField.value,
            article: articleField.value,
            bannerImage: bannerPath,
            publishedAt: `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}` // getmonth returns an integer month
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