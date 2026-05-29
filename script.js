const detailBox = document.getElementById("detailBox");
const detailTitle = document.getElementById("detailTitle");
const detailWriter = document.getElementById("detailWriter");
const detailDate = document.getElementById("detailDate");
const boardBody = document.getElementById("boardBody");

const titleInput = document.getElementById("titleInput");
const writerInput = document.getElementById("writerInput");
const dateInput = document.getElementById("dateInput");
const writeBtn = document.getElementById("writeBtn");
const messageBox = document.getElementById("errorMsg");


let editIndex = -1;

let posts = [];

async function loadPosts() {
  try {
    const response = await fetch("http://localhost:3000/posts");
    
    if(!response.ok) {
      throw new Error("서버 응답 실패");
    }
    
    const data = await response.json();
  
    posts = data.slice(0, 10).map(function(post) {
      return{
        id: post.id,
        title: post.title,
        writer: post.writer,
        date: post.date
      }
    });
  
    renderPosts();

  } catch(error) {
    console.log("에러 발생:", error);
    alert("데이터 불러오기 실패!");
  }
}

function renderPosts() {
  boardBody.innerHTML = "";

  for (let i = 0; i < posts.length; i++) {
    const post = posts[i];

    const tr = document.createElement("tr");

    const idTd = document.createElement("td");
    idTd.innerText = post.id;

    const titleTd = document.createElement("td");
    const titleSpan = document.createElement("span");
    titleSpan.innerText = post.title;
    titleSpan.style.cursor = "pointer";
    titleSpan.style.color = "blue";

    titleSpan.addEventListener("click", function () {
      detailTitle.innerText = post.title;
      detailWriter.innerText = "작성자: " + post.writer;
      detailDate.innerText = "날짜: " + post.date;
      detailBox.style.display = "block";
    });

    titleTd.appendChild(titleSpan);

    const writerTd = document.createElement("td");
    writerTd.innerText = post.writer;

    const dateTd = document.createElement("td");
    dateTd.innerText = post.date;

    const editTd = document.createElement("td");
    const editBtn = document.createElement("button");
    editBtn.innerText = "수정";

    editBtn.addEventListener("click", function () {
      startEdit(post, i);
      writeBtn.innerText = "수정완료";
    });

    editTd.appendChild(editBtn);

    const deleteTd = document.createElement("td");
    const deleteBtn = document.createElement("button");
    deleteBtn.innerText = "삭제";

    deleteBtn.addEventListener("click", async function () {

      // 선 확인
      if(!confirm("진짜 삭제할까요?")) return;

      const success = await deletePost(post.id); // 확인 후 삭제
      
      // 성공 했으면 새로고침
      if (success) {
        loadPosts();
      }
    });

    deleteTd.appendChild(deleteBtn);

    tr.appendChild(idTd);
    tr.appendChild(titleTd);
    tr.appendChild(writerTd);
    tr.appendChild(dateTd);
    tr.appendChild(editTd);
    tr.appendChild(deleteTd);

    boardBody.appendChild(tr);
  }
}

async function deletePost(id) {
    try {
      const response = await fetch(`http://localhost:3000/posts/${id}`,
        {
          method: "DELETE"
        });

      if(!response.ok) {
        throw new Error("삭제 실패");
      }

      return true;

    } catch(error) {
      console.error(error);
      return false;
    }
}

// 수정 버튼 클릭
function startEdit(post, index) {
  titleInput.value = post.title;
  writerInput.value = post.writer;
  dateInput.value = post.date;

  editIndex = index;
}

// 글쓰기 API 코드 분리
async function addPost(title, writer, date) {
  try {
    const response = await fetch("http://localhost:3000/posts", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        title: title,
        writer: writer,
        date: date
      })
    });

    if (!response.ok) {
      throw new Error("글쓰기 실패");
    }

    return await response.json();

  } catch (error) {
    console.error(error);
    return null;
  }
}

// 수정 API 코드 추가
async function updatePost(id, title, writer, date) {
  try{
    const response = await fetch(`http://localhost:3000/posts/${id}`,
      {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({title, writer, date})
    });

    if(!response.ok) {
      throw new Error("수정 실패");
    }

    return true;

  } catch(error) {
    console.log(error);
    return false;
  }
}

  // 버튼 클릭
writeBtn.addEventListener("click", function () {
  console.log("클릭됨");
  if (editIndex === -1) {
    handleSubmit();   // 글쓰기
  } else {
    handleUpdate();   // 수정
  }
});

function validateForm(title, writer) {
  messageBox.style.color = "red"; // 먼저 설정

  if(!title) {
    messageBox.innerText = "제목을 입력하세요";
    return false;
  }

  if(title.length > 20) {
    messageBox.innerText = "20자 내외로 쓰시오.";
    return false;
  }

  if(!writer) {
    messageBox.innerText = "작성자를 입력해주세요.";
    return false;
  }

  if(writer.length > 25) {
    messageBox.innerText = "25자 내외로 쓰시오.";
    return false;
  }

  messageBox.innerText = "";   // (통과시)성공하면 초기화
  return true;
}

function resetForm() {
    titleInput.value = "";
    writerInput.value = "";
    dateInput.value = "";

    editIndex = -1;
    writeBtn.innerText = "글쓰기";

    detailBox.style.display = "none"; // detail창도 닫기
}

  // 제어함수 (글쓰기)
async function handleSubmit() {
  // 입력 값
  const title = titleInput.value.trim();
  const writer = writerInput.value.trim();
  let date = dateInput.value;

  // 검증
  if(!validateForm(title, writer)) {
    return;
  }

  // 날짜 보정
  if(!date) {
    date = new Date().toISOString().split("T")[0];
  }

  writeBtn.disabled = true;
  writeBtn.innerText = "처리중";

  // API 함수 호출
  const result = await addPost(title, writer, date);

  // 성공 처리
  if (result) {
    messageBox.style.color = "green";
    messageBox.innerText = "등록 성공!";

    // 상태 복구
    writeBtn.disabled = false;
    writeBtn.innerText = "글쓰기";

    // 메시지만 지연 제거
    setTimeout(() => {
      messageBox.innerText = "";
    }, 3000);

    loadPosts(); // 서버 기준 & 목록 갱신
    resetForm(); // 입력 초기화
  
  } else {
    // 실패했을 때도 복구
    writeBtn.disabled = false;
    writeBtn.innerText = "글쓰기";
  }
}

  // 제어함수 (수정)
async function handleUpdate() {
  const title = titleInput.value.trim();
  const writer = writerInput.value.trim();
  const date = dateInput.value;

  if(!validateForm(title, writer)) {
    return;
  }

  const id = posts[editIndex].id;

  writeBtn.disabled = true;
  writeBtn.innerText = "수정중";

  const success = await updatePost(id, title, writer, date);

  console.log(success);
  if (success) {
    messageBox.style.color = "green";
    messageBox.innerText = "수정 성공!"

    writeBtn.disabled = false;
    writeBtn.innerText = "글쓰기";

    loadPosts();
    resetForm();

    setTimeout(() => {
      messageBox.innerText = ""  
    }, 3000)

  } else {
    writeBtn.disabled = false;
    writeBtn.innerText = "글쓰기";
  }
}

loadPosts();