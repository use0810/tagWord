"use strict";
/* ============================================================
[Programs] 起動時の設定
[Outline] 
起動時の初期設定等
============================================================ */

// データベース作成
const db = new Dexie("WordDb");     // データベース作成
db.version(1).stores({              // テーブル作成
    words: "++id, japanese, english, *tags",
    tags: "tag"
});
// 一覧に全ての単語を表示
const wordIndexes = [];
db.words.toArray().then((records) => {
    records.forEach((record)=>{
        if( records !== undefined ){
            wordIndexes.push(record.id);
        }
    });
}).then(() => {
    cardDisplayFunc(wordIndexes);   // ※使用関数は一覧画面の検索処理のfunctionに記述
});

// db.delete();
// const tmp = ['tag'];
// for(var i = 0; i < 5000; i++ ){
// db.words.add({japanese: 'test', english: 'test note', tags: tmp});
// }


/* ============================================================
[Programs] ページ表示
[Outline] 
ページ切り替えの処理群
※ただし編集画面については別項にて扱う
============================================================ */

/* ============================Variable============================ */

const addWrapper = document.getElementById('addWrapper');  // コンテンツ（追加画面）
const editWrapper = document.getElementById('editWrapper');  // コンテンツ（編集画面）
const listWrapper = document.getElementById('listWrapper');  // コンテンツ（一覧画面）
const homeWrapper = document.getElementById('homeWrapper');  // コンテンツ（ホーム画面）※未実装
// const testWrapper = document.getElementById('testWrapper');  // コンテンツ（テスト画面）
const helpWrapper = document.getElementById('helpWrapper');  // コンテンツ（ヘルプ画面）

let currentTarget = listWrapper; // 現在の表示画面を記憶 初期値は一覧画面

const addFt = document.getElementById('ft-add'); // 画面切り替え着火（追加）
const listFt = document.getElementById('ft-list'); // 画面切り替え着火（リスト）
const homeFt = document.getElementById('ft-home'); // 画面切り替え着火（ホーム
// const testFt = document.getElementById('ft-test'); // 画面切り替え着火（テスト）※未実装
const helpFt = document.getElementById('ft-help'); // 画面切り替え着火（ヘルプ）

/* ============================Event============================ */

// 追加画面のページ表示
addFt.addEventListener('click', () => {
    // ページ切り替え処理
    if( currentTarget !== addWrapper ){
        currentTarget.classList.toggle('closed');
        addWrapper.classList.toggle('closed');
        currentTarget = addWrapper;
    }
});

// 一覧画面のページ表示
listFt.addEventListener('click', () => {
    if( currentTarget !== listWrapper ){
        // ページ切り替え処理
        currentTarget.classList.toggle('closed');
        listWrapper.classList.toggle('closed');
        currentTarget = listWrapper;
    }
});

// ホーム画面の表示 未実装
homeFt.addEventListener('click', () => {
    // ページ切り替え処理
    if( currentTarget !== homeWrapper ){
        currentTarget.classList.toggle('closed');
        homeWrapper.classList.toggle('closed');
        currentTarget = homeWrapper;
    }
});

// testFt.addEventListener('click', () => {
//     // ページ切り替え処理
//     if( currentTarget !== testWrapper ){
//         currentTarget.classList.toggle('closed');
//         testWrapper.classList.toggle('closed');
//         currentTarget = testWrapper;
//     }
// });

helpFt.addEventListener('click', () => {
    // ページ切り替え処理
    if( currentTarget !== helpWrapper ){
        currentTarget.classList.toggle('closed');
        helpWrapper.classList.toggle('closed');
        currentTarget = helpWrapper;
    }
});

// ポップアップ設定
const modal = document.getElementById('modal');
const modalOverlay = document.getElementById('modal-overlay');
const closeButton = document.getElementById('close-button');
const openButtons = document.querySelectorAll('.open-button');

closeButton.addEventListener('click', () => {
    modal.classList.toggle('closed');
    modalOverlay.classList.toggle('closed');
}); // 閉じるボタン

openButtons.forEach((openButton) => {
    openButton.addEventListener('click', () => {
        modal.classList.toggle('closed');
        modalOverlay.classList.toggle('closed');
    }); // 開くボタン
});


