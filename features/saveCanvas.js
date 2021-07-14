// DOM Element
const btn_show_save = $('#save');
const name_canvas = $('.paint__name-canvas');
const btn_create = $('.paint__btn-create');
const btn_cancel = $('.paint__btn-cancel');
const table_img = $('.paint__table-img');
const img_canvas = $('.paint__img-canvas');
const input_name = $('.paint__input-name');
const error_input = $('.paint__error-input');
const listImg = $('#listImg');
//validate
let title;
let url_img;
let date;
let url_img_sample;

let counter = 0;
let arrBox = [];
let urlImgArr = [];

let arrUrlData = [];
const IMG_DATA_DEF =
    'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTM_W4e0q5AC-CNERlnCU_hiXJEZZCBLZ-iwvluMCaGesBJi8BzCyj-5dzEil4-lfo1b5Q&usqp=CAU';

var isSave = false;
//class tạo đối tượng sản phẩm ảnh
class addressImgCanvas {
    constructor(id, title, url_img, date, url_img_sample) {
        this.id = id;
        this.title = title;
        this.url_img = url_img;
        this.date = date;
        this.url_img_sample = url_img_sample;
    }
    getValue() {
        return {
            id: this.id,
            title: this.title,
            url_img: this.url_img,
            date: this.date,
            url_img_sample: this.url_img_sample,
        };
    }
}

// truy cập vào localStorage để lấy ra data
let dataImgSave = JSON.parse(localStorage.getItem('img_products'));
//function

// function imgProductData(dataImgSave, key) {}

// check dữ liệu đầu vào
if (dataImgSave) {
    // kiểm tra dữ liệu đầu vào nếu có phần từ bị undefined thì xoá phần tử đó ra
    dataImgSave = dataImgSave.filter((a) => a);
    for (let i = 0; i < dataImgSave.length; i++) {
        //lấy id của img product cuối gán cho counter
        num_id = dataImgSave[dataImgSave.length - 1].id;
        dataImgSave === null ? (counter = 0) : (counter = num_id);

        let dataImgSav = dataImgSave.slice().reverse();
        setImgSaveMode(dataImgSave);
        showImgCanvas(dataImgSav[i].url_img, false);
    }
} else {
    dataImgSave = [];
}

//show imgDefaut khi ko có data img nào được trả về cho đỡ trống, hiện tại chưa có ảnh nào đẹp
// nên lấy đại logo đông á để đỡ
function showImgCanvasDefaut() {
    if (dataImgSave.length <= 0) {
        setimgDefaut(IMG_DATA_DEF);
    } else {
        setimgDefaut('');
    }

    function setimgDefaut(dataImg) {
        if (table_img) {
            if (dataImg) {
                const img_defaut = document.createElement('img');
                img_defaut.src = dataImg;
                img_defaut.setAttribute('class', 'paint__img-def');
                table_img.appendChild(img_defaut);
            }
        }
    }
}

//mở cửa sổ nhập tên tác phẩm
function toggleSaveTable() {
    name_canvas.classList.add('active');
    blur.style.filter = 'blur(5px)';
}

// đóng cửa sổ bảng lưu từ bên ngoài body
function removePopupImgCanvas() {
    window.onclick = (e) => {
        if (
            !e.target.closest('.paint__table-img') &&
            !e.target.closest('#save') &&
            !e.target.closest('.paint__img-canvas') &&
            !e.target.closest('#delete') &&
            !e.target.closest('#save-canvas') &&
            !e.target.closest('paint__img-content')
        ) {
            table_img.classList.remove('active');
            img_canvas.classList.remove('active');
        }
    };
}

//đóng cửa sổ nhập tên tác phẩm
function closeFormSaveTable() {
    if (!isSave) {
        input_name.value = '';
    }
    name_canvas.classList.remove('active');
    blur.style.filter = 'blur(0px)';
    blur.setAttribute('style', '');
    error_input.innerHTML = '&nbsp;';
    input_name.classList.remove('active');
}

