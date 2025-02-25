import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// Tipe data untuk Post
type Post = {
  id: number;
  title: string;
  body: string;
  userId?: number;
};

// Props untuk modal update
type UpdatePostProps = {
  post: Post; // Data post yang akan diupdate
  onClose: () => void; // Fungsi untuk menutup modal
};

// Function untuk Update Post
const updatePost = async (updatedPost: Post) => {
  const res = await fetch(
    `https://jsonplaceholder.typicode.com/posts/${updatedPost.id}`,
    {
      method: "PUT",
      body: JSON.stringify(updatedPost),
      headers: {
        "Content-Type": "application/json; charset=UTF-8",
      },
    }
  );
  return res.json();
};

const UpdatePost = ({ post, onClose }: UpdatePostProps) => {
  const queryClient = useQueryClient();

  // State untuk input
  const [title, setTitle] = useState(post.title);
  const [body, setBody] = useState(post.body);

  // React Query Mutation untuk Update Post
  const mutation = useMutation({
    mutationFn: updatePost,
    onMutate: async (updatedPost) => {
      await queryClient.cancelQueries(["posts"]);

      const previousPosts = queryClient.getQueryData<Post[]>(["posts"]);
      if (previousPosts) {
        queryClient.setQueryData(
          ["posts"],
          previousPosts.map((p) => (p.id === updatedPost.id ? updatedPost : p))
        );
      }
      return { previousPosts };
    },
    onError: (_error, _newPost, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(["posts"], context.previousPosts);
      }
    },
    onSuccess: () => {
      alert("Task berhasil diperbarui");
      onClose(); // Tutup modal setelah sukses
    },
    onSettled: () => {
      queryClient.invalidateQueries(["posts"]);
    },
  });

  const handleUpdatePost = () => {
    if (!title || !body) return alert("Title dan body harus diisi!");

    mutation.mutate({
      ...post,
      title,
      body,
    });
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
        className="bg-green-500 text-white px-4 py-2 rounded w-full hover:bg-green-700"
        onClick={handleUpdatePost}
        disabled={mutation.isPending}
      >
        {mutation.isPending ? "Updating..." : "Update"}
      </button>
    </div>
  );
};

export default UpdatePost;
