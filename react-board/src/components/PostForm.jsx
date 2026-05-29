import "./PostForm";

function PostForm({
    title,
    writer,
    setTitle,
    setWriter,
    addPost,
    updatePost,
    editId,
}) {
    return (
        <div className="form-container">
            <input
                type="text"
                placeholder="제목"
                value={title}
                onChange={(event) => {
                    setTitle(event.target.value);
                }}
            />

            <input
                type="text"
                placeholder="작성자"
                value={writer}
                onChange={(event) => {
                    setWriter(event.target.value);
                }}
            />

            <button onClick={() => {
                if (editId) {
                    updatePost();
                } else {
                    addPost();
                }
            }}>{editId ? "수정완료" : "등록"}
            </button>
        </div>
    );
}