/* ============================================================
[Programs] 一覧画面の検索処理
[Outline] 
============================================================ */

/* ============================Variable============================ */

const searchWindowOptionsType = document.getElementById('searchWindow-options-type');
const searchWindowOptionsLogic = document.getElementById('searchWindow-options-logic');
const searchWindowSearchText = document.getElementById('searchWindow-search-text');
const searchWindowSearchSubmit = document.getElementById('searchWindow-search-submit');

/* ============================Function============================ */

// カードを一覧に表示する②。個別の処理。※編集画面時に再利用するので分割している。
function cardMakeFunc(record) {
        // 表示させるhtml
    const newTr = document.createElement("tr");
    const newTd1 = document.createElement("td");
    const newTd2 = document.createElement("td");
    const td1Text = document.createTextNode(record.english);
    const td2Text = document.createTextNode(record.japanese);

    // カードをロングタップ(1秒)したときに編集画面を表示する処理
    let timerCount = 0;
    let timerID;
    newTr.addEventListener('pointerdown', () => {
        timerID = setInterval(()=>{
            timerCount ++;
            if(timerCount /6 === 1){
                // 0.6秒過ぎたら編集画面処理に移行しインターバルを初期化
                editPageFunc(record.id, record.english,record.japanese,record.tags, newTr); 
                timerCount = 0;
                clearInterval(timerID);
            }
        }, 100);
    });
    // カードから指（orクリック）が離れたらインターバルを中止
    newTr.addEventListener('pointerup', () => {
        timerCount = 0
        clearInterval(timerID);
    });

    // 一時的な変数に表示情報を格納
    newTd1.appendChild(td1Text);
    newTd2.appendChild(td2Text);
    newTr.appendChild(newTd1);
    newTr.appendChild(newTd2);

    return newTr;
}

// カードを一覧に表示する①。引数には表示するカードのID群。
function cardDisplayFunc(wordIndexes){
    const searchResultTableBody = document.getElementById('searchResult-table-body');
    const tmpEleWords = document.createDocumentFragment();
    db.words.where('id').anyOf(wordIndexes).toArray().then((records) => {
        records.forEach((record)=>{
            if( records !== undefined ){
                const newTr = cardMakeFunc(record);
                tmpEleWords.prepend(newTr);
            }
        });
    }).then(() => {
        // 表示情報を実際に表示させる
        searchResultTableBody.prepend(tmpEleWords);
    });
}

/* ============================event============================ */

// タグ名⇔単語名ボタン切り替え
searchWindowOptionsType.addEventListener('click', () => {
    if(searchWindowOptionsType.textContent === 'タグ名'){
        searchWindowOptionsType.textContent = '単語名';
        searchWindowOptionsType.style.backgroundColor = '#7fff00';
    }else{
        searchWindowOptionsType.textContent = 'タグ名';
        searchWindowOptionsType.style.backgroundColor = '#ffa500';
    }
});

// 全て含む⇔一部含むボタン切り替え
searchWindowOptionsLogic.addEventListener('click', () => {
    if(searchWindowOptionsLogic.textContent === '全て含む'){
        searchWindowOptionsLogic.textContent = '一部含む';
        searchWindowOptionsLogic.style.backgroundColor = '#7fff00';
    }else{
        searchWindowOptionsLogic.textContent = '全て含む';
        searchWindowOptionsLogic.style.backgroundColor = '#ffa500';
    }
});

