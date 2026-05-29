import PostItem from "./PostItem";
import "./PostList.css";

function PostList({posts, deletePost, startEdit, likePost, toggleCompleted}) {
    return(
        <table claseName="post-table">
            <thead>
                <tr>
                    <td>제목</td>
                    <td>번호</td>
                    <td>작성자</td>
                    <td>기능</td>
                    <td>좋아요</td>
                </tr>
            </thead>
            <tbody>
                {posts.map((post) => (
                    <PostItem
                    key={post.id}
                    post={post}
                    deletePost={deletePost}
                    startEdit={startEdit}
                    likePost={likePost}
                    toggleCompleted={toggleCompleted}
                    />
                ))}
            </tbody>
        </table>
            
    );
}

export default PostList;