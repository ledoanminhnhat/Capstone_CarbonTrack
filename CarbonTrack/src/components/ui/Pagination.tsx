import { FaAngleLeft, FaAngleRight, FaAnglesLeft, FaAnglesRight } from "react-icons/fa6";
interface PaginationProps {
  page: number;
  totalPages: number;
  from: number;
  to: number;
  total: number;
  first: () => void;
  prev: () => void;
  next: () => void;
  last: () => void;
}

/** Thanh phân trang; nhận thẳng kết quả của usePagination. */
export default function Pagination({ page, totalPages, from, to, total, first, prev, next, last }: PaginationProps) {
  const btn = (disabled: boolean) =>
    `w-9 h-9 rounded-lg flex items-center justify-center transition-colors ${
      disabled ? "text-gray-300 pointer-events-none" : "text-ink hover:bg-brand-50 hover:text-brand-600"
    }`;
  const atStart = page === 1;
  const atEnd = page === totalPages;

  return (
    <div className="flex justify-between items-center mt-6 pt-4 border-t border-gray-100 text-muted text-[0.85rem]">
      <span>{total === 0 ? "0 results" : `${from}–${to} of ${total}`}</span>
      <div className="flex items-center gap-1">
        <button className={btn(atStart)} onClick={first} aria-label="First page">
          <FaAnglesLeft size={18} />
        </button>
        <button className={btn(atStart)} onClick={prev} aria-label="Previous page">
          <FaAngleLeft size={18} />
        </button>
        <span className="px-2 text-ink font-semibold">
          {page} / {totalPages}
        </span>
        <button className={btn(atEnd)} onClick={next} aria-label="Next page">
          <FaAngleRight size={18} />
        </button>
        <button className={btn(atEnd)} onClick={last} aria-label="Last page">
          <FaAnglesRight size={18} />
        </button>
      </div>
    </div>
  );
}
