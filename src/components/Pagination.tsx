import { NavLink, useHistory } from "react-router-dom";
import "./Pagination.css";

const Pagination = ({
  limit,
  count,
  currentPage,
  showPrevious,
  showNext,
}: {
  limit: number;
  count: number;
  currentPage: number;
  showPrevious: boolean;
  showNext: boolean;
}) => {
  const history = useHistory();
  const numberOfPages = Math.ceil(count / limit);

  const handleRedirect = (value: string) => {
    if (!value) return;
    // if value  is greater than count, redirect to last page
    const page = Math.min(numberOfPages, parseInt(value));
    history.push(`/pokedex/${page}`);
  };

  const handleKeyUp = (
    e: React.KeyboardEvent<HTMLInputElement> & { target: { value: string } }
  ) => {
    if (e.key === "Enter") {
      handleRedirect(e.target.value);
    }
  };

  const handleBlur = (
    e: React.FocusEvent<HTMLInputElement> & { target: { value: string } }
  ) => {
    handleRedirect(e.target.value);
  };

  return (
    <div className="pagination">
      {showPrevious && (
        <NavLink to={`/pokedex/${currentPage - 1}`}>Previous</NavLink>
      )}
      <div>
        <input
          type="text"
          defaultValue={currentPage || 1}
          onBlur={handleBlur}
          onKeyUp={handleKeyUp} // Replace handleKeyUp with onKeyUp
        />
        / {numberOfPages}
      </div>
      {showNext && <NavLink to={`/pokedex/${currentPage + 1}`}>Next</NavLink>}
    </div>
  );
};

export default Pagination;
