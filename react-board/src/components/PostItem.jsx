function PostItme({post, deletePost, startEdit, likePost, toggleCompleted}) {
    return (
        <tr>    
            <td>{post.id}</td>
            <td>{post.title}</td>
            <td>{post.writer}</td>
            <td> ❤️ {post.likes}</td>

            <td>
                {post.completed ? "완료" : "미완료"}
            </td>

            <td>
                <button onClick={() => startEdit(post)}>수정</button>
                <button onClick={() => deletePost(post.id)}>삭제</button>
                <button onClick={() => likePost(post)}>좋아요</button>
                <button onClick={() => toggleCompleted(post)}>상태 변경</button>
            </td>
        </tr>
    );
}
export default PostItem;