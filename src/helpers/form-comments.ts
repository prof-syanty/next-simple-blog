import { CommentsWithNestedFields } from "@utils/trpc";
import lodash from "lodash";

function formComments(comments: CommentsWithNestedFields) {
  const grouped = lodash.mapValues(
    lodash.groupBy(comments, "parentId"),
    (clist: CommentsWithNestedFields) =>
      clist?.map((comment) => lodash.omit(comment, "parentId"))
  );

  const commentsWithChildren = comments
    ?.map((comment) => {
      if (comment.parentId) {
        const getParentComment = comments.find(
          (c) => c.id === comment.parentId
        );

        return {
          ...getParentComment,
          children: grouped[comment.parentId],
        };
      } else {
        return {
          ...comment,
          children: [],
        };
      }
    })
    .filter(
      (c, index, array) =>
        c && array.findIndex((a) => a?.id === c?.id) === index
    );

  return commentsWithChildren;
}

export default formComments;
export type formCommentsReturnType = ReturnType<typeof formComments>;
