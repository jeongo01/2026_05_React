const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

let posts = []; // 임시 저장소

// ✅ 게시글 조회(GET)
app.get("/posts", (req, res) => {
  db.query("SELECT * FROM posts", (err, results) => {
    if (err) {
      return res.status(500).json({ message : "조회 실패" });
    } else {
        res.json(results);
    }
  });
});

// ✅ 글쓰기(POST)
app.post("/posts", (req, res) => {
  const { title, writer, date } = req.body;

  const sql = "INSERT INTO posts (title, writer, date) VALUES (?, ?, ?)";
  
  db.query(sql, [title, writer, date], (err, result) => {
    if (err) {
      return res.status(500).json({ message : "등록 실패" });
    }
    res.json({ message : "등록 성공" });
  });
});

// ✅ 수정
app.put("/posts/:id", (req, res) => {
  const { id } = req.params;
  const { title, writer, date } = req.body;

  const sql = "UPDATE posts SET title=?, writer=?, date=? WHERE id=?";
  
  db.query(sql, [title, writer, date, id], (err) => {
    if (err) {
      return res.status(500).json({ message : "수정 실패" });
    }
    res.json({ message : "수정 성공" });
  });
});

// ✅ 삭제
app.delete("/posts/:id", (req, res) => {
  const { id } = req.params;

  db.query("DELETE FROM posts WHERE id=?", [id], (err) => {
    if (err) {
      return res.status(500).json({ message : "삭제 실패" });
    }
    res.json({ message : "삭제 성공" });
  });
});

app.listen(3000, () => {
  console.log("서버 실행중 http://localhost:3000");
});