// 検索ボタンクリック時の処理
searchWindowSearchSubmit.addEventListener('click', () => {
    const keyWords = searchWindowSearchText.value.trim().split(/\s+/);
    // 表示している単語をクリアする
    const old = document.getElementById('searchResult-table-body');
    const clone = old.cloneNode(false);
    old.replaceWith(clone);

    // 検索システムで処理を分岐させる
    let searchID = 0;
    if(searchWindowOptionsType.textContent === 'タグ名') searchID += 1;
    if(searchWindowOptionsLogic.textContent === '全て含む' && keyWords.length > 1) searchID += 2;
    if(!keyWords[0] || !keyWords[0].match(/\S/g))  searchID = 4;

    let wordIndexes = [];

    // 検索システム
    new Promise((resolve) => {
        switch(searchID){
            case 0:     // 単語名＆一部含む
                let orWCount = 0;
                keyWords.forEach((keyWord) => {
                    db.words.where('english').startsWithIgnoreCase(keyWord).or('japanese').startsWithIgnoreCase(keyWord).toArray().then((records) => {
                        records.forEach((record)=>{
                            if( records !== undefined ){
                                wordIndexes.push(record.id);
                            }
                        });
                    }).then(() =>{
                        orWCount ++;
                        // keyWordの繰り返しの最後に重複したIDを削除する
                        if(orWCount === keyWords.length) {
                            // 重複を削除した配列
                            wordIndexes = wordIndexes.filter((x, i, self) => {
                                return self.indexOf(x) === i;
                            });
                            resolve();
                        }
                    });
                });
            break;
            case 1:     // タグ名＆一部含む
                db.words.where('tags').anyOfIgnoreCase(keyWords).toArray().then((records) => {
                    records.forEach((record)=>{
                        if( records !== undefined ){
                            wordIndexes.push(record.id);
                        }
                    });
                }).then(() => {
                    // 重複を削除した配列
                    wordIndexes = wordIndexes.filter((x, i, self) => {
                        return self.indexOf(x) === i;
                    });
                    resolve();
                });
            break;
            case 2:     // 単語名＆全て含む
                let andWCount = 0;
                keyWords.forEach((keyWord) => {
                    db.words.where('english').startsWithIgnoreCase(keyWord).or('japanese').startsWithIgnoreCase(keyWord).toArray().then((records) => {
                        records.forEach((record)=>{
                            if( records !== undefined ){
                                wordIndexes.push(record.id);
                            }
                        });
                    }).then(() =>{
                        if (andWCount !== 0){        // 最初の一回目は実行しない
                            wordIndexes = wordIndexes.filter((x, i, self) => {
                                // 重複のみを抜き出す
                                return self.indexOf(x) === i && i !== self.lastIndexOf(x);
                            });
                        }
                        andWCount ++;
                        if(andWCount === keyWords.length) {
                            resolve();
                        }
                    });
                });
            break;
            case 3:     // タグ名＆すべて含む
                let andTCount = 0;
                keyWords.forEach((keyWord) => {
                    db.words.where('tags').anyOfIgnoreCase(keyWord).toArray().then((records) => {
                        records.forEach((record)=>{
                            if( records !== undefined ){
                                wordIndexes.push(record.id);
                            }
                        });
                    }).then(() => {
                        if (andTCount !== 0){        // 最初の一回目は実行しない
                            wordIndexes = wordIndexes.filter((x, i, self) => {
                                // 重複のみを抜き出す
                                return self.indexOf(x) === i && i !== self.lastIndexOf(x);
                            });
                        }
                        andTCount++;
                        if(andTCount === keyWords.length) {
                            resolve();
                        }
                    });
                });
            break;
            case 4:     // 全て表示
                db.words.toArray().then((records) => {
                    records.forEach((record)=>{
                        if( records !== undefined ){
                            wordIndexes.push(record.id);
                        }
                    });
                }).then(() => {
                    resolve();
                });
            break;
            default:
            break;
        }
    }).then(() => {
        cardDisplayFunc(wordIndexes);
    });  
});


/* ============================================================
[Programs] 追加画面及びモーダル(タグ管理画面)処理
[Outline] 
一部編集画面に関わる処理を含む
→addTagFunc内での分岐

============================================================ */

/* ============================Variable============================ */
let tagArray = [];  // tagsテーブルのtagを変数を格納して扱いやすくする(データベースアクセスを減らす)
// let wordArray = []; // wordsテーブルのidを変数を格納して扱いやすくする(データベースアクセスを減らす)
const tagList = document.getElementById('tag-list');
const tagListCreate = document.getElementById('tag-list-create'); 
const tagListCreateText =document.getElementById('tag-list-create-text');
const tagListCreateButton =document.getElementById('tag-list-create-button');
const registerSubmitButton = document.getElementById('register-submit-button');

/* ============================Function============================ */

// 入力テキストをクリア
const clear = document.querySelectorAll('.clear');
clear.forEach((bt) => {
    bt.addEventListener('click',() => {
        bt.nextElementSibling.value = "";
    });
});

