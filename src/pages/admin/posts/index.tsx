import withAuth from "@hoc/with-auth";
import { trpc } from "@utils/trpc";
import moment from "moment";
import { useState } from "react";

function AllPosts() {
  const [page, setPage] = useState(1);
  const [limit] = useState(2);
  const { data, isLoading } = trpc.post.offsetPosts.useQuery({
    limit,
    page,
  });

  const { meta, results } = { ...data };
  const { totalPages, currentPage, prevPage, nextPage } = {
    ...meta,
  };

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
                    <span className="bg-purple-200 text-purple-600 py-1 px-3 rounded-full text-xs">
                      Published
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
                      <button className="p-2 rounded-md bg-gray-500 text-white">
                        Publish
                      </button>
                      <button className="p-2 rounded-md bg-red-500 text-white">
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              <tr>
                {JSON.stringify(meta)}
                <td colSpan={8} className="py-5 text-center">
                  <nav aria-label="Page navigation example">
                    <ul className="inline-flex -space-x-px">
                      <li>
                        <button
                          disabled={currentPage === prevPage}
                          onClick={() => {
                            if (prevPage) {
                              setPage(prevPage);
                            }
                          }}
                          className="py-2 px-3 ml-0 leading-tight text-gray-500 bg-white rounded-l-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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
                          disabled={currentPage === nextPage}
                          onClick={() => {
                            if (nextPage) {
                              setPage(nextPage);
                            }
                          }}
                          className="py-2 px-3 leading-tight text-gray-500 bg-white rounded-r-lg border border-gray-300 hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
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

export default withAuth(AllPosts);
