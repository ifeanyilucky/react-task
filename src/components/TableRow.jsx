import { useDrag, useDrop } from "react-dnd";

export const TableRow = ({ index, moveRow, children }) => {
  const [, ref] = useDrag({
    type: "ROW",
    item: { index },
  });

  const [, drop] = useDrop({
    accept: "ROW",
    hover: (draggedItem) => {
      if (draggedItem?.index !== index) {
        moveRow(draggedItem?.index, index);
        draggedItem.index = index;
      }
    },
  });

  return (
    <tr
      ref={(node) => ref(drop(node))}
      className="app-table-row pt-5 pb-5 table-row border-gray-300 border-solid border"
    >
      {children}
    </tr>
  );
};
