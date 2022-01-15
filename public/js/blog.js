let blogId = decodeURI( location.pathname.split('/').pop() );

let docRef = db.collection('blogs').doc(blogId);

docRef.get().then( (doc) => {
    if( doc.exists ) {
        setupBlog( doc.data() );
    } else {
        location.replace('/')
    }
}
).catch( (err)=>{ 
    console.log(err) 
} );

const setupBlog = (data) => {
    const banner = document.querySelector('.banner');
    const blogTitle = document.querySelector('.title');
    const titleTag = document.querySelector('.title');
    const publish = document.querySelector('.published');
    const article = document.querySelector('.article');
    

    banner.style.backgroundImage = `url(${data.bannerImage})`;

    titleTag.innerHTML += blogTitle.innerHTML = data.title;
    publish.innerHTML  += data.publishedAt;
    publish.innerHTML  += ` -- ${data.author ? data.author : "Unknown"}`;

    try{
        
        if(data.author == auth.currentUser.email.split('@')[0] ) {
            let editBtn = document.getElementById('edit-blog-btn');
            editBtn.style.display = 'inline';
            editBtn.href = `${blogId}/editor`;
        }

    } catch(err) {
        //no user logged in
        console.log('no user logged in');
    }
    
    addArticle( article, data.article );

}

const addArticle = (ele, data) => {
    data =  data.split('\n').filter( item => item.length )    
    
    data.forEach(item => {
        if( item[0] == '#' ) {
            let i = 0;
            let hCount = 0;
            while(item[i] == '#')
            {
                hCount++
                i++;
            }

            let tag = `h${hCount}`
            ele.innerHTML += `<${tag}>${item.slice(hCount, item.length)}</${tag}>`
        }
        // ![img4.png](uploads/1642105744077img4.png)

        else if( item[0] == '!' && item[1] == '[' ) {
            let seperator;
            
            for(let i = 0; i < item.length; i++) {
            
                if(item[i] == ']' && item[i+1] =='(' && item[item.length-1] == ')') {
                    seperator = i;
                }
            }
            
            let alt = item.slice(2, seperator);
            let src = item.slice( seperator + 2, item.length - 1 );
            
            ele.innerHTML += `
            <img src="${src}" alt = "${alt}" class = "article-image">
            `;
 
        }
        else{
            ele.innerHTML += `<p>${item}</p>`
        }
        
    });
} 
