import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [users, setUsers] = useState([]);
  const [posts, setPosts] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);

  useEffect(() => {
    fetchUsers();
    fetchPosts();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("http://20.244.56.144/test/users");
      setUsers(response.data.users);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchPosts = async () => {
    try {
      const response = await axios.get("http://20.244.56.144/test/posts");
      setPosts(response.data.posts);
      calculateTopUsers(response.data.posts);
      calculateTrendingPosts(response.data.posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const calculateTopUsers = (posts) => {
    const userPostCount = {};
    posts.forEach(post => {
      userPostCount[post.userid] = (userPostCount[post.userid] || 0) + 1;
    });
    const sortedUsers = Object.entries(userPostCount).sort((a, b) => b[1] - a[1]);
    setTopUsers(sortedUsers.slice(0, 5));
  };

  const calculateTrendingPosts = async (posts) => {
    let postCommentCounts = {};
    for (let post of posts) {
      try {
        const response = await axios.get(`http://20.244.56.144/test/posts/${post.id}/comments`);
        postCommentCounts[post.id] = response.data.comments.length;
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    }
    const sortedPosts = Object.entries(postCommentCounts).sort((a, b) => b[1] - a[1]);
    setTrendingPosts(sortedPosts.slice(0, 5));
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold">Social Media Analytics</h1>

      <section>
        <h2 className="text-xl font-semibold">Top Users</h2>
        <ul>
          {topUsers.map(([userId, count]) => (
            <li key={userId}>{users[userId]} - {count} posts</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Trending Posts</h2>
        <ul>
          {trendingPosts.map(([postId, count]) => (
            <li key={postId}>Post ID: {postId} - {count} comments</li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold">Live Feed</h2>
        <ul>
          {posts.map(post => (
            <li key={post.id}>{post.content}</li>
          ))}
        </ul>
      </section>
    </div>
  );
}
