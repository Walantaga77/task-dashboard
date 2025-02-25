import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Tipe data untuk Post
type Post = {
  id: number;
  title: string;
  body: string;
  userId: number;
};

// Props untuk modal close
type CreatePostProps = {
  onClose: () => void;
};

// Function untuk Create Post
const createPost = async (newPost: Omit<Post, "id">) => {
  const res = await fetch("https://jsonplaceholder.typicode.com/posts", {
    method: "POST",
    body: JSON.stringify(newPost),
    headers: {
      "Content-Type": "application/json; charset=UTF-8",
    },
  });
  return res.json();
};

const CreatePost = ({ onClose }: CreatePostProps) => {
  const queryClient = useQueryClient();

  // State untuk input
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");

  // React Query Mutation untuk Create Post
  const mutation = useMutation({
    mutationFn: createPost,
    onSuccess: (data) => {
      alert("Task berhasil ditambahkan");
      queryClient.setQueryData(["posts"], (oldPosts: Post[] | undefined) => {
        return oldPosts
          ? [...oldPosts, { ...data, id: oldPosts.length + 1 }]
          : [data];
      });
      onClose(); // Tutup modal setelah sukses
    },
  });

  const handleCreatePost = () => {
    if (!title || !body) return alert("Title dan body harus diisi!");

    mutation.mutate({
      title,
      body,
      userId: 1,
    });

    setTitle("");
    setBody("");
  };

  return (
    <div>
      <input
        type="text"
        placeholder="Post title..."
        className="border p-2 rounded w-full mb-2"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <input
        type="text"
        placeholder="Post body..."
        className="border p-2 rounded w-full mb-2"
        value={body}
        onChange={(e) => setBody(e.target.value)}
      />
      <button
        className="bg-blue-500 text-white px-4 py-2 rounded w-full hover:bg-blue-700"
        onClick={handleCreatePost}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Adding..." : "Submit"}
      </button>
    </div>
  );
};

export default CreatePost;
