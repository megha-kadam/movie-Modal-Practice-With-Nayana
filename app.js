const cl = console.log;

const backDrop = document.getElementById('backDrop');
const movieModal = document.getElementById('movieModal');
const addMovie = document.getElementById('addMovie');
const movieForm = document.getElementById('movieForm');
const movieTitle = document.getElementById('movieTitle');
const movieimgurl = document.getElementById('movieimgurl');
const movieDescription = document.getElementById('movieDescription');
const movieRating = document.getElementById('movieRating');
const movieContainer = document.getElementById('movieContainer');
const modalClose = [...document.querySelectorAll('.modalClose')];
const addMovieBtn = document.getElementById('addMovieBtn');
const updateMovieBtn = document.getElementById('updateMovieBtn');

let movieArr = [
//     {
//     title: "start up",
//     description: "Two boys are becoming real adults during a turbulent time as they experience a world that doesn't go their way",
//     imgURL :'https://www.pride.com/media-library/image.jpg?id=59944592&width=1200&quality=85',
//     rating: "4",
//     movieId : '123',
// }
];

if(localStorage.getItem('movieArr')){
    movieArr = JSON.parse(localStorage.getItem('movieArr'))
}


const generateUuid = ()=> {
    return (
      String('xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx')
    ).replace(/[xy]/g, (character) => {
      const random = (Math.random() * 16) | 0;
      const value = character === "x" ? random : (random & 0x3) | 0x8;
      return value.toString(16);
});
};

const setRating = (rating) => {
    if(rating > 4){
        return 'bg-success'
    }else if(rating > 3 && rating <= 4){
        return 'bg-warning'
    }else{
        return 'bg-danger'
    }
}

const onEditMovie = (ele) => {
    let editId = ele.closest('div.col-md-3').id;
    cl(editId);
    localStorage.setItem('editId', editId);

    let editObj = movieArr.find(movie => movie.movieId === editId);
    cl(editObj);

    localStorage.setItem('movieArr', JSON.stringify(movieArr));
    movieTitle.value = editObj.title;
    movieimgurl.value = editObj.imgURL;
    movieDescription.value = editObj.description;
    movieRating.value = editObj.rating;

    addMovieBtn.classList.add('d-none');
    updateMovieBtn.classList.remove('d-none');
}

const onRemovieMovie = (ele) => {
    let getConfirm = confirm(`Are you sure for remove this movie`);
    cl(getConfirm);

    if(getConfirm){
        let removeId = ele.closest('div.col-md-3').id;
        cl(removeId);

        let getIndex = movieArr.findIndex(movie => movie.movieId === removeId);
        cl(getIndex);
        movieArr.splice(getIndex, 1);

        localStorage.setItem('movieArr', JSON.stringify(movieArr));

        ele.closest('div.col-md-3').remove();
    }
}

const createMovieCard = (arr) => {
    let result = '';
    arr.forEach(ele => {
        result += `<div class="col-md-3" id='${ele.movieId}'>
                        <figure class="movieCard">
                          
                             <img src="${ele.imgURL}"
                              alt="${ele.title}" title="${ele.title}">
                       
                        <figcaption>
                    
                             <div class="ratingTitle">
                                <div class="row">
                                    <div class="col-10">
                                        <h5 class="m-0">${ele.title}</h5>
                                    </div>
                                    <div class="col-2">
                                        <small class="rating ${setRating(ele.movieRating)} p-2">${ele.rating}</small>
                                    </div>
                                </div>
                             </div>
                             <div class="movieInfo">
                                <h2>${ele.title}</h2>
                                <p class="overview">${ele.description}</p>
                             </div>
                             <div class="action">
                                <button class="btn btn-sm btn-outline-info" onclick='onEditMovie(this)'>Edit</button>
                                <button class="btn btn-sm btn-outline-danger" onclick='onRemovieMovie(this)'>Remove</button>
                             </div>
                        </figcaption>
                        </figure>
                    </div>`
                    movieContainer.innerHTML = result
    })
}
createMovieCard(movieArr);

const onToggleMovie = () => {
    backDrop.classList.toggle('active');
    movieModal.classList.toggle('active');
}

const  onMovieSubmit = (eve) => {
    eve.preventDefault();
    let movieObj = {
        title : movieTitle.value,
        imgURL : movieimgurl.value,
        description : movieDescription.value,
        rating : movieRating.value,
        movieId : generateUuid(),
    }
    cl(movieObj)
    movieForm.reset();
    movieArr.unshift(movieObj);
    localStorage.setItem('movieArr', JSON.stringify(movieArr));

    let card = document.createElement('div');
    card.className = 'col-md-3';
    card.id = movieObj.movieId;
    card.innerHTML = ` <figure class="movieCard">
                          
                             <img src="${movieObj.imgURL}"
                              alt="${movieObj.title}" title="${movieObj.title}">
                       
                        <figcaption>
                    
                             <div class="ratingTitle">
                                <div class="row">
                                    <div class="col-10">
                                        <h5 class="m-0">${movieObj.title}</h5>
                                    </div>
                                    <div class="col-2">
                                        <small class="rating ${setRating(movieObj.movieRating)} p-2">${movieObj.rating}</small>
                                    </div>
                                </div>
                             </div>
                             <div class="movieInfo">
                                <h2>${movieObj.title}</h2>
                                <p class="overview">${movieObj.description}</p>
                             </div>
                             <div class="action">
                                <button class="btn btn-sm btn-outline-info" onclick='onEditMovie(this)'>Edit</button>
                                <button class="btn btn-sm btn-outline-danger" onclick='onRemovieMovie(this)'>Remove</button>
                             </div>
                        </figcaption>
                        </figure>`
    movieContainer.prepend(card);
    onToggleMovie()

}
const onUpdateMovie = () => {
    let updateId = localStorage.getItem('editId');
    let updateObj = {
        title : movieTitle.value,
        imgURL : movieimgurl.value,
        description : movieDescription.value,
        rating : movieRating.value,
        movieId : updateId,
    }
    cl(updateObj);
    movieForm.reset();
    
    let getIndex = movieArr.findIndex(movie => movie.movieId === updateId);
    cl(getIndex);
    movieArr[getIndex] = updateObj;

    localStorage.setItem('movieArr', JSON.stringify(movieArr));
    addMovieBtn.classList.remove('d-none');
    updateMovieBtn.classList.add('d-none');

    let card = [...document.getElementById(updateId).children]
    cl(card);
    card[1].innerHTML = updateObj.title;
    card[2].innerHTML = updateObj.imgURL;
    card[3].innerHTML = updateObj.description;
    card[4].innerHTML = updateObj.rating;

}

addMovie.addEventListener('click', onToggleMovie);
movieForm.addEventListener('submit', onMovieSubmit);
modalClose.forEach(ele => ele.addEventListener('click', onToggleMovie));
updateMovieBtn.addEventListener('click', onUpdateMovie)
