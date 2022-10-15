import PostDeleteButton from "@components/ui/button/post-delete-button";
import PostPublishButton from "@components/ui/button/post-publish-button";
import withAdmin from "@hoc/with-admin";
import { trpc } from "@utils/trpc";
import moment from "moment";
import { useState } from "react";

function AllPosts() {
  const [page, setPage] = useState(1);
  const [limit] = useState(12);
  const { data, isLoading, refetch } = trpc.post.offsetPosts.useQuery({
    limit,
    page,
  });

  const { meta, results } = { ...data };
  const { totalPages, currentPage, prevPage, nextPage } = {
    ...meta,
  };

  const { mutate } = trpc.post.deletePost.useMutation({
    onSuccess() {
      refetch();
    },
  });

  function proceedDelete(id: string) {
    mutate({ id });
  }

  return (
    <div className="bg-white shadow-md rounded my-6">
      <table className="min-w-max w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">Id</th>
            <th className="py-3 px-6 text-left">Title</th>
            <th className="py-3 px-6 text-center">Body</th>
            <th className="py-3 px-6 text-center">Author</th>
            <th className="py-3 px-6 text-center">Publish Status</th>
            <th className="py-3 px-6 text-center">Created At</th>
            <th className="py-3 px-6 text-center">Updated At</th>
            <th className="py-3 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {isLoading ? (
            <tr>
              <td colSpan={8}>LOADING......</td>
            </tr>
          ) : (
            <>
              {results?.map((post) => (
                <tr
                  key={post.id}
                  className="border-b border-gray-200 hover:bg-gray-100"
                >
                  <td className="py-3 px-6 text-left whitespace-nowrap">
                    {post.id}
                  </td>
                  <td className="py-3 px-6 text-left">{post.title}</td>
                  <td className="py-3 px-6 text-center max-w-xs truncate">
                    {post.body}
                  </td>
                  <td className="py-3px-6 text-center ">{post.author.name}</td>
                  <td className="py-3 px-6 text-center">
                    <span
                      className={`py-1 px-3 rounded-full text-xs ${
                        post.isPublished
                          ? "bg-green-200 text-green-600"
                          : "bg-red-200 text-red-600"
                      }`}
                    >
                      {post.isPublished ? "Published" : "Pending"}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-center">
                    {moment(post.createdAt).format("YYYY-MM-DD")}
                  </td>
                  <td className="py-3 px-6 text-center">
                    {moment(post.updatedAt).format("YYYY-MM-DD")}
                  </td>
                  <td>
                    <div className="flex items-center space-x-3">
                      <PostPublishButton
                        refetch={refetch}
                        postId={post.id}
                        isPublished={post.isPublished}
                      />
                      <PostDeleteButton refetch={refetch} postId={post.id} />
                    </div>
                  </td>
                </tr>
              ))}

              <tr>
                <td colSpan={8} className="py-5 text-center">
                  <nav aria-label="Page navigation example">
                    <ul className="inline-flex -space-x-px">
                      <li>
                        <button
                          disabled={!prevPage}
                          onClick={() => {
                            if (prevPage) {
                              setPage(prevPage);
                            }
                          }}
                          className={`py-2 px-3 ml-0 leading-tight text-gray-500 rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                            !prevPage
                              ? "bg-gray-100 cursor-not-allowed"
                              : "bg-white"
                          }`}
                        >
                          Previous
                        </button>
                      </li>
                      {[...new Array(totalPages)].map((page, i) => (
                        <li key={i}>
                          <button
                            onClick={() => {
                              setPage(i + 1);
                            }}
                            className={`py-2 px-3 leading-tight border border-gray-300 ${
                              currentPage === i + 1 &&
                              "bg-blue-500 text-white border-blue-600"
                            }`}
                          >
                            {i + 1}
                          </button>
                        </li>
                      ))}

                      <li>
                        <button
                          disabled={!nextPage}
                          onClick={() => {
                            if (nextPage) {
                              setPage(nextPage);
                            }
                          }}
                          className={`py-2 px-3 ml-0 leading-tight text-gray-500 rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white ${
                            !nextPage
                              ? "bg-gray-100 cursor-not-allowed"
                              : "bg-white"
                          }`}
                        >
                          Next
                        </button>
                      </li>
                    </ul>
                  </nav>
                </td>
              </tr>
            </>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default withAdmin(AllPosts);
