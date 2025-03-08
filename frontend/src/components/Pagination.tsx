import React from "react";
import { Button } from "@/components/ui/button";

interface PaginationProps {
  tasksPerPage: number;
  totalTasks: number;
  paginate: (pageNumber: number) => void;
  currentPage: number;
}

export const Pagination = ({
  tasksPerPage,
  totalTasks,
  paginate,
  currentPage,
}: PaginationProps) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTasks / tasksPerPage); i++) {
    pageNumbers.push(i);
  }

  if (pageNumbers.length <= 1) {
    return null;
  }
  return (
    <nav>
      <ul className="flex justify-center space-x-2">
        {pageNumbers.map((number) => (
          <li
            key={number}
            className={`page-item ${currentPage === number ? "font-bold" : ""}`}
          >
            <Button
              onClick={() => paginate(number)}
              className="bg-blue-500 text-white p-2 rounded"
            >
              {number}
            </Button>
          </li>
        ))}
      </ul>
    </nav>
  );
};