// 追加画面からタグを消去する
function cancelTagFunc(newTag){
    newTag.remove();
}
// 追加画面にタグを追加する
function addTagFunc(text){
    let parent = 0;
    let reference = 0;
    
    //もし追加画面なら追加画面に、編集画面なら編集画面にタグを追加する
    if(currentTarget === addWrapper){
        parent = document.getElementById('register-tags');
        reference = document.getElementById('register-tags-add');
    } else {
        parent = document.getElementById('edit-tags');
        reference = document.getElementById('edit-tags-add');
    }

    try {
        [].slice.call(parent.children).forEach((child) => {
            if (child.textContent === text) {   // もしタグが追加済みなら
                const timeModal = document.getElementById('time-modal');    // 表示要素の親要素
                const timeModalContent = document.createElement('div');
                timeModalContent.setAttribute('class', 'time-modal-content fade-out');
                timeModalContent.textContent = "このタグは追加済みです"; 
                timeModal.appendChild(timeModalContent);
                setTimeout(() => {
                    timeModalContent.remove();
                }, 3800);
                throw new Error('重複');
            }
        });

        const newTag = document.createElement('button');
        currentTarget === addWrapper ? newTag.setAttribute('class', 'register-tags-tag') : newTag.setAttribute('class', 'edit-tags-tag');
        newTag.textContent = text;
        parent.insertBefore(newTag, reference);

        newTag.addEventListener('click', () => {
            cancelTagFunc(newTag);
        });

        if (currentTarget !== addWrapper && currentTarget !== editWrapper) {
            throw new Error('追加画面もしくは編集画面ではない');
        }
        modal.classList.toggle("closed");
        modalOverlay.classList.toggle("closed");

    } catch (e) {
    }
}

// モーダル(ポップアップ)画面とテーブルからタグを削除する
function delTagFunc(newItemDel){
    const parent = newItemDel.closest('li');
    const tagName = newItemDel.previousElementSibling;
    const index = tagArray.indexOf(tagName.textContent);

    tagArray.splice(index, 1);
    tagList.removeChild(parent);
    db.tags.where({tag : tagName.textContent}).delete();
}

// モーダル(ポップアップ)画面にタグを追加する
function addTagModalFunc(text){ 
    tagArray.push(text);
    const newItem = document.createElement("li");
    const newItemButton = document.createElement("Button");
    const itemContents = document.createTextNode(text);
    const newItemDel = document.createElement("Button");
    const delContents = document.createTextNode('削除');

    newItem.setAttribute('class', 'tag-list-item');
    newItemButton.setAttribute('class', 'tag-list-item-button');
    newItemDel.setAttribute('class', 'tag-list-item-del');
    
    newItemButton.addEventListener('click', () => {
        addTagFunc(text);
    });
    newItemDel.addEventListener('click', () => {
        delTagFunc(newItemDel);
    });

    newItemButton.appendChild(itemContents);
    newItem.appendChild(newItemButton);
    
    newItemDel.appendChild(delContents);
    newItem.appendChild(newItemDel);
    
    return newItem;
}

// カードの登録や保存の際に入力値をチェックする

function valueCheck(english, japanese, tags) {
    let flagCount = 0;

    // 英単語が入っているかチェック
    if(english === ""){
        // 英語のテキストが空だったら
        const timeModal = document.getElementById('time-modal');    // 表示要素の親要素
        const timeModalContent = document.createElement('div');
        timeModalContent.setAttribute('class', 'time-modal-content fade-out');
        timeModalContent.textContent = "英語を入力してください"; 
        timeModal.appendChild(timeModalContent);
        setTimeout(() => {
            timeModalContent.remove();
        }, 3800);
    } else {
        flagCount++;
    }

    // 日本語訳が入っているかチェック
    if(japanese === ""){
        // 日本語訳のテキストが空だったら
        const timeModal = document.getElementById('time-modal');    // 表示要素の親要素
        const timeModalContent = document.createElement('div');
        timeModalContent.setAttribute('class', 'time-modal-content fade-out');
        timeModalContent.textContent = "和訳を入力してください"; 
        timeModal.appendChild(timeModalContent);
        setTimeout(() => {
            timeModalContent.remove();
        }, 3800);
    } else {
        flagCount++;
    }

    // タグが入っているかチェック
    if(tags.length === 0){
        // タグが入ってなかったら
        const timeModal = document.getElementById('time-modal');    // 表示要素の親要素
        const timeModalContent = document.createElement('div');
        timeModalContent.setAttribute('class', 'time-modal-content fade-out');
        timeModalContent.textContent = "タグを一つ以上追加してください"; 
        timeModal.appendChild(timeModalContent);
        setTimeout(() => {
            timeModalContent.remove();
        }, 3800);
    } else {
        flagCount++;
    }
    return flagCount;
}

