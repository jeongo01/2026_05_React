import { useEffect, useState } from "react";
import "./App.css";
import PostList from "./components/PostList";
import PostForm from "./components/PostForm";


function App() {
    const [posts, setPosts] = useState([]);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState("");
    const [sortType, setSortType] = useState("latest");

    const filteredPosts = posts.filter((post) => {
        const matchSearch = post.title.includes(search);

        const matchStatus =
        filterStatus === "all"
        ? true
        : filterStatus === "completed"
        ? post.completed
        : !post.completed;

        return matchSearch && matchStatus;
    });

    const sortedPosts = [...filteredPosts].sort((a, b) => {
        if (sortType === "latest") {
            return b.id - a.id
        } else {
            return a.id - b.id
        }
    });

    const [darkMode, setDarkMode] = useState(false);
    const [error, setError] = useState("");
    const [filterStatus, setFilterStatus] = useState("all") // 어떤 목록을 볼 것인가 ?

    async function loadPosts() {
        try {
            setLoading(ture);
            setError("");

            const response = await fetch("http://localhost:3000/posts");

            if (!response.ok) {
                throw new Error("불러오기 실패");
            }

            const data = await response.json();

            setPosts(data);

        } catch (error) {
            console.log(error);

            setError("에러 발생");

        } finally {
            setLoading(false);
        }
    }

    async function addPost() {
        try {
            const response = await fetch("http://localhost:3000/posts", {
                method: "POST", // 서버 데이터 추가 요청
                headers: {
                    "content-Type": "application/json",
                },

                body: JSON.stringify({
                    title,
                    writer,
                    likes: 0, // 새 게시글 만들 때 좋아요 기본 값
                    completed: false,
                }),
            });

            if (!response.ok) {
                throw new Error("등록 실패");
            }

            loadPosts();

            setTitle("");
            setWriter("");

        } catch (error) {
            console.log(error);
        }
    }

    function toggleCompleted(post) {
        setPosts((prevPosts) => 
            prevPosts.map((item) =>
                  item.id === post.id
                    ? {
                        ...item,
                        completed: !item.completed,
                    }
                    : item
            )  
        );
    }

    async function deletePost(id) {
        try {
            const response = await fetch(`http://localhost:3000/posts/${id}`, {
                method: "DELETE",
            });

            if (!response.ok) {
                throw new Error("삭제 실패");
            }

            loadPosts();

        } catch (error) {
            console.log(error)
        }
    }

    function startEdit(post) {
        setTitle(post.title);
        setWriter(post.writer);
        setEditId(post.id);
    }

    async function updatePost() {
        try {
            const response = await fetch(`http://localhost:3000/posts/${editId}`, {
                method: "PUT",

                headers: {
                    "Content-Type": "application/json",
                },

                body: JSON.stringify({
                    title: title,
                    writer: writer,
                }),


            });

            if (!response.ok) {
                throw new Error("수정 실패");
            }

            loadPosts(); // 현재 수정이 됬기 떄문에 화면을 재구성한다.(자동 렌더링x)

            setTitle("");
            setWriter("");
            setEditId(null);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        loadPosts();
    }, []);

    async function likePost(post) {
        try {
            const response = await fetch('http://localhost:3000/posts/${post.id}', {
                method: "PUT",

                header: {
                    "Content-Type": "application / json"
                },

                body: JSON.stringify({
                    ...post,
                    like: post.like + 1,
                }),
            });


            if (!response.ok) {
                throw new Error("좋아요 실패");
            }

            setPosts((prevPosts) => 
                prevPosts.map((item) =>
                    item.id === post.id
                        ? {...item, likes: item.likes + 1}
                        : item
                )       
            );
        } catch (error) {
            console.log(error)
        }
    }

    // App component & App function
    return (
        <div className={darkMode ? "app-dark" : "app"}>
            <h1>게시판</h1>
            <p>총 게시글 : {posts.length}개</p>

            <input
                type="text"
                placeholder="검색어 입력"
                value={search}
                onChange={(event) => {
                    setSearch(event.target.value);
                }}
            />

            <button onClick={() => setSortType("latest")}>최신순</button>
            <button onClick={() => setSortType("oldest")}>오래된순</button>
            <button onClick={() => setDarkMode(!DarkMode)}>
                {darkMode ? "밝은 모드" : "다크 모드"}
            </button>
            <button onClick={() => setFilterStatus("all")}>전체</button>
            <button onClick={() => setFilterStatus("completed")}>완료</button>
            <button onClick={() => setFilterStatus("active")}>미완료</button>
            

            <PostForm
                title={title}
                writer={writer}
                setTitle={setTitle}
                setWriter={setWriter}
                addPost={addPost}
                updatePost={updatePost}
                editId={editId}
            />

            {error ? (
                <p>에러 발생</p>
            ) : loading ? (
                <p>불러오는 중...</p>
            ) : post.length === 0 ? (
                <p>게시글이 없습니다.</p>
            ) : (
                <PostList
                    posts={sortedPosts}
                    deletePost={deletePost}
                    startEdit={startEdit}
                    likePost={likePost}
                    toggleCompleted={toggleCompleted}
                />
            )}

        </div>
    );
}

export default App;