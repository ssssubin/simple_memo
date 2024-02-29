async function editMemo(event) {
  const id = event.target.dataset.id;
  //서버에 이 id에 맞는 값을 요청함으로써 특정 데이터를 바꿔주는 요청 보낼 것
  const editInput = prompt("수정할 값을 입력~~");
  const res = await fetch(`/memos/${id}`, {
    method: "PUT", //PUT: 특정 값이 있을 때 그 값으로 바꿔주는 메소드
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      id: id,
      content: editInput,
    }),
  });
  //const jsonRes = await res.json();
  //console.log(jsonRes);
  readMemo();
  //console.log(event.target.dataset.id);
}

async function deleteMemo(event) {
  const id = event.target.dataset.id;
  const res = await fetch(`/memos/${id}`, {
    method: "DELETE", //지울 때 사용하는 메소드
  });
  const jsonRes = await res.json();
  console.log(jsonRes);
  readMemo();
}

// 받아온 memos 값들을 html에 추가해주는 함수
function displayMemo(memo) {
  const ul = document.querySelector("#memo-ul");
  const li = document.createElement("li"); //li라는 태그 만듦
  const editBtn = document.createElement("button");

  editBtn.innerText = "수정하기";
  editBtn.addEventListener("click", editMemo);
  editBtn.dataset.id = memo.id; // dataset이라는 속성에 id라는 값에 메모의 id를 넣어줄거다

  const delBtn = document.createElement("button");
  delBtn.innerText = "삭제";
  delBtn.addEventListener("click", deleteMemo);
  delBtn.dataset.id = memo.id;

  li.innerText = `[id: ${memo.id}] ${memo.content}`;
  ul.appendChild(li); // ul 안에 li 추가
  li.appendChild(editBtn); // li 안에 editbtn 추가
  li.appendChild(delBtn);
}

// 생성된 메모 값 읽는 함수
async function readMemo() {
  const res = await fetch("/memos"); //memos를 get해서 가져와 달라는 요청(get 요청)
  const jsonRes = await res.json();

  //ul 값을 받아와서 ul 내부에 있는 html 초기화 시켜줘야 함
  const ul = document.querySelector("#memo-ul");
  ul.innerHTML = "";
  //jsonRes = [{id:123, content:'블라블라'}] 이 내용을 서버에서 받아온 다음에 html에 추가해줄 것 = displayMemos 함수
  jsonRes.forEach(displayMemo); //jsonRes라는 배열 내의 각각의 요소에 대해 displayMemo라는 함수를 실행->forEach() 함수
}

// 메모 생성하는 함수 : 서버에 요청 보내야 함(메모 만들어달라고)
async function createMemo(value) {
  //fetch로만 보내게 되면 get 요청이 default로 가기 때문에 값을 달라는 의미가 됨-> 값을 추가 및 업데이트 하기 위해서 POST 형태로 보내주기 위해 추가로 코드 작성
  const res = await fetch("/memos", {
    method: "POST",
    headers: {
      "Content-Type": "application/json", //POST로 request body에 넣어서 보내기 위한 코드, request-body를 보낼 때 필수적으로 넣어야 하는 headers
    },
    body: JSON.stringify({
      //body 값은 json 값인데 통신을 할 때는 문자열만 전송 가능, 그래서 문자열로 body를 바꿔주고 전송하기 위해 JSON.stringify로 body를 바꿔줌
      id: new Date().getTime(),
      content: value,
    }),
  });
  //서버에 값 업데이트 후 readMemo 호출하여 서버에 있는 메모 가져와서 뿌려주는 역할
  readMemo(); // 서버에만 데이터 업데이트 했으니까 그 값을 불러오기 위해 호출
}

function handleSubmit(event) {
  event.preventDefault(); // 이벤트가 동작('동작하나??'라는 문자열이 나타났다 사라짐)하는 걸 막아줌 -> 제출 이벤트가 막힘
  //console.log("동작하나??");
  //input 값 가져와서 서버에 요청 보내고 input 값 없애주기
  const input = document.querySelector("#memo-input"); //input 값 가져옴
  createMemo(input.value); // input에 있는 value 값을 넘겨줘서 createMemo 함수 호출
  input.value = ""; //input의 value 없애줌
}

const form = document.querySelector("#memo-form");
form.addEventListener("submit", handleSubmit); //form에 있는 값이 제출됐을 때 발생하는 이벤트

//맨 처음에 서버에 있는 데이터 값 가져오기 위해 호출
readMemo();