/* ============================Event============================ */

// 初期のタグをロードする
const tmpTags = document.createDocumentFragment();
db.tags.reverse().toArray().then((records) => {
    records.forEach((record)=>{
        if( records !== undefined ){
            const newItem = addTagModalFunc(record.tag);
            tmpTags.prepend(newItem);
        }
    });
}).then(() => {
    tagList.insertBefore(tmpTags, tagListCreate);
});

// タグを新しく追加する
tagListCreateButton.addEventListener('click', () => {
    if(tagListCreateText.value !== ""){
        if(tagArray.indexOf(tagListCreateText.value) === -1){
            const newItem = addTagModalFunc(tagListCreateText.value);
            tagList.insertBefore(newItem, tagListCreate)
            db.tags.add({
                tag: tagListCreateText.value
            });
        } else {
            // もしタグ名が重複していたら
            const timeModal = document.getElementById('time-modal');    // 表示要素の親要素
            const timeModalContent = document.createElement('div');
            timeModalContent.setAttribute('class', 'time-modal-content fade-out');
            timeModalContent.textContent = "タグが重複しています"; 
            timeModal.appendChild(timeModalContent);
            setTimeout(() => {
                timeModalContent.remove();
            }, 3800);
        }
    }
});

// 単語を追加する
registerSubmitButton.addEventListener('click', () => {
    const registerEnglish = document.getElementById('register-english');
    const registerJapanese = document.getElementById('register-japanese');
    const registerTagsTag= document.querySelectorAll('.register-tags-tag');
    const eValue = registerEnglish.value;
    const jValue = registerJapanese.value;
    let rTags = [];
    registerTagsTag.forEach(tag => {
        let tagText = tag.textContent;
        rTags.push(tagText);
    });
    const flagCount = valueCheck(eValue, jValue, rTags);

    if (flagCount === 3) {
        db.words.add({
            english: eValue,
            japanese: jValue,
            tags: rTags
        }).then((id) =>{
            // ここから追加した単語を一覧画面にただちに表示するかの判断
            db.words.get({id: id}).then((record) => {      
                const keyWords = searchWindowSearchText.value.trim().split(/\s+/);
                    // 検索システムで処理を分岐させる
                let searchID = 0;
                let listAddFlag = false;
                if(searchWindowOptionsType.textContent === 'タグ名') searchID += 1;
                if(searchWindowOptionsLogic.textContent === '全て含む' && keyWords.length > 1) searchID += 2;
                if(!keyWords[0] || !keyWords[0].match(/\S/g)) listAddFlag = true; ;
                switch(searchID){
                    case 0:     // 単語名＆一部含む
                        keyWords.forEach((keyWord) => {
                            if(eValue.toLowerCase().startsWith(keyWord.toLowerCase()) ||
                               jValue.toLowerCase().startsWith(keyWord.toLowerCase())){
                                   listAddFlag = true;
                            }
                        });         
                    break;
                    case 1:     // タグ名＆一部含む
                        let filterResult1 = [];
                        keyWords.forEach((keyWord) => {
                            filterResult1 = rTags.filter((tag => tag===keyWord));
                            if(filterResult1[0]){
                                   listAddFlag = true;
                            }
                        });    
                    break;
                    case 2:     // 単語名＆全て含む
                        let tflagW = 1;
                        keyWords.forEach((keyWord) => {
                            if(eValue.toLowerCase().startsWith(keyWord.toLowerCase()) ||
                               jValue.toLowerCase().startsWith(keyWord.toLowerCase())){
                                  tflagW *=1;
                            }else{
                                tflagW *=0;
                            }
                            if(tflagW > 0) listAddFlag = true;
                        });  
                    break;
                    case 3:     // タグ名＆全て含む
                        let filterResult2 = [];
                        let tflagT = 1;
                        keyWords.forEach((keyWord) => {
                            filterResult2 = rTags.filter((tag => tag===keyWord));
                            if(filterResult2[0]){
                                tflagT *=1;
                            }else{
                                tflagT *=0;
                            }
                            if(tflagT > 0) listAddFlag = true;
                        });   
                    break;
                }
                if(listAddFlag) cardDisplayFunc(id);
            });   
        });
        const timeModal = document.getElementById('time-modal');    // 表示要素の親要素
        const timeModalContent = document.createElement('div');
        timeModalContent.setAttribute('class', 'time-modal-content2 fade-out');
        timeModalContent.textContent = "単語を作成しました"; 
        timeModal.appendChild(timeModalContent);
        setTimeout(() => {
            timeModalContent.remove();
        }, 3800);      
    }
});