// tạo div img_content gán giá trị + remove dataImg + save dataImg
function setImgSaveMode(dataImgSav) {
    if (table_img) {
        if (typeof dataImgSav == 'undefined') {
            dataImgSav = [];
        }
        table_img.innerHTML = '';
        for (let i = 0; i < dataImgSav.length; i++) {
            const img_content = document.createElement('div');
            if (typeof dataImgSav[i] !== 'undefined') {
                img_content.classList.add(`paint__img-content`);
                // nếu tên sản phẩm quá dài thì cắt đi và thêm dấu ...
                let title_img = dataImgSav[i].title;
                if (dataImgSav[i].title.length > 12) {
                    title_img = dataImgSav[i].title.slice(0, 12) + '...';
                }
                const img_data = `<div class="paint__img-title">
                                    <span class="paint__h2">${title_img}</span>
                                    <span class="paint__img-time">
                                        ${dataImgSav[i].date}
                                    </span>
                                </div>
                                <div class="paint__img-option">
                                    <button id="save-canvas">
                                        <i class="fas fa-download"></i>
                                    </button>
                                    <button id="delete">
                                      <i class="fas fa-trash"></i>
                                    </button>
                                    <button id="seen" data-img=${dataImgSav[i].url_img} data-img-sample=${dataImgSav[i].url_img_sample}>
                                        <i class="fas fa-eye"></i>
                                    </button>
                                </div>`;
                img_content.innerHTML = img_data;
                table_img.appendChild(img_content);
            }
        }

        // xoá img_content
        const btn_deletes = $$('#delete');
        for (let i = 0; i < btn_deletes.length; i++) {
            btn_deletes[i].onclick = () => {
                deleteImgData(i, dataImgSav);
            };
        }

        // lưu hình ảnh về máy
        const btn_saves = $$('#save-canvas');
        for (let i = 0; i < btn_saves.length; i++) {
            btn_saves[i].onclick = () => {
                saveImgCanvas(i, dataImgSav);
            };
        }

        // khi click vào img_content thì chay chức năng sửa ảnh, nếu click vào btn-save, delete,
        // upload thì sẽ ko chạy
        const img_content = $$('.paint__img-content');
        for (let i = 0; i < img_content.length; i++) {
            img_content[i].onclick = (e) => {
                if (e.target.closest('.paint__img-content:not(.active)')) {
                    if (
                        !e.target.closest('#save-canvas') &&
                        !e.target.closest('#delete') &&
                        !e.target.closest('#seen')
                    ) {
                        handleImgDataSaveFile(i, dataImgSav);
                    }
                }
            };
        }
    }
}

// chức năng sửa data img
function handleImgDataSaveFile(i, dataImgSav) {
    const img_content = $$('.paint__img-content');
    for (let j = 0; j < img_content.length; j++) {
        img_content[j].classList.remove('active');
    }
    isSave = true;
    arrUrlData.push(dataImgSav[i]);
    getImgDataSaveFile(dataImgSav[i]);
    img_content[i].classList.add('active');
    img_canvas.classList.remove('active');
    let data = arrUrlData[arrUrlData.length - 1];
    if (isSave) {
        input_name.value = data.title;
    } else {
        input_name.value = '';
    }
}
// lấy dữ liệu từ img_content rồi set dữ liệu cho func setBgBoardPaint để show sản phẩm ra màn hình
function getImgDataSaveFile(data) {
    setBgBoardPaint(data.url_img, data.url_img_sample);
    table_img.classList.remove('active');
}

//chức năng delete img_content
function deleteImgData(i, dataImgSav) {
    showImgCanvas(null, dataImgSav[i].url_img);
    dataImgSav.splice(i, 1);
    localStorage.setItem('img_products', JSON.stringify(dataImgSav));
    setImgSaveMode(dataImgSav);

    table_img.classList.add('active');
    img_canvas.classList.remove('active');
    showImgCanvasDefaut();
}

// Chức năng save hình ảnh về máy
function saveImgCanvas(i, dataImgSav) {
    let dataURL = dataImgSav[i].url_img;
    downloadImage(dataURL, 'canvas.jpeg');
}

// tải ảnh về
function downloadImage(data, filename = 'untitled.jpeg') {
    var a = document.createElement('a');
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
}

// show hình ảnh của thẻ tương ứng
function showImgCanvas(urlImg, urlImgOld) {
    const btn_seens = $$('#seen');
    const img_content = $$('.paint__img-content');
    if (urlImgOld) {
        for (let i = 0; i < urlImgArr.length; i++) {
            if (urlImg !== null) {
                if (urlImgArr[i] == urlImgOld) {
                    urlImgArr.splice(i, 1, urlImg);
                }
            } else {
                if (urlImgArr[i] == urlImgOld) {
                    urlImgArr.splice(i, 1);
                }
            }
        }
    } else {
        urlImgArr.unshift(urlImg);
    }
    let t,
        hoverTime = 5000;
    if (urlImgArr) {
        for (let i = 0; i < urlImgArr.length; i++) {
            if (img_content.length > 0) {
                btn_seens[i].onclick = () => {
                    for (let j = 0; j < urlImgArr.length; j++) {
                        img_canvas.innerHTML = '';
                        clearTimeout(t);
                    }
                    const imgEle = `<img src="${urlImgArr[i]}" class="img" crossOrigin="anonymous"/>`;
                    img_canvas.classList.add('active');
                    img_canvas.innerHTML = imgEle;
                    t = setTimeout(setTimeImgCanvas, hoverTime);
                };
            }
        }
    }
    // tạo hiệu ứng tự đóng sau 5s khi ko có tác động
    function setTimeImgCanvas() {
        img_canvas.classList.remove('active');
    }
}

//Tạo thông tin giờ + date
function getDateCanvasSave() {
    var d = new Date();
    const hours = `0${d.getHours()}`.slice(-2);
    const minutes = `0${d.getMinutes()}`.slice(-2);

    const day = `0${d.getDay()}`.slice(-2);
    const month = `0${d.getMonth()}`.slice(-2);
    const year = d.getFullYear();

    return `${hours}h${minutes}~${day}/${month}/${year}`;
}

