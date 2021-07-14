//DOM
const $ = document.querySelector.bind(document);
const $$ = document.querySelectorAll.bind(document);

const loading = $('.loading');
const canvas_paint = $('#canvas-project');
//
// Thông tin cấu hình của data trong firebase
var firebaseConfig = {
    apiKey: 'AIzaSyCP5-shkb0226nspjgb2akGZvF-7S-Q1eY',
    authDomain: 'url-image-address-data.firebaseapp.com',
    databaseURL:
        'https://url-image-address-data-default-rtdb.asia-southeast1.firebasedatabase.app/',
    projectId: 'url-image-address-data',
    storageBucket: 'url-image-address-data.appspot.com',
    messagingSenderId: '973998855189',
    appId: '1:973998855189:web:3495d160485069fce42a1c',
    measurementId: 'G-GDNQ4Z1G3W',
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.analytics();

//validate
let arrImgs1 = [];
let arrImgs2 = [];

// Gọi Dữ liệu
function getValue(val) {
    var dataImg;
    let ref = firebase.database().ref();
    var dataImgRef = ref.child(val);

    dataImgRef
        .once('value')
        .then(function (snapshot) {
            dataImg = snapshot.val();
        })
        .then(
            function (readCountTxn) {
                if (val === '0') {
                    arrImgs1 = dataImg;
                } else if (val === '1') {
                    arrImgs2 = dataImg;
                }
                
                setTimeout(function(){
                    getDataImgUrl(arrImgs1, arrImgs2);
                    hideLoadingCanvas();
                },3000)
            },
            function (error) {
                console.error(error);
                showLoadingCanvas();
            },
        );
}
// Ẩn loading
function hideLoadingCanvas() {
    loading.style.display = 'none';
    canvas_paint.style.display = 'block';
    canvas_paint.style.transition = '1s ease-in-out';
}

// show loading
function showLoadingCanvas() {
    loading.style.display = 'block';
}

// lấy giá trị dữ liệu từ firebase
window.addEventListener(
    'load',
    () => {
        getValue('0');
        getValue('1');
    },
    false,
);