/* ============================================================
[Programs] 編集画面処理
[Outline] 
単語カードをロングタップした後の「編集画面」について
まとめた処理群
============================================================ */

/* ============================Variable============================ */

// 後で要素のIDを動的に変更するためクラスから取得
const editSubmitDel = document.querySelector('.edit-submit-del');
const editSubmitEdit = document.querySelector('.edit-submit-edit');
// 呼び出し元の要素を入れる
let editTarget = 0;

/* ============================Function============================ */

function editPageFunc(id, english, japanese, tags, target){
    const editEnglish = document.getElementById('edit-english');
    const editJapanese = document.getElementById('edit-japanese');
    const editTagsTags = document.querySelectorAll('.edit-tags-tag');
    // 動的にIDを付与
    editSubmitDel.id = "editDel" + id;
    editSubmitEdit.id = "editEdit" + id;

    // 呼び出し元
    editTarget = target;

    // 以前に編集画面を開いたときに設定されたタグがあれば消去する
    editTagsTags.forEach((editTagsTag) => {
        editTagsTag.remove();
    });

    // 編集するカード情報を画面に反映する
    editEnglish.value = english;
    editJapanese.value = japanese;
    tags.forEach((tag) => {
        addTagFunc(tag);
    });
 
    // ページ切り替え処理
    // ※ addTagFuncの後に切り替えを行うことと、addTagFunc内のcurrentTargetによる分岐で
    // ※ 切り替え後にモーダルが開いてしまう誤作動を防ぐように工夫をしている
    if( currentTarget !== editWrapper ){
        currentTarget.classList.toggle('closed');
        editWrapper.classList.toggle('closed');
        currentTarget = editWrapper;
    }
}

/* ============================Event============================ */

// カード削除処理
editSubmitDel.addEventListener('click', () => {
    const check = confirm('単語を削除しますか？');
    if (check){
        const delId = Number(editSubmitDel.id.replace("editDel", ""));
        db.words.delete(delId);
        editTarget.remove();

        currentTarget.classList.toggle('closed');
        listWrapper.classList.toggle('closed');
        currentTarget = listWrapper;
    }
});

// カード上書き処理
editSubmitEdit.addEventListener('click', () => {
    const EditId = Number(editSubmitEdit.id.replace("editEdit", ""));
    const editEnglish = document.getElementById('edit-english');
    const editJapanese = document.getElementById('edit-japanese');
    const editTagsTag= document.querySelectorAll('.edit-tags-tag');
    let tagRegs = [];
    editTagsTag.forEach(tag => {
        let tagText = tag.textContent;
        tagRegs.push(tagText);
    });
    // 値の入力に漏れがないかチェック
    const flagCount = valueCheck(editEnglish.value, editJapanese.value, tagRegs);

    if (flagCount === 3) {
        db.words.update(EditId, {
            japanese: editJapanese.value,
            english: editEnglish.value,
            tags: tagRegs
        }).then(()=>{
            // 一覧画面で表示されている自身のカード情報を差し替え
            let newTr = 0;
            db.words.get({id: EditId}).then((record) => {
                newTr = cardMakeFunc(record);
            }).then(() => {
            editTarget.replaceWith(newTr);
            });
        });
        const timeModal = document.getElementById('time-modal');    // 表示要素の親要素
        const timeModalContent = document.createElement('div');
        timeModalContent.setAttribute('class', 'time-modal-content2 fade-out');
        timeModalContent.textContent = "単語を編集しました"; 
        timeModal.appendChild(timeModalContent);
        setTimeout(() => {
            timeModalContent.remove();
        }, 3800);
        currentTarget.classList.toggle('closed');
        listWrapper.classList.toggle('closed');
        currentTarget = listWrapper;
    }
});