//lấy data tên tác phẩm
function handleChangeInputName(e) {
    var name = e.target.value;

    checkLengthValueInput(name);
}
// validate ô Tên tác phẩm(tên ko quá 20 kí tự, ko chứa kí tự đặc biệt(backend quy định))
function checkLengthValueInput(name) {
    if (name.length === 0) {
        checkIfFalse('Bạn phải nhập giá trị vào ô này!');
    } else if (name.length >= 20) {
        checkIfFalse('Không nhập quá 20 kí tự!');
    } else {
        let ReName = /^[a-zA-Z0-9\s]*$/i;
        if (ReName.test(name)) {
            error_input.innerHTML = '&nbsp;';
            input_name.classList.remove('active');
            title = name.trim();
            isCheckVal = true;
            handleBtnSaveCanvas(true);
        } else {
            checkIfFalse('Tên không chứa các kí tự đặc biệt!');
        }
    }
    function checkIfFalse(text) {
        error_input.innerText = text;
        input_name.classList.add('active');
        isCheckVal = false;
        handleBtnSaveCanvas(false);
    }
}

// thêm data + lấy URL data
function setDataImgData() {
    // nếu isSave = true thì thực hiện chức năng sửa dữ liệu
    if (isSave) {
        let data = arrUrlData[arrUrlData.length - 1];
        const date = getDateCanvasSave();
        let canvas = document.querySelector('#canvas');
        let dataURL = canvas.toDataURL('image/png', 1.0);
        let img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.setAttribute('class', 'img');
        img.src = dataURL;
        let dataImg = new addressImgCanvas(
            data.id,
            input_name.value == '' ? data.title : input_name.value,
            data.url_img == '' ? data.url_img : dataURL,
            date,
            data.url_img_sample,
        );
        if (dataImg) {
            if (dataImg.url_img.length > 14778) {
                for (let i = 0; i < dataImgSave.length; i++) {
                    if (dataImgSave[i].id === dataImg.id) {
                        dataImgSave.splice(i, 1, dataImg.getValue());
                        localStorage.setItem(
                            'img_products',
                            JSON.stringify(dataImgSave),
                        );
                    }
                }
                setImgSaveMode(dataImgSave);
                showImgCanvas(dataImg.url_img, data.url_img);
            }
        }
        input_name.value = '';
        clearCanvas();
        closeFormSaveTable();
        setBgBoardPaint('');
        isSave = false;
        url_img_sample = '';
    } else {
        // nếu isSave = false thì thực hiện chức năng thêm dữ liệu
        counter = counter + 1;
        const date = getDateCanvasSave();

        let canvas = document.querySelector('#canvas');
        let dataURL = canvas.toDataURL('image/png', 1.0);

        let img = new Image();
        img.setAttribute('crossOrigin', 'anonymous');
        img.setAttribute('class', 'img');
        img.src = dataURL;
        if (typeof url_img_sample === 'undefined') {
            url_img_sample = '';
        }
        // tạo đối tư
        if (input_name.value !== '') {
            checkLengthValueInput('');

            let dataImg = new addressImgCanvas(
                counter,
                input_name.value,
                (url_img = dataURL),
                date,
                url_img_sample,
            );
            if (dataImg) {
                dataImgSave.unshift(dataImg.getValue());
                localStorage.setItem(
                    'img_products',
                    JSON.stringify(dataImgSave),
                );
                setImgSaveMode(dataImgSave);
                showImgCanvas(dataURL);
            }

            clearCanvas();
            closeFormSaveTable();
            setBgBoardPaint('');
            isSave = false;
            sh_canvas.style.display = 'none';
            url_img_sample = '';
        }
        // addImgProductApi(dataImg.getValue());
    }
}

// hợp với điều kiện thì cho lưu ko thì thôi
function handleBtnSaveCanvas(isCheck) {
    if (isCheck) {
        btn_create.disabled = false;
        btn_create.addEventListener('click', setDataImgData, false);
    } else {
        btn_create.disabled = true;
    }
}
// khi người dùng xoá trang thì thông báo
function checkCanvasData() {
    if (index > -1) {
        return true;
    } else {
        return false;
    }
}
window.addEventListener('beforeunload', (event) => {
    const isCheck = checkCanvasData();
    if (isCheck === true) {
        event.preventDefault();
        event.returnValue = '';
    }
});
showImgCanvasDefaut();
//event
function toggleTodoListImgCanvas() {
    table_img.classList.toggle('active');
    table_geometry.classList.remove('active');
    removePopupImgCanvas();
}
btn_show_save.addEventListener('click', toggleTodoListImgCanvas);
btn_cancel.addEventListener('click', closeFormSaveTable);
input_name.addEventListener('input', handleChangeInputName);
listImg.addEventListener('click', toggleSaveTable);