/* ============================================================
[Programs] ホーム画面処理
[Outline] 

============================================================ */

const week = ["日", "月", "火", "水", "木", "金", "土"];
const prev = document.getElementById('prev');
const next = document.getElementById('next');
const today = new Date();
const showDate = new Date(today.getFullYear(), today.getMonth(), 1);
showProcess(today, calendar);

// 前の月表示
prev.addEventListener('click', () => {
    showDate.setMonth(showDate.getMonth() - 1);
    showProcess(showDate);
});

// 次の月表示
next.addEventListener('click', () => {
    showDate.setMonth(showDate.getMonth() + 1);
    showProcess(showDate);
});

// カレンダー表示
function showProcess(date) {
    const year = date.getFullYear();
    const month = date.getMonth();
    document.getElementById('cal-header').innerHTML = year + "年 " + (month + 1) + "月";
    const calendar = createProcess(year, month);
    document.getElementById('calendar').innerHTML = calendar;
}

// カレンダー作成
function createProcess(year, month) {
    // 曜日
    let calendar = "<table class='cal-table'><tr class='dayOfWeek'>";
    for (let i = 0; i < week.length; i++) {
        calendar += "<th class='cal-th'>" + week[i] + "</th>";
    }
    calendar += "</tr>";

    let count = 0;
    const startDayOfWeek = new Date(year, month, 1).getDay();
    const endDate = new Date(year, month + 1, 0).getDate();
    const lastMonthEndDate = new Date(year, month, 0).getDate();
    const row = Math.ceil((startDayOfWeek + endDate) / week.length);

    // 1行ずつ設定
    for (let i = 0; i < row; i++) {
        calendar += "<tr>";
        // 1colum単位で設定
        for (let j = 0; j < week.length; j++) {
            if (i == 0 && j < startDayOfWeek) {
                // 1行目で1日まで先月の日付を設定
                calendar += "<td class='cal-td disabled'>" + (lastMonthEndDate - startDayOfWeek + j + 1) + "</td>";
            } else if (count >= endDate) {
                // 最終行で最終日以降、翌月の日付を設定
                count++;
                calendar += "<td class='cal-td disabled'>" + (count - endDate) + "</td>";
            } else {
                // 当月の日付を曜日に照らし合わせて設定
                count++;
                if(year == today.getFullYear()
                  && month == (today.getMonth())
                  && count == today.getDate()){
                    calendar += "<td class='cal-td today'>" + count + "</td>";
                } else {
                    calendar += "<td class='cal-td'>" + count + "</td>";
                }
            }
        }
        calendar += "</tr>";
    }
    return calendar;
}

//  //改行させるためのファンクション
// function fillTextFunc (context, text, x, y, lineHeight, maxWidth) {
//     const textList = text.split('\n');
//     textList.forEach(function(text, i) {
//         // context.fillText(text, x, y+lineHeight*i, maxWidth);
//         context.fillText(text, x, y+lineHeight*i);
//     });
// };

// const canvas = document.getElementById('canvas');
// if (canvas.getContext) {
//     const ctx = canvas.getContext('2d');
//     // /* キャンバスのぼやけ対策のため、解像度の補正処理 */
//     // canvas.style.width = listWrapper.clientWidth + 'px';
//     // canvas.style.height = listWrapper.clientHeight / 2 + 'px';
//     // 現在のディスプレイにおけるCSS解像度と物理解像度の比
//     let scale = window.devicePixelRatio; 
    
//     // canvas.width = listWrapper.clientWidth * scale;
//     // canvas.height = listWrapper.clientHeight / 2 * scale;
//     canvas.width = listWrapper.clientWidth;
//     canvas.height = listWrapper.clientHeight / 2;

//     // alert(canvas.width);

//     const canvasFontSize = getComputedStyle(listWrapper).fontSize;
//     // const canvasFontSize = '100px';
//     // alert(canvas.width);
//     ctx.font= canvasFontSize + " メイリオ";
//     // alert(canvasFontSize);
//     // ctx.font = "100px メイリオ";

//     ctx.textBaseline = "top";
//     const lineHeight = ctx.measureText("あ").width;// ’あ’はフォントサイズを取り出すための一例
//     let point= [3,100,50,70,20,10,88];
//     let goal = 60;
//     let rate =canvas.height / goal;
//     let pointDisplay = [];

//     point.forEach((p) => {
//         // const tmp = parseInt(p);
//         const hour = parseInt(p / 60);
//         const minute = parseInt(p - 60 * hour);
//         let text = '';
//         if (hour > 0){
//             text = hour  + '時間' + '\n'+ minute + '分';
//         }else{
//             text =  minute + '分';
//         }
//         pointDisplay.push(text);
//     });

//     const wideUnit = canvas.width / 70.0;
//     const move = wideUnit * 10;
//     let drowPointX = wideUnit * 2.5;
//     let drowLength = 0;
//     for(let i = 0; i <7; i++){
//         ctx.fillStyle = point[i] > goal ? ctx.fillStyle = "rgb(255, 89, 71)" :  "rgb(0, 255, 200)";
//         drowLength = point[i] > goal ? goal * rate : point[i] * rate;
//         ctx.fillRect(drowPointX , canvas.height, wideUnit * 5, - drowLength);
//         ctx.fillStyle = "rgb(255, 255, 255)";
//         // ctx.strokeText(pointDisplay[i], drowPointX, canvas.height - point[i]*rate);
//         if(drowLength> lineHeight){
//         fillTextFunc (ctx, pointDisplay[i], drowPointX, canvas.height - drowLength + 5, lineHeight, wideUnit * 5);
//         }
//         drowPointX += move;
//     }
//       ctx.scale(scale, scale);
// }
/* ============================================================
[Programs] Q&Aシート
[Outline] 
備忘録ノート

【なぜDocumentFragmentに入れるのか】
for文で直接入れるとそのたびに描画情報を更新するらしい
大量の情報だと処理時間が掛かってしまうので
DocumentFragmentに一度情報を集約して、まとめて更新するといい

============================================================ */

// const keyName = 'visited';
// const keyValue = true;

// if (!localStorage.getItem(keyName)) {
//     //localStorageにキーと値を追加
//     localStorage.setItem(keyName, keyValue);

//     //ここに初回アクセス時の処理
//     console.log("初めての訪問です");

// } else {
//     //ここに通常アクセス時の処理
//     console.log("訪問済みです");

// }
// const tour = new Shepherd.Tour({
//   useModalOverlay: true,
//   defaults: {
//     // classes: 'shadow-md bg-purple-dark',
//     scrollTo: true
//   }
// });


// tour.addStep({
//     id: 'first',
//     text: 'ようこそタグ単へ！ \n チュートリアルを開始しますか？',
//     // attachTo: {
//     //     element: '.searchWindow-options-type ',
//     //     on: 'bottom'
//     // },
//     buttons: [
//         {
//             action: tour.cancel,
//             secondary: true,
//             text: 'いいえ'
//         },
//         {
//             action: tour.next,
//             text: 'はい',
//             // action() {
//             //     return this.show('addTagTan');
//             // }
//         }
//     ]
// });

// tour.addStep({
//     // id: 'addTagTan',
//     text: 'クリックしよう？',
//     attachTo: {
//         element: '#ft-add',
//         on: 'top'
//     },
//     advanceOn: {selector: '#ft-add', event: 'click'}
// });

// tour.addStep({
//     beforeShowPromise: function() {
//         return new Promise(function(resolve) {
//             alert('a');
//             resolve();
//         });
//     },
//     // id: 'addTagTan',
//         text: '進んだよ',
//     // attachTo: {
//     //     element: '.searchWindow-options-type ',
//     //     on: 'bottom'
//     // },
//     buttons: [
//         {
//             action: tour.cancel,
//             secondary: true,
//             text: 'いいえ'
//         },
//         {
//             text: 'はい',
//             action: tour.next
//         }
//     ]
//     //     // ページ切り替え処理
//     // if( currentTarget !== addWrapper ){
//     //     currentTarget.classList.toggle('closed');
//     //     addWrapper.classList.toggle('closed');
//     //     currentTarget = addWrapper;
//     // }
// });
// tour.start();